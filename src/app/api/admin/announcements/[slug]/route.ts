import "server-only";
export const runtime = "nodejs";
import { z } from "zod";
import { validateRequest } from "@/lib/auth/validateRequest";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { updateAnnouncement } from "@/data/admin/announcements";

const Body = z.object({
  title: z.string().optional(),
  slug: z.string().min(1).optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  lang: z.enum(["el","en","ru","zh"]).optional()
});

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const { user } = await validateRequest();
  await requireAdmin(user?.id ?? null);

  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  await updateAnnouncement(params.slug, parsed.data);
  return new Response(null, { status: 200 });
}
