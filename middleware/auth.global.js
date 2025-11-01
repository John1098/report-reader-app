export default defineNuxtRouteMiddleware((to, from) => {
  // Redirect root to reports
  if (to.path === '/') {
    return navigateTo('/reports')
  }
  
  // Skip auth check for login/register pages
  if (to.path === '/login' || to.path === '/register') {
    return
  }
  
  // Check if user is authenticated
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return navigateTo('/login')
    }
  }
})