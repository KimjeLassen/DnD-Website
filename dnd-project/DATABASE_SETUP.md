# Database Configuration

This project requires a PostgreSQL database. Follow these steps to configure:

## 1. Environment Variables

Create a `.env` file in the root of the `dnd-project` folder with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dnd_website
DB_USER=postgres
DB_PASSWORD=your_secure_password
NODE_ENV=development
PORT=3001
```

## 2. Install Database Client

Choose one of the following PostgreSQL clients:

### Option A: Using `pg` (node-postgres) - Recommended for this project
```bash
npm install pg
npm install --save-dev @types/pg
```

### Option B: Using `postgres`
```bash
npm install postgres
```

### Option C: Using Prisma (ORM)
```bash
npm install @prisma/client
npm install --save-dev prisma
npx prisma init
```

## 3. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE dnd_website;
```

2. Run the schema:
```bash
psql -U postgres -d dnd_website -f schema.sql
```

## 4. Update db.ts

After installing your chosen database client, uncomment and update the appropriate section in `server/db.ts`:

### For `pg` library:
```typescript
import { Pool } from 'pg'
export const pool = new Pool(dbConfig)

export async function query(text: string, params?: unknown[]) {
  return await pool.query(text, params)
}

export async function checkConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT NOW()')
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}
```

### For `postgres` library:
```typescript
import postgres from 'postgres'
const sql = postgres(dbConfig)
export { sql }

export async function query(text: string, params?: unknown[]) {
  return await sql.unsafe(text, params)
}
```

## 5. Verify Connection

Run your server and check if the connection is successful:
```bash
npm run dev
```

The API should start at `http://localhost:3001`
