export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  // Remove or comment out the css line for now
  // css: ['~/assets/css/main.css'],
  compatibilityDate: '2024-10-26',
  devtools: { enabled: true }
})