import Link from 'next/link'
import { Card, CardHeader, CardContent } from '../ui/card'
import { Calendar as CalendarIcon, MapPin } from 'lucide-react'

export default function EventCard({
  href,
  title,
  date,
  location,
}: {
  href: string
  title: string
  date?: string | null
  location?: string | null
}) {
  return (
    <Link href={href} className="block">
      <Card className="rounded-2xl ring-1 ring-border shadow-sm hover:shadow-md transition motion-safe:hover:-translate-y-0.5">
        <CardHeader className="rounded-t-2xl bg-gradient-to-br from-background to-muted/40 font-semibold">
          {title}
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {date && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
              <CalendarIcon className="h-4 w-4" />
              {new Date(date).toLocaleString()}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
              <MapPin className="h-4 w-4" />
              {location}
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
