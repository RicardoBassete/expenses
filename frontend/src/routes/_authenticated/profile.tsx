import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { userQueryOptions } from '@/lib/api'
import { Button } from '@/components/ui/button'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const Route = createFileRoute('/_authenticated/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, error, data } = useQuery(userQueryOptions)

  if (isPending) return 'loading'
  if (error) return 'not logged in'

  return (
    <div className="p-2 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={data.user.picture!} alt={data.user.given_name} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p>
          Hello {data.user.given_name} {data.user.family_name}
        </p>
      </div>

      <a href="/api/logout">
        <Button variant={'outline'} className="cursor-pointer">
          Logout
        </Button>
      </a>
    </div>
  )
}
