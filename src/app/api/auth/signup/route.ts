import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lucia } from "@/lib/auth/lucia";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { hash } from "oslo/password";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName } = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, {
      algorithm: "argon2id",
      strength: "strong",
    });

    // Create user
    const userId = generateId(15);
    await db.insert(users).values({
      id: userId,
      email,
      hashedPassword,
      fullName: fullName || null,
    });

    // Create session
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}