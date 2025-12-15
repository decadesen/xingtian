import { supabase } from '../lib/supabase'

export type Health = 'unconfigured' | 'ok' | 'error'

export async function checkConnection(): Promise<Health> {
  if (!supabase) return 'unconfigured'
  const { error } = await supabase
    .from('reviews')
    .select('id', { head: true, count: 'exact' })
    .limit(1)
  return error ? 'error' : 'ok'
}
