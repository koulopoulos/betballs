import type { NFLScoreboard, NFLScoreboardEvent } from '~/types/events';
import scoreboard from './scoreboard.json';

export async function getScoreboard(): Promise<NFLScoreboard | null> {
  /* @ts-ignore */
  return scoreboard as NFLScoreboard;

  try {
    const res = await fetch(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`);

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Performs an HTTP GET request to the ESPN NFL scoreboard
 * endpoint to get upcoming events.
 *
 * @param date
 * @returns
 */
export async function getEventsByDate(date: string): Promise<NFLScoreboardEvent[]> {
  if (!date) {
    return [];
  }

  const scoreboard = await getScoreboard();

  if (!scoreboard) {
    return [];
  }

  const events = scoreboard.events.filter(
    event => new Date(event.date).getTime() >= new Date(date).getTime(),
  );

  return events;
}

/**
 * Performs an HTTP GET request to the ESPN NFL scoreboard
 * endpoint and filters results based on the given event IDs.
 * @param id
 * @returns
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
