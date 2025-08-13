import "server-only";
export const runtime = "nodejs";
import { z } from "zod";
import { validateRequest } from "@/lib/auth/validateRequest";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { updateEvent } from "@/data/admin/events";

const Body = z.object({
  title: z.string().optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  lang: z.enum(["el","en","ru","zh"]).optional()
});

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const { user } = await validateRequest();
  await requireAdmin(user?.id ?? null);

  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  await updateEvent(params.slug, {
    ...parsed.data,
    startAt: parsed.data.startAt ? new Date(parsed.data.startAt) : undefined,
    endAt: parsed.data.endAt ? new Date(parsed.data.endAt) : undefined,
  });
  return new Response(null, { status: 200 });
}
