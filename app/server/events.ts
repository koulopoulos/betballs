import type { NFLScoreboard, NFLScoreboardEvent } from '~/types/events';
import * as db from './database/controllers/contest';

/**
 * Fetches upcoming NFL events from ESPN API. Updates contests database
 * with new entries as necessary.
 */
export async function getScoreboard(): Promise<NFLScoreboard | null> {
  if (!process.env.SCOREBOARD_URL) {
    throw new Error();
  }

  try {
    const res = await fetch(process.env.SCOREBOARD_URL);

    if (!res.ok) {
      return null;
    }

    const scoreboard = (await res.json()) as NFLScoreboard;

    for (let event of scoreboard.events) {
      /* @ts-ignore */
      await db.createNewContest(event as NFLScoreboardEvent); // TODO: fix?
    }

    return scoreboard as NFLScoreboard;
  } catch (e) {
    return null;
  }
}

/**
 * Performs an HTTP GET request to the ESPN NFL scoreboard
 * endpoint and filters results based on the given event IDs.
 */
export async function getEventsById(ids: string[]): Promise<NFLScoreboardEvent[] | null> {
  const scoreboard = await getScoreboard();

  if (!scoreboard) {
    return null;
  }

  const events = scoreboard.events.filter(event => ids.includes(event.id));

  if (!events) {
    return null;
  }

  return events;
}
