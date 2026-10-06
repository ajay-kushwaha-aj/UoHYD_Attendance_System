import { NextResponse } from "next/server";
import { turso, isTursoConfigured } from "@/lib/turso";
import { Department } from "@/types";

export const dynamic = "force-dynamic";

function rowToDepartment(row: any): Department {
  let programs: string[] = [];
  try {
    if (row.programs) {
      programs = JSON.parse(String(row.programs));
    }
  } catch {
    programs = row.programs ? [String(row.programs)] : [];
  }

  return {
    id: String(row.id),
    code: String(row.code || ""),
    name: String(row.name || ""),
    school: String(row.school || ""),
    hodName: String(row.hod_name || ""),
    hodEmail: String(row.hod_email || ""),
    officeLocation: String(row.office_location || ""),
    contactPhone: row.contact_phone ? String(row.contact_phone) : undefined,
    establishedYear: Number(row.established_year) || 2000,
    programs,
    totalFaculty: Number(row.total_faculty) || 0,
    totalStudents: Number(row.total_students) || 0,
    status: (row.status === "INACTIVE" ? "INACTIVE" : "ACTIVE") as "ACTIVE" | "INACTIVE",
    description: row.description ? String(row.description) : undefined,
  };
}

export async function GET() {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const result = await turso.execute(`
      SELECT id, code, name, school, hod_name, hod_email, office_location, contact_phone, established_year, programs, total_faculty, total_students, status, description, created_at
      FROM departments
      ORDER BY name ASC;
    `);

    const departments = result.rows.map(rowToDepartment);
    return NextResponse.json({ success: true, departments });
  } catch (error: any) {
    console.error("Error fetching departments from Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch departments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const cleanCode = (body.code || "DEPT").trim().toUpperCase();
    const id = body.id || `dept-${cleanCode.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const name = (body.name || "").trim();
    const school = (body.school || "School of Life Sciences").trim();
    const hod_name = (body.hodName || body.hod_name || "").trim();
    const hod_email = (body.hodEmail || body.hod_email || "").trim();
    const office_location = (body.officeLocation || body.office_location || "").trim();
    const contact_phone = body.contactPhone || body.contact_phone || "";
    const established_year = Number(body.establishedYear || body.established_year) || 2000;
    const programs = JSON.stringify(body.programs || []);
    const total_faculty = Number(body.totalFaculty || body.total_faculty) || 0;
    const total_students = Number(body.totalStudents || body.total_students) || 0;
    const status = body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";
    const description = body.description || "";

    if (!cleanCode || !name || !hod_name) {
      return NextResponse.json({ error: "Code, name, and HOD name are required" }, { status: 400 });
    }

    await turso.execute({
      sql: `
        INSERT INTO departments (id, code, name, school, hod_name, hod_email, office_location, contact_phone, established_year, programs, total_faculty, total_students, status, description)
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
          description = excluded.description;
      `,
      args: [id, cleanCode, name, school, hod_name, hod_email, office_location, contact_phone, established_year, programs, total_faculty, total_students, status, description],
    });

    const dept: Department = {
      id,
      code: cleanCode,
      name,
      school,
      hodName: hod_name,
      hodEmail: hod_email,
      officeLocation: office_location,
      contactPhone: contact_phone,
      establishedYear: established_year,
      programs: body.programs || [],
      totalFaculty: total_faculty,
      totalStudents: total_students,
      status,
      description,
    };

    return NextResponse.json({ success: true, department: dept });
  } catch (error: any) {
    console.error("Error creating department in Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to create department" }, { status: 500 });
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
      return NextResponse.json({ error: "Department ID is required" }, { status: 400 });
    }

    const updates: string[] = [];
    const args: any[] = [];

    if (body.code !== undefined) {
      updates.push("code = ?");
      args.push(String(body.code).trim().toUpperCase());
    }
    if (body.name !== undefined) {
      updates.push("name = ?");
      args.push(String(body.name).trim());
    }
    if (body.school !== undefined) {
      updates.push("school = ?");
      args.push(String(body.school).trim());
    }
    if (body.hodName !== undefined || body.hod_name !== undefined) {
      updates.push("hod_name = ?");
      args.push(String(body.hodName || body.hod_name).trim());
    }
    if (body.hodEmail !== undefined || body.hod_email !== undefined) {
      updates.push("hod_email = ?");
      args.push(String(body.hodEmail || body.hod_email).trim());
    }
    if (body.officeLocation !== undefined || body.office_location !== undefined) {
      updates.push("office_location = ?");
      args.push(String(body.officeLocation || body.office_location).trim());
    }
    if (body.contactPhone !== undefined || body.contact_phone !== undefined) {
      updates.push("contact_phone = ?");
      args.push(String(body.contactPhone || body.contact_phone));
    }
    if (body.establishedYear !== undefined || body.established_year !== undefined) {
      updates.push("established_year = ?");
      args.push(Number(body.establishedYear || body.established_year));
    }
    if (body.programs !== undefined) {
      updates.push("programs = ?");
      args.push(JSON.stringify(body.programs));
    }
    if (body.totalFaculty !== undefined || body.total_faculty !== undefined) {
      updates.push("total_faculty = ?");
      args.push(Number(body.totalFaculty || body.total_faculty));
    }
    if (body.totalStudents !== undefined || body.total_students !== undefined) {
      updates.push("total_students = ?");
      args.push(Number(body.totalStudents || body.total_students));
    }
    if (body.status !== undefined) {
      updates.push("status = ?");
      args.push(body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE");
    }
    if (body.description !== undefined) {
      updates.push("description = ?");
      args.push(String(body.description));
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
    }

    args.push(id);
    const sql = `UPDATE departments SET ${updates.join(", ")} WHERE id = ?;`;
    await turso.execute({ sql, args });

    return NextResponse.json({ success: true, message: "Department updated in database" });
  } catch (error: any) {
    console.error("Error updating department in Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to update department" }, { status: 500 });
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
      return NextResponse.json({ error: "Department ID is required" }, { status: 400 });
    }

    await turso.execute({
      sql: "DELETE FROM departments WHERE id = ?;",
      args: [id],
    });

    return NextResponse.json({ success: true, message: "Department deleted from database" });
  } catch (error: any) {
    console.error("Error deleting department from Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to delete department" }, { status: 500 });
  }
}
