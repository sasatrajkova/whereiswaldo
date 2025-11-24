import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/createAvatar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/createAvatar"!</div>
}
