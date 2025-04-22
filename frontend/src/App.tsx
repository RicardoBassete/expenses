import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'

function App() {
  const [totalSpent, setTotalSpent] = useState(0)

  useEffect(() => {
    fetch('/api/expenses/total-spent')
      .then(res => res.json())
      .then(data => setTotalSpent(data.total))
  }, [])

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total amount spent</CardDescription>
      </CardHeader>
      <CardContent>{totalSpent}</CardContent>
    </Card>
  )
}

export default App
