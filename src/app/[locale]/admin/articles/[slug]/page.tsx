import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/data/admin/articles";

export default async function Page({ params }: { params: { locale: string; slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();
  return (
    <form method="post" action={`/api/admin/articles/${article.slug}`} className="space-y-4 max-w-lg">
      <div>
        <label className="block mb-1">Title</label>
        <input name="title" className="input" defaultValue={article.title || ''} />
      </div>
      <div>
        <label className="block mb-1">Slug</label>
        <input name="slug" className="input" defaultValue={article.slug || ''} />
      </div>
      <div>
        <label className="block mb-1">Summary</label>
        <textarea name="summary" className="textarea" defaultValue={article.summary || ''} />
      </div>
      <div>
        <label className="block mb-1">Content</label>
        <textarea name="content" className="textarea" defaultValue={article.content || ''} />
      </div>
      <div>
        <label className="block mb-1">Language</label>
        <select name="lang" className="input" defaultValue={article.lang || 'el'}>
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
