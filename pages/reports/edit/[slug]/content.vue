<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button
              @click="navigateTo('/reports')"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeft :size="20" />
            </button>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ report?.title }}</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Content Editor</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button
              @click="saveChanges"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save :size="16" />
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-lg text-gray-600 dark:text-gray-400">Loading report...</div>
    </div>

    <!-- Editor -->
    <main v-else-if="report" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Chapters -->
      <div class="space-y-6">
        <div
          v-for="(chapter, chapterIndex) in chapters"
          :key="chapter.id || `chapter-${chapterIndex}`"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <!-- Chapter Header -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-start gap-4">
              <div class="flex-1">
                <input
                  v-model="chapter.title"
                  type="text"
                  placeholder="Chapter title"
                  class="w-full text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-gray-900 dark:text-white"
                />
                <div class="flex items-center gap-4 mt-2">
                  <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600 dark:text-gray-400">Icon:</label>
                    <select
                      v-model="chapter.icon"
                      class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="FileText">Document</option>
                      <option value="BarChart3">Chart</option>
                      <option value="Users">People</option>
                      <option value="TrendingUp">Growth</option>
                      <option value="Target">Target</option>
                    </select>
                  </div>
                  <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600 dark:text-gray-400">Order:</label>
                    <input
                      v-model.number="chapter.order"
                      type="number"
                      min="1"
                      class="w-20 text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <button
                @click="deleteChapter(chapterIndex)"
                class="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <Trash2 :size="18" class="text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>

          <!-- Sections -->
          <div class="p-6 space-y-4">
            <div
              v-for="(section, sectionIndex) in chapter.sections"
              :key="section.id || `section-${sectionIndex}`"
              class="pl-6 border-l-2 border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-start gap-4">
                <div class="flex-1">
                  <input
                    v-model="section.Title"
                    type="text"
                    placeholder="Section title"
                    class="w-full font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-gray-900 dark:text-white"
                  />
                  <div class="flex items-center gap-4 mt-2">
                    <div class="flex items-center gap-2">
                      <label class="text-sm text-gray-600 dark:text-gray-400">Order:</label>
                      <input
                        v-model.number="section.Order"
                        type="number"
                        min="1"
                        class="w-20 text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                <button
                  @click="deleteSection(chapterIndex, sectionIndex)"
                  class="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 :size="16" class="text-red-600 dark:text-red-400" />
                </button>
              </div>

              <!-- Content Blocks -->
              <div class="mt-4 space-y-3">
                <div
                  v-for="(block, blockIndex) in section.content_blocks"
                  :key="block.id || `block-${blockIndex}`"
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                >
                  <div class="flex items-start gap-4">
                    <div class="flex-1 space-y-3">
                      <select
                        v-model="block.Type"
                        class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="text">Text</option>
                        <option value="highlight">Highlight</option>
                        <option value="list">List</option>
                        <option value="image">Image</option>
                        <option value="quote">Quote</option>
                        <option value="stats">Stats</option>
                        <option value="table">Table</option>
                      </select>

                      <!-- Text/Highlight Content -->
                      <textarea
                        v-if="block.Type === 'text' || block.Type === 'highlight'"
                        v-model="block.textContent[0].children[0].text"
                        rows="3"
                        placeholder="Enter content..."
                        class="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      ></textarea>

                      <!-- List Content -->
                      <div v-else-if="block.Type === 'list'" class="space-y-2">
                        <div
                          v-for="(item, itemIndex) in block.listItems"
                          :key="itemIndex"
                          class="flex gap-2"
                        >
                          <input
                            v-model="block.listItems[itemIndex]"
                            type="text"
                            placeholder="List item..."
                            class="flex-1 text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <button
                            @click="block.listItems.splice(itemIndex, 1)"
                            class="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <X :size="16" class="text-red-600" />
                          </button>
                        </div>
                        <button
                          @click="block.listItems.push('')"
                          class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          + Add item
                        </button>
                      </div>

                      <!-- Image Content -->
                      <div v-else-if="block.Type === 'image'" class="space-y-2">
                        <input
                          v-model="block.imageUrl"
                          type="url"
                          placeholder="Image URL"
                          class="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          v-model="block.imageCaption"
                          type="text"
                          placeholder="Caption (optional)"
                          class="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <!-- Quote Content -->
                      <div v-else-if="block.Type === 'quote'" class="space-y-2">
                        <textarea
                          v-model="block.quoteText"
                          rows="3"
                          placeholder="Quote text..."
                          class="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        ></textarea>
                        <input
                          v-model="block.quoteAuthor"
                          type="text"
                          placeholder="Author (optional)"
                          class="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <!-- Stats/Table - JSON editing -->
                      <textarea
                        v-else-if="block.Type === 'stats' || block.Type === 'table'"
                        v-model="block[block.Type === 'stats' ? 'statsDataJson' : 'tableDataJson']"
                        rows="5"
                        placeholder="Enter JSON data..."
                        class="w-full text-sm font-mono border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      ></textarea>

                      <div class="flex items-center gap-2">
                        <label class="text-xs text-gray-600 dark:text-gray-400">Order:</label>
                        <input
                          v-model.number="block.Order"
                          type="number"
                          min="1"
                          class="w-16 text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <button
                      @click="deleteContentBlock(chapterIndex, sectionIndex, blockIndex)"
                      class="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 :size="16" class="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                <!-- Add Content Block Button -->
                <button
                  @click="addContentBlock(chapterIndex, sectionIndex)"
                  class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  + Add Content Block
                </button>
              </div>
            </div>

            <!-- Add Section Button -->
            <button
              @click="addSection(chapterIndex)"
              class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              + Add Section
            </button>
          </div>
        </div>

        <!-- Add Chapter Button -->
        <button
          @click="addChapter"
          class="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
        >
          <Plus :size="20" />
          Add Chapter
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowLeft, Save, Trash2, Plus, X } from 'lucide-vue-next'

