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
        <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <User :size="20" />
        </button>
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
import { BookOpen, Menu, X, FileText, Download, Moon, Sun, Bell, User } from 'lucide-vue-next'
import { useReportStore } from '../stores/report'
import { storeToRefs } from 'pinia'

const store = useReportStore()
const { darkMode, sidebarOpen } = storeToRefs(store)

const handleDownload = () => {
  alert('PDF download would be triggered here')
}
</script>