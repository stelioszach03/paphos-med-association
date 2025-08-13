import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lucia } from "@/lib/auth/lucia";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { verify } from "oslo/password";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const [foundUser] = user;

    // Verify password
    if (!foundUser.hashedPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const validPassword = await verify(
      foundUser.hashedPassword,
      password,
      {
        algorithm: "argon2id",
      }
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    const session = await lucia.createSession(foundUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return NextResponse.json({ 
      success: true, 
      userId: foundUser.id,
      email: foundUser.email,
      fullName: foundUser.fullName 
    });
  } catch (error) {
    console.error("Login error:", error);
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