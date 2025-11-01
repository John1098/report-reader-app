<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <BookOpen class="text-blue-600" :size="32" />
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Reports</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ reports.length }} report{{ reports.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button
              @click="toggleDarkMode"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <component :is="darkMode ? Sun : Moon" :size="20" />
            </button>
            
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <User :size="20" />
                <span v-if="user" class="text-sm hidden md:block">{{ user.username }}</span>
              </button>
              
              <div 
                v-if="showUserMenu" 
                :class="[
                  'absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50',
                  darkMode ? 'bg-gray-800' : 'bg-white'
                ]"
              >
                <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-medium">{{ user?.username }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
                </div>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="text-lg text-gray-600 dark:text-gray-400">Loading reports...</div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="reports.length === 0" class="text-center py-12">
        <FileText class="mx-auto text-gray-400 mb-4" :size="64" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No reports yet</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Create your first report to get started</p>
        <button
          @click="navigateTo('/reports/new')"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus :size="20" />
          Create Report
        </button>
      </div>

      <!-- Reports Grid -->
      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing {{ reports.length }} report{{ reports.length !== 1 ? 's' : '' }}
          </div>
          <button
            @click="navigateTo('/reports/new')"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Plus :size="18" />
            New Report
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="report in reports"
            :key="report.id"
            @click="navigateTo(`/reports/${report.slug || report.documentId}`)"
            :class="[
              'group cursor-pointer rounded-xl border-2 transition-all hover:shadow-lg',
              darkMode 
                ? 'bg-gray-800 border-gray-700 hover:border-blue-500' 
                : 'bg-white border-gray-200 hover:border-blue-400'
            ]"
          >
            <!-- Report Card Header -->
            <div class="h-32 rounded-t-xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex items-center justify-center">
              <FileText class="text-white opacity-50" :size="48" />
            </div>

            <!-- Report Card Content -->
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ report.title }}
              </h3>
              
              <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div v-if="report.publishedDate" class="flex items-center gap-1">
                  <Calendar :size="14" />
                  {{ formatDate(report.publishedDate) }}
                </div>
                <div v-if="report.chapters" class="flex items-center gap-1">
                  <BookOpen :size="14" />
                  {{ report.chapters.length }} chapter{{ report.chapters.length !== 1 ? 's' : '' }}
                </div>
              </div>

              <div class="mt-4">
                <span 
                  :class="[
                    'inline-block px-2 py-1 rounded text-xs font-medium',
                    report.publicationStatus === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  ]"
                >
                  {{ report.publicationStatus || 'draft' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { BookOpen, FileText, Plus, Calendar, User, Moon, Sun } from 'lucide-vue-next'
import { useStrapi } from '../../composables/useStrapi'

const { fetchReports } = useStrapi()

const reports = ref([])
const loading = ref(true)
const darkMode = ref(false)
const showUserMenu = ref(false)
const user = ref(null)

onMounted(async () => {
  // Load user info
  if (process.client) {
    const userData = localStorage.getItem('user')
    if (userData) {
      user.value = JSON.parse(userData)
    }
    
    // Check dark mode preference
    darkMode.value = localStorage.getItem('darkMode') === 'true'
  }

  // Fetch reports
  try {
    const data = await fetchReports()
    reports.value = data || []
  } catch (error) {
    console.error('Error loading reports:', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  if (process.client) {
    localStorage.setItem('darkMode', darkMode.value)
  }
}

const handleLogout = () => {
  if (process.client) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    navigateTo('/login')
  }
}
</script>