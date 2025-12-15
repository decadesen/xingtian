import { useReviewStore, type Review } from '../stores/reviewStore'
import { useTaskStore, type Task } from '../stores/taskStore'

export function exportData() {
  const reviewStore = useReviewStore()
  const taskStore = useTaskStore()
  const data = {
    version: 1,
    reviews: reviewStore.reviews,
    tasks: taskStore.tasks,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'xingtian-backup.json'
  a.click()
  URL.revokeObjectURL(url)
}

export async function importData(file: File, mode: 'replace' | 'merge' = 'merge') {
  const text = await file.text()
  const parsed = JSON.parse(text)
  const reviewStore = useReviewStore()
  const taskStore = useTaskStore()
  const reviews = Array.isArray(parsed?.reviews) ? parsed.reviews as Review[] : []
  const tasks = Array.isArray(parsed?.tasks) ? parsed.tasks as Task[] : []
  if (mode === 'replace') {
    reviewStore.$patch({ reviews })
    taskStore.$patch({ tasks })
  } else {
    const rmap = new Map<number, Review>()
    ;[...reviewStore.reviews, ...reviews].forEach(r => rmap.set(r.id, r))
    const tmap = new Map<number, Task>()
    ;[...taskStore.tasks, ...tasks].forEach(t => tmap.set(t.id, t))
    reviewStore.$patch({ reviews: Array.from(rmap.values()).sort((a,b) => a.createdAt.localeCompare(b.createdAt)).reverse() })
    taskStore.$patch({ tasks: Array.from(tmap.values()).sort((a,b) => a.createdAt.localeCompare(b.createdAt)) })
  }
  localStorage.setItem('xingtian-reviews', JSON.stringify(reviewStore.reviews))
  localStorage.setItem('xingtian-tasks', JSON.stringify(taskStore.tasks))
}

