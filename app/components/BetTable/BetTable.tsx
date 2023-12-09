import type { Bet } from '~/types/contest';
import './styles.css';
import { Link } from '@remix-run/react';

interface BetTableProps {
  bets?: Bet[];
}

export default function BetTable({ bets }: BetTableProps) {
  return (
    <table className='table table-striped bet-table'>
      <thead>
        <tr className='fw-bold'>
          <th scope='col'>Contest</th>
          <th scope='col'>Team</th>
          <th scope='col' className='text-end'>
            Wager
          </th>
          <th scope='col'></th>
        </tr>
      </thead>
      <tbody>
        {bets &&
          bets.map((bet, i) => (
            <tr key={bet.uid}>
              <td className='text-nowrap'>
                <Link to={`/details/${bet.contest.id}`}>{bet.contest.name}</Link>
              </td>
              <td className='text-nowrap'>{bet.winner.name}</td>
              <td className='text-end text-nowrap'>${bet.amount}.00</td>
              <td className='text-end text-nowrap'>
                <form method='post'>
                  <input type='hidden' name='betId' value={bet.uid} />
                  <button
                    type='submit'
                    name='_action'
                    value='CANCEL_BET'
                    className='btn btn-danger btn-sm'>
                    Cancel
                  </button>
                </form>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
