import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import { getSession } from '~/server/auth';
import type { MainOutletContext } from './_main';
import { getContestsByDate, getContestsByUser } from '~/server/contests';
import '../styles/home.css';
import ContestList from '~/components/ContestList/ContestList';
import { sortContestsByDate } from '~/utils/utils';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const username = session.get('username');

  if (!username) {
    const contests = await getContestsByDate(new Date().toDateString());
    return json({ contests: sortContestsByDate(contests) });
  }

  try {
    const contests = await getContestsByUser(username);
    return json({
      contests: sortContestsByDate(contests),
    });
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
      <div className='main__hero'>
        <div className='main__hero-texture'></div>
        <img src='logo.png' alt='BetBalls' className='main__hero-logo' />
        <h1 className='main__hero-title'>The ultimate sports betting operator.</h1>
      </div>
      <div className='main__content'>
        <h2 className='main__title'>{isLoggedIn ? 'Your active contests' : 'Featured contests'}</h2>
        <hr className='main__divider' />
        <ContestList contests={contests} />
      </div>
    </main>
  );
}
