import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import ContestList from '~/components/ContestList/ContestList';
import { getContestsByDate } from '~/server/contests';
import '../styles/search.css';
import { sortContestsByDate } from '~/utils/utils';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const date = url.searchParams.get('criteria');

  if (!date) {
    return json({ contests: null });
  }

  const contests = await getContestsByDate(date);

  return json({
    contests: sortContestsByDate(contests),
  });
}

export default function Search() {
  const { contests } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const criteria = searchParams.get('criteria');
  const searchDatetime = criteria || new Date().toISOString().slice(0, -8);

  return (
    <main className='search__wrapper'>
      <h1 className='search__title'>Contest search</h1>
      <hr className='search__divider' />
      <form className='search__form d-flex gap-1'>
        <div className='form-group w-100'>
          <input
            type='datetime-local'
            id='search-input'
            name='criteria'
            defaultValue={searchDatetime}
            className='form-control'
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Search
        </button>
      </form>
      {criteria &&
        contests &&
        (contests.length > 0 ? (
          <ContestList contests={contests} />
        ) : (
          <span>No contests found</span>
        ))}
    </main>
  );
}
