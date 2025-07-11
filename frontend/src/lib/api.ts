import { hc } from 'hono/client'
import { ApiRoutes } from '@server/app'
import { queryOptions } from '@tanstack/react-query'
import { type CreateExpense } from '@server/sharedTypes'

const client = hc<ApiRoutes>('/')

export const api = client.api

async function getCurrentUser() {
  const res = await api.me.$get()
  if (!res.ok) {
    throw new Error('server error')
  }
  const data = await res.json()
  return { user: data }
}

export const userQueryOptions = queryOptions({
  queryKey: ['get-current-user'],
  queryFn: getCurrentUser,
  staleTime: Infinity,
})

async function getAllExpenses() {
  const res = await api.expenses.$get()
  if (!res.ok) {
    throw new Error('Server error')
  }
  const data = await res.json()
  return data
}

export const getAllExpensesQueryOptions = queryOptions({
  queryKey: ['expenses'],
  queryFn: getAllExpenses,
  staleTime: 5 * 60 * 1000,
})

export async function createExpense(value: CreateExpense) {
  const res = await api.expenses.$post({ json: value })

  if (!res.ok) {
    throw new Error('Server error')
  }
  const { expense } = await res.json()
  return expense
}

export async function deleteExpense({ id }: { id: number }) {
  const res = await api.expenses[':id{[0-9]+}'].$delete({ param: { id: id.toString() } })

  if (!res.ok) {
    throw new Error('Server error')
  }
}
