import { NextResponse } from "next/server";
import { turso, isTursoConfigured } from "@/lib/turso";
import { Course, TimeTableSlot } from "@/types";

export const dynamic = "force-dynamic";

function rowToCourse(row: any): Course {
  let scheduleDays: string[] = ["Monday", "Wednesday"];
  try {
    if (row.schedule_days) {
      scheduleDays = JSON.parse(String(row.schedule_days));
    }
  } catch {
    scheduleDays = ["Monday", "Wednesday"];
  }

  let timeTableSlots: TimeTableSlot[] = [];
  try {
    if (row.timetable_slots) {
      timeTableSlots = JSON.parse(String(row.timetable_slots));
    }
  } catch {
    timeTableSlots = [];
  }

  return {
    id: String(row.id),
    code: String(row.code || ""),
    name: String(row.name || ""),
    department: String(row.department || "Department of Systems & Computational Biology"),
    program: String(row.program || "MSc Systems & Computational Biology"),
    semester: Number(row.semester) || 2,
    credits: Number(row.credits) || 3,
    professorId: String(row.professor_id || "prof-01"),
    professorName: String(row.professor_name || "Prof. K. Venkatesh Rao"),
    room: String(row.room || "LH-204"),
    scheduleTime: String(row.schedule_time || "10:00 AM – 11:30 AM"),
    scheduleDays,
    timeTableSlots,
    totalStudents: Number(row.total_students) || 8,
    totalConductedSessions: 0,
  };
}

export async function GET() {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const result = await turso.execute(`
      SELECT id, code, name, department, program, semester, credits, professor_id, professor_name, room, schedule_time, schedule_days, timetable_slots, total_students, created_at
      FROM courses
      ORDER BY code ASC;
    `);

    const courses = result.rows.map(rowToCourse);
    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    console.error("Error fetching courses from Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const id = body.id || `course-${(body.code || "sub").toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`;
    const code = (body.code || "").trim().toUpperCase();
    const name = (body.name || "").trim();
    const department = body.department || "Department of Systems & Computational Biology";
    const program = body.program || "MSc Systems & Computational Biology";
    const semester = Number(body.semester) || 2;
    const credits = Number(body.credits) || 3;
    const professor_id = body.professorId || body.professor_id || "prof-01";
    const professor_name = body.professorName || body.professor_name || "Prof. K. Venkatesh Rao";
    const room = body.room || "LH-204";
    const schedule_time = body.scheduleTime || body.schedule_time || "10:00 AM – 11:30 AM";
    const schedule_days = JSON.stringify(body.scheduleDays || ["Monday", "Wednesday"]);
    const timetable_slots = JSON.stringify(body.timeTableSlots || []);
    const total_students = Number(body.totalStudents) || 8;

    if (!code || !name) {
      return NextResponse.json({ error: "Course code and name are required" }, { status: 400 });
    }

    await turso.execute({
      sql: `
        INSERT INTO courses (id, code, name, department, program, semester, credits, professor_id, professor_name, room, schedule_time, schedule_days, timetable_slots, total_students)
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
          total_students = excluded.total_students;
      `,
      args: [id, code, name, department, program, semester, credits, professor_id, professor_name, room, schedule_time, schedule_days, timetable_slots, total_students],
    });

    const course: Course = {
      id,
      code,
      name,
      department,
      program,
      semester,
      credits,
      professorId: professor_id,
      professorName: professor_name,
      room,
      scheduleTime: schedule_time,
      scheduleDays: body.scheduleDays || ["Monday", "Wednesday"],
      timeTableSlots: body.timeTableSlots || [],
      totalStudents: total_students,
      totalConductedSessions: 0,
    };

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    console.error("Error creating course in Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to create course" }, { status: 500 });
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
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
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
    if (body.department !== undefined) {
      updates.push("department = ?");
      args.push(String(body.department));
    }
    if (body.program !== undefined) {
      updates.push("program = ?");
      args.push(String(body.program));
    }
    if (body.semester !== undefined) {
      updates.push("semester = ?");
      args.push(Number(body.semester));
    }
    if (body.credits !== undefined) {
      updates.push("credits = ?");
      args.push(Number(body.credits));
    }
    if (body.professorId !== undefined || body.professor_id !== undefined) {
      updates.push("professor_id = ?");
      args.push(String(body.professorId || body.professor_id));
    }
    if (body.professorName !== undefined || body.professor_name !== undefined) {
      updates.push("professor_name = ?");
      args.push(String(body.professorName || body.professor_name));
    }
    if (body.room !== undefined) {
      updates.push("room = ?");
      args.push(String(body.room));
    }
    if (body.scheduleTime !== undefined || body.schedule_time !== undefined) {
      updates.push("schedule_time = ?");
      args.push(String(body.scheduleTime || body.schedule_time));
    }
    if (body.scheduleDays !== undefined) {
      updates.push("schedule_days = ?");
      args.push(JSON.stringify(body.scheduleDays));
    }
    if (body.timeTableSlots !== undefined) {
      updates.push("timetable_slots = ?");
      args.push(JSON.stringify(body.timeTableSlots));
    }
    if (body.totalStudents !== undefined) {
      updates.push("total_students = ?");
      args.push(Number(body.totalStudents));
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
    }

    args.push(id);
    const sql = `UPDATE courses SET ${updates.join(", ")} WHERE id = ?;`;
    await turso.execute({ sql, args });

    return NextResponse.json({ success: true, message: "Course updated in database" });
  } catch (error: any) {
    console.error("Error updating course in Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to update course" }, { status: 500 });
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
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    await turso.execute({
      sql: "DELETE FROM courses WHERE id = ?;",
      args: [id],
    });

    return NextResponse.json({ success: true, message: "Course deleted from database" });
  } catch (error: any) {
    console.error("Error deleting course from Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to delete course" }, { status: 500 });
  }
}
