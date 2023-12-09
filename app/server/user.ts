import type { ActiveUser, User, UserProfile } from '~/types/user';
import * as db from './database/controllers/user';

export async function updateUser(username: string, profile: Partial<UserProfile>) {
  return await db.updateUser(username, profile);
}

export async function getActiveUser(username: string): Promise<ActiveUser> {
  const user = await db.getUser(username);

  if (!user) {
    throw new Error();
  }

  return {
    username: user.username,
    role: user.role,
    email: user.email,
    phone: user.phone,
    bets: user.bets,
  };
}

export async function getUser(username: string): Promise<User> {
  const user = await db.getUser(username);

  if (!user) {
    throw new Error();
  }

  return {
    username: user.username,
    bets: user.bets,
  };
}
