import { requireAdmin } from '@/lib/roles'
import { supabaseServer } from '@/lib/supabaseServer'
import { createSignedUploadUrl } from '@/lib/storage'
import { audit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export default async function AdminContent({ params: { locale } }: { params: { locale: string } }) {
  await requireAdmin()
  const supabase = supabaseServer()
  const { data: articles } = await supabase.from('articles').select('id,title,slug').order('created_at', { ascending: false })
  const { data: announcements } = await supabase.from('announcements').select('id,title,slug').order('created_at', { ascending: false })
  const { data: events } = await supabase.from('events').select('id,title,slug').order('created_at', { ascending: false })

  async function addArticle(formData: FormData) {
    'use server'
    const supabase = supabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    const title = String(formData.get('title') || '')
    const slug = title.toLowerCase().replace(/\s+/g, '-')
    await supabase.from('articles').insert({ title, slug, content: formData.get('content') })
    await audit(user?.id || null, 'create-article', 'articles', slug, {})
  }
  async function addAnnouncement(formData: FormData) {
    'use server'
    const supabase = supabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    const title = String(formData.get('title') || '')
    const slug = title.toLowerCase().replace(/\s+/g, '-')
    await supabase.from('announcements').insert({ title, slug, content: formData.get('content') })
    await audit(user?.id || null, 'create-announcement', 'announcements', slug, {})
  }
  async function addEvent(formData: FormData) {
    'use server'
    const supabase = supabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    const title = String(formData.get('title') || '')
    const slug = title.toLowerCase().replace(/\s+/g, '-')
    const file = formData.get('image') as File | null
    let image_url: string | undefined
    if (file && file.size > 0) {
      const path = `events/${Date.now()}-${file.name}`
      const { signedUrl } = await createSignedUploadUrl('public-assets', path)
      await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'content-type': file.type },
        body: file,
      })
      image_url = path
    }
    await supabase.from('events').insert({ title, slug, description: formData.get('content'), image_url })
    await audit(user?.id || null, 'create-event', 'events', slug, {})
  }

  return (
    <div className="container py-8 space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Articles</h2>
        <ul className="mb-4 list-disc pl-5">
          {articles?.map(a => <li key={a.id}>{a.title}</li>)}
        </ul>
        <form action={addArticle} className="flex flex-col gap-2">
          <input name="title" placeholder="Title" className="input" required />
          <textarea name="content" placeholder="Content" className="textarea" />
          <button type="submit" className="btn">Add</button>
        </form>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Announcements</h2>
        <ul className="mb-4 list-disc pl-5">
          {announcements?.map(a => <li key={a.id}>{a.title}</li>)}
        </ul>
        <form action={addAnnouncement} className="flex flex-col gap-2">
          <input name="title" placeholder="Title" className="input" required />
          <textarea name="content" placeholder="Content" className="textarea" />
          <button type="submit" className="btn">Add</button>
        </form>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Events</h2>
        <ul className="mb-4 list-disc pl-5">
          {events?.map(a => <li key={a.id}>{a.title}</li>)}
        </ul>
        <form action={addEvent} className="flex flex-col gap-2" encType="multipart/form-data">
          <input name="title" placeholder="Title" className="input" required />
          <textarea name="content" placeholder="Description" className="textarea" />
          <input type="file" name="image" accept="image/*" />
          <button type="submit" className="btn">Add</button>
        </form>
      </section>
    </div>
  )
}
