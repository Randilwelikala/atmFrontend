import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './hardwareCheck.css'

function HardwareCheck () {
  const [hardwareError, setHardwareError] = useState(null);

  useEffect(() => {
    const checkHardware = async () => {
      try {
        await axios.get('http://localhost:3001/check-hardware-status');

        if (hardwareError) {
            const timer = setTimeout(() => setHardwareError(null), 5000);
            return () => clearTimeout(timer);
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
    <div>
      {hardwareError && <div className="popup">{hardwareError}</div>}
     
    </div>
  );
}

export default HardwareCheck;
