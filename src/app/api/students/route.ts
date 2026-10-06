import { NextResponse } from "next/server";
import { turso, isTursoConfigured } from "@/lib/turso";
import { StudentProfile } from "@/types";

export const dynamic = "force-dynamic";

// Map database row to StudentProfile
function rowToStudent(row: any): StudentProfile {
  return {
    id: String(row.id),
    fullName: String(row.name || ""),
    rollNumber: String(row.reg_no || ""),
    email: String(row.email || ""),
    batchId: String(row.batch_id || "batch-2025-27"),
    batchName: String(row.batch_name || "MSc SCB 2025–27"),
    section: String(row.section || "A"),
    phone: row.phone ? String(row.phone) : undefined,
    semester: Number(row.semester) || 2,
    program: String(row.program || "MSc Systems & Computational Biology"),
    department: String(row.department || "Department of Systems & Computational Biology"),
    enrollmentNumber: row.enrollment_no ? String(row.enrollment_no) : undefined,
    role: "student",
  };
}

export async function GET() {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const result = await turso.execute(`
      SELECT id, name, reg_no, email, batch_id, section, phone, semester, program, batch_name, enrollment_no, created_at
      FROM students
      ORDER BY reg_no ASC;
    `);

    const students = result.rows.map(rowToStudent);
    return NextResponse.json({ success: true, students });
  } catch (error: any) {
    console.error("Error fetching students from Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const id = body.id || `std-${Date.now().toString().slice(-4)}`;
    const name = (body.fullName || body.name || "").trim();
    const reg_no = (body.rollNumber || body.reg_no || "").trim().toUpperCase();
    const email = (body.email || "").trim().toLowerCase();
    const batch_id = body.batchId || body.batch_id || "batch-2025-27";
    const batch_name = body.batchName || body.batch_name || "MSc SCB 2025–27";
    const section = body.section || "A";
    const phone = body.phone || "";
    const semester = Number(body.semester) || 2;
    const program = body.program || "MSc Systems & Computational Biology";
    const department = body.department || "Department of Systems & Computational Biology";
    const enrollment_no = body.enrollmentNumber || body.enrollment_no || "";

    if (!name || !reg_no || !email) {
      return NextResponse.json({ error: "Full name, roll number, and email are required" }, { status: 400 });
    }

    await turso.execute({
      sql: `
        INSERT INTO students (id, name, reg_no, email, batch_id, section, phone, semester, program, batch_name, enrollment_no)
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
          enrollment_no = excluded.enrollment_no;
      `,
      args: [id, name, reg_no, email, batch_id, section, phone, semester, program, batch_name, enrollment_no],
    });

    // Create login account in users table if not already existing
    const { hashPassword } = await import("@/lib/auth-crypto");
    const cred = hashPassword("student123");
    const userId = `usr-${id}`;
    const identifier = reg_no.toLowerCase();

    await turso.execute({
      sql: `
        INSERT INTO users (id, email, identifier, password_hash, salt, role, full_name, reference_id)
        VALUES (?, ?, ?, ?, ?, 'student', ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          email = excluded.email,
          identifier = excluded.identifier,
          full_name = excluded.full_name;
      `,
      args: [userId, email, identifier, cred.hash, cred.salt, name, id],
    });

    const student: StudentProfile = {
      id,
      fullName: name,
      rollNumber: reg_no,
      email,
      batchId: batch_id,
      batchName: batch_name,
      section,
      phone,
      semester,
      program,
      department,
      enrollmentNumber: enrollment_no,
      role: "student",
    };

    return NextResponse.json({ success: true, student });
  } catch (error: any) {
    console.error("Error creating student in Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to create student" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const id = body.id;
    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    // Build update dynamic fields
    const updates: string[] = [];
    const args: any[] = [];

    if (body.fullName !== undefined || body.name !== undefined) {
      updates.push("name = ?");
      args.push(String(body.fullName || body.name).trim());
    }
    if (body.rollNumber !== undefined || body.reg_no !== undefined) {
      updates.push("reg_no = ?");
      args.push(String(body.rollNumber || body.reg_no).trim().toUpperCase());
    }
    if (body.email !== undefined) {
      updates.push("email = ?");
      args.push(String(body.email).trim().toLowerCase());
    }
    if (body.batchId !== undefined || body.batch_id !== undefined) {
      updates.push("batch_id = ?");
      args.push(String(body.batchId || body.batch_id));
    }
    if (body.batchName !== undefined || body.batch_name !== undefined) {
      updates.push("batch_name = ?");
      args.push(String(body.batchName || body.batch_name));
    }
    if (body.section !== undefined) {
      updates.push("section = ?");
      args.push(String(body.section));
    }
    if (body.phone !== undefined) {
      updates.push("phone = ?");
      args.push(String(body.phone));
    }
    if (body.semester !== undefined) {
      updates.push("semester = ?");
      args.push(Number(body.semester));
    }
    if (body.program !== undefined) {
      updates.push("program = ?");
      args.push(String(body.program));
    }
    if (body.department !== undefined) {
      updates.push("department = ?");
      args.push(String(body.department));
    }
    if (body.enrollmentNumber !== undefined || body.enrollment_no !== undefined) {
      updates.push("enrollment_no = ?");
      args.push(String(body.enrollmentNumber || body.enrollment_no));
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
    }

    args.push(id);
    const sql = `UPDATE students SET ${updates.join(", ")} WHERE id = ?;`;
    await turso.execute({ sql, args });

    return NextResponse.json({ success: true, message: "Student updated in database" });
  } catch (error: any) {
    console.error("Error updating student in Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    await turso.execute({
      sql: "DELETE FROM students WHERE id = ?;",
      args: [id],
    });

    return NextResponse.json({ success: true, message: "Student deleted from database" });
  } catch (error: any) {
    console.error("Error deleting student from Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to delete student" }, { status: 500 });
  }
}
