import "server-only";
export const runtime = "nodejs";
import { z } from "zod";
import { validateRequest } from "@/lib/auth/validateRequest";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createArticle } from "@/data/admin/articles";

const Body = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().optional(),
  content: z.string().optional(),
  lang: z.enum(["el","en","ru","zh"]).optional()
});

export async function POST(req: Request) {
  const { user } = await validateRequest();
  await requireAdmin(user?.id ?? null);

  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  await createArticle({ ...parsed.data, createdBy: user!.id });
  return new Response(null, { status: 201 });
}
