import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col justify-between items-center gap-3 w-full mx-auto max-w-2xl">
      <button onClick={() => setCount(count => count + 1)}>Up</button>
      <p>count is {count}</p>
      <button onClick={() => setCount(count => count - 1)}>Down</button>
    </div>
  )
}

export default App
