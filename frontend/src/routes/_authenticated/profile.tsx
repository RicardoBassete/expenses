import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { userQueryOptions } from '@/lib/api'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, error, data } = useQuery(userQueryOptions)

  if (isPending) return 'loading'
  if (error) return 'not logged in'

  return (
    <div className="p-2 flex flex-col gap-2">
      <p>
        Hello {data.given_name} {data.family_name}
      </p>
      <a href="/api/logout">
        <Button variant={'outline'} className="cursor-pointer">
          Logout
        </Button>
      </a>
    </div>
  )
}
