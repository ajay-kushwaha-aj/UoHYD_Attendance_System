import { NextResponse } from "next/server";
import { turso, isTursoConfigured } from "@/lib/turso";

export const dynamic = "force-dynamic";

const DEFAULT_ADMIN = {
  id: "adm-01",
  fullName: "Dr. S. R. Murthy",
  email: "academic.admin@uohyd.ac.in",
  department: "Dean's Office, School of Life Sciences",
  phone: "+91 40 2313 4001",
  officeRoom: "Dean's Office, Administration Block, Ground Floor",
  role: "admin",
};

export async function GET() {
  if (!isTursoConfigured()) {
    return NextResponse.json({ success: true, profile: DEFAULT_ADMIN });
  }

  try {
    const result = await turso.execute(`
      SELECT id, full_name, email, department, phone, office_room, role
      FROM admin_profile
      LIMIT 1;
    `);

    if (result.rows.length === 0) {
      // Seed default admin in database
      await turso.execute({
        sql: `
          INSERT INTO admin_profile (id, full_name, email, department, phone, office_room, role)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        args: [
          DEFAULT_ADMIN.id,
          DEFAULT_ADMIN.fullName,
          DEFAULT_ADMIN.email,
          DEFAULT_ADMIN.department,
          DEFAULT_ADMIN.phone,
          DEFAULT_ADMIN.officeRoom,
          DEFAULT_ADMIN.role,
        ],
      });
      return NextResponse.json({ success: true, profile: DEFAULT_ADMIN });
    }

    const row = result.rows[0];
    return NextResponse.json({
      success: true,
      profile: {
        id: String(row.id),
        fullName: String(row.full_name || DEFAULT_ADMIN.fullName),
        email: String(row.email || DEFAULT_ADMIN.email),
        department: String(row.department || DEFAULT_ADMIN.department),
        phone: String(row.phone || DEFAULT_ADMIN.phone),
        officeRoom: String(row.office_room || DEFAULT_ADMIN.officeRoom),
        role: "admin",
      },
    });
  } catch (error: any) {
    console.error("Error reading admin profile from Turso:", error);
    return NextResponse.json({ success: true, profile: DEFAULT_ADMIN });
  }
}

export async function PUT(req: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const phone = body.phone;
    const officeRoom = body.officeRoom;
    const newPassword = body.newPassword;

    // Check if admin profile exists
    const existing = await turso.execute("SELECT id FROM admin_profile LIMIT 1;");
    const adminId = existing.rows.length > 0 ? String(existing.rows[0].id) : "adm-01";

    const updates: string[] = ["updated_at = CURRENT_TIMESTAMP"];
    const args: any[] = [];

    if (phone !== undefined) {
      updates.push("phone = ?");
      args.push(String(phone).trim());
    }
    if (officeRoom !== undefined) {
      updates.push("office_room = ?");
      args.push(String(officeRoom).trim());
    }
    if (newPassword !== undefined && String(newPassword).trim().length > 0) {
      const { hashPassword } = await import("@/lib/auth-crypto");
      const cred = hashPassword(String(newPassword).trim());
      updates.push("password_hash = ?");
      args.push(cred.hash);

      // Also update in users table for real authentication
      await turso.execute({
        sql: "UPDATE users SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP WHERE role = 'admin';",
        args: [cred.hash, cred.salt],
      });
    }

    if (existing.rows.length === 0) {
      const { hashPassword } = await import("@/lib/auth-crypto");
      const cred = hashPassword(newPassword || "admin123");
      await turso.execute({
        sql: `
          INSERT INTO admin_profile (id, full_name, email, department, phone, office_room, password_hash)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        args: [
          adminId,
          DEFAULT_ADMIN.fullName,
          DEFAULT_ADMIN.email,
          DEFAULT_ADMIN.department,
          phone || DEFAULT_ADMIN.phone,
          officeRoom || DEFAULT_ADMIN.officeRoom,
          cred.hash,
        ],
      });
    } else {
      args.push(adminId);
      await turso.execute({
        sql: `UPDATE admin_profile SET ${updates.join(", ")} WHERE id = ?;`,
        args,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Admin details updated in database successfully",
    });
  } catch (error: any) {
    console.error("Error updating admin profile in Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to update admin profile" }, { status: 500 });
  }
}
