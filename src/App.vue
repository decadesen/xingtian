<template>
  <div id="app" class="container">
    <!-- 板块1: 今日寄语 -->
    <section class="motto-section">
      <h1 class="main-motto">你在构建一个迭代成长的系统。</h1>
      <p class="sub-motto">{{ randomMotto }}</p>
    </section>

    <!-- 板块2: 今日复盘 -->
    <section class="review-section">
      <h2><span class="icon">📝</span> 今日复盘</h2>
      <div class="review-form">
        <div class="question">
          <label>今天最有价值的一项产出是什么？</label>
          <textarea v-model="newReview.output" rows="2" placeholder="哪怕只是修复了一个小bug..."></textarea>
        </div>
        <div class="question">
          <label>今天主要的精力消耗在哪儿？</label>
          <textarea v-model="newReview.drain" rows="2" placeholder="是某次会议，还是某个纠结的情绪？"></textarea>
        </div>
        <div class="question">
          <label>今天，我对自己最满意的一点是什么？</label>
          <textarea v-model="newReview.satisfaction" rows="2" placeholder="比如：即使很累，也开始了复盘..."></textarea>
        </div>
        <button class="submit-btn" @click="submitReview">完成复盘</button>
      </div>
    </section>

    <!-- 板块3: 当下计划 -->
    <section class="plan-section">
      <h2><span class="icon">🎯</span> 当下计划</h2>
      <div class="current-tasks">
        <div class="task-card" v-for="task in currentTasks" :key="task.id">
          <span class="task-title">{{ task.title }}</span>
          <div class="task-actions">
            <button class="btn-start" @click="startTask(task)">开始</button>
            <button class="btn-complete" @click="completeTask(task)">完成</button>
          </div>
        </div>
      </div>
      <div class="quick-add">
        <input v-model="newTask" type="text" placeholder="添加一项微型任务..." @keyup.enter="addQuickTask" />
        <button @click="addQuickTask">添加</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useReviewStore, type Review } from './stores/reviewStore'
import { useTaskStore, type Task } from './stores/taskStore'

// 初始化Store
const reviewStore = useReviewStore()
const taskStore = useTaskStore()

// 板块1：寄语
const randomMotto = ref('行动是打败焦虑的最好方法。')

// 板块2：复盘 - 直接绑定到局部变量
const newReview = ref<Omit<Review, 'id' | 'createdAt'>>({
  output: '',
  drain: '',
  satisfaction: ''
})

const submitReview = () => {
  if (!newReview.value.output.trim()) {
    alert('请至少填写“最有价值的产出”')
    return
  }

  reviewStore.addReview(newReview.value)
  alert('复盘已保存！')

  // 清空表单
  newReview.value.output = ''
  newReview.value.drain = ''
  newReview.value.satisfaction = ''
}

// 板块3：计划 - 使用Store中的任务
const newTask = ref('')

// 获取当前未完成的任务（保持响应式）
const currentTasks = computed(() => taskStore.getCurrentTasks())

const startTask = (task: Task) => {
  // 这里可以扩展为记录任务开始时间
  alert(`开始任务: ${task.title}`)
}

const completeTask = (task: Task) => {
  if (confirm(`确认完成“${task.title}”吗？`)) {
    taskStore.updateTaskStatus(task.id, true)
    // 任务从currentTasks自动移除，因为getCurrentTasks是计算属性
  }
}

const addQuickTask = () => {
  const title = newTask.value.trim()
  if (title) {
    taskStore.addTask(title)
    newTask.value = ''
  }
}

// 可选：初始化一些示例任务（第一次运行时）
onMounted(() => {
  if (taskStore.tasks.length === 0) {
    taskStore.addTask('完善“刑天”页面布局')
    taskStore.addTask('学习K8s核心概念一小时')
  }
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  color: #333;
}

/* 板块1：寄语 */
.motto-section {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}
.main-motto {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}
.sub-motto {
  font-size: 1.1rem;
  color: #666;
  font-style: italic;
}

/* 板块2：复盘 */
.review-section, .plan-section {
  margin-bottom: 3rem;
  background: #f9f9f9;
  padding: 1.8rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}
.icon {
  font-size: 1.4em;
}
.review-form .question {
  margin-bottom: 1.5rem;
}
.review-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #444;
}
.review-form textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}
.review-form textarea:focus {
  outline: none;
  border-color: #4a90e2;
}
.submit-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 600;
}
.submit-btn:hover {
  background-color: #3a7bc8;
}

/* 板块3：计划 */
.task-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.task-title {
  font-size: 1.05rem;
}
.task-actions button {
  margin-left: 0.8rem;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-start {
  background-color: #e8f4ff;
  color: #4a90e2;
}
.btn-start:hover {
  background-color: #d0e7ff;
}
.btn-complete {
  background-color: #4CAF50;
  color: white;
}
.btn-complete:hover {
  background-color: #43a047;
}

.quick-add {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
}
.quick-add input {
  flex-grow: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}
.quick-add button {
  background-color: #888;
  color: white;
  border: none;
  padding: 0 1.5rem;
  border-radius: 6px;
  cursor: pointer;
}
.quick-add button:hover {
  background-color: #777;
}
</style>
