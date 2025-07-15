import React, { useState } from 'react';
import Transaction from './Transaction';
import axios from 'axios';

export default function Dashboard({ user, onLogout }) {
  const [balance, setBalance] = useState(user.balance);
  const [message, setMessage] = useState('');

 

  const handleTransaction = async (type, amount) => {
    setMessage('');
    try {
      const url = `http://localhost:3001/${type}`;
      const res = await axios.post(url, { accountNumber: user.accountNumber, amount: Number(amount) });
      setBalance(res.data.balance);
      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} successful!`);
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Transaction failed');
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', marginTop: 50 }}>
      <h2>Welcome, Card {user.cardNumber}</h2>
      <p><strong>Balance:</strong> ${balance.toFixed(2)}</p>      
      <Transaction onSubmit={handleTransaction} />
      {message && <p>{message}</p>}
      <button onClick={onLogout} style={{ marginTop: 20 }}>Logout</button>
    </div>
  );
}
