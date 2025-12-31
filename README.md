# FeathersJS CRUD API

A minimal CRUD API built with Feathers v5 (Dove), Koa, Knex, and SQLite. It exposes a single `todo` service over REST and WebSockets with validation using TypeBox.

## Features

- Simple `todo` CRUD: `find`, `get`, `create`, `patch`, `remove`
- REST over Koa and real-time via Socket.io
- SQLite database managed with Knex migrations
- Schema validation and typed models with TypeBox
- Config-driven setup with environment overrides

## Requirements

- Node.js >= 18.13.0
- npm

## Quick Start

```bash
# Install dependencies
npm install

# Compile TypeScript to lib/
npm run compile

# Run database migrations (creates SQLite file at project root)
npm run migrate

# Start the server (listens on http://localhost:3030)
npm start
```

For live development with auto-reload:

```bash
npm run dev
```

## Configuration

- Default config: [config/default.json](config/default.json)
    - `port`: 3030
    - `public`: `./public/`
    - `origins`: CORS origins
    - `paginate`: default and max page sizes
    - `sqlite`: Knex configuration; SQLite file: `feathersjs-crud-api.sqlite`
- Environment overrides: [config/custom-environment-variables.json](config/custom-environment-variables.json)
    - `PORT`, `HOSTNAME`, `FEATHERS_SECRET`

## Data Model

`todo` entries follow this schema (see [src/services/todo/todo.schema.ts](src/services/todo/todo.schema.ts)):

```ts
{
    id: number,
    task: string,
    isDone: boolean
}
```

## API Reference

- Base URL: `http://localhost:3030`
- Service path: `/todo`
- Methods: `find`, `get`, `create`, `patch`, `remove`

### List todos

```bash
curl -s "http://localhost:3030/todo"
```

Query helpers (Feathers query syntax): `$limit`, `$skip`, `$sort[field]`, `$select[]`, `$or`, `$and`, and direct field filters like `isDone=true`.

Examples:

```bash
# Only done tasks
curl -s "http://localhost:3030/todo?isDone=true"

# Sort by task ascending
curl -s "http://localhost:3030/todo?$sort[task]=1"
```

### Get a todo by id

```bash
curl -s "http://localhost:3030/todo/1"
```

### Create a todo

```bash
curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"task":"Buy milk","isDone":false}' \
    "http://localhost:3030/todo"
```

### Patch a todo

```bash
curl -s -X PATCH \
    -H "Content-Type: application/json" \
    -d '{"isDone":true}' \
    "http://localhost:3030/todo/1"
```

### Remove a todo

```bash
curl -s -X DELETE "http://localhost:3030/todo/1"
```
## Database & Migrations

- SQLite file: `feathersjs-crud-api.sqlite` (created at project root)
- Migration creates table `todo` with columns: `id` (auto‑increment), `task` (string), `isDone` (boolean)
- Migrate up: `npm run migrate`
- Create a new migration: `npm run migrate:make`

See [migrations/20230312224403_todo.ts](migrations/20230312224403_todo.ts).

## Project Structure

```
src/
    app.ts           # Feathers app, transports (REST/WebSockets), Koa middlewares
    services/
        todo/
            todo.ts      # Service registration, hooks
            todo.class.ts# Knex service adapter options
            todo.schema.ts# TypeBox schemas & validators
config/            # App configuration and env mapping
migrations/        # Knex migrations (SQLite)
public/            # Static assets
```

## Scripts

- `dev`: Run with ts-node + nodemon
- `compile`: Build TypeScript to `lib/`
- `start`: Run compiled server
- `migrate`: Apply latest Knex migrations
- `migrate:make`: Create a new migration file
- `prettier`: Format TypeScript sources

## Insomnia Collection

An Insomnia export is provided: [Insomnia.json](Insomnia.json)

Import in Insomnia: `Application` → `Preferences` → `Data` → `Import Data` → `From File` → select `Insomnia.json`.

## Troubleshooting

- Delete the SQLite file to reset local data: `rm feathersjs-crud-api.sqlite`
- Ensure the Node version satisfies `>= 18.13.0`
- If port conflicts occur, set `PORT` env var: `PORT=4000 npm start`

## Resources

- Feathers docs: https://feathersjs.com/
- Feathers v5 (Dove) guides: https://dove.feathersjs.com/

## License

This project is licensed under the terms specified in [LICENSE](LICENSE).
