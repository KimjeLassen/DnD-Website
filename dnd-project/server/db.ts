// Load environment variables from .env file
import dotenv from 'dotenv'
dotenv.config()

// Database Connection Configuration
// Fill in the environment variables in your .env file

interface DatabaseConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
}

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'cat_king',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
}

// Connection pool (to be implemented with your database client)
// Example: using 'pg' library
import { Pool } from 'pg'
export const pool = new Pool(dbConfig)

export { dbConfig }

// Export placeholder for database query function
export async function query(text: string, params?: unknown[]) {
  try {
     const result = await pool.query(text, params)
     return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Health check
export async function checkConnection(): Promise<boolean> {
  try {
    // Replace with actual health check
     const result = await query('SELECT NOW()')
     return !!result
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}
