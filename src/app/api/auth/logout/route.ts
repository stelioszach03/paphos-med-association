import { NextRequest, NextResponse } from "next/server";
import { lucia } from "@/lib/auth/lucia";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) {
      return NextResponse.json({ success: true });
    }

    await lucia.invalidateSession(sessionId);
    
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}