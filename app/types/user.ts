import type { PopulatedUserSchema } from '~/server/database/controllers/user';

export type User = Pick<PopulatedUserSchema, 'username' | 'bets'>;
export type ActiveUser = User & Pick<PopulatedUserSchema, 'email' | 'phone' | 'role'>;
export type UserProfile = Pick<PopulatedUserSchema, 'email' | 'phone'>;
