import Bet from '../models/bet';
import User from '../models/user';
import Contest from '../models/contest';

/**
 * Insert a new Bet into the database.
 */
export async function createBet(
  amount: number,
  winnerId: string,
  winnerName: string,
  username: string,
  contestId: string,
): Promise<void> {
  const user = await User.findOne({ username });
  const contest = await Contest.findOne({ id: contestId });

  if (!user || !contest) {
    throw new Error();
  }

  const bet = await Bet.create({
    amount,
    winner: { id: winnerId, name: winnerName },
    user: user._id,
    contest: contest._id,
  });

  if (!bet) {
    throw new Error();
  }

  await Contest.findOneAndUpdate({ _id: contest._id }, { $push: { bets: bet._id } });
  await User.findOneAndUpdate({ _id: user._id }, { $push: { bets: bet._id } });
}

/**
 * Delete a Bet from the database.
 */
export async function deleteBet(uid: string): Promise<void> {
  let bet = await Bet.findOneAndDelete({ uid });

  if (!bet) {
    throw new Error();
  }

  /* @ts-ignore - TypeScript type is incorrect for findOneAndDelete*/
  await Contest.findOneAndUpdate({ _id: bet.contest }, { $pull: { bets: bet._id } });

  /* @ts-ignore - TypeScript type is incorrect for findOneAndDelete*/
  await User.findOneAndUpdate({ _id: bet.user }, { $pull: { bets: bet._id } });
}
