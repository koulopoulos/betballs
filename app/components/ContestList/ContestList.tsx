import { Link } from '@remix-run/react';
import type { Contest } from '~/types/contest';
import ContestCard from '~/components/ContestCard/ContestCard';
import './styles.css';

interface ContestListProps {
  contests: Contest[];
}

export default function ContestList({ contests }: ContestListProps) {
  return (
    <ul className='contest-list'>
      {contests.map(
        contest =>
          contest.event && (
            <li key={contest.uid} className='contest-list__item'>
              <Link to={`/details/${contest.uid}`}>
                <ContestCard key={contest.uid} contest={contest} />
              </Link>
            </li>
          ),
      )}
    </ul>
  );
}
