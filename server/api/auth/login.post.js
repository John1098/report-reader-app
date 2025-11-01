export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    const response = await $fetch('http://localhost:1337/api/auth/local', {
      method: 'POST',
      body: {
        identifier: body.email,
        password: body.password
      }
    })
    
    return {
      jwt: response.jwt,
      user: response.user
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }
})