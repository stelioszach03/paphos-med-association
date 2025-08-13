import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { listEvents } from "@/data/admin/events";
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'

export default async function Page({ params }: { params: { locale: string } }) {
  const rows = await listEvents();
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Events</h2>
        <Link href={`/${params.locale}/admin/events/new`}>
          <Button size="sm">New</Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Slug</th>
              <th className="p-2">Lang</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any, idx: number) => (
              <tr key={r.id} className={idx % 2 ? 'odd:bg-muted/10' : ''}>
                <td className="p-2 font-medium">{r.title}</td>
                <td className="p-2 text-muted-foreground">{r.slug}</td>
                <td className="p-2 text-muted-foreground">{r.lang}</td>
                <td className="p-2 text-right">
                  <Link className="underline" href={`/${params.locale}/admin/events/${r.slug}`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
