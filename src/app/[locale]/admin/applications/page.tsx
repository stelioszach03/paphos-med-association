import { requireAdmin } from '@/lib/roles'
import { supabaseServer } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export default async function AdminApplications() {
  await requireAdmin()
  const supabase = supabaseServer()
  const { data: apps } = await supabase.from('applications').select('*').order('created_at', { ascending: false })

  async function process(formData: FormData) {
    'use server'
    const supabase = supabaseServer()
    const id = String(formData.get('id'))
    const action = String(formData.get('action'))
    const status = action === 'approve' ? 'approved' : 'rejected'
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('applications').update({ status, processed_by: user?.id, processed_at: new Date().toISOString() }).eq('id', id)
    if (status === 'approved') {
      const { data: app } = await supabase.from('applications').select('user_id, full_name, email, phone, registry_no').eq('id', id).maybeSingle()
      if (app) {
        await supabase.from('doctors').upsert({
          id: app.user_id,
          full_name: app.full_name,
          email: app.email,
          phone: app.phone,
          registry_no: app.registry_no,
          status: 'approved',
        })
      }
    }
  }

  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-xl font-semibold">Applications</h1>
      <ul className="space-y-4">
        {apps?.map(a => (
          <li key={a.id} className="border p-4 rounded">
            <p className="font-medium">{a.full_name}</p>
            <p className="text-sm">{a.email}</p>
            <form action={process} className="mt-2 flex gap-2">
              <input type="hidden" name="id" value={a.id} />
              <button name="action" value="approve" className="btn">Approve</button>
              <button name="action" value="reject" className="btn" formNoValidate>Reject</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}
