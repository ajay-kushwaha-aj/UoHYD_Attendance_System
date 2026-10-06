import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { turso, isTursoConfigured } from "@/lib/turso";
import { verifyPassword, generateSessionToken } from "@/lib/auth-crypto";
import { AuthUser } from "@/lib/auth-context";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ success: false, error: "Database is not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const rawIdentifier = String(body.identifier || "").trim();
    const password = String(body.password || "").trim();
    const requestedRole = body.role ? String(body.role).toLowerCase() : undefined;

    if (!rawIdentifier || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both an institutional ID/email and password." },
        { status: 400 }
      );
    }

    const clean = rawIdentifier.toLowerCase();
    const withoutDomain = clean.replace("@uohyd.ac.in", "").trim();
    const withDomain = `${withoutDomain}@uohyd.ac.in`;

    // 1. Query users table in Turso
    const result = await turso.execute({
      sql: `
        SELECT u.id, u.email, u.identifier, u.password_hash, u.salt, u.role, u.full_name, u.reference_id, u.status
        FROM users u
        WHERE lower(u.email) = ? OR lower(u.identifier) = ? OR lower(u.identifier) = ?
        LIMIT 1;
      `,
      args: [withDomain, clean, withoutDomain],
    });

    let userRow = result.rows[0];

    // If not found by primary identifiers, check if identifier is an employee code for professors
    if (!userRow) {
      const profResult = await turso.execute({
        sql: `
          SELECT u.id, u.email, u.identifier, u.password_hash, u.salt, u.role, u.full_name, u.reference_id, u.status
          FROM users u
          JOIN professors p ON u.reference_id = p.id
          WHERE lower(p.faculty_id) = ?
          LIMIT 1;
        `,
        args: [clean],
      });
      userRow = profResult.rows[0];
    }

    // Check if user exists
    if (!userRow) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. No institutional account found for the entered ID/email." },
        { status: 401 }
      );
    }

    if (userRow.status === "INACTIVE" || userRow.status === "SUSPENDED") {
      return NextResponse.json(
        { success: false, error: "This institutional account is currently suspended. Please contact the Dean's Office." },
        { status: 403 }
      );
    }

    // 2. Verify hashed password against stored salt in Turso
    const isPasswordValid = verifyPassword(
      password,
      String(userRow.password_hash),
      String(userRow.salt)
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect password. Please verify your credentials and try again." },
        { status: 401 }
      );
    }

    // 3. Verify role match if user specifically attempted login through role-specific tab
    const role = String(userRow.role) as "student" | "professor" | "admin";
    if (requestedRole && requestedRole !== role) {
      return NextResponse.json(
        {
          success: false,
          error: `This institutional account is authorized as "${role.toUpperCase()}". Please switch to the ${role.toUpperCase()} login tab.`,
        },
        { status: 403 }
      );
    }

    // 4. Create real persistent session in Turso
    const sessionToken = generateSessionToken();
    const sessionId = `sess-${Date.now()}-${sessionToken.slice(0, 8)}`;

    await turso.execute({
      sql: `
        INSERT INTO user_sessions (id, user_id, token, role, expires_at)
        VALUES (?, ?, ?, ?, datetime('now', '+7 days'));
      `,
      args: [sessionId, String(userRow.id), sessionToken, role],
    });

    // 5. Fetch extended profile info based on role
    let authUser: AuthUser = {
      id: String(userRow.id),
      email: String(userRow.email),
      fullName: String(userRow.full_name),
      role,
      department: "Department of Systems & Computational Biology",
    };

    if (role === "student" && userRow.reference_id) {
      const stdRes = await turso.execute({
        sql: "SELECT * FROM students WHERE id = ? LIMIT 1;",
        args: [String(userRow.reference_id)],
      });
      if (stdRes.rows.length > 0) {
        const s = stdRes.rows[0];
        authUser = {
          ...authUser,
          rollNumber: String(s.reg_no || userRow.identifier).toUpperCase(),
          department: String(s.department || authUser.department),
          program: s.program ? String(s.program) : undefined,
          batch: s.batch_name ? String(s.batch_name) : undefined,
          semester: s.semester ? Number(s.semester) : undefined,
          phone: s.phone ? String(s.phone) : undefined,
        };
      }
    } else if (role === "professor" && userRow.reference_id) {
      const profRes = await turso.execute({
        sql: "SELECT * FROM professors WHERE id = ? LIMIT 1;",
        args: [String(userRow.reference_id)],
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
    } else if (role === "admin" && userRow.reference_id) {
      const adminRes = await turso.execute({
        sql: "SELECT * FROM admin_profile WHERE id = ? LIMIT 1;",
        args: [String(userRow.reference_id)],
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

    // 6. Set HTTP-only Cookie
    const cookieStore = cookies();
    cookieStore.set("auth_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: authUser,
      token: sessionToken,
    });
  } catch (error: any) {
    console.error("Login authentication error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "An unexpected authentication error occurred." },
      { status: 500 }
    );
  }
}
