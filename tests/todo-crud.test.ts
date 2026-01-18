import { describe, it, expect, beforeEach } from 'vitest'
import { createClient, cleanTodoTable } from './setup.js'
import { buildTodo } from './helpers/todo-factory.js'

describe('Todo CRUD Operations', () => {
  const client = createClient()

  beforeEach(async () => {
    await cleanTodoTable()
  })

  describe('POST /todo (create)', () => {
    it('creates a new todo with valid data', async () => {
      const todoData = buildTodo({ task: 'Buy groceries', isDone: false })

      const response = await client.post('/todo', todoData)

      expect(response.status).toBe(201)
      expect(response.data.id).toEqual(expect.any(Number))
      expect(response.data.task).toBe('Buy groceries')
      expect(response.data.isDone).toBeFalsy()
    })

    it('creates multiple todos with unique ids', async () => {
      const todo1 = buildTodo({ task: 'Task 1' })
      const todo2 = buildTodo({ task: 'Task 2' })

      const res1 = await client.post('/todo', todo1)
      const res2 = await client.post('/todo', todo2)

      expect(res1.status).toBe(201)
      expect(res2.status).toBe(201)
      expect(res1.data.id).not.toBe(res2.data.id)
    })
  })

  describe('GET /todo (find)', () => {
    it('returns empty array when no todos exist', async () => {
      const response = await client.get('/todo')

      expect(response.status).toBe(200)
      expect(response.data.data).toEqual([])
      expect(response.data.total).toBe(0)
    })

    it('returns all todos with pagination info', async () => {
      await client.post('/todo', buildTodo({ task: 'Task 1' }))
      await client.post('/todo', buildTodo({ task: 'Task 2' }))

      const response = await client.get('/todo')

      expect(response.status).toBe(200)
      expect(response.data.data).toHaveLength(2)
      expect(response.data.total).toBe(2)
      expect(response.data.limit).toBe(10)
      expect(response.data.skip).toBe(0)
    })
  })

  describe('GET /todo/:id (get)', () => {
    it('returns a specific todo by id', async () => {
      const createRes = await client.post('/todo', buildTodo({ task: 'Specific task' }))
      const todoId = createRes.data.id

      const response = await client.get(`/todo/${todoId}`)

      expect(response.status).toBe(200)
      expect(response.data).toMatchObject({
        id: todoId,
        task: 'Specific task'
      })
    })
  })

  describe('PATCH /todo/:id (patch)', () => {
    it('updates todo task', async () => {
      const createRes = await client.post('/todo', buildTodo({ task: 'Original' }))
      const todoId = createRes.data.id

      const response = await client.patch(`/todo/${todoId}`, { task: 'Updated' })

      expect(response.status).toBe(200)
      expect(response.data.task).toBe('Updated')
    })

    it('updates todo isDone status', async () => {
      const createRes = await client.post('/todo', buildTodo({ isDone: false }))
      const todoId = createRes.data.id

      const response = await client.patch(`/todo/${todoId}`, { isDone: true })

      expect(response.status).toBe(200)
      expect(response.data.isDone).toBeTruthy()
    })

    it('allows partial updates', async () => {
      const createRes = await client.post('/todo', buildTodo({ task: 'Original', isDone: false }))
      const todoId = createRes.data.id

      const response = await client.patch(`/todo/${todoId}`, { isDone: true })

      expect(response.status).toBe(200)
      expect(response.data.task).toBe('Original')
      expect(response.data.isDone).toBeTruthy()
    })
  })

  describe('DELETE /todo/:id (remove)', () => {
    it('deletes a todo and returns the deleted item', async () => {
      const createRes = await client.post('/todo', buildTodo())
      const todoId = createRes.data.id

      const deleteRes = await client.delete(`/todo/${todoId}`)

      expect(deleteRes.status).toBe(200)
      expect(deleteRes.data.id).toBe(todoId)

      const getRes = await client.get(`/todo/${todoId}`)
      expect(getRes.status).toBe(404)
    })
  })
})
