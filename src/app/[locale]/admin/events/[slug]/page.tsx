import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data/admin/events";

export default async function Page({ params }: { params: { locale: string; slug: string } }) {
  const row = await getEventBySlug(params.slug);
  if (!row) notFound();
  return (
    <form method="post" action={`/api/admin/events/${row.slug}`} className="space-y-4 max-w-lg">
      <div>
        <label className="block mb-1">Title</label>
        <input name="title" className="input" defaultValue={row.title || ''} />
      </div>
      <div>
        <label className="block mb-1">Slug</label>
        <input name="slug" className="input" defaultValue={row.slug || ''} />
      </div>
      <div>
        <label className="block mb-1">Description</label>
        <textarea name="description" className="textarea" defaultValue={row.description || ''} />
      </div>
      <div>
        <label className="block mb-1">Location</label>
        <input name="location" className="input" defaultValue={row.location || ''} />
      </div>
      <div>
        <label className="block mb-1">Start</label>
        <input type="datetime-local" name="startAt" className="input" defaultValue={row.startAt ? new Date(row.startAt).toISOString().slice(0,16) : ''} />
      </div>
      <div>
        <label className="block mb-1">End</label>
        <input type="datetime-local" name="endAt" className="input" defaultValue={row.endAt ? new Date(row.endAt).toISOString().slice(0,16) : ''} />
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
