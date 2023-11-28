import bcrypt from 'bcryptjs';
import type { ActiveUserProfile, UserProfile } from '~/types/profile';
import scoreboard from '../server/scoreboard.json';

const USERS = [
  {
    username: '123',
    password: '$2a$10$.7cTMbk0WyaCm1XB.S6fAO2E.r/tkcN1Fth0s63JqSpVCXaKQJbq.',
    email: '123@betballs.com',
    phone: '1234567890',
  },
  {
    username: '1234',
    password: '',
    email: '1234@betballs.com',
    phone: '1234567890',
  },
];

type ContestModel = {
  uid: string;
  participants: string[];
  bets: string[];
  date: string;
  eventId: string;
};

export async function getContestById(id: string): Promise<ContestModel> {
  // TODO: Connect to database
  return Promise.resolve({
    uid: '1',
    participants: ['1', '2', '3'],
    bets: ['8', '94', '63'],
    eventId: id,
    date: new Date().toString(),
  });
}

export async function getContestsByDate(date: string): Promise<ContestModel[]> {
  return Promise.resolve(
    scoreboard.events.map(event => ({
      uid: event.id,
      participants: ['1', '2', '3'],
      bets: ['50', '60', '70'],
      eventId: event.id,
      date: new Date().toString(),
    })),
  );
}

export async function getUserContests(username: string): Promise<ContestModel[]> {
  // TODO: Connect to database
  return Promise.resolve([
    {
      uid: '401547552',
      participants: ['1', '2', '3'],
      bets: ['8', '94', '63'],
      eventId: '401547552',
      date: new Date().toString(),
    },
  ]);
}

export async function getUser(username: string) {
  console.log(await bcrypt.hash(username, 0));
  return {
    username: username,
    password: await bcrypt.hash(username, 0),
  };
}

export async function isUser(username: string) {
  return true;
}

export async function getUserProfile(username: string): Promise<UserProfile> {
  const user = USERS.find(user => user.username === username); // TODO: Connect to database

  if (!user) {
    throw new Error('Invalid user');
  }

  return {
    username: user.username,
  };
}

export async function getActiveUserProfile(username: string): Promise<ActiveUserProfile> {
  const user = USERS.find(user => user.username === username); // TODO: Connect to database

  if (!user) {
    throw new Error('Invalid user');
  }

  return {
    username: user.username,
    email: user.email,
    phone: user.phone,
  };
}

export async function updateUserProfile(
  username: string,
  profile: Partial<ActiveUserProfile>,
): Promise<void> {
  const userIndex = USERS.findIndex(user => user.username === username); // TODO: Connect to database

  console.log('INDEX', userIndex);

  if (userIndex === -1) {
    throw new Error('Invalid user');
  }

  USERS[userIndex] = {
    ...USERS[userIndex],
    ...profile,
  };

  console.log(USERS);
}
