import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Ask() {
    const navigate = useNavigate();
  return (
    <div className="atm-column card">
          <h2>Do You want a Receipt For This Transaction</h2>
          <button onClick={() => navigate('/GetCardAccountNumberandPin')}>
            Yes
          </button>
          <button onClick={() => navigate('/GetCardAccountNumberandPin2')}>
            No          
          </button>    
          
        </div>
  );
}
