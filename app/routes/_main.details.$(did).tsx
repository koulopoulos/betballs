import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react';
import { formatEventDate, getEventTeamNameById } from '~/utils/utils';
import TeamLogos from '~/components/TeamLogos/TeamLogos';
import { getContestById } from '~/server/contests';
import '../styles/details.css';
import BetForm from '~/components/BetForm/BetForm';
import { getSession } from '~/server/auth';
import { createBet } from '~/server/bet';

export async function loader({ params }: LoaderFunctionArgs) {
  const did = params?.did;

  if (!did) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  try {
    const contest = await getContestById(did);
    return json({ contest });
  } catch {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }
}

export async function action({ params, request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const username = session.get('username');

  if (!username) {
    return redirect('/login');
  }

  const did = params?.did;

  if (!did) {
    throw new Response(null, {
      status: 400,
    });
  }

  const body = await request.formData();

  const bet = {
    winnerId: body.get('bet-winner-id'),
    amount: body.get('bet-amount'),
  };

  if (!bet.winnerId || !bet.amount) {
    throw new Response(null, {
      status: 400,
    });
  }

  if (isNaN(Number(bet.amount)) || Number(bet.amount) < 1) {
    throw new Response(null, {
      status: 400,
    });
  }

  try {
    const contest = await getContestById(did);
    await createBet(
      Number(bet.amount),
      bet.winnerId.toString(),
      getEventTeamNameById(bet.winnerId.toString(), contest.event),
      username,
      contest.id,
    );
  } catch {
    throw new Response(null, {
      status: 400,
    });
  }

  return new Response(null, {
    status: 200,
  });
}

export default function Details() {
  const { contest } = useLoaderData<typeof loader>();
  const competition = contest?.event?.competitions.at(0);

  if (!contest || !contest.event || !competition) {
    return (
      <>
        <main className='details__wrapper'>
          <div className='details__content'>
            <h1 className='details__title'>Not found</h1>
          </div>
        </main>
      </>
    );
  }

  const { event } = contest;

  return (
    <main className='details__wrapper'>
      <TeamLogos contest={contest} isWide />
      <div className='details__content'>
        <div className='details__header'>
          <h3 className='details__date'>{formatEventDate(event.date)}</h3>
          <h1 className='details__title'>{event.name}</h1>
          <div className='details__records'>
            {competition.competitors.map(competitor => (
              <h4
                key={competitor.team.uid}
                className='details__record-chip'
                style={{ background: `#${competitor.team.color}` }}>{`${
                competitor.team.shortDisplayName
              } (${competitor.records.find(r => r.name === 'overall')?.summary || '?-?'})`}</h4>
            ))}
          </div>
          {/* <span>{`Total participants: ${contest.participants.length}`}</span> */}
        </div>
        <hr className='details__divider' />
        <BetForm contest={contest} />
        <hr className='details__divider' />
        <table className='table table-striped'>
          <thead>
            <tr className='fw-bold'>
              <th scope='col'>User</th>
              <th scope='col'>Team</th>
              <th scope='col' className='text-end'>
                Wager
              </th>
            </tr>
          </thead>
          <tbody>
            {contest.bets.map((bet, i) => (
              <tr key={bet.uid}>
                <td className='text-nowrap'>
                  <Link to={`/profile/${bet.user.username}`}>{bet.user.username}</Link>
                </td>
                <td className='text-nowrap'>{bet.winner.name}</td>
                <td className='text-end text-nowrap'>${bet.amount}.00</td>
              </tr>
            ))}
            {contest.bets.length === 0 && (
              <tr>
                <td className='text-nowrap'>—</td>
                <td className='text-nowrap'>—</td>
                <td className='text-end text-nowrap'>—</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <main className='details__wrapper'>
      <div className='details__content'>
        <h1 className='details__title'>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
            ? error.message
            : 'Unknown Error'}
        </h1>
      </div>
    </main>
  );
}
