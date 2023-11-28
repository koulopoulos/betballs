import type { ActiveUserProfile, UserProfile } from '~/types/profile';
import * as db from '../db/db';

export async function updateUserProfile(username: string, profile: Partial<ActiveUserProfile>) {
  return await db.updateUserProfile(username, profile);
}

export async function getActiveUserProfile(username: string): Promise<ActiveUserProfile> {
  return await db.getActiveUserProfile(username);
}

export async function getUserProfile(username: string): Promise<UserProfile> {
  return await db.getUserProfile(username);
}
