import { useState } from 'react';
import type { ActiveUserProfile } from '~/types/profile';

export interface ProfileFormProps {
  profile: ActiveUserProfile;
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
      <div>
        <label htmlFor='email'>email</label>
        <input
          type='email'
          id='email'
          name='email'
          defaultValue={profile.email}
          onChange={handleEmailChange}
        />
      </div>
      <div>
        <label htmlFor='phone'>phone</label>
        <input
          type='tel'
          id='phone'
          name='phone'
          defaultValue={profile.phone}
          onChange={handlePhoneChange}
        />
      </div>
      <button type='submit' disabled={!isUpdated}>
        Update info
      </button>
    </form>
  );
}
