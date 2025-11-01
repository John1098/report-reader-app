export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@sidebase/nuxt-auth'
  ],
  
  auth: {
    baseURL: 'http://localhost:3000/api/auth',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: { path: '/register', method: 'post' },
        getSession: { path: '/session', method: 'get' }
      },
      token: {
        signInResponseTokenPointer: '/jwt'
      }
    },
    globalAppMiddleware: false
  },
  
  compatibilityDate: '2024-10-26',
  devtools: { enabled: true }
})