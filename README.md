# FeathersJS CRUD API

A minimal CRUD API built with Feathers v5 (Dove), Koa, Knex, and SQLite. It exposes a single `todo` service over REST and WebSockets with validation using TypeBox.

## Features

- Simple `todo` CRUD: `find`, `get`, `create`, `patch`, `remove`
- REST over Koa and real-time via Socket.io
- SQLite database managed with Knex migrations
- Schema validation and typed models with TypeBox
- Interactive API documentation with Scalar
- Config-driven setup with environment overrides
- Biome for linting and formatting

## Requirements

- Node.js >= 18.13.0
- npm

## Quick Start

```bash
# Install dependencies
npm install

# Run database migrations (creates SQLite file at project root)
npm run migrate

# Start development server with auto-reload
npm run dev
```

Open http://localhost:3030/docs/ for interactive API documentation.

For production:

```bash
# Compile TypeScript to lib/
npm run compile

# Start the server
npm start
```

## API Documentation

Interactive API documentation is available at **http://localhost:3030/docs/** powered by [Scalar](https://scalar.com/).

Features:
- Test requests directly from the browser
- Code samples in multiple languages
- Dark/light mode toggle
- Request/response examples

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
curl "http://localhost:3030/todo"
```

Query helpers (Feathers query syntax): `$limit`, `$skip`, `$sort[field]`, `$select[]`, `$or`, `$and`, and direct field filters like `isDone=true`.

Examples:

```bash
# Only done tasks
curl "http://localhost:3030/todo?isDone=true"

# Sort by task ascending
curl "http://localhost:3030/todo?\$sort[task]=1"
```

### Get a todo by id

```bash
curl "http://localhost:3030/todo/1"
```

### Create a todo

```bash
curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"task":"Buy milk","isDone":false}' \
    "http://localhost:3030/todo"
```

### Patch a todo

```bash
curl -X PATCH \
    -H "Content-Type: application/json" \
    -d '{"isDone":true}' \
    "http://localhost:3030/todo/1"
```

### Remove a todo

```bash
curl -X DELETE "http://localhost:3030/todo/1"
```

## Database & Migrations

- SQLite file: `feathersjs-crud-api.sqlite` (created at project root)
- Migration creates table `todo` with columns: `id` (auto-increment), `task` (string), `isDone` (boolean)
- Migrate up: `npm run migrate`
- Create a new migration: `npm run migrate:make`

See [migrations/20230312224403_todo.ts](migrations/20230312224403_todo.ts).

## Project Structure

```
src/
    app.ts              # Feathers app, transports (REST/WebSockets), Koa middlewares
    declarations.ts     # TypeScript type definitions
    services/
        todo/
            todo.ts         # Service registration, hooks
            todo.class.ts   # Knex service adapter options
            todo.schema.ts  # TypeBox schemas & validators
config/                 # App configuration and env mapping
migrations/             # Knex migrations (SQLite)
public/
    docs/
        index.html      # Scalar API documentation
        openapi.json    # OpenAPI 3.0 specification
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run with ts-node + nodemon (auto-reload) |
| `npm run compile` | Build TypeScript to `lib/` |
| `npm start` | Run compiled server |
| `npm run migrate` | Apply latest Knex migrations |
| `npm run migrate:make` | Create a new migration file |
| `npm run format` | Format code with Biome |
| `npm run lint` | Lint code with Biome |
| `npm run check` | Format, lint, and organize imports |

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. Configuration is in [biome.json](biome.json).

```bash
# Check and fix all issues
npm run check

# Format only
npm run format

# Lint only
npm run lint
```

## Troubleshooting

- **Port in use**: Kill existing process with `npx kill-port 3030` or set `PORT` env var: `PORT=4000 npm run dev`
- **Reset database**: Delete the SQLite file: `rm feathersjs-crud-api.sqlite` and run `npm run migrate`
- **Node version**: Ensure Node.js >= 18.13.0

## Tech Stack

- **Framework**: [FeathersJS v5](https://feathersjs.com/) (Dove)
- **Server**: [Koa](https://koajs.com/)
- **Database**: SQLite with [Knex](https://knexjs.org/)
- **Validation**: [TypeBox](https://github.com/sinclairzx81/typebox)
- **Real-time**: [Socket.io](https://socket.io/)
- **API Docs**: [Scalar](https://scalar.com/)
- **Linting**: [Biome](https://biomejs.dev/)

## Resources

- Feathers docs: https://feathersjs.com/
- Feathers v5 (Dove) guides: https://dove.feathersjs.com/
- Scalar docs: https://scalar.com/
- Biome docs: https://biomejs.dev/

## License

This project is licensed under the terms specified in [LICENSE](LICENSE).
