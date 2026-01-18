import type { Server } from 'node:http'

let server: Server | undefined

export async function setup(): Promise<void> {
  // Set NODE_ENV to test before importing app
  process.env.NODE_ENV = 'test'

  // Dynamic import to ensure config is loaded with test environment
  const { app } = await import('../src/app.js')

  // Run migrations
  const knex = app.get('sqliteClient')
  await knex.migrate.latest()

  // Start the server
  const port = app.get('port')
  server = await app.listen(port)

  console.log(`Test server started on port ${port}`)
}

export async function teardown(): Promise<void> {
  // Close database connection first
  const { app } = await import('../src/app.js')
  const knex = app.get('sqliteClient')
  if (knex) {
    await knex.destroy()
    console.log('Database connection closed')
  }

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server!.close((err) => {
        if (err) reject(err)
        else resolve()
      })
    })
    console.log('Test server stopped')
  }

  // Clean up test database file
  const fs = await import('node:fs/promises')
  try {
    await fs.unlink('feathersjs-crud-api-test.sqlite')
    console.log('Test database cleaned up')
  } catch {
    // File may not exist, ignore
  }
}
