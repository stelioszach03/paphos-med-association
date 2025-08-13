import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getAnnouncementBySlug } from "@/data/admin/announcements";

export default async function Page({ params }: { params: { locale: string; slug: string } }) {
  const row = await getAnnouncementBySlug(params.slug);
  if (!row) notFound();
  return (
    <form method="post" action={`/api/admin/announcements/${row.slug}`} className="space-y-4 max-w-lg">
      <div>
        <label className="block mb-1">Title</label>
        <input name="title" className="input" defaultValue={row.title || ''} />
      </div>
      <div>
        <label className="block mb-1">Slug</label>
        <input name="slug" className="input" defaultValue={row.slug || ''} />
      </div>
      <div>
        <label className="block mb-1">Summary</label>
        <textarea name="summary" className="textarea" defaultValue={row.summary || ''} />
      </div>
      <div>
        <label className="block mb-1">Content</label>
        <textarea name="content" className="textarea" defaultValue={row.content || ''} />
      </div>
      <div>
        <label className="block mb-1">Language</label>
        <select name="lang" className="input" defaultValue={row.lang || 'el'}>
          <option value="el">el</option>
          <option value="en">en</option>
          <option value="ru">ru</option>
          <option value="zh">zh</option>
        </select>
      </div>
      <button type="submit" className="btn">Save</button>
    </form>
  );
}
