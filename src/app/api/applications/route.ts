import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createApplication } from "@/data/applications";
import { validateRequest } from "@/lib/auth/validateRequest";

const applicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  registryNo: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = applicationSchema.parse(body);

    // Get current user session if exists (optional for applications)
    const { user } = await validateRequest();

    // Create application
    const application = await createApplication({
      userId: user?.id,
      fullName: validated.fullName,
      email: validated.email,
      phone: validated.phone,
      registryNo: validated.registryNo,
      notes: validated.notes,
    });

    return NextResponse.json({ success: true, applicationId: application.id });
  } catch (error) {
    console.error("Application submission error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
