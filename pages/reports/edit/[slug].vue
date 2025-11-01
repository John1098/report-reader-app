<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <button
          @click="navigateTo('/reports')"
          class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft :size="16" />
          Back to Reports
        </button>
        
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Report
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Update your report details
        </p>
      </div>

      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="text-center text-gray-600 dark:text-gray-400">Loading...</div>
      </div>

      <form v-else-if="report" @submit.prevent="handleUpdate" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Report Title *
          </label>
          <input
            id="title"
            v-model="report.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label for="publishedDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Published Date
          </label>
          <input
            id="publishedDate"
            v-model="report.publishedDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            id="status"
            v-model="report.publicationStatus"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div class="flex gap-4">
          <button
            type="button"
            @click="navigateTo('/reports')"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const report = ref(null)
const loading = ref(true)
const saving = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    const token = localStorage.getItem('auth_token')
    const slug = route.params.slug
    
    // Fetch the report
    const response = await $fetch(`http://localhost:1337/api/reports?filters[slug][$eq]=${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    // If no slug match, try documentId
    if (!response.data || response.data.length === 0) {
      const docResponse = await $fetch(`http://localhost:1337/api/reports/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      report.value = docResponse.data
    } else {
      report.value = response.data[0]
    }
  } catch (e) {
    console.error('Error loading report:', e)
    error.value = 'Failed to load report'
  } finally {
    loading.value = false
  }
})

const handleUpdate = async () => {
  saving.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('auth_token')
    
    await $fetch(`http://localhost:1337/api/reports/${report.value.documentId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        data: {
          title: report.value.title,
          publishedDate: report.value.publishedDate,
          publicationStatus: report.value.publicationStatus
        }
      }
    })
    
    // Redirect back to reports
    navigateTo('/reports')
  } catch (e) {
    console.error('Update error:', e)
    error.value = e.data?.error?.message || 'Failed to update report'
  } finally {
    saving.value = false
  }
}
</script>