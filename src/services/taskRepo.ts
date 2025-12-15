import { supabase } from '../lib/supabase'
import type { Task } from '../stores/taskStore'

type Row = {
  id: number
  title: string
  completed: boolean
  created_at: string
  completed_at?: string | null
}

const toModel = (t: Row): Task => ({
  id: t.id,
  title: t.title,
  completed: t.completed,
  createdAt: t.created_at,
  completedAt: t.completed_at ?? undefined,
})

export async function fetchAll(): Promise<Task[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) {
    console.error('[supabase] fetch tasks failed', error.message)
    return null
  }
  return (data as Row[]).map(toModel)
}

export async function insert(task: Task): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('tasks').insert({
    id: task.id,
    title: task.title,
    completed: task.completed,
    created_at: task.createdAt,
    completed_at: task.completedAt ?? null,
  })
  if (error) {
    console.error('[supabase] insert task failed', error.message)
    return false
  }
  return true
}

export async function updateStatus(
  id: number,
  completed: boolean,
  completedAt?: string,
): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('tasks')
    .update({
      completed,
      completed_at: completed ? (completedAt ?? new Date().toISOString()) : null,
    })
    .eq('id', id)
  if (error) {
    console.error('[supabase] update task failed', error.message)
    return false
  }
  return true
}

export async function remove(id: number): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) {
    console.error('[supabase] delete task failed', error.message)
    return false
  }
  return true
}
