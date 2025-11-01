export default defineEventHandler(async (event) => {
  // For JWT-based auth, we just return success
  // The client will remove the token
  return { success: true }
})