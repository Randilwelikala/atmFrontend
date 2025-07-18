import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
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
 

  if (error) return <p >{error}</p>;
  if (!user) return <p >Loading user details...</p>;

  return (
    
    <div className="container">
      <SessionTimeout timeoutDuration={5000} />
      <h2 className="title">Account Details</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Account Number:</strong> {user.accountNumber}</p>
      <p><strong>Branch:</strong> {user.branch}</p>
      <p><strong>Account Type:</strong> {user.accountType}</p>
      <p><strong>Current Balance:</strong> Rs. {user.balance}</p>
      
    </div>
  );
}
