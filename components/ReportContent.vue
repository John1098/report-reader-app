<template>
  <article v-if="content">
    <!-- Hero Section -->
    <div 
      class="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
      :style="{ background: content.hero }"
    >
      <div class="relative z-10">
        <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
          {{ content.tag }}
        </span>
        <h1 class="text-4xl font-bold mb-6">{{ content.title }}</h1>
        
        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-2">
          <button 
            @click="handleShare"
            class="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Share2 :size="16" />
            Share
          </button>
          <button 
            @click="store.toggleBookmark(activeSection)"
            class="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
          >
            <component :is="isBookmarked ? BookmarkCheck : Bookmark" :size="16" />
            {{ isBookmarked ? 'Bookmarked' : 'Bookmark' }}
          </button>
          <button 
            @click="handleDownload"
            class="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download :size="16" />
            Download
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div v-if="content.stats" :class="[
      'grid grid-cols-3 gap-4 mb-8 rounded-xl p-6 shadow-sm',
      darkMode ? 'bg-gray-800' : 'bg-white'
    ]">
      <div v-for="(stat, idx) in content.stats" :key="idx" class="text-center">
        <div class="text-3xl font-bold text-blue-600 mb-1">{{ stat.value }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Content Blocks -->
    <div class="space-y-6">
      <template v-for="(block, idx) in content.content" :key="idx">
        <!-- Text Block -->
        <div v-if="block.type === 'text'" class="relative group">
          <p :class="['text-lg leading-relaxed', darkMode ? 'text-gray-300' : 'text-gray-700']">
            {{ block.text }}
          </p>
          <button
            @click="copyText(block.text)"
            class="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Copy :size="16" class="text-gray-400" />
          </button>
        </div>

        <!-- Highlight Block -->
        <div 
          v-else-if="block.type === 'highlight'" 
          :class="[
            'border-l-4 p-6 rounded-r-lg relative group',
            darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'
          ]"
        >
          <p class="text-lg font-medium">{{ block.text }}</p>
          <button
            @click="copyText(block.text)"
            class="absolute -left-8 top-6 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Copy :size="16" class="text-gray-400" />
          </button>
        </div>

        <!-- List Block -->
        <ul v-else-if="block.type === 'list'" class="space-y-3">
          <li v-for="(item, i) in block.items" :key="i" class="flex items-start gap-3">
            <span class="mt-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />
            <span :class="['text-lg', darkMode ? 'text-gray-300' : 'text-gray-700']">{{ item }}</span>
          </li>
        </ul>
      </template>
    </div>

    <!-- Copy Notification -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="showCopyNotification" class="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
        <Copy :size="16" />
        Text copied!
      </div>
    </Transition>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Share2, Bookmark, BookmarkCheck, Download, Copy } from 'lucide-vue-next'
import { useReportStore } from '../stores/report'
import { storeToRefs } from 'pinia'

const store = useReportStore()
const { darkMode, activeSection, bookmarkedSections } = storeToRefs(store)
const content = computed(() => store.currentContent)

const showCopyNotification = ref(false)
const isBookmarked = computed(() => bookmarkedSections.value.has(activeSection.value))

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showCopyNotification.value = true
    setTimeout(() => {
      showCopyNotification.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: content.value.title,
      text: `Check out: ${content.value.title}`,
      url: window.location.href
    })
  }
}

const handleDownload = () => {
  alert('PDF download would be triggered here')
}
</script>