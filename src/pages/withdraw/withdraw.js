import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';

function Withraw() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const [depositedAmount, setDepositedAmount] = useState('');
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {    
    axios.get(`http://localhost:3001/user/${accountNumber}`)
      .then(res => setUser(res.data))      
  }, [accountNumber]);

  const handleWithdraw = async e => {
    e.preventDefault();
    setMessage('');
    setError('');    

    try {
      const res = await axios.post('http://localhost:3001/withdraw', {
        accountNumber,
        amount: Number(amount),
      });
      setMessage(`withdraw successful!`);
      setUser(prev => ({ ...prev, balance: res.data.balance }));
      setDepositedAmount(amount); 
      setAmount('');
    } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Something went wrong');
        }
    }
  };

  if (error) return <p >{error}</p>;
  if (!user) return <p >Loading user details...</p>;

  return (
    <div className="container">
      <SessionTimeout timeoutDuration={5000} />
      <h2 className="title">Withdraw Money</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Account Number:</strong> {user.accountNumber}</p>
      <p><strong>Branch:</strong> {user.branch}</p>
      <p><strong>Account Type:</strong> {user.accountType}</p>
      <p><strong>Current Balance:</strong> Rs. {user.balance}</p>
  
      <form onSubmit={handleWithdraw} className="form">
        <label className="label">Amount to Withdraw:</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}          
          className="input"
        />
        <button type="submit" className="btn">Withdraw</button>
      </form>
  
      {message && (
        localStorage.getItem('wantsReceipt') === 'yes' ? (
          <div className="receipt-box">
            <h3>🧾 Transaction Receipt</h3>
            <p><strong>Account:</strong> {user.accountNumber}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Branch:</strong> {user.branch}</p>
            <p><strong>Account Type:</strong> {user.accountType}</p>
            <p><strong>Withdrawed Amount:</strong> Rs. {depositedAmount}</p>
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
export default Withraw;