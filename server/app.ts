import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/bun'

import { expensesRoute } from './routes/expenses'

const app = new Hono()
app.use('*', logger())

const apiRoutes = app.basePath('/api').route('/expenses', expensesRoute)

//                                ↓ this path starts in the root directory
app.get('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

export type ApiRoutes = typeof apiRoutes

export default app
