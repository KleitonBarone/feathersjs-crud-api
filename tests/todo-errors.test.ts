import { describe, it, expect, beforeEach } from 'vitest'
import { createClient, cleanTodoTable } from './setup.js'

describe('Todo Error Handling', () => {
  const client = createClient()

  beforeEach(async () => {
    await cleanTodoTable()
  })

  describe('GET /todo/:id (not found)', () => {
    it('returns 404 for non-existent id', async () => {
      const response = await client.get('/todo/99999')

      expect(response.status).toBe(404)
      expect(response.data.name).toBe('NotFound')
    })

    it('returns 404 for deleted todo', async () => {
      const createRes = await client.post('/todo', { task: 'Test', isDone: false })
      const todoId = createRes.data.id

      await client.delete(`/todo/${todoId}`)

      const response = await client.get(`/todo/${todoId}`)

      expect(response.status).toBe(404)
      expect(response.data.name).toBe('NotFound')
    })
  })

  describe('PATCH /todo/:id (not found)', () => {
    it('returns 404 when patching non-existent id', async () => {
      const response = await client.patch('/todo/99999', { task: 'Updated' })

      expect(response.status).toBe(404)
      expect(response.data.name).toBe('NotFound')
    })
  })

  describe('DELETE /todo/:id (not found)', () => {
    it('returns 404 when deleting non-existent id', async () => {
      const response = await client.delete('/todo/99999')

      expect(response.status).toBe(404)
      expect(response.data.name).toBe('NotFound')
    })

    it('returns 404 when deleting already deleted todo', async () => {
      const createRes = await client.post('/todo', { task: 'Test', isDone: false })
      const todoId = createRes.data.id

      await client.delete(`/todo/${todoId}`)
      const response = await client.delete(`/todo/${todoId}`)

      expect(response.status).toBe(404)
      expect(response.data.name).toBe('NotFound')
    })
  })
})