const route = useRoute()
const report = ref(null)
const chapters = ref([])
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  try {
    const token = localStorage.getItem('auth_token')
    const slug = route.params.slug
    
    // Fetch the full report with all nested data
    const response = await $fetch(
      `http://localhost:1337/api/reports?filters[slug][$eq]=${slug}&populate[chapters][populate][sections][populate]=content_blocks`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    if (!response.data || response.data.length === 0) {
      // Try by documentId
      const docResponse = await $fetch(
        `http://localhost:1337/api/reports/${slug}?populate[chapters][populate][sections][populate]=content_blocks`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      report.value = docResponse.data
    } else {
      report.value = response.data[0]
    }
    
    // Initialize chapters data and ensure IDs are preserved
    chapters.value = (report.value.chapters || []).map(chapter => ({
      ...chapter,
      id: chapter.id, // Keep the numeric ID
      documentId: chapter.documentId,
      sections: (chapter.sections ? (Array.isArray(chapter.sections) ? chapter.sections : [chapter.sections]) : []).map(section => ({
        ...section,
        id: section.id, // Keep the numeric ID
        documentId: section.documentId,
        content_blocks: (section.content_blocks || []).map(block => {
          const mappedBlock = {
            ...block,
            id: block.id,
            documentId: block.documentId
          };
          
          // Initialize JSON fields for stats and tables
          if (block.Type === 'stats' && block.statsData) {
            mappedBlock.statsDataJson = JSON.stringify(block.statsData, null, 2);
          }
          if (block.Type === 'table' && block.tableData) {
            mappedBlock.tableDataJson = JSON.stringify(block.tableData, null, 2);
          }
          if (!mappedBlock.listItems) {
            mappedBlock.listItems = [];
          }
          if ((block.Type === 'text' || block.Type === 'highlight') && !block.textContent) {
            mappedBlock.textContent = [{ type: 'paragraph', children: [{ type: 'text', text: '' }] }];
          }
          
          return mappedBlock;
        })
      }))
    }));

    console.log('Loaded chapters with IDs:', chapters.value.map(c => ({ title: c.title, id: c.id, sectionCount: c.sections.length }))); 

  } catch (error) {
    console.error('Error loading report:', error)
    alert('Failed to load report')
  } finally {
    loading.value = false
  }
})

const addChapter = () => {
  chapters.value.push({
    title: 'New Chapter',
    order: chapters.value.length + 1,
    icon: 'FileText',
    sections: [],
    isNew: true
  })
}

const deleteChapter = (chapterIndex) => {
  if (confirm('Delete this chapter and all its sections?')) {
    chapters.value.splice(chapterIndex, 1)
  }
}

const addSection = (chapterIndex) => {
  const chapter = chapters.value[chapterIndex]
  chapter.sections.push({
    Title: 'New Section',
    Order: chapter.sections.length + 1,
    Content_Key: `section-${Date.now()}`,
    content_blocks: [],
    isNew: true
  })
}

const deleteSection = (chapterIndex, sectionIndex) => {
  if (confirm('Delete this section and all its content?')) {
    chapters.value[chapterIndex].sections.splice(sectionIndex, 1)
  }
}

const addContentBlock = (chapterIndex, sectionIndex) => {
  const section = chapters.value[chapterIndex].sections[sectionIndex]
  section.content_blocks.push({
    Type: 'text',
    textContent: [{ type: 'paragraph', children: [{ type: 'text', text: '' }] }],
    Order: section.content_blocks.length + 1,
    listItems: [],
    isNew: true
  })
}

const deleteContentBlock = (chapterIndex, sectionIndex, blockIndex) => {
  if (confirm('Delete this content block?')) {
    chapters.value[chapterIndex].sections[sectionIndex].content_blocks.splice(blockIndex, 1)
  }
}

