import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <form method="post" action="/api/admin/announcements" className="space-y-4 max-w-lg">
      <div>
        <label className="block mb-1">Title</label>
        <input name="title" className="input" required />
      </div>
      <div>
        <label className="block mb-1">Slug</label>
        <input name="slug" className="input" required />
      </div>
      <div>
        <label className="block mb-1">Summary</label>
        <textarea name="summary" className="textarea" />
      </div>
      <div>
        <label className="block mb-1">Content</label>
        <textarea name="content" className="textarea" />
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
