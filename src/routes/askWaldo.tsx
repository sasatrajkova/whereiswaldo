import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import questions from '../database/questions.json';
import { useState, useEffect, type FormEvent } from 'react';
import { submitAnswer } from '@/database/database';
import { getUser, type User } from '@/database/database';
import Confetti from 'react-confetti';

export const Route = createFileRoute('/askWaldo')({
  component: RouteComponent,
  validateSearch: (search) => ({
    id: search.id ?? '',
  }),
});

function RouteComponent() {
  const { id } = Route.useSearch();
  const [answer, setAnswer] = useState<string>('');
  const [question] = useState(() => getQuestion());
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser(id as string).then((response) =>
      response ? setUser(response) : null
    );
  }, []);

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(id, answer.trim());

    submitAnswer(id as string, [answer]);

    navigate({ to: '/myWaldos' });
  }

  return (
    <>
      <Confetti className="w-full h-4/7" />
      <form
        onSubmit={(e) => handleFormSubmit(e)}
        className="flex flex-col gap-3 w-full"
      >
        <img src={user?.imageBase64} className="object-cover" />
        <h1>{question}</h1>
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

const getQuestion = () => {
  return questions[Math.floor(Math.random() * questions.length)];
};
