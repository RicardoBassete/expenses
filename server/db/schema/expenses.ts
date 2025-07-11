import { date, index, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod/v4'

export const expenses = pgTable(
  'expenses',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    date: date('date').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  expenses => {
    return {
      userIdIndex: index('user_id_idx').on(expenses.userId),
    }
  },
)

/** Schema for creating a new expense*/
export const insertExpenseSchema = createInsertSchema(expenses, {
  title: z.string().min(3, 'Title must be at least 3 characters'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid monetary value'),
}).omit({ id: true, userId: true, createdAt: true })
