import type { NFLScoreboardEvent } from '~/types/events';
import type { BetSchema } from '../models/bet';
import type { UserSchema } from '../models/user';
import type { ContestSchema } from '../models/contest';
import Contest from '../models/contest';
import User from '../models/user';

type PopulatedBetSchema = Omit<BetSchema, 'user' | 'contest'> & {
  user: UserSchema;
  contest: ContestSchema;
};

/**
 * Add a new Contest to the database.
 */
export async function createNewContest(event: NFLScoreboardEvent) {
  const contest = await Contest.findOne({ id: event.id });

  if (contest) {
    return;
  }

  await Contest.create({
    id: event.id,
    name: event.name,
    date: new Date(event.date),
  });
}

/**
 * Get a Contest from the database.
 */
export async function getContest(id: string) {
  const contest = await Contest.findOne({ id }).populate<{ bets: PopulatedBetSchema[] }>({
    path: 'bets',
    populate: {
      path: 'user',
    },
  });

  if (!contest) {
    throw new Error();
  }

  return contest;
}

/**
 * Get multiple Contests from the database.
 */
export async function getContestsByDate(date: string) {
  return await Contest.find({ date: { $gte: new Date(date) } }).populate<{
    bets: PopulatedBetSchema[];
  }>({
    path: 'bets',
    populate: {
      path: 'user',
    },
  });
}

/**
 * Get multiple Contests from the database.
 */
export async function getContestsByUser(username: string) {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error();
  }

  return await Contest.find({ bets: { $in: user.bets } }).populate<{
    bets: PopulatedBetSchema[];
  }>({
    path: 'bets',
    populate: {
      path: 'user',
    },
  });
}
