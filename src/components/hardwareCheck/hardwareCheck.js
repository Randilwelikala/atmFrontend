import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './hardwareCheck.css';

function HardwareCheck() {
  const [hardwareError, setHardwareError] = useState(null);

  useEffect(() => {
    const checkHardware = async () => {
      try {
        await axios.get('http://localhost:3001/check-hardware-status');

        // Clear error if previously set
        if (hardwareError) {
          setHardwareError(null);
        }
      } catch (error) {
        if (error.response?.status === 500) {
          setHardwareError(error.response.data.message);
        }
      }
    };

    const interval = setInterval(checkHardware, 5000);
    return () => clearInterval(interval);
  }, [hardwareError]);

  return (
    <>
      {hardwareError && (
        <div className="hardwareOverlay">
          <div className="hardwareOverlayContent">
            <h2>Hardware Error Detected</h2>
            <p>{hardwareError}</p>
            <p>The system is temporarily unavailable. Please contact support.</p>
          </div>
        </div>
      )}
    </>
  );
}

export default HardwareCheck;
