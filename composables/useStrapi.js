export const useStrapi = () => {
  const config = useRuntimeConfig()
  const baseURL = 'http://localhost:1337/api'

  const fetchReports = async () => {
    try {
      const response = await $fetch(`${baseURL}/reports?populate[chapters][populate][sections][populate]=content_blocks`)
      return response.data
    } catch (error) {
      console.error('Error fetching reports:', error)
      return []
    }
  }

  const fetchReport = async (slug) => {
    try {
      const response = await $fetch(`${baseURL}/reports?filters[slug][$eq]=${slug}&populate[chapters][populate][sections][populate]=content_blocks`)
      return response.data[0]
    } catch (error) {
      console.error('Error fetching report:', error)
      return null
    }
  }

  return {
    fetchReports,
    fetchReport
  }
}