<template>
  <aside :class="[
    'fixed left-0 h-[calc(100vh-4rem)] border-r transition-all duration-300 z-40 overflow-y-auto',
    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    sidebarOpen ? 'w-80 translate-x-0' : 'w-80 -translate-x-full lg:translate-x-0',
    'lg:sticky lg:top-16'
  ]">
    <div class="p-6">
      <!-- Search -->
      <div class="relative mb-6">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="18" />
        <input
          type="text"
          placeholder="Search report..."
          :value="searchQuery"
          @input="store.setSearchQuery($event.target.value)"
          :class="[
            'w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500',
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          ]"
        />
      </div>

      <!-- Progress -->
      <div :class="[
        'mb-6 p-4 rounded-lg',
        darkMode ? 'bg-gray-700' : 'bg-blue-50'
      ]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">Reading Progress</span>
          <span class="text-sm font-bold text-blue-600">{{ store.progressPercentage }}%</span>
        </div>
        <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div 
            class="h-full bg-blue-600 transition-all duration-300"
            :style="{ width: `${store.progressPercentage}%` }"
          />
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ store.readSections }} of {{ store.totalSections }} sections
        </p>
      </div>

      <!-- Bookmarked Sections -->
      <div v-if="store.bookmarkedSectionsList.length > 0" class="mb-6">
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Bookmarked
        </h3>
        <div class="space-y-1">
          <button
            v-for="section in store.bookmarkedSectionsList"
            :key="section.id"
            @click="store.setActiveSection(section.id)"
            :class="[
              'w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700',
              activeSection === section.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''
            ]"
          >
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ section.chapterTitle }}</div>
            {{ section.title }}
          </button>
        </div>
      </div>

      <!-- Report Title -->
      <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        {{ store.reportStructure.title }}
      </h2>

      <!-- Navigation -->
      <nav class="space-y-1">
        <div v-for="chapter in store.reportStructure.chapters" :key="chapter.id">
          <button
            @click="store.toggleChapter(chapter.id)"
            class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-center gap-3">
              <component :is="getIcon(chapter.icon)" :size="18" class="text-gray-500 dark:text-gray-400" />
              <span class="font-medium">{{ chapter.title }}</span>
            </div>
            <component :is="expandedChapters[chapter.id] ? ChevronDown : ChevronRight" :size="18" />
          </button>
          
          <div v-if="expandedChapters[chapter.id]" class="ml-10 mt-1 space-y-1">
            <button
              v-for="section in chapter.sections"
              :key="section.id"
              @click="store.setActiveSection(section.id)"
              :class="[
                'w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between',
                activeSection === section.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              ]"
            >
              <span>
                <span class="text-xs mr-2">{{ section.id }}</span>
                {{ section.title }}
              </span>
              <span v-if="readProgress[section.id]" class="text-green-500 text-xs">✓</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { Search, ChevronDown, ChevronRight, FileText, BarChart3, Users } from 'lucide-vue-next'
import { useReportStore } from '../stores/report'
import { storeToRefs } from 'pinia'

const store = useReportStore()
const { darkMode, sidebarOpen, activeSection, expandedChapters, searchQuery, readProgress } = storeToRefs(store)

const iconMap = {
  FileText,
  BarChart3,
  Users
}

const getIcon = (iconName) => iconMap[iconName] || FileText
</script>