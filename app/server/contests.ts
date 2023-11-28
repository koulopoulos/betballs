import type { Contest } from '~/types/contest';
import { getEventsByDate, getEventsById } from './events';
import * as db from '../db/db';

export async function getContestById(id: string): Promise<Contest> {
  const contest = await db.getContestById(id);
  const events = await getEventsById([contest.eventId]);

  if (!events || events?.length === 0) {
    throw new Error('Event not found');
  }

  return {
    ...contest,
    event: events[0],
  } as Contest;
}

export async function getUserContests(username: string): Promise<Contest[]> {
  const contests = await db.getUserContests(username);
  const events = await getEventsById(contests.map(contest => contest.eventId));
  let res: Contest[] = [];

  if (!events || events.length === 0) {
    return res;
  }

  for (let event of events) {
    const contest = contests.find(contest => contest.eventId === event.id);
    if (contest) {
      res.push({
        event,
        ...contest,
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
  if (!date) {
    return [];
  }

  const events = await getEventsByDate(date);

  // TODO: Join Contests DB with Events
  const contests = events.map(event => ({
    uid: event.id,
    participants: [],
    bets: [],
    date: event.date,
    event,
  }));

  return contests;
}
