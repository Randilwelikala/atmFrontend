import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './downloadHistoryOTP.css'; 
import CardlessSideNavbar from '../../components/cardlessSideNavbar/cardlessSideNavbar';
import { t } from 'i18next';
export default function DownloadHistoryOTP() {
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
      setMessage(`${t('OTP sent to')} ${mobile}. ${t('For testing')}: ${t('OTP is')} ${res.data.otp}`);
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
            type="text"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="07XXXXXXXX"
            maxLength={10}
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