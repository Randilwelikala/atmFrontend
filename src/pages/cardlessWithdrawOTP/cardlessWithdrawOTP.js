import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CardlessWithdrawOTP() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const sendOtp = async () => {
    setMessage('');
    setError('');
    if (!mobile.match(/^07\d{8}$/)) {
      setError('Enter a valid mobile number starting with 07');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/send-otp', { mobile });
      setMessage(`OTP sent to ${mobile}. For testing: OTP is ${res.data.otp}`);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    setMessage('');
    setError('');
    if (otp.length !== 4) {
      setError('Enter the 4-digit OTP');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/verify-otp', { mobile, otp });
      setMessage('OTP verified! Redirecting...');
      // Redirect to withdraw page with account number as query param
      navigate(`/Withdraw?account=${res.data.accountNumber}`);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Cardless Withdraw - OTP Verification</h2>
      {!otpSent ? (
        <>
          <label>Enter Mobile Number:</label>
          <input
            type="text"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="07XXXXXXXX"
            maxLength={10}
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
          />
          <button onClick={sendOtp} style={{ padding: '10px 20px' }}>Send OTP</button>
        </>
      ) : (
        <>
          <p>{message}</p>
          <label>Enter OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            maxLength={4}
            placeholder="1234"
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
          />
          <button onClick={verifyOtp} style={{ padding: '10px 20px' }}>Verify OTP</button>
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
