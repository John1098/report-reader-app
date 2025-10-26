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
    
    reportStructure: {
      title: "Annual Impact Report 2024",
      chapters: [
        {
          id: 1,
          title: "Executive Summary",
          icon: "FileText",
          sections: [
            { id: "1.1", title: "Overview", content: "executive-summary" },
            { id: "1.2", title: "Key Highlights", content: "key-highlights" }
          ]
        },
        {
          id: 2,
          title: "Financial Performance",
          icon: "BarChart3",
          sections: [
            { id: "2.1", title: "Revenue Growth", content: "revenue" },
            { id: "2.2", title: "Market Analysis", content: "market" },
            { id: "2.3", title: "Cost Optimization", content: "costs" }
          ]
        },
        {
          id: 3,
          title: "People & Culture",
          icon: "Users",
          sections: [
            { id: "3.1", title: "Employee Engagement", content: "engagement" },
            { id: "3.2", title: "Diversity & Inclusion", content: "diversity" }
          ]
        }
      ]
    },
    
    contentBlocks: {
      "executive-summary": {
        title: "Executive Summary",
        tag: "Overview",
        hero: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        content: [
          { type: "text", text: "Our organization achieved remarkable growth in 2024, expanding our reach to serve over 2 million customers across 45 countries. This report outlines our strategic initiatives, financial performance, and commitment to sustainable practices." },
          { type: "highlight", text: "Revenue increased by 34% year-over-year, reaching $450M in annual recurring revenue." },
          { type: "text", text: "We invested heavily in innovation, launching three new product lines and acquiring two strategic partners. Our team grew from 850 to 1,200 employees, strengthening our capabilities across engineering, sales, and customer success." }
        ],
        stats: [
          { label: "Revenue Growth", value: "34%", trend: "up" },
          { label: "New Markets", value: "12", trend: "up" },
          { label: "Customer Satisfaction", value: "94%", trend: "up" }
        ]
      },
      "key-highlights": {
        title: "Key Highlights",
        tag: "Achievements",
        hero: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        content: [
          { type: "text", text: "2024 marked a pivotal year of transformation and achievement. Our strategic focus on innovation and customer-centricity drove exceptional results across all business units." },
          { type: "list", items: [
            "Launched AI-powered analytics platform, serving 500,000+ users",
            "Achieved carbon neutrality across all operations",
            "Expanded to 12 new international markets",
            "Recognized as 'Best Place to Work' by industry publications"
          ]},
          { type: "text", text: "These accomplishments reflect the dedication of our team and the trust of our customers. We remain committed to pushing boundaries and delivering exceptional value." }
        ]
      },
      "revenue": {
        title: "Revenue Growth",
        tag: "Financial Performance",
        hero: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        content: [
          { type: "text", text: "Our financial performance exceeded expectations in 2024. Total revenue reached $450M, representing a 34% increase from the previous year. This growth was driven by strong demand across all product lines and successful expansion into new markets." },
          { type: "highlight", text: "Recurring revenue now represents 82% of total revenue, up from 76% in 2023, demonstrating the strength of our subscription model." },
          { type: "text", text: "Enterprise segment grew 45% year-over-year, while our SMB business maintained steady 28% growth. Geographic expansion contributed $67M in new revenue, with particularly strong performance in APAC and EMEA regions." }
        ],
        stats: [
          { label: "Total Revenue", value: "$450M", trend: "up" },
          { label: "ARR Growth", value: "34%", trend: "up" },
          { label: "Enterprise Sales", value: "+45%", trend: "up" }
        ]
      },
      "market": {
        title: "Market Analysis",
        tag: "Financial Performance",
        hero: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        content: [
          { type: "text", text: "Our market position strengthened significantly in 2024. We captured 18% market share in our core segment, up from 14% in 2023. Competitive analysis shows we're outpacing industry growth by 2.3x." },
          { type: "text", text: "Customer acquisition costs decreased by 22% while customer lifetime value increased by 31%, demonstrating improved efficiency and product-market fit. Our Net Promoter Score reached 72, placing us in the 'Excellent' category." }
        ]
      },
      "costs": {
        title: "Cost Optimization",
        tag: "Financial Performance",
        hero: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        content: [
          { type: "text", text: "Strategic cost management initiatives delivered $23M in annual savings while maintaining service quality. We automated 40% of routine operations and renegotiated key vendor contracts." },
          { type: "list", items: [
            "Cloud infrastructure optimization saved $8M annually",
            "Process automation reduced manual work by 15,000 hours",
            "Strategic sourcing improved supplier terms by 18%"
          ]}
        ]
      },
      "engagement": {
        title: "Employee Engagement",
        tag: "People & Culture",
        hero: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        content: [
          { type: "text", text: "Employee satisfaction reached an all-time high of 87%, up from 79% last year. Our focus on work-life balance, professional development, and transparent communication created a thriving workplace culture." },
          { type: "highlight", text: "Voluntary turnover decreased to 8.2%, well below the industry average of 13.5%." }
        ]
      },
      "diversity": {
        title: "Diversity & Inclusion",
        tag: "People & Culture",
        hero: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        content: [
          { type: "text", text: "We made meaningful progress toward our diversity goals. Women now represent 42% of our workforce and 35% of leadership positions. Underrepresented minorities comprise 31% of new hires." },
          { type: "text", text: "Our mentorship program connected 200 employees with senior leaders, and we launched six employee resource groups to foster belonging and community." }
        ]
      }
    }
  }),
  
  getters: {
    currentContent: (state) => {
      const section = state.reportStructure.chapters
        .flatMap(c => c.sections)
        .find(s => s.id === state.activeSection)
      return section ? state.contentBlocks[section.content] : null
    },
    
    allSections: (state) => {
      return state.reportStructure.chapters.flatMap(chapter => 
        chapter.sections.map(section => ({
          ...section,
          chapterTitle: chapter.title
        }))
      )
    },
    
    totalSections: (state) => {
      return state.reportStructure.chapters.reduce((sum, ch) => sum + ch.sections.length, 0)
    },
    
    readSections: (state) => {
      return Object.keys(state.readProgress).length
    },
    
    progressPercentage: (state) => {
      const total = state.reportStructure.chapters.reduce((sum, ch) => sum + ch.sections.length, 0)
      const read = Object.keys(state.readProgress).length
      return Math.round((read / total) * 100)
    },
    
    bookmarkedSectionsList: (state) => {
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