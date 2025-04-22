import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({ id: true })

const fakeExpenses: Expense[] = [
  { id: 1, title: 'Coffee', amount: 50 },
  { id: 2, title: 'Lunch', amount: 120 },
  { id: 3, title: 'Grocery Shopping', amount: 250 },
]

export const expensesRoute = new Hono()
  .get('/', async c => {
    return c.json({ expenses: fakeExpenses })
  })
  .get('/total-spent', async c => {
    const total = fakeExpenses.reduce((accumulator, expense) => accumulator + expense.amount, 0)
    return c.json({ total })
  })
  .get('/:id{[0-9]+}', async c => {
    const id = parseInt(c.req.param('id'))
    const expense = fakeExpenses.find(e => e.id === id)

    if (!expense) {
      return c.notFound()
    }

    return c.json({ expense })
  })
  .post('/', zValidator('json', createPostSchema), async c => {
    const expense = c.req.valid('json')
    const newExpense = { ...expense, id: fakeExpenses.length + 1 }
    fakeExpenses.push(newExpense)
    return c.json({ expense: newExpense })
  })
  .delete('/:id{[0-9]+}', async c => {
    const id = parseInt(c.req.param('id'))
    const index = fakeExpenses.findIndex(e => e.id === id)

    if (index === -1) {
      return c.notFound()
    }

    const removedExpense = fakeExpenses.splice(index, 1)[0]

    return c.json({ expense: removedExpense })
  })
