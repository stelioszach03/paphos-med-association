import Link from 'next/link'
import { Card, CardHeader, CardContent } from '../ui/card'

export default function AnnouncementCard({
  href,
  title,
  summary,
}: {
  href: string
  title: string
  summary?: string | null
}) {
  return (
    <Link href={href} className="block">
      <Card className="rounded-2xl ring-1 ring-border shadow-sm hover:shadow-md transition motion-safe:hover:-translate-y-0.5">
        <CardHeader className="rounded-t-2xl bg-gradient-to-br from-background to-muted/40 font-semibold">
          {title}
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground line-clamp-3">
          {summary}
        </CardContent>
      </Card>
    </Link>
  )
}
