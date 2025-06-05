import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Button } from '@/components/ui/button'
import { type QueryClient } from '@tanstack/react-query'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <div className="p-2 flex gap-2 max-w-2xl m-auto">
        <Link to="/" className="[&.active]:font-bold">
          <Button variant={'outline'} className="cursor-pointer">
            Home
          </Button>
        </Link>{' '}
        <Link to="/expenses" className="[&.active]:font-bold">
          <Button variant={'outline'} className="cursor-pointer">
            Expenses
          </Button>
        </Link>
        <Link to="/create-expense" className="[&.active]:font-bold">
          <Button variant={'outline'} className="cursor-pointer">
            Create Expense
          </Button>
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          <Button variant={'outline'} className="cursor-pointer">
            Profile
          </Button>
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          <Button variant={'outline'} className="cursor-pointer">
            About
          </Button>
        </Link>
      </div>
      <hr />
      <div className="p-2 max-w-2xl m-auto">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})
