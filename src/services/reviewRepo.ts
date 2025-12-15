import { supabase } from '../lib/supabase'
import type { Review } from '../stores/reviewStore'

type Row = {
  id: number
  output: string
  drain: string
  satisfaction: string
  created_at: string
}

const toModel = (r: Row): Review => ({
  id: r.id,
  output: r.output,
  drain: r.drain,
  satisfaction: r.satisfaction,
  createdAt: r.created_at,
})

export async function fetchAll(): Promise<Review[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[supabase] fetch reviews failed', error.message)
    return null
  }
  return (data as Row[]).map(toModel)
}

export async function insert(review: Review): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('reviews').insert({
    id: review.id,
    output: review.output,
    drain: review.drain,
    satisfaction: review.satisfaction,
    created_at: review.createdAt,
  })
  if (error) {
    console.error('[supabase] insert review failed', error.message)
    return false
  }
  return true
}
