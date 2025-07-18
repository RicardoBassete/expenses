import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteExpense, getAllExpensesQueryOptions } from '@/lib/api'
import { useCreateExpenseStatus } from '@/context/create-expense-status'
import { Button } from '@/components/ui/button'
import { TrashIcon } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

function SkeletonTableRow() {
  return Array(3)
    .fill(0)
    .map((_, i) => {
      return (
        <TableRow key={i}>
          <TableCell className="font-medium">
            <Skeleton className="h-6" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6" />
          </TableCell>
        </TableRow>
      )
    })
}

function Expenses() {
  const { isPending, error, data } = useQuery(getAllExpensesQueryOptions)
  const createExpenseStatus = useCreateExpenseStatus()

  if (error) return 'An error has occurred: ' + error.message

  return (
    <Table>
      <TableCaption>A list of all your expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {createExpenseStatus.newExpense && (
          <TableRow>
            <TableCell className="font-medium">
              <Skeleton className="h-6" />
            </TableCell>
            <TableCell>{createExpenseStatus.newExpense?.title}</TableCell>
            <TableCell>{createExpenseStatus.newExpense?.amount}</TableCell>
            <TableCell>{createExpenseStatus.newExpense?.date.split('T')[0].split('-').reverse().join('-')}</TableCell>
            <TableCell>
              <Skeleton className="h-6" />
            </TableCell>
          </TableRow>
        )}
        {isPending ? (
          <SkeletonTableRow />
        ) : (
          data?.expenses.map(expense => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.id}</TableCell>
              <TableCell>{expense.title}</TableCell>
              <TableCell>{expense.amount}</TableCell>
              <TableCell>{expense.date.split('-').reverse().join('-')}</TableCell>
              <TableCell>
                <DeleteButton id={expense.id} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

function DeleteButton({ id }: { id: number }) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast('ERROR', {
        description: 'Failed to delete expense',
      })
    },
    onSuccess: () => {
      toast('Expense deleated')

      queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, existingExpenses => ({
        ...existingExpenses,
        expenses: existingExpenses!.expenses.filter(e => e.id !== id),
      }))
    },
  })

  return (
    <Button
      variant={'destructive'}
      className="cursor-pointer"
      onClick={() => mutation.mutate({ id })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? '...' : <TrashIcon className="h-4 w-4" />}
    </Button>
  )
}
