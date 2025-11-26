import { Button } from '@/components/ui/button';
import { getAnswersForUser, getUser, User } from '@/database/database';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { WordCloud } from '@isoterik/react-word-cloud';

export const Route = createFileRoute('/exploreWaldo')({
  component: RouteComponent,
  validateSearch: (search) => ({
    id: search.id ?? '',
  }),
});

function RouteComponent() {
  const { id } = Route.useSearch();
  const [waldo, setWaldo] = useState<User>();
  const [words, setWords] = useState<{ text: string; value: number }[]>([]);

  useEffect(() => {
    getUser(id as string).then((response) =>
      response ? setWaldo(response) : null
    );
    getAnswersForUser(id as string).then((res) => setWords(res));
  }, []);

  return (
    <>
      <h1>{waldo?.name}</h1>
      <img src={waldo?.imageBase64} />
      <WordCloud words={words} width={300} height={200} />
      <Link to="/chooseWaldo" className="w-full">
        <Button className="w-full">Find the next Waldo</Button>
      </Link>
    </>
  );
}
