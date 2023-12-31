import { Contest } from '~/types/contest';
import { NFLScoreboardEvent } from '~/types/events';

export function formatEventDate(date: string) {
  const d = new Date(date);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  return formatter.format(d);
}

/**
 * https://gist.github.com/renancouto/4675192
 */
export function lightenHexColor(color: string, percent: number) {
  const num = parseInt(color, 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt;

  return (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
    (G < 255 ? (G < 1 ? 0 : G) : 255)
  )
    .toString(16)
    .slice(1);
}

export function getEventTeamNameById(id: string, event: NFLScoreboardEvent) {
  const competitors = event.competitions.at(0)?.competitors;
  const competitor = competitors?.find(competitor => competitor.team.id === id);
  const name = competitor?.team.displayName;
  if (!name) {
    throw new Error();
  }
  return name;
}

export function sortContestsByDate(contests: Contest[]) {
  return contests.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
