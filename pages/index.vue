<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <div class="text-2xl">Loading report...</div>
  </div>
  
  <div v-else-if="error" class="min-h-screen flex items-center justify-center">
    <div class="text-2xl text-red-600">Error loading report: {{ error }}</div>
  </div>
  
  <div v-else :class="['min-h-screen', darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900']">
    <ReportHeader />
    <TableOfContents />
    
    <div class="flex pt-16">
      <ReportSidebar />
      
      <main :class="[
        'flex-1 min-w-0 transition-all duration-300',
        sidebarOpen ? 'ml-0 lg:ml-80' : 'ml-0'
      ]">
        <div class="max-w-4xl mx-auto px-6 py-8 w-full">
          <ReportContent />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReportStore } from '../stores/report'
import { useStrapi } from '../composables/useStrapi'
import { storeToRefs } from 'pinia'

const store = useReportStore()
const { darkMode, sidebarOpen } = storeToRefs(store)
const { fetchReports } = useStrapi()

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const reports = await fetchReports()
    if (reports && reports.length > 0) {
      store.loadStrapiReport(reports[0])
    } else {
      error.value = 'No reports found'
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>