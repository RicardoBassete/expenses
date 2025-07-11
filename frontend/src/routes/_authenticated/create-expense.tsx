import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { createExpense, getAllExpensesQueryOptions } from '@/lib/api'

import { createExpenseSchema } from '@server/sharedTypes'
import { Calendar } from '@/components/ui/calendar'

import { useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      title: '',
      amount: '0',
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const existingExpenses = await queryClient.ensureQueryData(getAllExpensesQueryOptions)

      navigate({ to: '/expenses' })

      const newExpense = await createExpense(value)

      queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, {
        ...existingExpenses,
        expenses: [newExpense, ...existingExpenses.expenses],
      })
    },
  })

  return (
    <div>
      <h2>Create Expense</h2>
      <form
        action=""
        method="POST"
        className="mt-4 flex flex-col gap-y-4"
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Field
          name="title"
          validators={{
            onChange: createExpenseSchema.shape.title,
          }}
          children={field => (
            <div>
              <Label className="mt-4 mb-2 ml-1" htmlFor={field.name}>
                Title
              </Label>
              <Input
                type="text"
                id={field.name}
                name={field.name}
                placeholder="Title..."
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                <em>{field.state.meta.errors.map(e => e?.message)}</em>
              ) : null}
            </div>
          )}
        />
        <form.Field
          name="amount"
          validators={{
            onChange: createExpenseSchema.shape.amount,
          }}
          children={field => (
            <div>
              <Label className="mt-4 mb-2 ml-1" htmlFor={field.name}>
                Amount
              </Label>
              <Input
                type="number"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                <em>{field.state.meta.errors.map(e => e?.message)}</em>
              ) : null}
            </div>
          )}
        />
        <form.Field
          name="date"
          validators={{
            onChange: createExpenseSchema.shape.date,
          }}
          children={field => (
            <div className="self-start">
              <Label className="mt-4 mb-2 ml-1" htmlFor={field.name}>
                Date
              </Label>
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={date => field.handleChange(date ? date.toISOString() : new Date().toISOString())}
                className="rounded-md border"
              />
            </div>
          )}
        />
        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button className="mt-4" type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Create Expense'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}
