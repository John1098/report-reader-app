<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Report
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Give your report a title to get started
        </p>
      </div>

      <form @submit.prevent="handleCreate" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Report Title *
          </label>
          <input
            id="title"
            v-model="title"
            type="text"
            required
            placeholder="e.g., Annual Impact Report 2024"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label for="publishedDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Published Date
          </label>
          <input
            id="publishedDate"
            v-model="publishedDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div class="flex gap-4">
          <button
            type="button"
            @click="navigateTo('/')"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || !title"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Creating...' : 'Create Report' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const publishedDate = ref(new Date().toISOString().split('T')[0])
const loading = ref(false)
const error = ref('')

const handleCreate = async () => {
  loading.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      navigateTo('/login')
      return
    }

    // Get user's organization
    const user = await $fetch('http://localhost:1337/api/users/me?populate=organization', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!user.organization) {
      error.value = 'No organization found for user'
      return
    }

    // Create the report
    const response = await $fetch('http://localhost:1337/api/reports', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        data: {
          title: title.value,
          publishedDate: publishedDate.value,
          publicationStatus: 'published',
          organization: user.organization.id
        }
      }
    })

    // Redirect to home
    navigateTo('/')
  } catch (e) {
    console.error('Create error:', e)
    error.value = e.data?.error?.message || 'Failed to create report'
  } finally {
    loading.value = false
  }
}
</script>