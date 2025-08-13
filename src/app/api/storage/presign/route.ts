import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { s3 } from "@/lib/storage/s3";
import { getSession } from "@/lib/auth/requireAdmin";
import { db } from "@/db/client";
import { doctors, adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

const presignSchema = z.object({
  key: z.string().min(1),
  contentType: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { session, user } = await getSession();
    
    if (!session || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is doctor or admin
    const [isDoctor] = await db
      .select()
      .from(doctors)
      .where(eq(doctors.id, user.id))
      .limit(1);
    
    const [isAdmin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.userId, user.id))
      .limit(1);

    if (!isDoctor && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Must be a doctor or admin" },
        { status: 403 }
      );
    }

    // Parse request
    const body = await request.json();
    const { key, contentType } = presignSchema.parse(body);

    // Sanitize key to prevent directory traversal
    const sanitizedKey = key.replace(/\.\.|\//g, '_');
    const finalKey = `uploads/${user.id}/${Date.now()}_${sanitizedKey}`;

    // Get presigned URL
    const presignedUrl = await s3.getPresignedUploadUrl(
      finalKey,
      contentType,
      3600 // 1 hour
    );

    return NextResponse.json({ 
      success: true,
      uploadUrl: presignedUrl,
      key: finalKey,
      expiresIn: 3600
    });
  } catch (error) {
    console.error("Presign error:", error);
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