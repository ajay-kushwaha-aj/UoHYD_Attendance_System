import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { turso, isTursoConfigured } from "@/lib/turso";
import { hashPassword, verifyPassword } from "@/lib/auth-crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized session" }, { status: 401 });
    }

    const body = await req.json();
    const currentPassword = String(body.currentPassword || "").trim();
    const newPassword = String(body.newPassword || "").trim();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 1. Fetch user session
    const sessionRes = await turso.execute({
      sql: `
        SELECT u.id, u.role, u.password_hash, u.salt
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > datetime('now')
        LIMIT 1;
      `,
      args: [token],
    });

    if (sessionRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Session expired or invalid" }, { status: 401 });
    }

    const user = sessionRes.rows[0];

    // 2. If current password provided, verify it
    if (currentPassword) {
      const isValid = verifyPassword(currentPassword, String(user.password_hash), String(user.salt));
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Current password does not match our records." },
          { status: 400 }
        );
      }
    }

    // 3. Hash new password and update in Turso
    const newCred = hashPassword(newPassword);
    await turso.execute({
      sql: `
        UPDATE users
        SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?;
      `,
      args: [newCred.hash, newCred.salt, String(user.id)],
    });

    // If admin, also update admin_profile
    if (user.role === "admin") {
      await turso.execute({
        sql: "UPDATE admin_profile SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 'adm-01';",
        args: [newCred.hash],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully and updated in central database.",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to change password." },
      { status: 500 }
    );
  }
}
