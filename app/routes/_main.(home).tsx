import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import { getSession } from '~/server/auth';
import type { MainOutletContext } from './_main';
import { getContestsByDate, getUserContests } from '~/server/contests';
import '../styles/home.css';
import ContestList from '~/components/ContestList/ContestList';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const username = session.get('username');

  if (!username) {
    const contests = await getContestsByDate(new Date().toDateString());
    return json({ contests });
  }

  try {
    const contests = await getUserContests(username);
    return json({ contests });
  } catch {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }
}

export default function Home() {
  const { isLoggedIn } = useOutletContext<MainOutletContext>();
  const { contests } = useLoaderData<typeof loader>();

  return (
    <main className='main__wrapper'>
      <h1 className='main__title'>{isLoggedIn ? 'Your Contests' : 'Featured Contests'}</h1>
      <hr className='main__divider' />
      <ContestList contests={contests} />
    </main>
  );
}
