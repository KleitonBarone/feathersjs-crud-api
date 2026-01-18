import type { TodoData } from '../../src/services/todo/todo.schema.js'

let counter = 0

export function buildTodo(overrides: Partial<TodoData> = {}): TodoData {
  counter++
  return {
    task: `Test task ${counter}`,
    isDone: false,
    ...overrides
  }
}

export function resetCounter(): void {
  counter = 0
}
