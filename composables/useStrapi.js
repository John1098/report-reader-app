export const useStrapi = () => {
  const baseURL = 'http://localhost:1337/api'

  const getAuthToken = () => {
    if (process.client) {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  const fetchReports = async () => {
    const token = getAuthToken()
    
    console.log('Token:', token ? 'exists' : 'missing')
    
    if (!token) {
      return []
    }

    try {
      // First get the current user's organization
      const user = await $fetch(`${baseURL}/users/me?populate[organization]=*`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('User fetched:', user)
      console.log('User organization:', user.organization)
      
      if (!user.organization) {
        console.log('No organization found for user')
        return []
      }

      const orgDocId = user.organization.documentId
      console.log('Fetching reports for org documentId:', orgDocId)

      // Fetch reports using documentId instead of id
      const response = await $fetch(
        `${baseURL}/reports?filters[organization][documentId][$eq]=${orgDocId}&populate[organization]=*&populate[chapters][populate][sections][populate]=content_blocks`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      console.log('Reports API response:', response)
      
      return response.data
    } catch (error) {
      console.error('Error fetching reports:', error)
      return []
    }
  }

  const fetchReport = async (slug) => {
    const token = getAuthToken()
    
    if (!token) {
      return null
    }

    try {
      const user = await $fetch(`${baseURL}/users/me?populate[organization]=*`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!user.organization) {
        return null
      }

      const orgDocId = user.organization.documentId

      const response = await $fetch(
        `${baseURL}/reports?filters[slug][$eq]=${slug}&filters[organization][documentId][$eq]=${orgDocId}&populate[organization]=*&populate[chapters][populate][sections][populate]=content_blocks`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
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