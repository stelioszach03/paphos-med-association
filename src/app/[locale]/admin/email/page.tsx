import { supabaseServer } from '@/lib/supabaseServer'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function AdminEmail() {
  const supabase = supabaseServer()
  const { data: emails } = await supabase.from('emails').select('*').order('created_at', { ascending: false }).limit(50)
  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-xl font-semibold">Inbox</h1>
      <ul className="space-y-2">
        {emails?.map((e: any) => (
          <li key={e.id}>
            <Card>
              <CardContent className="p-4 space-y-1">
                <p className="font-medium">{e.subject}</p>
                <p className="text-sm text-muted-foreground">{e.from} → {e.to}</p>
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: e.snippet || '' }} />
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
