import type { NFLScoreboardEvent } from './events';

export type Bet = {
  uid: string;
  forId: string;
  userId: string;
  amount: number;
};

export type Contest = {
  uid: string;
  participants: string[];
  bets: string[];
  date: string;
  event: NFLScoreboardEvent;
};
