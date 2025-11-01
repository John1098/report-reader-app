export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    // Register the user
    const response = await $fetch('http://localhost:1337/api/auth/local/register', {
      method: 'POST',
      body: {
        username: body.username,
        email: body.email,
        password: body.password
      }
    })
    
    // Create an organization for this user
    const orgName = `${body.username}'s Organization`
    const orgSlug = body.username.toLowerCase().replace(/[^a-z0-9]/g, '-')
    
    const organization = await $fetch('http://localhost:1337/api/organizations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${response.jwt}`
      },
      body: {
        data: {
          name: orgName,
          slug: orgSlug
        }
      }
    })
    
    // Link the user to the organization
    await $fetch(`http://localhost:1337/api/users/${response.user.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${response.jwt}`
      },
      body: {
        organization: organization.data.id
      }
    })
    
    return {
      jwt: response.jwt,
      user: {
        ...response.user,
        organization: organization.data
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    throw createError({
      statusCode: 400,
      message: error.data?.error?.message || 'Registration failed'
    })
  }
})