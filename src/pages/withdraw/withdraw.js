import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function Withraw() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const [depositedAmount, setDepositedAmount] = useState('');
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accountNumber) return;
    axios.get(`http://localhost:3001/user/${accountNumber}`)
      .then(res => setUser(res.data))
      .catch(() => setError('User not found'));
  }, [accountNumber]);

  const handleDeposit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!amount || Number(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/withdraw', {
        accountNumber,
        amount: Number(amount),
      });
      setMessage(`Deposit successful!`);
      setUser(prev => ({ ...prev, balance: res.data.balance }));
      setDepositedAmount(amount); 
      setAmount('');
    } catch {
      setError('Deposit failed');
    }
  };

  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>{error}</p>;
  if (!user) return <p style={{ textAlign: 'center', marginTop: 50 }}>Loading user details...</p>;

  return (
    <div className="container">
      <h2 className="title">Withdraw Money</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Account Number:</strong> {user.accountNumber}</p>
      <p><strong>Branch:</strong> {user.branch}</p>
      <p><strong>Account Type:</strong> {user.accountType}</p>
      <p><strong>Current Balance:</strong> Rs. {user.balance}</p>
  
      <form onSubmit={handleDeposit} className="form">
        <label className="label">Amount to Deposit:</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          min="1"
          className="input"
        />
        <button type="submit" className="btn">Deposit</button>
      </form>
  
      {message && (
        localStorage.getItem('wantsReceipt') === 'yes' ? (
          <div className="receipt-box">
            <h3>🧾 Transaction Receipt</h3>
            <p><strong>Account:</strong> {user.accountNumber}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Branch:</strong> {user.branch}</p>
            <p><strong>Account Type:</strong> {user.accountType}</p>
            <p><strong>Deposited Amount:</strong> Rs. {depositedAmount}</p>
            <p><strong>New Balance:</strong> Rs. {user.balance}</p>
            <p className="success">✅ Withraw successful!</p>
          </div>
        ) : (
          <p className="success">✅ Withraw successful!</p>
        )
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
  
}
