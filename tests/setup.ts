import axios, { type AxiosInstance } from 'axios'

const TEST_PORT = 8998
const BASE_URL = `http://localhost:${TEST_PORT}`

// Create axios client for API requests
export function createClient(): AxiosInstance {
  return axios.create({
    baseURL: BASE_URL,
    validateStatus: () => true // Don't throw on non-2xx responses
  })
}

// Helper to get app instance for direct database access
export async function getApp() {
  const { app } = await import('../src/app.js')
  return app
}

// Helper to clean the todo table between tests
export async function cleanTodoTable(): Promise<void> {
  const app = await getApp()
  const knex = app.get('sqliteClient')
  await knex('todo').truncate()
}
