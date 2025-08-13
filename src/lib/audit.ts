import { supabaseServer } from './supabaseServer'

export async function audit(actor: string | null, action: string, entity: string, entityId: string, meta: any = null) {
  const supabase = supabaseServer()
  await supabase.from('audit_logs').insert({ actor, action, entity, entity_id: entityId, meta })
}
