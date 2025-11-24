import SplashScreen from '@/components/Splashscreen';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SplashScreen />;
}
