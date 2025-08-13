import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { listAnnouncements } from "@/data/admin/announcements";

export default async function Page({ params }: { params: { locale: string } }) {
  const rows = await listAnnouncements();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Announcements</h2>
        <Link className="btn" href={`/${params.locale}/admin/announcements/new`}>New</Link>
      </div>
      <ul className="divide-y">
        {rows.map((r: any) => (
          <li key={r.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{r.title}</div>
              <div className="text-xs text-gray-500">{r.slug} • {r.lang}</div>
            </div>
            <Link className="text-sm underline" href={`/${params.locale}/admin/announcements/${r.slug}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
