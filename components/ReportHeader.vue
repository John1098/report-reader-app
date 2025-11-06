<template>
  <header :class="[
    'fixed top-0 left-0 right-0 z-50',
    darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100',
    'border-b backdrop-blur-sm'
  ]">
    <div class="max-w-screen-2xl mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <!-- Left: Logo + Title -->
        <div class="flex items-center gap-6">
          <button
            @click="store.toggleSidebar()"
            :class="[
              'p-2.5 rounded-xl transition-colors',
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            ]"
          >
            <component :is="sidebarOpen ? X : Menu" :size="20" :stroke-width="2" />
          </button>
          
          <div class="flex items-center gap-3">
            <div :class="[
              'p-2 rounded-xl',
              darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
            ]">
              <BookOpen class="text-blue-600" :size="22" :stroke-width="2" />
            </div>
            <div class="hidden md:block">
              <h1 class="text-base font-semibold tracking-tight">
                {{ store.reportStructure?.title || 'Report' }}
              </h1>
            </div>
          </div>
        </div>
        
        <!-- Right: Actions + User -->
        <div class="flex items-center gap-3">
          <!-- Report Actions -->
          <div :class="[
            'hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-xl',
            darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
          ]">
            <button
              @click="store.toggleTOC()"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-white text-gray-700'
              ]"
            >
              <FileText :size="16" :stroke-width="2" />
              <span>Contents</span>
            </button>
            
            <button
              @click="handleDownload"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-white text-gray-700'
              ]"
            >
              <Download :size="16" :stroke-width="2" />
              <span>Download</span>
            </button>
          </div>
          
          <!-- Divider -->
          <div :class="[
            'hidden md:block w-px h-8',
            darkMode ? 'bg-gray-800' : 'bg-gray-200'
          ]" />
          
          <!-- Theme Toggle -->
          <button
            @click="store.toggleDarkMode()"
            :class="[
              'p-2.5 rounded-xl transition-colors',
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            ]"
            title="Toggle theme"
          >
            <component :is="darkMode ? Sun : Moon" :size="20" :stroke-width="2" />
          </button>
          
          <!-- Notifications -->
          <button
            :class="[
              'relative p-2.5 rounded-xl transition-colors',
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            ]"
            title="Notifications"
          >
            <Bell :size="20" :stroke-width="2" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
          </button>
          
          <!-- User Menu -->
          <div class="relative">
            <button 
              @click.stop="toggleUserMenu"
              :class="[
                'flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors',
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              ]"
            >
              <div :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold',
                darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
              ]">
                {{ getUserInitials() }}
              </div>
              <ChevronDown :size="16" :stroke-width="2" :class="[
                'hidden sm:block transition-transform',
                showUserMenu ? 'rotate-180' : '',
                darkMode ? 'text-gray-500' : 'text-gray-400'
              ]" />
            </button>
            
            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div 
                v-if="showUserMenu"
                v-click-outside="() => showUserMenu = false"
                :class="[
                  'absolute right-0 mt-2 w-72 rounded-2xl shadow-xl overflow-hidden z-50',
                  darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
                ]"
              >
                <!-- User Info Header -->
                <div :class="[
                  'px-4 py-4 border-b',
                  darkMode ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-50 border-gray-100'
                ]">
                  <div class="flex items-center gap-3">
                    <div :class="[
                      'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold',
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    ]">
                      {{ getUserInitials() }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold truncate">{{ user?.username }}</p>
                      <p :class="[
                        'text-xs truncate',
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      ]">{{ user?.email }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Navigation Section -->
                <div class="py-2">
                  <button
                    @click="handleNavigate('/reports')"
                    :class="[
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
                      darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    ]"
                  >
                    <div :class="[
                      'p-1.5 rounded-lg',
                      darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    ]">
                      <LayoutGrid :size="16" :stroke-width="2" :class="darkMode ? 'text-gray-400' : 'text-gray-600'" />
                    </div>
                    <span>My Reports</span>
                  </button>
                  
                  <button
                    @click="editReport"
                    :class="[
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
                      darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    ]"
                  >
                    <div :class="[
                      'p-1.5 rounded-lg',
                      darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    ]">
                      <Edit :size="16" :stroke-width="2" :class="darkMode ? 'text-gray-400' : 'text-gray-600'" />
                    </div>
                    <span>Edit This Report</span>
                  </button>
                </div>
                
                <!-- Coming Soon Section -->
                <div :class="[
                  'py-2 border-t',
                  darkMode ? 'border-gray-800' : 'border-gray-100'
                ]">
                  <div :class="[
                    'flex items-center gap-3 px-4 py-2.5 text-sm opacity-50 cursor-not-allowed',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  ]">
                    <div :class="[
                      'p-1.5 rounded-lg',
                      darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    ]">
                      <Bell :size="16" :stroke-width="2" />
                    </div>
                    <span class="font-medium">Notifications</span>
                    <span :class="[
                      'ml-auto text-xs px-2 py-0.5 rounded-full font-medium',
                      darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-500'
                    ]">
                      Soon
                    </span>
                  </div>
                </div>
                
                <!-- Logout Section -->
                <div :class="[
                  'py-2 border-t',
                  darkMode ? 'border-gray-800' : 'border-gray-100'
                ]">
                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <div class="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <LogOut :size="16" :stroke-width="2" />
                    </div>
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div :class="['h-1', darkMode ? 'bg-gray-800' : 'bg-gray-100']">
      <div 
        class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
        :style="{ width: `${store.progressPercentage}%` }"
      />
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { BookOpen, Menu, X, FileText, Download, Moon, Sun, Bell, ChevronDown, LayoutGrid, Edit, LogOut } from 'lucide-vue-next'
import { useReportStore } from '../stores/report'
import { storeToRefs } from 'pinia'

const store = useReportStore()
const { darkMode, sidebarOpen } = storeToRefs(store)

const showUserMenu = ref(false)
const user = ref(null)

const toggleUserMenu = (event) => {
  showUserMenu.value = !showUserMenu.value
}

const currentReportSlug = computed(() => {
  if (!store.strapiReport) return null
  return store.strapiReport.slug || store.strapiReport.documentId
})

onMounted(() => {
  if (process.client) {
    const userData = localStorage.getItem('user')
    if (userData) {
      user.value = JSON.parse(userData)
    }
  }
})

const getUserInitials = () => {
  if (!user.value?.username) return 'U'
  const names = user.value.username.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  }
  return user.value.username.substring(0, 2).toUpperCase()
}

const handleDownload = () => {
  showUserMenu.value = false
  alert('PDF download would be triggered here')
}

const editReport = () => {
  if (currentReportSlug.value) {
    showUserMenu.value = false
    navigateTo(`/reports/edit/${currentReportSlug.value}/content`)
  }
}

const handleNavigate = (path) => {
  showUserMenu.value = false
  navigateTo(path)
}

const handleLogout = () => {
  if (process.client) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    navigateTo('/login')
  }
}

// Click outside directive with debounce
const vClickOutside = {
  mounted(el, binding) {
    // Add a small delay to prevent immediate firing
    setTimeout(() => {
      el.clickOutsideEvent = (event) => {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value()
        }
      }
      document.addEventListener('click', el.clickOutsideEvent)
    }, 100)
  },
  unmounted(el) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}
</script>