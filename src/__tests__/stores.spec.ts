import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useReviewStore } from '../stores/reviewStore'
import { useTaskStore } from '../stores/taskStore'

describe('stores persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds review and persists to localStorage', () => {
    const reviewStore = useReviewStore()
    reviewStore.addReview({ output: '写代码', drain: '会议', satisfaction: '坚持复盘' })
    const raw = localStorage.getItem('xingtian-reviews')
    expect(raw).toBeTruthy()
    const arr = JSON.parse(String(raw))
    expect(Array.isArray(arr)).toBe(true)
    expect(arr[0].output).toBe('写代码')
    expect(arr[0].createdAt).toMatch(/\d{4}-\d{2}-\d{2}/)
  })

  it('adds task, updates status and persists', () => {
    const taskStore = useTaskStore()
    const t = taskStore.addTask('测试任务')
    let raw = localStorage.getItem('xingtian-tasks')
    expect(raw).toBeTruthy()
    let arr = JSON.parse(String(raw))
    expect(arr.length).toBe(1)
    expect(taskStore.getCurrentTasks().length).toBe(1)
    taskStore.updateTaskStatus(t.id, true)
    raw = localStorage.getItem('xingtian-tasks')
    arr = JSON.parse(String(raw))
    expect(arr[0].completed).toBe(true)
    expect(taskStore.getCurrentTasks().length).toBe(0)
  })
})
