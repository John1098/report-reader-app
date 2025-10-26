<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="showTOC" 
      class="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20" 
      @click="store.toggleTOC()"
    >
      <div 
        :class="[
          'rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-y-auto',
          darkMode ? 'bg-gray-800' : 'bg-white'
        ]"
        @click.stop
      >
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">Table of Contents</h2>
            <button @click="store.toggleTOC()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X :size="20" />
            </button>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Progress: {{ store.readSections }} of {{ store.totalSections }} sections read ({{ store.progressPercentage }}%)
          </p>
        </div>
        <div class="p-6">
          <div v-for="chapter in store.reportStructure.chapters" :key="chapter.id" class="mb-6">
            <h3 class="font-semibold text-lg mb-3 flex items-center gap-2">
              <component :is="getIcon(chapter.icon)" :size="18" />
              {{ chapter.title }}
            </h3>
            <div class="space-y-2 ml-7">
              <button
                v-for="section in chapter.sections"
                :key="section.id"
                @click="handleSectionClick(section.id)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700',
                  activeSection === section.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''
                ]"
              >
                <span>
                  <span class="text-xs mr-2">{{ section.id }}</span>
                  {{ section.title }}
                </span>
                <span v-if="readProgress[section.id]" class="text-green-500">✓</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { X, FileText, BarChart3, Users } from 'lucide-vue-next'
import { useReportStore } from '../stores/report'
import { storeToRefs } from 'pinia'

const store = useReportStore()
const { showTOC, darkMode, activeSection, readProgress } = storeToRefs(store)

const iconMap = {
  FileText,
  BarChart3,
  Users
}

const getIcon = (iconName) => iconMap[iconName] || FileText

const handleSectionClick = (sectionId) => {
  store.setActiveSection(sectionId)
  store.toggleTOC()
}
</script>