import { supabaseServer } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export default async function AdminAdmins() {
  const supabase = supabaseServer()
  const { data: admins } = await supabase.from('admin_users').select('user_id, role').order('created_at')

  async function add(formData: FormData) {
    'use server'
    const supabase = supabaseServer()
    const user_id = String(formData.get('user_id'))
    const role = String(formData.get('role'))
    await supabase.from('admin_users').upsert({ user_id, role })
  }
  async function remove(formData: FormData) {
    'use server'
    const supabase = supabaseServer()
    const user_id = String(formData.get('user_id'))
    await supabase.from('admin_users').delete().eq('user_id', user_id)
  }

  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-xl font-semibold">Admins</h1>
      <ul className="list-disc pl-5">
        {admins?.map((a: any) => <li key={a.user_id}>{a.user_id} – {a.role}</li>)}
      </ul>
      <form action={add} className="flex gap-2">
        <input name="user_id" placeholder="User ID" className="input" />
        <select name="role" className="input">
          <option value="admin">admin</option>
          <option value="super_admin">super_admin</option>
        </select>
        <button className="btn">Add</button>
      </form>
      <form action={remove} className="flex gap-2">
        <input name="user_id" placeholder="User ID" className="input" />
        <button className="btn">Remove</button>
      </form>
    </div>
  )
}
