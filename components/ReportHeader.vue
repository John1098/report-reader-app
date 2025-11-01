<template>
  <header :class="[
    'fixed top-0 left-0 right-0 z-50 border-b',
    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  ]">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center gap-4">
        <button
          @click="store.toggleSidebar()"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <component :is="sidebarOpen ? X : Menu" :size="20" />
        </button>
        <div class="flex items-center gap-3">
          <BookOpen class="text-blue-600" :size="24" />
          <span class="font-semibold text-lg">WorldInc</span>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          @click="store.toggleTOC()"
          class="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm"
        >
          <FileText :size="16" />
          <span>Table of Contents</span>
        </button>
        <button
          @click="handleDownload"
          class="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm"
        >
          <Download :size="16" />
          <span>Download PDF</span>
        </button>
        <button
          @click="store.toggleDarkMode()"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <component :is="darkMode ? Sun : Moon" :size="20" />
        </button>
        <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <Bell :size="20" />
        </button>
        <div class="relative">
          <button 
            @click="showUserMenu = !showUserMenu"
            class="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <User :size="20" />
            <span v-if="user" class="text-sm hidden md:block">{{ user.username }}</span>
          </button>
          
          <!-- User dropdown menu -->
          <div 
            v-if="showUserMenu" 
            :class="[
              'absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50',
              darkMode ? 'bg-gray-800' : 'bg-white'
            ]"
          >
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p class="text-sm font-medium">{{ user?.username }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
            </div>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="h-1 bg-gray-200 dark:bg-gray-700">
      <div 
        class="h-full bg-blue-600 transition-all duration-300"
        :style="{ width: `${store.progressPercentage}%` }"
      />
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { BookOpen, Menu, X, FileText, Download, Moon, Sun, Bell, User } from 'lucide-vue-next'
import { useReportStore } from '../stores/report'
import { storeToRefs } from 'pinia'

const store = useReportStore()
const { darkMode, sidebarOpen } = storeToRefs(store)

const showUserMenu = ref(false)
const user = ref(null)

onMounted(() => {
  if (process.client) {
    const userData = localStorage.getItem('user')
    if (userData) {
      user.value = JSON.parse(userData)
    }
  }
})

const handleDownload = () => {
  alert('PDF download would be triggered here')
}

const handleLogout = () => {
  if (process.client) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    navigateTo('/login')
  }
}
</script>