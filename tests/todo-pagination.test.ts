import { describe, it, expect, beforeEach } from 'vitest'
import { createClient, cleanTodoTable } from './setup.js'
import { buildTodo } from './helpers/todo-factory.js'

describe('Todo Pagination', () => {
  const client = createClient()

  beforeEach(async () => {
    await cleanTodoTable()
  })

  async function createTodos(count: number) {
    for (let i = 0; i < count; i++) {
      await client.post('/todo', buildTodo({ task: `Task ${i + 1}` }))
    }
  }

  describe('Default pagination', () => {
    it('returns default limit of 10', async () => {
      await createTodos(15)

      const response = await client.get('/todo')

      expect(response.status).toBe(200)
      expect(response.data.data).toHaveLength(10)
      expect(response.data.total).toBe(15)
      expect(response.data.limit).toBe(10)
      expect(response.data.skip).toBe(0)
    })
  })

  describe('Custom limit', () => {
    it('respects custom limit parameter', async () => {
      await createTodos(10)

      const response = await client.get('/todo', { params: { $limit: 5 } })

      expect(response.status).toBe(200)
      expect(response.data.data).toHaveLength(5)
      expect(response.data.limit).toBe(5)
    })

    it('enforces max limit of 50', async () => {
      await createTodos(60)

      const response = await client.get('/todo', { params: { $limit: 100 } })

      expect(response.status).toBe(200)
      expect(response.data.data).toHaveLength(50)
      expect(response.data.limit).toBe(50)
    })

    it('allows limit of 0 to get count only', async () => {
      await createTodos(5)

      const response = await client.get('/todo', { params: { $limit: 0 } })

      expect(response.status).toBe(200)
      expect(response.data.data).toHaveLength(0)
      expect(response.data.total).toBe(5)
    })
  })

  describe('Skip (offset)', () => {
    it('skips records with $skip parameter', async () => {
      await createTodos(10)

      const response = await client.get('/todo', { params: { $skip: 5 } })

      expect(response.status).toBe(200)
      expect(response.data.data).toHaveLength(5)
      expect(response.data.skip).toBe(5)
      expect(response.data.total).toBe(10)
    })

    it('returns empty array when skip exceeds total', async () => {
      await createTodos(5)

      const response = await client.get('/todo', { params: { $skip: 100 } })

      expect(response.status).toBe(200)
      expect(response.data.data).toHaveLength(0)
      expect(response.data.total).toBe(5)
    })
  })

  describe('Combined limit and skip', () => {
    it('paginates correctly with limit and skip', async () => {
      await createTodos(25)

      const page1 = await client.get('/todo', { params: { $limit: 10, $skip: 0 } })
      expect(page1.data.data).toHaveLength(10)

      const page2 = await client.get('/todo', { params: { $limit: 10, $skip: 10 } })
      expect(page2.data.data).toHaveLength(10)

      const page3 = await client.get('/todo', { params: { $limit: 10, $skip: 20 } })
      expect(page3.data.data).toHaveLength(5)

      expect(page1.data.total).toBe(25)
      expect(page2.data.total).toBe(25)
      expect(page3.data.total).toBe(25)
    })
  })
})
