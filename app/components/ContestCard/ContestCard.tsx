import type { Contest } from '~/types/contest';
import { formatEventDate } from '~/utils/utils';
import TeamLogos from '../TeamLogos/TeamLogos';
import './styles.css';

interface ContestCardProps {
  contest: Contest;
}

export default function ContestCard({ contest }: ContestCardProps) {
  const { event } = contest;
  return (
    <div className='contest-card'>
      <div className='contest-card__header'>
        <TeamLogos contest={contest} />
      </div>
      <div className='contest-card__content'>
        <span className='contest-card__date'>{formatEventDate(event.date)}</span>
        <h3 className='contest-card__title'>{event.name}</h3>
      </div>
    </div>
  );
}
