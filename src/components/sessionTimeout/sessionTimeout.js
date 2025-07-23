import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './sessionTimeout.css'
import { useTranslation } from 'react-i18next';

export default function SessionTimeout({ timeoutDuration = 5000, confirmDuration = 10000 }) {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);
  const { t, i18n } = useTranslation();
  const inactivityTimer = useRef(null);
  const confirmTimer = useRef(null);
  const waitingForResponse = useRef(false);


  const resetInactivityTimer = () => {
    if (waitingForResponse.current) return; 

    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    setShowPrompt(false);

    inactivityTimer.current = setTimeout(() => {
      setShowPrompt(true);
      waitingForResponse.current = true;
      
      confirmTimer.current = setTimeout(() => {
        
        setShowPrompt(false);
        waitingForResponse.current = false;
        resetInactivityTimer(); 
      }, confirmDuration);

    }, timeoutDuration);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('userSession');
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (confirmTimer.current) clearTimeout(confirmTimer.current);

    setShowPrompt(false);
    waitingForResponse.current = false;

    try {
      await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include' 
      });
    } catch (err) {
      console.error('Logout request failed:', err);
    }

    navigate('/');
  };
  
  useEffect(() => {
    const events = ['click', 'keypress', 'mousemove', 'scroll', 'touchstart'];

    const activityHandler = () => resetInactivityTimer();

    events.forEach(evt => window.addEventListener(evt, activityHandler));
    resetInactivityTimer(); 

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      events.forEach(evt => window.removeEventListener(evt, activityHandler));
    };
  }, []);

  const handleUserResponse = (response) => {
    if (confirmTimer.current) clearTimeout(confirmTimer.current);
    waitingForResponse.current = false;
    setShowPrompt(false);

    if (response === 'yes') {      
      resetInactivityTimer();
    } else {      
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


