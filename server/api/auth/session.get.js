export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader) {
    return { user: null }
  }
  
  const token = authHeader.replace('Bearer ', '')
  
  try {
    const user = await $fetch('http://localhost:1337/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    return { user }
  } catch (error) {
    return { user: null }
  }
})