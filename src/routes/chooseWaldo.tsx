import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chooseWaldo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/chooseWaldo"!</div>
}
