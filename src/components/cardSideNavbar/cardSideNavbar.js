import React, { useState } from 'react';
import './cardSideNavbar.css';

export default function CardSideNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="fixed-toggle-btn" onClick={toggleNavbar}>
        ☰
      </button>

      <div className={`right-navbar ${isOpen ? 'open' : ''}`}>
        <button onClick={() => window.location.href='/withdraw'}>Withdraw</button>
        <button onClick={() => window.location.href='/deposit'}>Deposit</button>
        <button onClick={() => window.location.href='/balance'}>Balance Inquiry</button>
        <button onClick={() => window.location.href='/history'}>Transaction History</button>
        <button onClick={() => window.location.href='/exit'}>Exit</button>
      </div>
    </>
  );
}
