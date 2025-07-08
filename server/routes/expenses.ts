import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { getUser } from '../kinde'

import { db } from '../db'
import { expenses as expensesTable } from '../db/schema/expenses'
import { eq } from 'drizzle-orm'

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.string(),
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({ id: true })

const fakeExpenses: Expense[] = [
  { id: 1, title: 'Coffee', amount: '50' },
  { id: 2, title: 'Lunch', amount: '120' },
  { id: 3, title: 'Grocery Shopping', amount: '250' },
]

export const expensesRoute = new Hono()
  .get('/', getUser, async c => {
    const user = c.var.user

    const expenses = await db.select().from(expensesTable).where(eq(expensesTable.userId, user.id))

    return c.json({ expenses: expenses })
  })
  .get('/total-spent', getUser, async c => {
    const total = fakeExpenses.reduce((accumulator, expense) => accumulator + Number(expense.amount), 0)
    return c.json({ total })
  })
  .get('/:id{[0-9]+}', getUser, async c => {
    const id = parseInt(c.req.param('id'))
    const expense = fakeExpenses.find(e => e.id === id)

    if (!expense) {
      return c.notFound()
    }

    return c.json({ expense })
  })
  .post('/', zValidator('json', createPostSchema), getUser, async c => {
    const expense = c.req.valid('json')
    const user = c.var.user

    const result = await db
      .insert(expensesTable)
      .values({
        title: expense.title,
        amount: expense.amount,
        userId: user.id,
      })
      .returning()

    return c.json({ expense: result })
  })
  .delete('/:id{[0-9]+}', getUser, async c => {
    const id = parseInt(c.req.param('id'))
    const index = fakeExpenses.findIndex(e => e.id === id)

    if (index === -1) {
      return c.notFound()
    }

    const removedExpense = fakeExpenses.splice(index, 1)[0]

    return c.json({ expense: removedExpense })
  })
