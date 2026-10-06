import { createClient } from "@libsql/client";
import fs from "fs";

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

loadEnv(".env.local");
loadEnv(".env");

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function addColumnIfNotExists(table, column, type) {
  try {
    await client.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${type};`);
    console.log(`➕ Added column ${column} (${type}) to ${table}`);
  } catch (err) {
    if (err.message && (err.message.includes("duplicate column") || err.message.includes("already exists"))) {
      // already exists, all good
    } else {
      console.warn(`Note on ${table}.${column}:`, err.message);
    }
  }
}

async function main() {
  console.log("🚀 Upgrading Turso schema for full Admin Dashboard sync...");

  // 1. Upgrade students
  await addColumnIfNotExists("students", "phone", "TEXT");
  await addColumnIfNotExists("students", "semester", "INTEGER DEFAULT 2");
  await addColumnIfNotExists("students", "program", "TEXT");
  await addColumnIfNotExists("students", "batch_name", "TEXT");
  await addColumnIfNotExists("students", "enrollment_no", "TEXT");

  // 2. Upgrade professors
  await addColumnIfNotExists("professors", "phone", "TEXT");
  await addColumnIfNotExists("professors", "room", "TEXT");
  await addColumnIfNotExists("professors", "specialization", "TEXT");
  await addColumnIfNotExists("professors", "assigned_courses", "TEXT");

  // 3. Upgrade courses
  await addColumnIfNotExists("courses", "program", "TEXT");
  await addColumnIfNotExists("courses", "semester", "INTEGER DEFAULT 2");
  await addColumnIfNotExists("courses", "professor_name", "TEXT");
  await addColumnIfNotExists("courses", "room", "TEXT");
  await addColumnIfNotExists("courses", "schedule_time", "TEXT");
  await addColumnIfNotExists("courses", "schedule_days", "TEXT");
  await addColumnIfNotExists("courses", "timetable_slots", "TEXT");
  await addColumnIfNotExists("courses", "total_students", "INTEGER DEFAULT 0");

  // 4. Upgrade departments
  await addColumnIfNotExists("departments", "programs", "TEXT");

  // 5. Create admin_profile table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS admin_profile (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      department TEXT,
      phone TEXT,
      office_room TEXT,
      password_hash TEXT,
      role TEXT DEFAULT 'admin',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ admin_profile table verified");

  // 6. Create system_settings table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ system_settings table verified");

  // 7. Create audit_logs table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      session_id TEXT,
      course_name TEXT,
      actor_id TEXT,
      actor_name TEXT,
      actor_role TEXT,
      action TEXT,
      target_student_name TEXT,
      target_student_roll TEXT,
      old_value TEXT,
      new_value TEXT,
      reason TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ audit_logs table verified");

  console.log("🎉 Database schema successfully upgraded!");
}

main().catch(console.error);
