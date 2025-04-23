import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Button } from '@/components/ui/button'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
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
        <Link to="/about" className="[&.active]:font-bold">
          <Button variant={'outline'} className="cursor-pointer">
            About
          </Button>
        </Link>
      </div>
      <hr />
      <div className="p-2 max-w-3xl mx-auto">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})
