import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      setStep(1); // go back to step 1
      setFirstInput('');
      setSecondInput('');
      return;
    }
    navigate(`/Deposit?account=${firstInput}`);
  };

  return (
    <div style={{ maxWidth: 300, margin: 'auto', marginTop: 50 }}>
      <h2>Enter Account Number</h2>
      {step === 1 && (
        <form onSubmit={handleFirstSubmit}>
          <input
            type="text"
            placeholder="Enter account number"
            value={firstInput}
            onChange={e => setFirstInput(e.target.value)}
            required
          />
          <button type="submit" style={{ marginTop: 10 }}>Next</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSecondSubmit}>
          <input
            type="text"
            placeholder="Re-enter account number"
            value={secondInput}
            onChange={e => setSecondInput(e.target.value)}
            required
          />
          <button type="submit" style={{ marginTop: 10 }}>Confirm</button>
        </form>
      )}

      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
}
