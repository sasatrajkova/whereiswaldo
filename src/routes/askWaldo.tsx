import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';
import questions from '../database/questions.json';

export const Route = createFileRoute('/askWaldo')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Link to="/myWaldos">
        <Button>My Waldos</Button>
      </Link>
    </>
  );
}

const getQuestion = async () => {
  return questions[Math.floor(Math.random() * questions.length)];
}