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

async function seed() {
  console.log("🌱 Seeding initial data into Turso database...");

  // 1. Seed Professors
  const professors = [
    {
      id: "prof-01",
      name: "Prof. K. Venkatesh Rao",
      faculty_id: "EMP-UOH-882",
      email: "dr.rao@uohyd.ac.in",
      department: "Department of Systems & Computational Biology",
      designation: "Professor & Head of Department",
    },
    {
      id: "prof-02",
      name: "Dr. Ananya Sen",
      faculty_id: "EMP-UOH-890",
      email: "ananya.sen@uohyd.ac.in",
      department: "Department of Systems & Computational Biology",
      designation: "Associate Professor",
    },
    {
      id: "prof-03",
      name: "Dr. M. K. Sundaram",
      faculty_id: "EMP-UOH-895",
      email: "sundaram.mk@uohyd.ac.in",
      department: "Department of Systems & Computational Biology",
      designation: "Assistant Professor",
    },
  ];

  for (const prof of professors) {
    await client.execute({
      sql: `INSERT INTO professors (id, name, faculty_id, email, department, designation)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET name = excluded.name, email = excluded.email;`,
      args: [prof.id, prof.name, prof.faculty_id, prof.email, prof.department, prof.designation],
    });
  }
  console.log(`✅ Seeded ${professors.length} professors.`);

  // 2. Seed Courses
  const courses = [
    {
      id: "course-scb-501",
      code: "SCB-501",
      name: "Molecular Biology & Structural Bioinformatics",
      department: "Department of Systems & Computational Biology",
      credits: 4,
      professor_id: "prof-01",
    },
    {
      id: "course-scb-502",
      code: "SCB-502",
      name: "Computational Genomics & Sequence Algorithms",
      department: "Department of Systems & Computational Biology",
      credits: 4,
      professor_id: "prof-01",
    },
    {
      id: "course-scb-503",
      code: "SCB-503",
      name: "Systems Biology & Metabolic Networks",
      department: "Department of Systems & Computational Biology",
      credits: 3,
      professor_id: "prof-02",
    },
  ];

  for (const c of courses) {
    await client.execute({
      sql: `INSERT INTO courses (id, code, name, department, credits, professor_id)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET name = excluded.name, credits = excluded.credits;`,
      args: [c.id, c.code, c.name, c.department, c.credits, c.professor_id],
    });
  }
  console.log(`✅ Seeded ${courses.length} courses.`);

  // 3. Seed Students
  const students = [
    {
      id: "std-01",
      name: "Ajay Kumar",
      reg_no: "25MCMS01",
      email: "25mcms01@uohyd.ac.in",
      batch_id: "batch-2025-27",
      section: "A",
    },
    {
      id: "std-02",
      name: "Priya Singh",
      reg_no: "25MCMS02",
      email: "25mcms02@uohyd.ac.in",
      batch_id: "batch-2025-27",
      section: "A",
    },
    {
      id: "std-03",
      name: "Rahul Sharma",
      reg_no: "25MCMS03",
      email: "25mcms03@uohyd.ac.in",
      batch_id: "batch-2025-27",
      section: "A",
    },
    {
      id: "std-04",
      name: "Ananya Das",
      reg_no: "25MCMS04",
      email: "25mcms04@uohyd.ac.in",
      batch_id: "batch-2025-27",
      section: "A",
    },
  ];

  for (const s of students) {
    await client.execute({
      sql: `INSERT INTO students (id, name, reg_no, email, batch_id, section)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET name = excluded.name, email = excluded.email;`,
      args: [s.id, s.name, s.reg_no, s.email, s.batch_id, s.section],
    });
  }
  console.log(`✅ Seeded ${students.length} students.`);

  console.log("🎉 Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
