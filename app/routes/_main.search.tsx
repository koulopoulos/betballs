import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';
import ContestCard from '~/components/ContestCard/ContestCard';
import { getContestsByDate } from '~/server/contests';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const date = url.searchParams.get('criteria');

  if (!date) {
    return json({ contests: null });
  }

  const contests = await getContestsByDate(date);

  return json({ contests });
}

export default function Search() {
  const { contests } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const criteria = searchParams.get('criteria');
  const searchDatetime = criteria || new Date().toISOString().slice(0, -8);

  return (
    <main>
      <h1>Contest Search</h1>
      <form>
        <label htmlFor='search-input' />
        <input
          type='datetime-local'
          id='search-input'
          name='criteria'
          defaultValue={searchDatetime}
        />
        <input type='submit' value='Search' />
      </form>
      <ul>
        {criteria &&
          contests &&
          contests.length > 0 &&
          contests.map(
            contest =>
              contest.event && (
                <li key={contest.uid}>
                  <Link to={`/details/${contest.uid}`}>
                    <ContestCard contest={contest} />
                  </Link>
                </li>
              ),
          )}
        {criteria && contests && contests.length === 0 && <li>No contests found</li>}
      </ul>
    </main>
  );
}
