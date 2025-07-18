import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SessionTimeout({ timeoutDuration = 5000, confirmDuration = 10000 }) {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);

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
        handleLogout();
      }, confirmDuration);
    }, timeoutDuration);
  };

  // Logout function: clear timers and navigate away
  const handleLogout = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (confirmTimer.current) clearTimeout(confirmTimer.current);

    setShowPrompt(false);
    waitingForResponse.current = false;
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
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <p>Session is about to expire. Do you want more time?</p>
            <button onClick={() => handleUserResponse('yes')}>Yes</button>
            <button onClick={() => handleUserResponse('no')}>No</button>
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
