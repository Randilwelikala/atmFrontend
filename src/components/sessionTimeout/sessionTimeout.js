// SessionTimeout.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionTimeout = ({ timeoutDuration = 5 * 60 * 1000 }) => {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const sessionTimer = setTimeout(() => {
      setShowPrompt(true);
    }, timeoutDuration); // default 5 mins

    return () => clearTimeout(sessionTimer);
  }, [timeoutDuration]);

  useEffect(() => {
    let promptTimeout;
    if (showPrompt) {
      promptTimeout = setTimeout(() => {
        navigate('/cardLogin');
      }, 10000); // 10 seconds to respond
    }
    return () => clearTimeout(promptTimeout);
  }, [showPrompt, navigate]);

  const handleExtend = () => {
    setShowPrompt(false);
    window.location.reload(); // or reset timer logic if needed
  };

  const handleEnd = () => {
    navigate('/cardLogin');
  };

  return showPrompt ? (
    <div className="session-modal">
      <div className="session-modal-content">
        <p>Your session is about to expire. Do you want more time?</p>
        <button onClick={handleExtend}>Yes</button>
        <button onClick={handleEnd}>No</button>
      </div>
    </div>
  ) : null;
};

export default SessionTimeout;
