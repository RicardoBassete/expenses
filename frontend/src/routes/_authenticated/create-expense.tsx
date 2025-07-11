import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { api } from '@/lib/api'

import { createExpenseSchema } from '@server/sharedTypes'

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      title: '',
      amount: '0',
    },
    onSubmit: async ({ value }) => {
      const res = await api.expenses.$post({ json: value })
      if (!res.ok) {
        throw new Error('Server error')
      }
      navigate({ to: '/expenses' })
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
