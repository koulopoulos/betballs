import type { Contest } from '~/types/contest';
import './styles.css';

interface BetFormProps {
  contest: Contest;
}

export default function BetForm({ contest }: BetFormProps) {
  return (
    <div className='bet-form'>
      <form method='post'>
        <fieldset className='row mb-3'>
          <legend className='col-form-label col-md-2 pt-0 fw-bold'>To win</legend>
          <div className='col-md-4 d-flex flex-column'>
            {contest.event.competitions.at(0)?.competitors.map(competitor => (
              <div key={competitor.team.id} className='form-check'>
                <input
                  type='radio'
                  name='bet-winner-id'
                  value={competitor.team.id}
                  required
                  className='form-check-input cursor-pointer'
                  id={`betWinnerId${competitor.team.id}`}
                />
                <label
                  htmlFor={`betWinnerId${competitor.team.id}`}
                  className='form-check-label cursor-pointer'>
                  <span className='lh-base'>{competitor.team.displayName}</span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        <div className='row mb-3'>
          <label htmlFor='betAmount' className='col-md-2 col-form-label fw-bold'>
            Bet amount
          </label>
          <div className='col-md-4'>
            <div className='input-group'>
              <span className='input-group-text'>$</span>
              <input
                type='number'
                min='1'
                placeholder='0'
                required
                name='bet-amount'
                id='betAmount'
                className='form-control'></input>
              <span className='input-group-text'>.00</span>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-2'></div>
          <div className='col-md-4'>
            <button type='submit' className='btn btn-danger'>
              Place bet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
