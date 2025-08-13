import "server-only";
export const runtime = "nodejs";
import { z } from "zod";
import { validateRequest } from "@/lib/auth/validateRequest";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createEvent } from "@/data/admin/events";

const Body = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  lang: z.enum(["el","en","ru","zh"]).optional()
});

export async function POST(req: Request) {
  const { user } = await validateRequest();
  await requireAdmin(user?.id ?? null);

  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  await createEvent({
    ...parsed.data,
    startAt: parsed.data.startAt ? new Date(parsed.data.startAt) : undefined,
    endAt: parsed.data.endAt ? new Date(parsed.data.endAt) : undefined,
    createdBy: user!.id
  });
  return new Response(null, { status: 201 });
}
