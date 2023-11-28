import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { formatEventDate } from '~/utils/utils';
import TeamLogos from '~/components/TeamLogos/TeamLogos';
import { getContestById } from '~/server/contests';
import '../styles/details.css';

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

export default function Details() {
  const { contest } = useLoaderData<typeof loader>();
  const competition = contest?.event?.competitions.at(0);

  if (!contest || !contest.event || !competition) {
    return (
      <>
        <main>
          <h1>Not found</h1>
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
      </div>
    </main>
  );
}
