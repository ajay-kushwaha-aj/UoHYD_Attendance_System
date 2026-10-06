import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

// Simple env loader
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

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("❌ Error: Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env.local / .env.");
  process.exit(1);
}

const client = createClient({
  url,
  authToken,
});

async function main() {
  console.log("🔄 Connecting to Turso database:", url);

  // Read schema file
  const schemaPath = path.resolve("src/lib/db-schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");

  console.log("🚀 Executing schema creation in Turso...");
  await client.executeMultiple(schemaSql);
  console.log("✅ Schema executed successfully!");

  // Verify created tables
  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
  );
  console.log("📋 Verified tables in Turso:");
  tables.rows.forEach((row) => console.log(`   ✨ ${row.name}`));
}

main().catch((err) => {
  console.error("❌ Failed to initialize database:", err);
  process.exit(1);
});
