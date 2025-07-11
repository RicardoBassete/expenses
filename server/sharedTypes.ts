import { z } from 'zod'

import { insertExpenseSchema } from './db/schema/expenses'

export const createExpenseSchema = insertExpenseSchema

export type CreateExpense = z.infer<typeof createExpenseSchema>
