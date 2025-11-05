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

      <!-- Duplicating Overlay -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="duplicating" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div :class="[
            'rounded-xl shadow-2xl p-6 text-center',
            darkMode ? 'bg-gray-800' : 'bg-white'
          ]">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-lg font-medium text-gray-900 dark:text-white">Duplicating report...</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a moment</p>
          </div>
        </div>
      </Transition>

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

              <div class="mt-4 flex items-center justify-between">
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
                
                <div class="flex items-center gap-2">
                  <button
                    @click.stop="editContent(report)"
                    class="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                    title="Edit content"
                  >
                    <Edit :size="16" class="text-green-600 dark:text-green-400" />
                  </button>
                  <button
                    @click.stop="duplicateReport(report)"
                    class="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    title="Duplicate report"
                  >
                    <Copy :size="16" class="text-blue-600 dark:text-blue-400" />
                  </button>
                  <button
                    @click.stop="editReport(report)"
                    class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Edit report details"
                  >
                    <Pencil :size="16" class="text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    @click.stop="confirmDelete(report)"
                    class="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete report"
                  >
                    <Trash2 :size="16" class="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <!-- Delete Confirmation Modal -->
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="reportToDelete" 
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click="reportToDelete = null"
    >
      <div 
        :class="[
          'rounded-xl shadow-2xl max-w-md w-full p-6',
          darkMode ? 'bg-gray-800' : 'bg-white'
        ]"
        @click.stop
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertTriangle :size="24" class="text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Delete Report</h3>
        </div>
        
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete "<strong>{{ reportToDelete.title }}</strong>"? This action cannot be undone.
        </p>
        
        <div class="flex gap-3">
          <button
            @click="reportToDelete = null"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            @click="deleteReport"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { BookOpen, FileText, Plus, Calendar, User, Moon, Sun, Pencil, Trash2, AlertTriangle, Copy, Edit } from 'lucide-vue-next'
import { useStrapi } from '../../composables/useStrapi'

const { fetchReports } = useStrapi()

const reports = ref([])
const loading = ref(true)
const darkMode = ref(false)
const showUserMenu = ref(false)
const user = ref(null)
const reportToDelete = ref(null)
const deleting = ref(false)
const duplicating = ref(false)

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

const editContent = (report) => {
  navigateTo(`/reports/edit/${report.slug || report.documentId}/content`)
}

const editReport = (report) => {
  navigateTo(`/reports/edit/${report.slug || report.documentId}`)
}

const confirmDelete = (report) => {
  reportToDelete.value = report
}

const deleteReport = async () => {
  if (!reportToDelete.value) return
  
  deleting.value = true
  
  try {
    const token = localStorage.getItem('auth_token')
    
    await $fetch(`http://localhost:1337/api/reports/${reportToDelete.value.documentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    // Remove from local list
    reports.value = reports.value.filter(r => r.documentId !== reportToDelete.value.documentId)
    reportToDelete.value = null
  } catch (error) {
    console.error('Error deleting report:', error)
    alert('Failed to delete report')
  } finally {
    deleting.value = false
  }
}

const duplicateReport = async (report) => {
  if (duplicating.value) return
  
  duplicating.value = true
  
  try {
    const token = localStorage.getItem('auth_token')
    
    // Get user's organization
    const user = await $fetch('http://localhost:1337/api/users/me?populate[organization]=*', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    if (!user.organization) {
      alert('No organization found')
      return
    }
    
    // Fetch the full report with all nested data
    const fullReport = await $fetch(
      `http://localhost:1337/api/reports/${report.documentId}?populate[chapters][populate][sections][populate]=content_blocks`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    const originalReport = fullReport.data
    
    // Create new report
    const timestamp = Date.now()
    const newReportResponse = await $fetch('http://localhost:1337/api/reports', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        data: {
          title: `${originalReport.title} (Copy)`,
          slug: `${originalReport.slug || 'report'}-copy-${timestamp}`,
          publishedDate: new Date().toISOString().split('T')[0],
          publicationStatus: 'published',
          organization: user.organization.id
        }
      }
    })
    
    const newReport = newReportResponse.data
    
    // Duplicate chapters
    if (originalReport.chapters && originalReport.chapters.length > 0) {
      for (const chapter of originalReport.chapters) {
        const newChapterResponse = await $fetch('http://localhost:1337/api/chapters', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: {
            data: {
              title: chapter.title,
              order: chapter.order,
              icon: chapter.icon,
              report: newReport.id
            }
          }
        })
        
        const newChapter = newChapterResponse.data
        
        // Duplicate sections
        if (chapter.sections && chapter.sections.length > 0) {
          const sectionsArray = Array.isArray(chapter.sections) ? chapter.sections : [chapter.sections]
          
          for (const section of sectionsArray) {
            const newSectionResponse = await $fetch('http://localhost:1337/api/sections', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`
              },
              body: {
                data: {
                  Title: section.Title,
                  Order: section.Order,
                  Content_Key: section.Content_Key,
                  chapter: newChapter.id
                }
              }
            })
            
            const newSection = newSectionResponse.data
            
            // Duplicate content blocks
            if (section.content_blocks && section.content_blocks.length > 0) {
              for (const block of section.content_blocks) {
                await $fetch('http://localhost:1337/api/content-blocks', {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`
                  },
                  body: {
                    data: {
                      Type: block.Type,
                      textContent: block.textContent,
                      listItems: block.listItems,
                      statsData: block.statsData,
                      imageUrl: block.imageUrl,
                      imageCaption: block.imageCaption,
                      quoteText: block.quoteText,
                      quoteAuthor: block.quoteAuthor,
                      tableData: block.tableData,
                      Order: block.Order,
                      section: newSection.id
                    }
                  }
                })
              }
            }
          }
        }
      }
    }
    
    // Refresh the reports list
    const updatedReports = await fetchReports()
    reports.value = updatedReports || []
    
    alert('Report duplicated successfully!')
  } catch (error) {
    console.error('Error duplicating report:', error)
    alert('Failed to duplicate report: ' + (error.data?.error?.message || error.message))
  } finally {
    duplicating.value = false
  }
}


</script>