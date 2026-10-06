import { NextResponse } from "next/server";
import { turso, isTursoConfigured } from "@/lib/turso";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isTursoConfigured()) {
    return NextResponse.json(
      {
        status: "unconfigured",
        message:
          "TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing. Please check .env.local or .env.",
      },
      { status: 400 }
    );
  }

  try {
    const startTime = Date.now();

    // Query tables and counts
    const ping = await turso.execute("SELECT 1 AS connected, datetime('now') AS server_time;");
    const students = await turso.execute("SELECT COUNT(*) AS count FROM students;");
    const professors = await turso.execute("SELECT COUNT(*) AS count FROM professors;");
    const courses = await turso.execute("SELECT COUNT(*) AS count FROM courses;");

    const responseTimeMs = Date.now() - startTime;

    return NextResponse.json({
      status: "success",
      message: "🎉 Turso database is fully connected and initialized!",
      responseTimeMs: `${responseTimeMs}ms`,
      details: {
        serverTime: ping.rows[0]?.server_time,
        totalStudents: students.rows[0]?.count,
        totalProfessors: professors.rows[0]?.count,
        totalCourses: courses.rows[0]?.count,
      },
    });
  } catch (error: unknown) {
    console.error("Turso connection error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown database error";
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to Turso database.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
