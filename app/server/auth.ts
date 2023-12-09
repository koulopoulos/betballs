import { createCookieSessionStorage } from '@remix-run/node';
import bcrypt from 'bcryptjs';
import * as db from './database/controllers/user';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: '__session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

export async function isValidLogin(username: string, password: string) {
  const user = await db.getUser(username);

  if (!user) {
    return false;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return false;
  }

  return true;
}

export async function isUser(username: string) {
  return !!(await db.getUser(username));
}

export async function createUser(username: string, password: string, email: string, phone: string) {
  return await db.createUser(username, password, email, phone);
}
