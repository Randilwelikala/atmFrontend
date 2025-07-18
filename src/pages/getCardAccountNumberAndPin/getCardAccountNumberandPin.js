import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './getCardAccountNumberAndPin.css';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';

export default function GetCardAccountNumberandPin() {
  const [accountNumber, setAccountNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    if (!cardNumber) {
        setError('Enter a card number');
        return;
      }
      

      if (cardNumber.length !== 16) {
        setError('Card number must be exactly 16 digits');
        return;
      }

      if (!pin) {
        setError('Enter a PIN');
        return;
      }  

    try {
      const res = await axios.post('http://localhost:3001/cardLogin', {
        cardNumber,
        pin
      });

      if (res.data.success) {
        // const account = res.data.accountNumber;
        navigate(`/cardDashboard?account=${res.data.accountNumber}`);
      } 
    } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Something went wrong');
        }
      }
  };

  return (
    <div className="login-container">
      <SessionTimeout timeoutDuration={5000000} />
      <h2 className="login-title">For Continue</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={e => setCardNumber(e.target.value)}          
          className="login-input"
        />
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}          
          className="login-input"
        />
        <button type="submit" className="login-button">Confirm</button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}