import { NextResponse } from "next/server";
import { turso, isTursoConfigured } from "@/lib/turso";
import { AuditLog } from "@/types";

export const dynamic = "force-dynamic";

function rowToAudit(row: any): AuditLog {
  return {
    id: String(row.id),
    sessionId: String(row.session_id || ""),
    courseName: String(row.course_name || ""),
    actorId: String(row.actor_id || ""),
    actorName: String(row.actor_name || ""),
    actorRole: (row.actor_role || "admin") as any,
    action: String(row.action || "STATUS_OVERRIDE"),
    targetStudentName: row.target_student_name ? String(row.target_student_name) : undefined,
    targetStudentRoll: row.target_student_roll ? String(row.target_student_roll) : undefined,
    oldValue: row.old_value ? String(row.old_value) : undefined,
    newValue: row.new_value ? String(row.new_value) : undefined,
    reason: String(row.reason || ""),
    timestamp: String(row.timestamp || new Date().toISOString()),
  };
}

export async function GET() {
  if (!isTursoConfigured()) {
    return NextResponse.json({ success: true, auditLogs: [] });
  }

  try {
    const result = await turso.execute(`
      SELECT id, session_id, course_name, actor_id, actor_name, actor_role, action, target_student_name, target_student_roll, old_value, new_value, reason, timestamp
      FROM audit_logs
      ORDER BY timestamp DESC
      LIMIT 100;
    `);

    const auditLogs = result.rows.map(rowToAudit);
    return NextResponse.json({ success: true, auditLogs });
  } catch (error: any) {
    console.error("Error reading audit logs from Turso:", error);
    return NextResponse.json({ success: true, auditLogs: [] });
  }
}

export async function POST(req: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const id = body.id || `audit-${Date.now()}`;
    const session_id = body.sessionId || "GENERAL";
    const course_name = body.courseName || "General Administration";
    const actor_id = body.actorId || "adm-01";
    const actor_name = body.actorName || "Administrator";
    const actor_role = body.actorRole || "admin";
    const action = body.action || "STATUS_OVERRIDE";
    const target_student_name = body.targetStudentName || "";
    const target_student_roll = body.targetStudentRoll || "";
    const old_value = body.oldValue || "";
    const new_value = body.newValue || "";
    const reason = body.reason || "";
    const timestamp = body.timestamp || new Date().toISOString();

    await turso.execute({
      sql: `
        INSERT INTO audit_logs (id, session_id, course_name, actor_id, actor_name, actor_role, action, target_student_name, target_student_roll, old_value, new_value, reason, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      args: [id, session_id, course_name, actor_id, actor_name, actor_role, action, target_student_name, target_student_roll, old_value, new_value, reason, timestamp],
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Error writing audit log to Turso:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
