import bcrypt from 'bcryptjs';
import type { UserSchema } from '../models/user';
import type { BetSchema } from '../models/bet';
import type { ContestSchema } from '../models/contest';
import User from '../models/user';

type PopulatedBetSchema = Omit<BetSchema, 'contest' | 'user'> & {
  user: UserSchema;
  contest: ContestSchema;
};

export type PopulatedUserSchema = Omit<UserSchema, 'bets'> & {
  bets: PopulatedBetSchema[];
};

/**
 * Get a User from the database.
 */
export async function getUser(username: string) {
  const user = await User.findOne({ username }).populate<{ bets: PopulatedBetSchema[] }>({
    path: 'bets',
    populate: {
      path: 'contest',
    },
  });

  if (!user) {
    return false;
  }

  return user;
}

/**
 * Update a User in the database.
 */
export async function updateUser(username: string, properties: Partial<UserSchema>): Promise<void> {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error();
  }

  await User.updateOne({ username }, { ...properties });
}

/**
 * Add a new User to the database.
 */
export async function createUser(username: string, password: string, email: string, phone: string) {
  await User.create({
    username,
    password: await bcrypt.hash(password, await bcrypt.genSalt()),
    email,
    phone,
  });
}
