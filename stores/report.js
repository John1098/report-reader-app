import { defineStore } from 'pinia'

export const useReportStore = defineStore('report', {
  state: () => ({
    activeSection: '1.1',
    expandedChapters: { 1: true },
    bookmarkedSections: new Set(),
    readProgress: {},
    darkMode: false,
    sidebarOpen: true,
    showTOC: false,
    searchQuery: '',
    strapiReport: null, // Raw data from Strapi
    reportStructure: null, // Transformed data
    contentBlocks: {} // Transformed content
  }),
  
  getters: {
    currentContent: (state) => {
      if (!state.reportStructure) return null
      
      const section = state.reportStructure.chapters
        .flatMap(c => c.sections)
        .find(s => s.id === state.activeSection)
      
      return section ? state.contentBlocks[section.content] : null
    },
    
    allSections: (state) => {
      if (!state.reportStructure) return []
      
      return state.reportStructure.chapters.flatMap(chapter => 
        chapter.sections.map(section => ({
          ...section,
          chapterTitle: chapter.title
        }))
      )
    },
    
    totalSections: (state) => {
      if (!state.reportStructure) return 0
      return state.reportStructure.chapters.reduce((sum, ch) => sum + ch.sections.length, 0)
    },
    
    readSections: (state) => {
      return Object.keys(state.readProgress).length
    },
    
    progressPercentage: (state) => {
      if (!state.reportStructure) return 0
      const total = state.reportStructure.chapters.reduce((sum, ch) => sum + ch.sections.length, 0)
      const read = Object.keys(state.readProgress).length
      return Math.round((read / total) * 100)
    },
    
    bookmarkedSectionsList: (state) => {
      if (!state.reportStructure) return []
      
      return state.reportStructure.chapters
        .flatMap(chapter => 
          chapter.sections.map(section => ({
            ...section,
            chapterTitle: chapter.title
          }))
        )
        .filter(s => state.bookmarkedSections.has(s.id))
    }
  },
  
  actions: {
    // Transform Strapi data to match component expectations
    loadStrapiReport(strapiData) {
      this.strapiReport = strapiData
      
      // Transform to reportStructure format
      this.reportStructure = {
        title: strapiData.title,
        chapters: strapiData.chapters.map((chapter, chapterIndex) => ({
          id: chapterIndex + 1,
          title: chapter.title,
          icon: chapter.icon || 'FileText',
          sections: chapter.sections ? (Array.isArray(chapter.sections) ? chapter.sections : [chapter.sections]).map((section, sectionIndex) => ({
            id: `${chapterIndex + 1}.${sectionIndex + 1}`,
            title: section.Title,
            content: `section-${section.id}`
          })) : []
        }))
      }
      
      // Transform content blocks
      strapiData.chapters.forEach(chapter => {
        const sections = chapter.sections ? (Array.isArray(chapter.sections) ? chapter.sections : [chapter.sections]) : []
        
        sections.forEach(section => {
          const contentBlocks = section.content_blocks || []
          
          // Build content array
          const content = contentBlocks.map(block => {
            if (block.Type === 'text') {
              return {
                type: 'text',
                text: block.textContent?.[0]?.children?.[0]?.text || ''
              }
            }
            if (block.Type === 'highlight') {
              return {
                type: 'highlight',
                text: block.textContent?.[0]?.children?.[0]?.text || ''
              }
            }
            if (block.Type === 'list') {
              return {
                type: 'list',
                items: block.listItems || []
              }
            }
            return null
          }).filter(Boolean)
          
          this.contentBlocks[`section-${section.id}`] = {
            title: section.Title,
            tag: chapter.title,
            hero: this.getGradientForChapter(chapter.title),
            content,
            stats: section.statsData || null
          }
        })
      })
      
      // Set first section as active
      if (this.reportStructure.chapters.length > 0 && 
          this.reportStructure.chapters[0].sections.length > 0) {
        this.activeSection = this.reportStructure.chapters[0].sections[0].id
      }
    },
    
    getGradientForChapter(chapterTitle) {
      const gradients = {
        'Executive Summary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'Financial Performance': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'People & Culture': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
      }
      return gradients[chapterTitle] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    
    setActiveSection(sectionId) {
      this.activeSection = sectionId
      this.readProgress[sectionId] = true
    },
    
    toggleChapter(chapterId) {
      this.expandedChapters[chapterId] = !this.expandedChapters[chapterId]
    },
    
    toggleBookmark(sectionId) {
      if (this.bookmarkedSections.has(sectionId)) {
        this.bookmarkedSections.delete(sectionId)
      } else {
        this.bookmarkedSections.add(sectionId)
      }
    },
    
    toggleDarkMode() {
      this.darkMode = !this.darkMode
    },
    
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    
    toggleTOC() {
      this.showTOC = !this.showTOC
    },
    
    setSearchQuery(query) {
      this.searchQuery = query
    }
  }
})