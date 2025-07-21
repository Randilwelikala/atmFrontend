import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import './seeBalance.css';

export default function SeeBalance() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');

  const [user, setUser] = useState(null);  
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accountNumber) return;
    axios.get(`http://localhost:3001/user/${accountNumber}`)
      .then(res => setUser(res.data))
      .catch(() => setError('User not found'));
  }, [accountNumber]);

  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p className="loading-message">Loading user details...</p>;

  return (
    <div className="balance-container">
      <SessionTimeout timeoutDuration={5000000} />
      <h2 className="balance-title">Account Details</h2>
      <div className="balance-details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Account Number:</strong> {user.accountNumber}</p>
        <p><strong>Branch:</strong> {user.branch}</p>
        <p><strong>Account Type:</strong> {user.accountType}</p>
        <p><strong>Current Balance:</strong> Rs. {user.balance}</p>
      </div>
    </div>
  );
}
