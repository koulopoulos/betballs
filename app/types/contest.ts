import type { NFLScoreboardEvent } from './events';

export type Bet = {
  uid: string;
  amount: number;
  winner: {
    id: string;
    name: string;
  };
  user: {
    username: string;
  };
  contest: {
    id: string;
    name: string;
    date: string;
  };
};

export type Contest = {
  id: string;
  name: string;
  date: string;
  event: NFLScoreboardEvent;
  bets: Bet[];
};
