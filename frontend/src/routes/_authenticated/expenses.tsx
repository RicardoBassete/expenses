import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

async function getAllExpenses() {
  const res = await api.expenses.$get()
  if (!res.ok) {
    throw new Error('Server error')
  }
  const data = await res.json()
  return data
}

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
        </TableRow>
      )
    })
}

function Expenses() {
  const { isPending, error, data } = useQuery({ queryKey: ['expenses'], queryFn: getAllExpenses })

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
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending ? (
          <SkeletonTableRow />
        ) : (
          data?.expenses.map(expense => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.id}</TableCell>
              <TableCell>{expense.title}</TableCell>
              <TableCell>{expense.amount}</TableCell>
              <TableCell>{expense.date.split('-').reverse().join('-')}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
