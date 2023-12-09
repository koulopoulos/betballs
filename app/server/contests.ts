import type { Contest } from '~/types/contest';
import { getEventsById } from './events';
import * as db from './database/controllers/contest';

export async function getContestById(id: string): Promise<Contest> {
  const contest = await db.getContest(id);
  const events = await getEventsById([contest.id]);

  if (!events || events?.length === 0) {
    throw new Error('Event not found');
  }

  return {
    id: contest.id,
    name: contest.name,
    date: contest.date.toString(),
    bets: contest.bets.map(bet => ({
      uid: bet.uid,
      amount: bet.amount,
      winner: bet.winner,
      user: bet.user,
      contest: { ...bet.contest, date: contest.date.toString() },
    })),
    event: events[0],
  };
}

export async function getContestsByUser(username: string): Promise<Contest[]> {
  let res: Contest[] = [];

  if (!username) {
    return res;
  }

  const contests = await db.getContestsByUser(username);
  const events = await getEventsById(contests.map(contest => contest.id));

  if (!events || events.length <= 0) {
    return res;
  }

  for (let contest of contests) {
    const event = events.find(event => event.id === contest.id);
    if (event) {
      res.push({
        id: contest.id,
        name: contest.name,
        date: contest.date.toString(),
        bets: contest.bets.map(bet => ({
          ...bet,
          contest: { ...bet.contest, date: contest.date.toString() },
        })),
        event,
      });
    }
  }

  return res;
}

/**
 * Returns contests occurring on or after the given date.
 *
 * @param date
 * @returns
 */
export async function getContestsByDate(date: string): Promise<Contest[]> {
  let res: Contest[] = [];

  if (!date) {
    return res;
  }

  const contests = await db.getContestsByDate(date);
  const events = await getEventsById(contests.map(contest => contest.id));

  if (!events || events.length <= 0) {
    return res;
  }

  for (let contest of contests) {
    const event = events.find(event => event.id === contest.id);
    if (event) {
      res.push({
        id: contest.id,
        name: contest.name,
        date: contest.date.toString(),
        bets: contest.bets.map(bet => ({
          ...bet,
          contest: { ...bet.contest, date: contest.date.toString() },
        })),
        event,
      });
    }
  }

  return res;
}
