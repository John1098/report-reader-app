<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <div class="text-2xl">Loading report...</div>
  </div>
  
  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center px-4">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Report Not Found
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ error }}
      </p>
      
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
import { ArrowLeft } from 'lucide-vue-next'
import { useReportStore } from '../../stores/report'
import { useStrapi } from '../../composables/useStrapi'
import { storeToRefs } from 'pinia'

const route = useRoute()
const store = useReportStore()
const { darkMode, sidebarOpen } = storeToRefs(store)
const { fetchReport } = useStrapi()

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const slug = route.params.slug
    const report = await fetchReport(slug)
    
    if (report) {
      store.loadStrapiReport(report)
    } else {
      error.value = 'Report not found'
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>