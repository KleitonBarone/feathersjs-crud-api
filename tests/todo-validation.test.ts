import { describe, it, expect, beforeEach } from 'vitest'
import { createClient, cleanTodoTable } from './setup.js'

describe('Todo Validation Errors', () => {
  const client = createClient()

  beforeEach(async () => {
    await cleanTodoTable()
  })

  describe('POST /todo validation', () => {
    it('rejects missing task field', async () => {
      const response = await client.post('/todo', { isDone: false })

      expect(response.status).toBe(400)
      expect(response.data.name).toBe('BadRequest')
    })

    it('rejects missing isDone field', async () => {
      const response = await client.post('/todo', { task: 'Test' })

      expect(response.status).toBe(400)
      expect(response.data.name).toBe('BadRequest')
    })

    it('rejects empty request body', async () => {
      const response = await client.post('/todo', {})

      expect(response.status).toBe(400)
      expect(response.data.name).toBe('BadRequest')
    })

    it('rejects invalid task type', async () => {
      const response = await client.post('/todo', { task: 123, isDone: false })

      expect(response.status).toBe(400)
      expect(response.data.name).toBe('BadRequest')
    })

    it('rejects invalid isDone type', async () => {
      const response = await client.post('/todo', { task: 'Test', isDone: 'yes' })

      expect(response.status).toBe(400)
      expect(response.data.name).toBe('BadRequest')
    })

    it('rejects additional properties', async () => {
      const response = await client.post('/todo', {
        task: 'Test',
        isDone: false,
        extraField: 'not allowed'
      })

      expect(response.status).toBe(400)
      expect(response.data.name).toBe('BadRequest')
    })
  })

  describe('PATCH /todo/:id validation', () => {
    it('allows partial update with only task', async () => {
      const createRes = await client.post('/todo', { task: 'Original', isDone: false })
      const todoId = createRes.data.id

      const response = await client.patch(`/todo/${todoId}`, { task: 'Updated' })

      expect(response.status).toBe(200)
    })

    it('allows partial update with only isDone', async () => {
      const createRes = await client.post('/todo', { task: 'Original', isDone: false })
      const todoId = createRes.data.id

      const response = await client.patch(`/todo/${todoId}`, { isDone: true })

      expect(response.status).toBe(200)
    })

    it('rejects invalid task type on patch', async () => {
      const createRes = await client.post('/todo', { task: 'Original', isDone: false })
      const todoId = createRes.data.id

      const response = await client.patch(`/todo/${todoId}`, { task: 123 })

      expect(response.status).toBe(400)
      expect(response.data.name).toBe('BadRequest')
    })
  })
})