const saveChanges = async () => {
  saving.value = true
  
  try {
    const token = localStorage.getItem('auth_token')
    
    // Save each chapter
    for (const chapter of chapters.value) {
      let chapterId = chapter.id
      let chapterDocId = chapter.documentId  // Store documentId too
      
      console.log('Processing chapter:', chapter.title, 'ID:', chapterId, 'DocID:', chapterDocId, 'isNew:', chapter.isNew)

      
      if (chapter.isNew) {
        // Create new chapter
        const chapterResponse = await $fetch('http://localhost:1337/api/chapters', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: {
            data: {
              title: chapter.title,
              order: chapter.order,
              icon: chapter.icon,
              report: report.value.id
            }
          }
        })
        chapterId = chapterResponse.data.id
        chapter.id = chapterId
        chapter.documentId = chapterResponse.data.documentId
        console.log('Created chapter, new ID:', chapterId)
        delete chapter.isNew
      } else if (chapter.documentId) {
        // Update existing chapter
        await $fetch(`http://localhost:1337/api/chapters/${chapter.documentId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: {
            data: {
              title: chapter.title,
              order: chapter.order,
              icon: chapter.icon
            }
          }
        })
        console.log('Updated chapter, using ID:', chapterId)
      }
      
      // Verify we have a valid chapter ID
      if (!chapterId) {
        console.error('No chapter ID for:', chapter.title)
        continue
      }
      
      // Save sections
      for (const section of chapter.sections) {
        let sectionId = section.id
        let sectionDocId = section.documentId
        
        console.log('Processing section:', section.Title, 'ID:', sectionId, 'chapterId:', chapterId, 'chapterDocId:', chapterDocId)
        
        if (section.isNew) {
          const sectionResponse = await $fetch('http://localhost:1337/api/sections', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: {
              data: {
                Title: section.Title,
                Order: section.Order,
                Content_Key: section.Content_Key,
                chapter: chapterDocId
              }
            }
          })
          sectionId = sectionResponse.data.id
          sectionDocId = sectionResponse.data.documentId
          section.id = sectionId
          section.documentId = sectionDocId
          console.log('Created section, new ID:', sectionId)
          delete section.isNew
        } else if (sectionDocId) {
          await $fetch(`http://localhost:1337/api/sections/${sectionDocId}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: {
              data: {
                Title: section.Title,
                Order: section.Order,
                Content_Key: section.Content_Key
              }
            }
          })
          console.log('Updated section, using ID:', sectionId)
        }
        
        // Verify we have a valid section ID
        if (!sectionId) {
          console.error('No section ID for:', section.Title)
          continue
        }
        
        // Save content blocks
        for (const block of section.content_blocks) {
          // Parse JSON fields
          if (block.Type === 'stats' && block.statsDataJson) {
            try {
              block.statsData = JSON.parse(block.statsDataJson)
            } catch (e) {
              console.error('Invalid stats JSON:', e)
            }
          }
          if (block.Type === 'table' && block.tableDataJson) {
            try {
              block.tableData = JSON.parse(block.tableDataJson)
            } catch (e) {
              console.error('Invalid table JSON:', e)
            }
          }
          
          const blockData = {
            Type: block.Type,
            Order: block.Order
          }
          
          // Add type-specific fields
          if (block.Type === 'text' || block.Type === 'highlight') {
            blockData.textContent = block.textContent
          }
          if (block.Type === 'list') {
            blockData.listItems = block.listItems || []
          }
          if (block.Type === 'stats') {
            blockData.statsData = block.statsData || null
          }
          if (block.Type === 'image') {
            blockData.imageUrl = block.imageUrl || ''
            blockData.imageCaption = block.imageCaption || ''
          }
          if (block.Type === 'quote') {
            blockData.quoteText = block.quoteText || ''
            blockData.quoteAuthor = block.quoteAuthor || ''
          }
          if (block.Type === 'table') {
            blockData.tableData = block.tableData || null
          }
          
          if (block.isNew) {
            blockData.section = sectionDocId  // Use documentId instead of numeric id
            
            try {
              const blockResponse = await $fetch('http://localhost:1337/api/content-blocks', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`
                },
                body: {
                  data: blockData
                }
              })
              block.id = blockResponse.data.id
              block.documentId = blockResponse.data.documentId
              console.log('Created block, new ID:', block.id)
              delete block.isNew
            } catch (createError) {
              console.error('Error creating block:', createError)
            }
          } else if (block.documentId) {
            try {
              await $fetch(`http://localhost:1337/api/content-blocks/${block.documentId}`, {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${token}`
                },
                body: {
                  data: blockData
                }
              })
              console.log('Updated block:', block.documentId)
            } catch (updateError) {
              console.error('Error updating block:', block.documentId, updateError.data)
            }
          }
        }
      }
    }
    
    alert('Changes saved successfully!')
    navigateTo('/reports')
  } catch (error) {
    console.error('Error saving changes:', error)
    alert('Failed to save changes: ' + (error.data?.error?.message || error.message))
  } finally {
    saving.value = false
  }
}
</script>