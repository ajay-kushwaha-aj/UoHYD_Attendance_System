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
  console.log("🌱 Seeding rich initial data into Turso database...");

  // 1. Seed Professors
  const professors = [
    {
      id: "prof-01",
      name: "Prof. K. Venkatesh Rao",
      faculty_id: "EMP-UOH-882",
      email: "dr.rao@uohyd.ac.in",
      department: "Department of Systems & Computational Biology",
      designation: "Professor & Head of Department",
      phone: "+91 40 2313 4500",
      room: "Faculty Block-B, Room 301",
      specialization: "Structural Bioinformatics & Biomolecular Simulations",
      assigned_courses: JSON.stringify(["course-scb-501", "course-scb-502", "course-scb-503"]),
    },
    {
      id: "prof-02",
      name: "Dr. Ananya Sen",
      faculty_id: "EMP-UOH-890",
      email: "ananya.sen@uohyd.ac.in",
      department: "Department of Systems & Computational Biology",
      designation: "Associate Professor",
      phone: "+91 40 2313 4512",
      room: "Faculty Block-B, Room 304",
      specialization: "Systems Biology & Metabolic Networks",
      assigned_courses: JSON.stringify(["course-scb-503"]),
    },
    {
      id: "prof-03",
      name: "Dr. M. K. Sundaram",
      faculty_id: "EMP-UOH-895",
      email: "sundaram.mk@uohyd.ac.in",
      department: "Department of Systems & Computational Biology",
      designation: "Assistant Professor",
      phone: "+91 40 2313 4518",
      room: "Faculty Block-B, Room 308",
      specialization: "Computational Genomics & Epigenetics",
      assigned_courses: JSON.stringify(["course-scb-502"]),
    },
    {
      id: "prof-04",
      name: "Prof. P. Radhakrishnan",
      faculty_id: "EMP-UOH-870",
      email: "p.radhakrishnan@uohyd.ac.in",
      department: "Department of Systems & Computational Biology",
      designation: "Senior Professor & Chair",
      phone: "+91 40 2313 4525",
      room: "Faculty Block-A, Room 102",
      specialization: "Evolutionary Biology & Population Genetics",
      assigned_courses: JSON.stringify([]),
    },
  ];

  for (const prof of professors) {
    await client.execute({
      sql: `INSERT INTO professors (id, name, faculty_id, email, department, designation, phone, room, specialization, assigned_courses)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              name = excluded.name,
              faculty_id = excluded.faculty_id,
              email = excluded.email,
              department = excluded.department,
              designation = excluded.designation,
              phone = excluded.phone,
              room = excluded.room,
              specialization = excluded.specialization,
              assigned_courses = excluded.assigned_courses;`,
      args: [prof.id, prof.name, prof.faculty_id, prof.email, prof.department, prof.designation, prof.phone, prof.room, prof.specialization, prof.assigned_courses],
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
      program: "MSc Systems & Computational Biology",
      semester: 2,
      credits: 4,
      professor_id: "prof-01",
      professor_name: "Prof. K. Venkatesh Rao",
      room: "LH-204",
      schedule_time: "10:00 AM – 11:30 AM",
      schedule_days: JSON.stringify(["Monday", "Wednesday", "Friday"]),
      timetable_slots: JSON.stringify([
        { id: "slot-501-1", day: "Monday", startTime: "10:00 AM", endTime: "11:30 AM", room: "LH-204", sessionType: "LECTURE" },
        { id: "slot-501-2", day: "Wednesday", startTime: "10:00 AM", endTime: "11:30 AM", room: "LH-204", sessionType: "LECTURE" },
        { id: "slot-501-3", day: "Friday", startTime: "09:30 AM", endTime: "11:30 AM", room: "Bioinformatics Lab-1", sessionType: "LAB" },
      ]),
      total_students: 8,
    },
    {
      id: "course-scb-502",
      code: "SCB-502",
      name: "Computational Genomics & Sequence Algorithms",
      department: "Department of Systems & Computational Biology",
      program: "MSc Systems & Computational Biology",
      semester: 2,
      credits: 4,
      professor_id: "prof-01",
      professor_name: "Prof. K. Venkatesh Rao",
      room: "Bioinformatics Lab-1",
      schedule_time: "11:30 AM – 01:00 PM",
      schedule_days: JSON.stringify(["Tuesday", "Thursday"]),
      timetable_slots: JSON.stringify([
        { id: "slot-502-1", day: "Tuesday", startTime: "11:30 AM", endTime: "01:00 PM", room: "Bioinformatics Lab-1", sessionType: "LAB" },
        { id: "slot-502-2", day: "Thursday", startTime: "11:30 AM", endTime: "01:00 PM", room: "LH-204", sessionType: "LECTURE" },
      ]),
      total_students: 8,
    },
    {
      id: "course-scb-503",
      code: "SCB-503",
      name: "Statistical Machine Learning for Omics Data",
      department: "Department of Systems & Computational Biology",
      program: "MSc Systems & Computational Biology",
      semester: 2,
      credits: 3,
      professor_id: "prof-01",
      professor_name: "Prof. K. Venkatesh Rao",
      room: "LH-205",
      schedule_time: "02:00 PM – 03:30 PM",
      schedule_days: JSON.stringify(["Monday", "Wednesday"]),
      timetable_slots: JSON.stringify([
        { id: "slot-503-1", day: "Monday", startTime: "02:00 PM", endTime: "03:30 PM", room: "LH-205", sessionType: "LECTURE" },
        { id: "slot-503-2", day: "Wednesday", startTime: "02:00 PM", endTime: "03:30 PM", room: "LH-205", sessionType: "LECTURE" },
      ]),
      total_students: 8,
    },
  ];

  for (const c of courses) {
    await client.execute({
      sql: `INSERT INTO courses (id, code, name, department, program, semester, credits, professor_id, professor_name, room, schedule_time, schedule_days, timetable_slots, total_students)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              code = excluded.code,
              name = excluded.name,
              department = excluded.department,
              program = excluded.program,
              semester = excluded.semester,
              credits = excluded.credits,
              professor_id = excluded.professor_id,
              professor_name = excluded.professor_name,
              room = excluded.room,
              schedule_time = excluded.schedule_time,
              schedule_days = excluded.schedule_days,
              timetable_slots = excluded.timetable_slots,
              total_students = excluded.total_students;`,
      args: [c.id, c.code, c.name, c.department, c.program, c.semester, c.credits, c.professor_id, c.professor_name, c.room, c.schedule_time, c.schedule_days, c.timetable_slots, c.total_students],
    });
  }
  console.log(`✅ Seeded ${courses.length} courses.`);

  // 3. Seed Students
  const students = [
    { id: "std-01", name: "Ajay Kumar", reg_no: "25MCMS01", email: "25mcms01@uohyd.ac.in", batch_id: "batch-2025-27", batch_name: "MSc SCB 2025–27", section: "A", phone: "+91 98765 43210", semester: 2, program: "MSc Systems & Computational Biology", enrollment_no: "UOH/SLS/2025/0114" },
    { id: "std-02", name: "Priya Singh", reg_no: "25MCMS02", email: "25mcms02@uohyd.ac.in", batch_id: "batch-2025-27", batch_name: "MSc SCB 2025–27", section: "A", phone: "+91 98765 43211", semester: 2, program: "MSc Systems & Computational Biology", enrollment_no: "UOH/SLS/2025/0115" },
    { id: "std-03", name: "Rahul Sharma", reg_no: "25MCMS03", email: "25mcms03@uohyd.ac.in", batch_id: "batch-2025-27", batch_name: "MSc SCB 2025–27", section: "A", phone: "+91 98765 43212", semester: 2, program: "MSc Systems & Computational Biology", enrollment_no: "UOH/SLS/2025/0116" },
    { id: "std-04", name: "Ananya Das", reg_no: "25MCMS04", email: "25mcms04@uohyd.ac.in", batch_id: "batch-2025-27", batch_name: "MSc SCB 2025–27", section: "A", phone: "+91 98765 43213", semester: 2, program: "MSc Systems & Computational Biology", enrollment_no: "UOH/SLS/2025/0117" },
    { id: "std-05", name: "Aman Verma", reg_no: "25MCMS05", email: "25mcms05@uohyd.ac.in", batch_id: "batch-2025-27", batch_name: "MSc SCB 2025–27", section: "A", phone: "+91 98765 43214", semester: 2, program: "MSc Systems & Computational Biology", enrollment_no: "UOH/SLS/2025/0118" },
    { id: "std-06", name: "Sneha Patel", reg_no: "25MCMS06", email: "25mcms06@uohyd.ac.in", batch_id: "batch-2025-27", batch_name: "MSc SCB 2025–27", section: "A", phone: "+91 98765 43215", semester: 2, program: "MSc Systems & Computational Biology", enrollment_no: "UOH/SLS/2025/0119" },
    { id: "std-07", name: "Vikram Reddy", reg_no: "25MCMS07", email: "25mcms07@uohyd.ac.in", batch_id: "batch-2025-27", batch_name: "MSc SCB 2025–27", section: "A", phone: "+91 98765 43216", semester: 2, program: "MSc Systems & Computational Biology", enrollment_no: "UOH/SLS/2025/0120" },
    { id: "std-08", name: "Kavita Nair", reg_no: "25MCMS08", email: "25mcms08@uohyd.ac.in", batch_id: "batch-2025-27", batch_name: "MSc SCB 2025–27", section: "A", phone: "+91 98765 43217", semester: 2, program: "MSc Systems & Computational Biology", enrollment_no: "UOH/SLS/2025/0121" },
    { id: "std-09", name: "Rohit Gupta", reg_no: "25MCMS09", email: "25mcms09@uohyd.ac.in", batch_id: "batch-2025-27", batch_name: "MSc SCB 2025–27", section: "A", phone: "+91 98765 43218", semester: 2, program: "MSc Systems & Computational Biology", enrollment_no: "UOH/SLS/2025/0122" },
    { id: "std-10", name: "Deepika Rao", reg_no: "25MCMS10", email: "25mcms10@uohyd.ac.in", batch_id: "batch-2025-27", batch_name: "MSc SCB 2025–27", section: "A", phone: "+91 98765 43219", semester: 2, program: "MSc Systems & Computational Biology", enrollment_no: "UOH/SLS/2025/0123" },
    { id: "std-11", name: "Sanjay Kumar", reg_no: "25MCMS11", email: "25mcms11@uohyd.ac.in", batch_id: "batch-2025-27", batch_name: "MSc SCB 2025–27", section: "A", phone: "+91 98765 43220", semester: 2, program: "MSc Systems & Computational Biology", enrollment_no: "UOH/SLS/2025/0124" },
    { id: "std-12", name: "Pooja Menon", reg_no: "25MCMS12", email: "25mcms12@uohyd.ac.in", batch_id: "batch-2025-27", batch_name: "MSc SCB 2025–27", section: "A", phone: "+91 98765 43221", semester: 2, program: "MSc Systems & Computational Biology", enrollment_no: "UOH/SLS/2025/0125" },
  ];

  for (const s of students) {
    await client.execute({
      sql: `INSERT INTO students (id, name, reg_no, email, batch_id, section, phone, semester, program, batch_name, enrollment_no)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              name = excluded.name,
              reg_no = excluded.reg_no,
              email = excluded.email,
              batch_id = excluded.batch_id,
              section = excluded.section,
              phone = excluded.phone,
              semester = excluded.semester,
              program = excluded.program,
              batch_name = excluded.batch_name,
              enrollment_no = excluded.enrollment_no;`,
      args: [s.id, s.name, s.reg_no, s.email, s.batch_id, s.section, s.phone, s.semester, s.program, s.batch_name, s.enrollment_no],
    });
  }
  console.log(`✅ Seeded ${students.length} students.`);

  // 4. Seed Departments
  const departments = [
    {
      id: "dept-scb",
      code: "SCB",
      name: "Department of Systems & Computational Biology",
      school: "School of Life Sciences",
      hod_name: "Prof. K. Venkatesh Rao",
      hod_email: "dr.rao@uohyd.ac.in",
      office_location: "SLS Building, 2nd Floor, Room 204",
      contact_phone: "+91 40 2313 4500",
      established_year: 2014,
      programs: JSON.stringify(["MSc Systems & Computational Biology", "PhD Computational Biology"]),
      total_faculty: 6,
      total_students: 30,
      status: "ACTIVE",
      description: "Center of excellence in computational genomics, structural biology, and biological network analysis.",
    },
    {
      id: "dept-scis",
      code: "SCIS",
      name: "School of Computer & Information Sciences",
      school: "School of Computer & Information Sciences",
      hod_name: "Prof. Chakravarthy Bhagvati",
      hod_email: "bhagvati@uohyd.ac.in",
      office_location: "SCIS Block, Gachibowli Campus",
      contact_phone: "+91 40 2313 4000",
      established_year: 1993,
      programs: JSON.stringify(["Master of Computer Applications (MCA)", "MTech Computer Science", "MTech Artificial Intelligence", "PhD Computer Science"]),
      total_faculty: 22,
      total_students: 180,
      status: "ACTIVE",
      description: "Pioneering research and education in algorithms, distributed systems, machine learning, computer vision, and cybersecurity.",
    },
    {
      id: "dept-bch",
      code: "BCH",
      name: "Department of Biochemistry",
      school: "School of Life Sciences",
      hod_name: "Prof. Krishnaveni Mishra",
      hod_email: "krishnaveni@uohyd.ac.in",
      office_location: "SLS East Wing, 3rd Floor",
      contact_phone: "+91 40 2313 4520",
      established_year: 1979,
      programs: JSON.stringify(["MSc Biochemistry", "PhD Biochemistry"]),
      total_faculty: 10,
      total_students: 42,
      status: "ACTIVE",
      description: "Fundamental and translational research in enzymology, immunology, cellular signaling, and metabolic diseases.",
    },
    {
      id: "dept-phys",
      code: "PHYS",
      name: "School of Physics",
      school: "School of Physics",
      hod_name: "Prof. Prem Kiran P.",
      hod_email: "premkiran@uohyd.ac.in",
      office_location: "School of Physics Building, West Campus",
      contact_phone: "+91 40 2313 4300",
      established_year: 1977,
      programs: JSON.stringify(["MSc Physics", "Integrated MSc Physics", "PhD Physics"]),
      total_faculty: 26,
      total_students: 120,
      status: "ACTIVE",
      description: "Premier research department focusing on condensed matter physics, quantum optics, laser physics, and high-energy physics.",
    },
  ];

  for (const d of departments) {
    await client.execute({
      sql: `INSERT INTO departments (id, code, name, school, hod_name, hod_email, office_location, contact_phone, established_year, programs, total_faculty, total_students, status, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              code = excluded.code,
              name = excluded.name,
              school = excluded.school,
              hod_name = excluded.hod_name,
              hod_email = excluded.hod_email,
              office_location = excluded.office_location,
              contact_phone = excluded.contact_phone,
              established_year = excluded.established_year,
              programs = excluded.programs,
              total_faculty = excluded.total_faculty,
              total_students = excluded.total_students,
              status = excluded.status,
              description = excluded.description;`,
      args: [d.id, d.code, d.name, d.school, d.hod_name, d.hod_email, d.office_location, d.contact_phone, d.established_year, d.programs, d.total_faculty, d.total_students, d.status, d.description],
    });
  }
  console.log(`✅ Seeded ${departments.length} departments.`);

  // 5. Seed Admin Profile
  await client.execute({
    sql: `INSERT INTO admin_profile (id, full_name, email, department, phone, office_room, role)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            full_name = excluded.full_name,
            email = excluded.email,
            department = excluded.department;`,
    args: ["adm-01", "Dr. S. R. Murthy", "academic.admin@uohyd.ac.in", "Dean's Office, School of Life Sciences", "+91 40 2313 4001", "Dean's Office, Administration Block, Ground Floor", "admin"],
  });
  console.log("✅ Seeded Admin Profile.");

  // 6. Seed System Settings
  const settings = [
    { key: "minThreshold", value: "75" },
    { key: "criticalThreshold", value: "60" },
    { key: "qrExpiryMinutes", value: "5" },
  ];
  for (const s of settings) {
    await client.execute({
      sql: `INSERT INTO system_settings (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
      args: [s.key, s.value],
    });
  }
  console.log("✅ Seeded System Settings.");

  console.log("🎉 Turso database seeding completed successfully!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
