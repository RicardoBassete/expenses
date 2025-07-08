import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { getUser } from '../kinde'

import { db } from '../db'
import { expenses as expensesTable } from '../db/schema/expenses'
import { and, desc, eq, sum } from 'drizzle-orm'

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.string(),
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({ id: true })

export const expensesRoute = new Hono()
  .get('/', getUser, async c => {
    const user = c.var.user

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100)

    return c.json({ expenses: expenses })
  })
  .get('/total-spent', getUser, async c => {
    const user = c.var.user

    const result = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then(res => res[0])

    return c.json({ total: result?.total })
  })
  .get('/:id{[0-9]+}', getUser, async c => {
    const id = parseInt(c.req.param('id'))
    const user = c.var.user

    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .limit(1)
      .then(res => res[0])

    if (!expense) {
      return c.notFound()
    }

    return c.json({ expense: expense })
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
    const user = c.var.user

    const expense = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .returning()
      .then(res => res[0])

    if (!expense) {
      return c.notFound()
    }

    return c.json({ expense: expense })
  })
