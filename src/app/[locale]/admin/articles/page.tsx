import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { listArticles } from "@/data/admin/articles";

export default async function Page({ params }: { params: { locale: string } }) {
  const rows = await listArticles();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Articles</h2>
        <Link className="btn" href={`/${params.locale}/admin/articles/new`}>New</Link>
      </div>
      <ul className="divide-y">
        {rows.map((r: any) => (
          <li key={r.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{r.title}</div>
              <div className="text-xs text-gray-500">{r.slug} • {r.lang}</div>
            </div>
            <Link className="text-sm underline" href={`/${params.locale}/admin/articles/${r.slug}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
