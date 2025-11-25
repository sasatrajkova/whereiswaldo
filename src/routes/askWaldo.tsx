import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import questions from '../database/questions.json';
import { useState, type FormEvent } from 'react';

export const Route = createFileRoute('/askWaldo')({
  component: RouteComponent,
});

function RouteComponent() {
  const [answer, setAnswer] = useState<string>('');
  const navigate = useNavigate();

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(answer.trim());

    setAnswer('');

    navigate({ to: '/myWaldos' });
  }

  return (
    <>
      <form
        onSubmit={(e) => handleFormSubmit(e)}
        className="flex flex-col gap-3 w-full px-8"
      >
        <img src="https://picsum.photos/200" className="object-cover" />
        <h1>What is your name?</h1>
        <Input
          type="text"
          placeholder="Add your answer in here"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Button type="submit" disabled={!answer} className="w-full">
          Submit
        </Button>
      </form>
    </>
  );
}

const getQuestion = async () => {
  return questions[Math.floor(Math.random() * questions.length)];
};
