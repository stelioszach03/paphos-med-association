'use client'
import { useRef, useState } from 'react'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Button from '@/components/ui/button'
import Field from '@/components/ui/field'
import { isEmail } from '@/components/ui/validators'
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
  const [errors, setErrors] = useState<{fullName?:string; email?:string}>({})

  async function submit(e: React.FormEvent){
    e.preventDefault()
    const errs: any = {}
    if (!fullName.trim()) errs.fullName = 'Απαιτείται'
    if (!isEmail(email)) errs.email = 'Μη έγκυρο email'
    if (Object.keys(errs).length){ setErrors(errs); return }
    setErrors({})
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
        <Field label="Ονοματεπώνυμο" error={errors.fullName} className="md:col-span-2">
          <Input value={fullName} onChange={e=>setFullName(e.target.value)} />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </Field>
        <Field label="Τηλέφωνο">
          <Input value={phone} onChange={e=>setPhone(e.target.value)} />
        </Field>
        <Field label="Αρ. Μητρώου (αν υπάρχει)">
          <Input value={registry} onChange={e=>setRegistry(e.target.value)} />
        </Field>
        <Field label="Σημειώσεις" className="md:col-span-2">
          <Textarea value={notes} onChange={e=>setNotes(e.target.value)} />
        </Field>
        {err && <p className="text-sm text-red-600 md:col-span-2">{err}</p>}
        {ok && <p className="text-sm text-green-700 md:col-span-2">{ok}</p>}
        <div className="md:col-span-2"><Button disabled={saving} type="submit">{saving?'Υποβολή...':'Υποβολή'}</Button></div>
      </form>
    </div>
  )
}
