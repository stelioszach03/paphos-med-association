import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <form method="post" action="/api/admin/events" className="space-y-4 max-w-lg">
      <div>
        <label className="block mb-1">Title</label>
        <input name="title" className="input" required />
      </div>
      <div>
        <label className="block mb-1">Slug</label>
        <input name="slug" className="input" required />
      </div>
      <div>
        <label className="block mb-1">Description</label>
        <textarea name="description" className="textarea" />
      </div>
      <div>
        <label className="block mb-1">Location</label>
        <input name="location" className="input" />
      </div>
      <div>
        <label className="block mb-1">Start</label>
        <input type="datetime-local" name="startAt" className="input" />
      </div>
      <div>
        <label className="block mb-1">End</label>
        <input type="datetime-local" name="endAt" className="input" />
      </div>
      <div>
        <label className="block mb-1">Language</label>
        <select name="lang" className="input">
          <option value="el">el</option>
          <option value="en">en</option>
          <option value="ru">ru</option>
          <option value="zh">zh</option>
        </select>
      </div>
      <button type="submit" className="btn">Create</button>
    </form>
  );
}
