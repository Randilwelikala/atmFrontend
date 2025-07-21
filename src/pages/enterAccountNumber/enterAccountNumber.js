import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './enterAccountNumber.css';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import CardlessSideNavbar from '../../components/cardlessSideNavbar/cardlessSideNavbar';


export default function EnterAccountNumber() {
  const [step, setStep] = useState(1);
  const [firstInput, setFirstInput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFirstSubmit = e => {
    e.preventDefault();
    setError('');
    if (firstInput.trim() === '') {
      setError('Please enter an account number.');
      return;
    }
    setStep(2);
  };

  const handleSecondSubmit = e => {
    e.preventDefault();
    setError('');
    if (secondInput !== firstInput) {
      setError('Account numbers do not match!');
      setStep(1); 
      setFirstInput('');
      setSecondInput('');
      return;
    }
    navigate(`/cardlessDeposit?account=${firstInput}`);
  };

  return (
    <>
    <CardlessSideNavbar/>
    <div className="container">
      <SessionTimeout timeoutDuration={5000000} />
      <h2 className="title">Enter Account Number</h2>
  
      {step === 1 && (
        <form onSubmit={handleFirstSubmit} className="form">
          <input
            className="input"
            type="text"
            placeholder="Enter account number"
            value={firstInput}
            onChange={e => setFirstInput(e.target.value)}
            required
          />
          <button type="submit" className="btn">Next</button>
        </form>
      )}
  
      {step === 2 && (
        <form onSubmit={handleSecondSubmit} className="form">
          <input
            className="input"
            type="text"
            placeholder="Re-enter account number"
            value={secondInput}
            onChange={e => setSecondInput(e.target.value)}
            required
          />
          <button type="submit" className="btn">Confirm</button>
        </form>
      )}
  
      {error && <p className="error">{error}</p>}
    </div>
    </>
  );
}
