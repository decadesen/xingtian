import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as taskRepo from '../services/taskRepo'
import { hasSupabase } from '../lib/supabase'

export interface Task {
  id: number
  title: string
  completed: boolean // 增加完成状态
  createdAt: string
  completedAt?: string // 可选，完成时间
}

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>(loadFromLocalStorage('xingtian-tasks', []))
  
  function saveTasks() {
    localStorage.setItem('xingtian-tasks', JSON.stringify(tasks.value))
  }
  
  // 添加新任务（包括快速添加）
  function addTask(title: string) {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    }
    tasks.value.push(newTask)
    saveTasks()
    if (hasSupabase) {
      taskRepo.insert(newTask)
    }
    return newTask
  }
  
  // 标记任务为开始/完成
  function updateTaskStatus(id: number, completed: boolean) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = completed
      task.completedAt = completed ? new Date().toISOString() : undefined
      saveTasks()
      if (hasSupabase) {
        taskRepo.updateStatus(id, completed, task.completedAt)
      }
    }
  }
  
  // 删除任务（比如完成后移除）
  function removeTask(id: number) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index > -1) {
      tasks.value.splice(index, 1)
      saveTasks()
      if (hasSupabase) {
        taskRepo.remove(id)
      }
    }
  }
  
  // 获取当前未完成的任务（用于“当下计划”板块）
  function getCurrentTasks() {
    return tasks.value.filter(t => !t.completed)
  }
  
  async function syncRemote() {
    if (!hasSupabase) return
    const remote = await taskRepo.fetchAll()
    if (remote) {
      tasks.value = remote
      saveTasks()
    }
  }
  
  return { 
    tasks, 
    addTask, 
    updateTaskStatus, 
    removeTask,
    getCurrentTasks,
    syncRemote
  }
})

function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : defaultValue
}
