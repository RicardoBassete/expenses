import { useState } from 'react'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col justify-center items-center gap-3 mx-auto max-w-2xl h-screen w-screen">
      <Button onClick={() => setCount(count => count + 1)}>Up</Button>
      <p>count is {count}</p>
      <Button onClick={() => setCount(count => count - 1)}>Down</Button>
    </div>
  )
}

export default App
