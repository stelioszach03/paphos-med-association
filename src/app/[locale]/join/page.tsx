'use client'
import { useRef, useState } from 'react'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Button from '@/components/ui/button'
import { supabaseBrowser } from '@/lib/supabaseClient'

export default function JoinPage(){
  const supabase = useRef(supabaseBrowser()).current
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [registry, setRegistry] = useState('')
  const [notes, setNotes] = useState('')
  const [ok, setOk] = useState<string|null>(null)
  const [err, setErr] = useState<string|null>(null)
  const [saving, setSaving] = useState(false)

  async function submit(e: React.FormEvent){
    e.preventDefault()
    setSaving(true); setErr(null); setOk(null)
    try{
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('applications').insert({
        user_id: user?.id || null,
        full_name: fullName,
        email, phone, registry_no: registry, notes
      })
      if (error) throw error
      setOk('Η αίτηση υποβλήθηκε επιτυχώς. Θα επικοινωνήσουμε σύντομα.')
      setFullName(''); setEmail(''); setPhone(''); setRegistry(''); setNotes('')
    }catch(e:any){
      setErr(e.message || 'Αποτυχία υποβολής')
    }finally{
      setSaving(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Αίτηση Εγγραφής Μέλους</h1>
      <p className="text-slate-600 mb-6">Συμπλήρωσε τα στοιχεία σου για να ξεκινήσει η διαδικασία εγγραφής στον Ιατρικό Σύλλογο Πάφου.</p>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4 max-w-3xl">
        <div className="md:col-span-2">
          <label className="text-sm text-slate-600">Ονοματεπώνυμο</label>
          <Input value={fullName} onChange={e=>setFullName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-slate-600">Email</label>
          <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-slate-600">Τηλέφωνο</label>
          <Input value={phone} onChange={e=>setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Αρ. Μητρώου (αν υπάρχει)</label>
          <Input value={registry} onChange={e=>setRegistry(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-slate-600">Σημειώσεις</label>
          <Textarea value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>
        {err && <p className="text-sm text-red-600 md:col-span-2">{err}</p>}
        {ok && <p className="text-sm text-green-700 md:col-span-2">{ok}</p>}
        <div className="md:col-span-2"><Button disabled={saving} type="submit">{saving?'Υποβολή...':'Υποβολή'}</Button></div>
      </form>
    </div>
  )
}
