import React from 'react';
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';

function Account() {
  return (
    <div className='card mt-16'>
      <ChangePassword />
      <SignOutButton />
    </div>
  );
}

export default Account;
