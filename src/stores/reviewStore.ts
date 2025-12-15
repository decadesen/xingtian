import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import * as reviewRepo from '../services/reviewRepo'
import { hasSupabase } from '../lib/supabase'

export interface Review {
  id: number // 使用时间戳作为ID
  output: string
  drain: string
  satisfaction: string
  createdAt: string // 记录日期
}

export const useReviewStore = defineStore('review', () => {
  // 状态：从localStorage初始化，或设为空数组
  const reviews = ref<Review[]>(loadFromLocalStorage('xingtian-reviews', []))

  // 保存到localStorage的函数
  function saveToLocalStorage() {
    localStorage.setItem('xingtian-reviews', JSON.stringify(reviews.value))
  }

  // 添加新的复盘记录
  function addReview(reviewData: Omit<Review, 'id' | 'createdAt'>) {
    const newReview: Review = {
      ...reviewData,
      id: Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
    }
    reviews.value.unshift(newReview) // 新记录添加到开头
    saveToLocalStorage()
    if (hasSupabase) {
      reviewRepo.insert(newReview)
    }
    return newReview
  }

  // 获取某天的复盘记录（用于未来可能的历史查看）
  function getReviewByDate(date: string): Review | undefined {
    return reviews.value.find((r) => r.createdAt === date)
  }

  // 监听reviews变化并自动持久化（可选，确保数据安全）
  watch(reviews, saveToLocalStorage, { deep: true })

  async function syncRemote() {
    if (!hasSupabase) return
    const remote = await reviewRepo.fetchAll()
    if (remote && remote.length) {
      reviews.value = remote
      saveToLocalStorage()
    }
  }

  return { reviews, addReview, getReviewByDate, syncRemote }
})

// 通用加载函数
function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : defaultValue
}
