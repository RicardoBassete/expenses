import { Button } from '@/components/ui/button'
import { userQueryOptions } from '@/lib/api'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context
    try {
      const data = await queryClient.fetchQuery(userQueryOptions)
      return { user: data }
    } catch {
      return { user: null }
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  if (!user) {
    return <Login />
  }

  return <Outlet />
}

function Login() {
  return (
    <div className="p-2 flex flex-col gap-2">
      You have to log in <br />
      <a href="/api/login">
        <Button variant={'outline'} className="cursor-pointer">
          Login
        </Button>
      </a>
    </div>
  )
}
