import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { turso, isTursoConfigured } from "@/lib/turso";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (token && isTursoConfigured()) {
      await turso.execute({
        sql: "DELETE FROM user_sessions WHERE token = ?;",
        args: [token],
      });
    }

    // Delete the cookie
    cookieStore.delete("auth_token");

    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: true, message: "Logged out" });
  }
}
