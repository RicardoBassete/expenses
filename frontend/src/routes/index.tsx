import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

async function getTotalSpent() {
  const res = await api.expenses['total-spent'].$get()
  if (!res.ok) {
    throw new Error('Server error')
  }
  const data = await res.json()
  return data
}

function App() {
  const { isPending, error, data } = useQuery({ queryKey: ['total-spent'], queryFn: getTotalSpent })

  if (error) return 'An error has occurred: ' + error.message

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total amount spent</CardDescription>
      </CardHeader>
      <CardContent>{isPending ? '...' : data?.total}</CardContent>
    </Card>
  )
}

export const Route = createFileRoute('/')({
  component: App,
})
