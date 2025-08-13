import { supabaseServer } from './supabaseServer'

export async function createSignedUploadUrl(bucket: 'public-assets' | 'doctor-docs', path: string) {
  const supabase = supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  if (bucket === 'public-assets') {
    const { data: isAdmin } = await supabase.rpc('is_admin', { uid: user.id })
    if (!isAdmin) throw new Error('Forbidden')
  } else {
    if (user.id !== path.split('/')[0]) throw new Error('Forbidden')
  }
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path)
  if (error) throw error
  return data
}
