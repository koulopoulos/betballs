import { useState } from 'react';
import type { ActiveUser } from '~/types/user';
import './styles.css';

export interface ProfileFormProps {
  profile: ActiveUser;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isUpdated, setIsUpdated] = useState(false);

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setIsUpdated(event.target.value !== profile.email);
  };

  const handlePhoneChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setIsUpdated(event.target.value !== profile.phone);
  };

  return (
    <form method='post'>
      <fieldset className='row mb-3'>
        <label htmlFor='username' className='col-form-label col-md-2 fw-bold'>
          Username
        </label>
        <div className='col-md-4'>
          <input
            type='text'
            id='username'
            name='username'
            disabled
            defaultValue={profile.username}
            className='form-control disabled cursor-disabled'
          />
        </div>
      </fieldset>
      <fieldset className='row mb-3'>
        <label htmlFor='email' className='col-form-label col-md-2 fw-bold'>
          Email
        </label>
        <div className='col-md-4'>
          <input
            type='email'
            id='email'
            name='email'
            defaultValue={profile.email}
            onChange={handleEmailChange}
            className='form-control'
          />
        </div>
      </fieldset>
      <fieldset className='row mb-3'>
        <label htmlFor='phone' className='col-form-label col-md-2 fw-bold'>
          Phone
        </label>
        <div className='col-md-4'>
          <input
            type='tel'
            id='phone'
            name='phone'
            defaultValue={profile.phone}
            onChange={handlePhoneChange}
            className='form-control'
          />
        </div>
      </fieldset>
      <div className='row'>
        <div className='col-md-2'></div>
        <div className='col-md-4'>
          <button type='submit' disabled={!isUpdated} className='btn btn-warning'>
            Update info
          </button>
        </div>
      </div>
    </form>
  );
}
