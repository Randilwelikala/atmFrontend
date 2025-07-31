import React, { useState, useEffect, useRef } from 'react';
import './cardlessSideNavbar.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CardlessSideNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const { t, i18n } = useTranslation();

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
      <button className="fixed-toggle-btn" onClick={toggleNavbar} title={t('Menu')}>
        ☰
      </button>

      <div ref={navbarRef} className={`right-navbar ${isOpen ? 'open' : ''}`}>
        <div className="navbar-title">Cardless Transactions</div>
        <button onClick={() => window.location.href = `/askReceiptforCardlessWithdraw`}>Withdraw Money</button>
        <button onClick={() => window.location.href = `/askCardless`}>Deposit Money</button>
        <button onClick={() => window.location.href = `/downloadHistoryOTP`}>Download History</button>
     
      </div>
    </>
  );
}
