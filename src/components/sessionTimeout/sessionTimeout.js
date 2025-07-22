import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './sessionTimeout.css'
import { useTranslation } from 'react-i18next';

export default function SessionTimeout({ timeoutDuration = 5000, confirmDuration = 10000 }) {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);
  const { t, i18n } = useTranslation();


  // Using refs to keep timers stable between renders
  const inactivityTimer = useRef(null);
  const confirmTimer = useRef(null);
  const waitingForResponse = useRef(false);

  // Reset the inactivity timer unless waiting for user response
  const resetInactivityTimer = () => {
    if (waitingForResponse.current) return; // Don't reset if prompt showing

    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    setShowPrompt(false);

    inactivityTimer.current = setTimeout(() => {
      setShowPrompt(true);
      waitingForResponse.current = true;

      // Start confirmation countdown
      confirmTimer.current = setTimeout(() => {
        // Just hide prompt but DO NOT logout
        setShowPrompt(false);
        waitingForResponse.current = false;
        resetInactivityTimer(); // Give more time silently
      }, confirmDuration);

    }, timeoutDuration);
  };

  // Logout function: clear timers, clear sessionStorage, call backend logout, navigate away
  const handleLogout = async () => {
    sessionStorage.removeItem('userSession');
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (confirmTimer.current) clearTimeout(confirmTimer.current);

    setShowPrompt(false);
    waitingForResponse.current = false;

    // Call backend logout to destroy session server side
    try {
      await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include' // important to send cookies/session info
      });
    } catch (err) {
      console.error('Logout request failed:', err);
    }

    navigate('/');
  };

  // On user activity, reset timer (unless waiting for prompt answer)
  useEffect(() => {
    const events = ['click', 'keypress', 'mousemove', 'scroll', 'touchstart'];

    const activityHandler = () => resetInactivityTimer();

    events.forEach(evt => window.addEventListener(evt, activityHandler));
    resetInactivityTimer(); // start timer on mount

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      events.forEach(evt => window.removeEventListener(evt, activityHandler));
    };
  }, []);

  // Handle user clicking Yes or No on the prompt
  const handleUserResponse = (response) => {
    if (confirmTimer.current) clearTimeout(confirmTimer.current);
    waitingForResponse.current = false;
    setShowPrompt(false);

    if (response === 'yes') {
      // User wants more time, restart inactivity timer
      resetInactivityTimer();
    } else {
      // User says no, logout immediately
      handleLogout();
    }
  };

  return (
    <>
      {showPrompt && (
        <div className="session-modal">
          <div className="session-modal-content">
            <p>{t('Do you want more time?')}</p>
            <button onClick={() => handleUserResponse('yes')}>{t('Yes')}</button>
            <button onClick={() => handleUserResponse('no')}>{t('No')}</button>
          </div>
        </div>
      )}
    </>
  );
}

const modalStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 10,
  textAlign: 'center',
};
