import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { turso, isTursoConfigured } from "@/lib/turso";
import { AuthUser } from "@/lib/auth-context";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    const cookieStore = cookies();
    let token = cookieStore.get("auth_token")?.value;

    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    // Verify session in Turso
    const sessionRes = await turso.execute({
      sql: `
        SELECT s.id as session_id, s.token, s.role, s.expires_at,
               u.id as user_id, u.email, u.identifier, u.role as user_role, u.full_name, u.reference_id, u.status
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > datetime('now')
        LIMIT 1;
      `,
      args: [token],
    });

    if (sessionRes.rows.length === 0) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    const row = sessionRes.rows[0];
    const role = String(row.user_role) as "student" | "professor" | "admin";

    let authUser: AuthUser = {
      id: String(row.user_id),
      email: String(row.email),
      fullName: String(row.full_name),
      role,
      department: "Department of Systems & Computational Biology",
    };

    if (role === "student" && row.reference_id) {
      const stdRes = await turso.execute({
        sql: "SELECT * FROM students WHERE id = ? LIMIT 1;",
        args: [String(row.reference_id)],
      });
      if (stdRes.rows.length > 0) {
        const s = stdRes.rows[0];
        authUser = {
          ...authUser,
          rollNumber: String(s.reg_no || row.identifier).toUpperCase(),
          department: String(s.department || authUser.department),
          program: s.program ? String(s.program) : undefined,
          batch: s.batch_name ? String(s.batch_name) : undefined,
          semester: s.semester ? Number(s.semester) : undefined,
          phone: s.phone ? String(s.phone) : undefined,
        };
      }
    } else if (role === "professor" && row.reference_id) {
      const profRes = await turso.execute({
        sql: "SELECT * FROM professors WHERE id = ? LIMIT 1;",
        args: [String(row.reference_id)],
      });
      if (profRes.rows.length > 0) {
        const p = profRes.rows[0];
        authUser = {
          ...authUser,
          employeeCode: String(p.faculty_id || ""),
          designation: String(p.designation || ""),
          department: String(p.department || authUser.department),
          phone: p.phone ? String(p.phone) : undefined,
        };
      }
    } else if (role === "admin" && row.reference_id) {
      const adminRes = await turso.execute({
        sql: "SELECT * FROM admin_profile WHERE id = ? LIMIT 1;",
        args: [String(row.reference_id)],
      });
      if (adminRes.rows.length > 0) {
        const a = adminRes.rows[0];
        authUser = {
          ...authUser,
          department: String(a.department || authUser.department),
          phone: a.phone ? String(a.phone) : undefined,
        };
      }
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: authUser,
    });
  } catch (error: any) {
    console.error("Session verification error:", error);
    return NextResponse.json({ success: false, authenticated: false }, { status: 500 });
  }
}
