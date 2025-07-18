// src/components/sessionTimeout/SessionTimeout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SessionTimeout({ timeoutDuration = 5 * 60 * 1000, confirmDuration = 10000 }) {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptTimer, setPromptTimer] = useState(null);


  useEffect(() => {
    let timeout;
    const activityEvents = ['click', 'keypress', 'mousemove', 'scroll', 'touchstart'];
    let promptTimeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      setShowPrompt(false);
      if (promptTimer) clearTimeout(promptTimer);

      timeout = setTimeout(() => {
        setShowPrompt(true);

        // Auto-close after confirmDuration if user doesn't respond
        const autoClose = setTimeout(() => {
          navigate('/');
        }, confirmDuration);
        setPromptTimer(autoClose);
      }, timeoutDuration);
    };


    // Listen to user activity
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // Start timer initially

    return () => {
      clearTimeout(timeout);
      if (promptTimer) clearTimeout(promptTimer);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate, timeoutDuration, confirmDuration]);

  const handleUserResponse = (response) => {
    if (promptTimer) clearTimeout(promptTimer);
    setShowPrompt(false);
    if (response === 'yes') {
      // Extend session
    } else {
      navigate('/');
    }
  };

