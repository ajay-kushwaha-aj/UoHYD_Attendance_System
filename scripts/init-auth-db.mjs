import { createClient } from "@libsql/client";
import crypto from "crypto";
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

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return { hash, salt };
}

async function main() {
  console.log("🔐 Creating authentication tables in Turso database...");

  // 1. Create users table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      identifier TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL,
      full_name TEXT NOT NULL,
      reference_id TEXT,
      status TEXT DEFAULT 'ACTIVE',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ Table 'users' created/verified.");

  // 2. Create user_sessions table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ Table 'user_sessions' created/verified.");

  // 3. Seed Admin User
  const adminCred = hashPassword("admin123");
  await client.execute({
    sql: `
      INSERT INTO users (id, email, identifier, password_hash, salt, role, full_name, reference_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email = excluded.email,
        identifier = excluded.identifier,
        password_hash = excluded.password_hash,
        salt = excluded.salt,
        role = excluded.role,
        full_name = excluded.full_name;
    `,
    args: ["usr-admin-01", "academic.admin@uohyd.ac.in", "academic.admin", adminCred.hash, adminCred.salt, "admin", "Dr. S. R. Murthy", "adm-01"],
  });
  console.log("✅ Admin user seeded.");

  // 4. Seed Professors
  const profs = [
    { id: "usr-prof-01", email: "dr.rao@uohyd.ac.in", identifier: "dr.rao", name: "Prof. K. Venkatesh Rao", refId: "prof-01" },
    { id: "usr-prof-02", email: "ananya.sen@uohyd.ac.in", identifier: "ananya.sen", name: "Dr. Ananya Sen", refId: "prof-02" },
    { id: "usr-prof-03", email: "sundaram.mk@uohyd.ac.in", identifier: "sundaram.mk", name: "Dr. M. K. Sundaram", refId: "prof-03" },
    { id: "usr-prof-04", email: "p.radhakrishnan@uohyd.ac.in", identifier: "p.radhakrishnan", name: "Prof. P. Radhakrishnan", refId: "prof-04" },
  ];

  for (const p of profs) {
    const cred = hashPassword("prof123");
    await client.execute({
      sql: `
        INSERT INTO users (id, email, identifier, password_hash, salt, role, full_name, reference_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          email = excluded.email,
          identifier = excluded.identifier,
          password_hash = excluded.password_hash,
          salt = excluded.salt,
          full_name = excluded.full_name;
      `,
      args: [p.id, p.email, p.identifier, cred.hash, cred.salt, "professor", p.name, p.refId],
    });
  }
  console.log(`✅ Seeded ${profs.length} professors with hashed passwords.`);

  // 5. Seed Students (std-01 to std-12)
  const students = [
    { id: "usr-std-01", email: "25mcms01@uohyd.ac.in", identifier: "25mcms01", name: "Ajay Kumar", refId: "std-01" },
    { id: "usr-std-02", email: "25mcms02@uohyd.ac.in", identifier: "25mcms02", name: "Priya Singh", refId: "std-02" },
    { id: "usr-std-03", email: "25mcms03@uohyd.ac.in", identifier: "25mcms03", name: "Rahul Sharma", refId: "std-03" },
    { id: "usr-std-04", email: "25mcms04@uohyd.ac.in", identifier: "25mcms04", name: "Ananya Das", refId: "std-04" },
    { id: "usr-std-05", email: "25mcms05@uohyd.ac.in", identifier: "25mcms05", name: "Aman Verma", refId: "std-05" },
    { id: "usr-std-06", email: "25mcms06@uohyd.ac.in", identifier: "25mcms06", name: "Sneha Patel", refId: "std-06" },
    { id: "usr-std-07", email: "25mcms07@uohyd.ac.in", identifier: "25mcms07", name: "Vikram Reddy", refId: "std-07" },
    { id: "usr-std-08", email: "25mcms08@uohyd.ac.in", identifier: "25mcms08", name: "Kavita Nair", refId: "std-08" },
    { id: "usr-std-09", email: "25mcms09@uohyd.ac.in", identifier: "25mcms09", name: "Rohit Gupta", refId: "std-09" },
    { id: "usr-std-10", email: "25mcms10@uohyd.ac.in", identifier: "25mcms10", name: "Deepika Rao", refId: "std-10" },
    { id: "usr-std-11", email: "25mcms11@uohyd.ac.in", identifier: "25mcms11", name: "Sanjay Kumar", refId: "std-11" },
    { id: "usr-std-12", email: "25mcms12@uohyd.ac.in", identifier: "25mcms12", name: "Pooja Menon", refId: "std-12" },
  ];

  for (const s of students) {
    const cred = hashPassword("student123");
    await client.execute({
      sql: `
        INSERT INTO users (id, email, identifier, password_hash, salt, role, full_name, reference_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          email = excluded.email,
          identifier = excluded.identifier,
          password_hash = excluded.password_hash,
          salt = excluded.salt,
          full_name = excluded.full_name;
      `,
      args: [s.id, s.email, s.identifier, cred.hash, cred.salt, "student", s.name, s.refId],
    });
  }
  console.log(`✅ Seeded ${students.length} students with hashed passwords.`);

  console.log("🎉 Authentication tables and credentials successfully initialized in Turso!");
}

main().catch(console.error);
