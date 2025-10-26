<template>
  <div :class="['min-h-screen', darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900']">
    <ReportHeader />
    <TableOfContents />
    
    <div class="flex pt-16">
      <ReportSidebar />
      
      <main :class="[
        'flex-1 transition-all duration-300',
        sidebarOpen ? 'lg:ml-80' : 'ml-0'
      ]">
        <div class="max-w-4xl mx-auto px-6 py-8">
          <ReportContent />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useReportStore } from '../stores/report'
import { storeToRefs } from 'pinia'

const store = useReportStore()
const { darkMode, sidebarOpen } = storeToRefs(store)
</script>