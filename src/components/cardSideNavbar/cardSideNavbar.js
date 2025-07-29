import React, { useState, useEffect, useRef } from 'react';
import './cardSideNavbar.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function CardSideNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      !event.target.classList.contains('fixed-toggle-btn')
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <button className="fixed-toggle-btn" onClick={toggleNavbar}>
        ☰
      </button>

      <div ref={navbarRef} className={`right-navbar ${isOpen ? 'open' : ''}`}>
        <div className="navbar-title">Card Transactions</div>
        <button onClick={() => window.location.href = `/AskCard?account=${accountNumber}`}>Deposit Money</button>
        <button onClick={() => window.location.href = `/askCardWithdrawal?account=${accountNumber}`}>Withdraw Money</button>
        <button onClick={() => window.location.href = `/SeeBalance?account=${accountNumber}`}>View Balance</button>
        <button onClick={() => window.location.href = `/change-pin?account=${accountNumber}`}>Change PIN</button>
        <button onClick={() => window.location.href = `/fundTransfer`}>Fund Transfer</button>
      </div>
    </>
  );
}
