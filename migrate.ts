import postgres from 'postgres'
import { env } from './server/env'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'

const migrationClient = postgres(env.DATABASE_URL, { max: 1 })
await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' })
console.log('Migration complete')
