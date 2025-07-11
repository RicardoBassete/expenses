import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { RouterProvider, createRouter } from '@tanstack/react-router'

const queryClient = new QueryClient()

import { routeTree } from './routeTree.gen' // Import the generated route tree
import { CreateExpenseStatusProvider } from './context/create-expense-status'

const router = createRouter({ routeTree, context: { queryClient } }) // Create a new router instance

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CreateExpenseStatusProvider>
        <RouterProvider router={router} />
      </CreateExpenseStatusProvider>
    </QueryClientProvider>
  </StrictMode>,
)
