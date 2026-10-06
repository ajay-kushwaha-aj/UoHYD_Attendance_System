import { NextResponse } from "next/server";
import { turso, isTursoConfigured } from "@/lib/turso";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS: Record<string, string> = {
  minThreshold: "75",
  criticalThreshold: "60",
  qrExpiryMinutes: "5",
};

export async function GET() {
  if (!isTursoConfigured()) {
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }

  try {
    const result = await turso.execute("SELECT key, value FROM system_settings;");
    const settings: Record<string, string> = { ...DEFAULT_SETTINGS };

    for (const row of result.rows) {
      if (row.key && row.value !== undefined) {
        settings[String(row.key)] = String(row.value);
      }
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Error reading system settings from Turso:", error);
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(req: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: "Turso database is not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();

    const keys = ["minThreshold", "criticalThreshold", "qrExpiryMinutes"];
    for (const key of keys) {
      if (body[key] !== undefined) {
        await turso.execute({
          sql: `
            INSERT INTO system_settings (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET
              value = excluded.value,
              updated_at = CURRENT_TIMESTAMP;
          `,
          args: [key, String(body[key])],
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Academic settings updated in database successfully",
    });
  } catch (error: any) {
    console.error("Error updating system settings in Turso:", error);
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
