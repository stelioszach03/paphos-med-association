import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/validateRequest";
import { db } from "@/db/client";
import { adminUsers, doctors } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        role: 'guest'
      });
    }

    // Check if user is admin
    const [admin] = await db
      .select({ role: adminUsers.role })
      .from(adminUsers)
      .where(eq(adminUsers.userId, user.id))
      .limit(1);

    if (admin?.role) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName
        },
        role: admin.role
      });
    }

    // Check if user is doctor
    const [doctor] = await db
      .select({ status: doctors.status })
      .from(doctors)
      .where(eq(doctors.id, user.id))
      .limit(1);

    if (doctor?.status === 'approved') {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName
        },
        role: 'doctor'
      });
    }

    // Default to guest role
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      },
      role: 'guest'
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
