import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './downloadHistoryOTP.css'; 
import CardlessSideNavbar from '../../components/cardlessSideNavbar/cardlessSideNavbar';
import { t } from 'i18next';

export default function DownloadHistoryOTP() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const sendOtp = async () => {
    setMessage('');
    setError('');
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/send-otp', { email });
      setMessage(`${t('OTP sent to')} ${email}. ${t('For testing')}: ${t('OTP is')} ${res.data.otp}`);
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
      const res = await axios.post('http://localhost:3001/verify-otp', { email, otp });
      localStorage.setItem('jwtToken', res.data.token);
      setMessage('OTP verified! Redirecting...');
      navigate(`/pastTransaction?account=${res.data.accountNumber}`);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    
    <div className="otp-container" id="cardless-otp-page">
      <CardlessSideNavbar/>     
      <h2 className="otp-title">{t('Cardless Withdraw - OTP Verification')}</h2>
      
      {!otpSent ? (
        <div className="otp-step">
          <label className="otp-label">{t('Enter Mobile Number')}:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="youremail@gmail.com"
            className="otp-input"
          />
          <button onClick={sendOtp} className="otp-button">{t('Send OTP')}</button>
        </div>
      ) : (
        <div className="otp-step">
          <p className="otp-message">{message}</p>
          <label className="otp-label">{t('Enter OTP')}:</label>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            maxLength={4}
            placeholder="1234"
            className="otp-input"
          />
          <button onClick={verifyOtp} className="otp-button">{t('Verify OTP')}</button>
        </div>
      )}
      
      {error && <p className="otp-error">{error}</p>}
    </div>
  );
}