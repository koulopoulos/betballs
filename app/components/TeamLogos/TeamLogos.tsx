import type { Contest } from '~/types/contest';
import { lightenHexColor } from '~/utils/utils';
import './styles.css';

interface TeamLogosProps {
  contest: Contest;
  isWide?: boolean;
}

export default function TeamLogos({ contest, isWide }: TeamLogosProps) {
  const { event } = contest;
  return (
    <div className={`team-logos ${isWide && 'team-logos--wide'}`}>
      {event.competitions.map(competition =>
        competition.competitors.map(competitor => (
          <div
            key={competitor.team.uid}
            className='team-logos__wrapper'
            style={{
              background: `#${lightenHexColor(competitor.team.color, 8)}`,
            }}>
            <div className='team-logos__texture'></div>
            <img
              src={competitor.team.logo}
              alt={competitor.team.name}
              className='team-logos__logo'
            />
          </div>
        )),
      )}
    </div>
  );
}
