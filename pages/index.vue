<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <div class="text-2xl">Loading report...</div>
  </div>
  
  <div v-else-if="error" class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
  <div class="absolute top-4 right-4">
    <button
      @click="handleLogout"
      class="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
    >
      Logout
    </button>
  </div>
  
  <div class="text-center px-4">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
      No Reports Yet
    </h2>
    <p class="text-gray-600 dark:text-gray-400 mb-8">
      Get started by creating your first report
    </p>
    <button
      @click="createFirstReport"
      class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
    >
      Create Your First Report
    </button>
  </div>
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
    console.log('Fetching reports...')
    const reports = await fetchReports()
    console.log('Reports received:', reports)
    
    if (reports && reports.length > 0) {
      console.log('Loading first report:', reports[0])
      store.loadStrapiReport(reports[0])
    } else {
      console.log('No reports found')
      error.value = 'No reports found'
    }
  } catch (e) {
    console.error('Error:', e)
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const createFirstReport = () => {
  navigateTo('/reports/new')
}

const handleLogout = () => {
  if (process.client) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    navigateTo('/login')
  }
}
</script>