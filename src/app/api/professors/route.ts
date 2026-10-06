import { NextResponse } from "next/server";
import { turso, isTursoConfigured } from "@/lib/turso";
import { ProfessorProfile } from "@/types";

export const dynamic = "force-dynamic";

function rowToProfessor(row: any): ProfessorProfile {
  let assignedCourses: string[] = [];
  try {
    if (row.assigned_courses) {
      assignedCourses = JSON.parse(String(row.assigned_courses));
    }
  } catch {
    assignedCourses = row.assigned_courses ? [String(row.assigned_courses)] : [];
  }

  return {
    id: String(row.id),
    fullName: String(row.name || ""),
    employeeCode: String(row.faculty_id || ""),
    email: String(row.email || ""),
    department: String(row.department || "Department of Systems & Computational Biology"),
    designation: String(row.designation || "Professor"),
    phone: row.phone ? String(row.phone) : undefined,
    room: row.room ? String(row.room) : undefined,
    specialization: row.specialization ? String(row.specialization) : undefined,
    assignedCourses,
    role: "professor",
  };
}

export async function GET() {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const result = await turso.execute(`
      SELECT id, name, faculty_id, email, department, designation, phone, room, specialization, assigned_courses, created_at
      FROM professors
      ORDER BY name ASC;
    `);

    const professors = result.rows.map(rowToProfessor);
    return NextResponse.json({ success: true, professors });
  } catch (error: any) {
    console.error("Error fetching professors from Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch professors" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const id = body.id || `prof-${Date.now().toString().slice(-4)}`;
    const name = (body.fullName || body.name || "").trim();
    const faculty_id = (body.employeeCode || body.faculty_id || `EMP-UOH-${Math.floor(100 + Math.random() * 900)}`).trim();
    const email = (body.email || "").trim().toLowerCase();
    const department = body.department || "Department of Systems & Computational Biology";
    const designation = body.designation || "Assistant Professor";
    const phone = body.phone || "";
    const room = body.room || "";
    const specialization = body.specialization || "";
    const assigned_courses = JSON.stringify(body.assignedCourses || []);

    if (!name || !email) {
      return NextResponse.json({ error: "Full name and email are required" }, { status: 400 });
    }

    await turso.execute({
      sql: `
        INSERT INTO professors (id, name, faculty_id, email, department, designation, phone, room, specialization, assigned_courses)
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
          assigned_courses = excluded.assigned_courses;
      `,
      args: [id, name, faculty_id, email, department, designation, phone, room, specialization, assigned_courses],
    });

    // Create login account in users table
    const { hashPassword } = await import("@/lib/auth-crypto");
    const cred = hashPassword("prof123");
    const userId = `usr-${id}`;
    const identifier = (email.split("@")[0] || faculty_id).toLowerCase();

    await turso.execute({
      sql: `
        INSERT INTO users (id, email, identifier, password_hash, salt, role, full_name, reference_id)
        VALUES (?, ?, ?, ?, ?, 'professor', ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          email = excluded.email,
          identifier = excluded.identifier,
          full_name = excluded.full_name;
      `,
      args: [userId, email, identifier, cred.hash, cred.salt, name, id],
    });

    const prof: ProfessorProfile = {
      id,
      fullName: name,
      employeeCode: faculty_id,
      email,
      department,
      designation,
      phone,
      room,
      specialization,
      assignedCourses: body.assignedCourses || [],
      role: "professor",
    };

    return NextResponse.json({ success: true, professor: prof });
  } catch (error: any) {
    console.error("Error creating professor in Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to create professor" }, { status: 500 });
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
      return NextResponse.json({ error: "Professor ID is required" }, { status: 400 });
    }

    const updates: string[] = [];
    const args: any[] = [];

    if (body.fullName !== undefined || body.name !== undefined) {
      updates.push("name = ?");
      args.push(String(body.fullName || body.name).trim());
    }
    if (body.employeeCode !== undefined || body.faculty_id !== undefined) {
      updates.push("faculty_id = ?");
      args.push(String(body.employeeCode || body.faculty_id).trim());
    }
    if (body.email !== undefined) {
      updates.push("email = ?");
      args.push(String(body.email).trim().toLowerCase());
    }
    if (body.department !== undefined) {
      updates.push("department = ?");
      args.push(String(body.department));
    }
    if (body.designation !== undefined) {
      updates.push("designation = ?");
      args.push(String(body.designation));
    }
    if (body.phone !== undefined) {
      updates.push("phone = ?");
      args.push(String(body.phone));
    }
    if (body.room !== undefined) {
      updates.push("room = ?");
      args.push(String(body.room));
    }
    if (body.specialization !== undefined) {
      updates.push("specialization = ?");
      args.push(String(body.specialization));
    }
    if (body.assignedCourses !== undefined) {
      updates.push("assigned_courses = ?");
      args.push(JSON.stringify(body.assignedCourses));
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
    }

    args.push(id);
    const sql = `UPDATE professors SET ${updates.join(", ")} WHERE id = ?;`;
    await turso.execute({ sql, args });

    return NextResponse.json({ success: true, message: "Professor updated in database" });
  } catch (error: any) {
    console.error("Error updating professor in Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to update professor" }, { status: 500 });
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
      return NextResponse.json({ error: "Professor ID is required" }, { status: 400 });
    }

    await turso.execute({
      sql: "DELETE FROM professors WHERE id = ?;",
      args: [id],
    });

    return NextResponse.json({ success: true, message: "Professor deleted from database" });
  } catch (error: any) {
    console.error("Error deleting professor from Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to delete professor" }, { status: 500 });
  }
}
