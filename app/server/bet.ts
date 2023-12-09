import * as db from './database/controllers/bet';

export async function createBet(
  amount: number,
  winnerId: string,
  winnerName: string,
  username: string,
  contestId: string,
) {
  return await db.createBet(amount, winnerId, winnerName, username, contestId);
}

export async function deleteBet(uid: string) {
  return await db.deleteBet(uid);
}
