import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import './cardSideNavbar.css';
import { useTranslation } from 'react-i18next';

export default function CardSideNavbar() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account') || '';
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { t, i18n } = useTranslation();
  const toggleSidebar = () => setOpen(!open);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.classList.contains('hamburger-btn')
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);


  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setOpen(false);
    }
  };

  return (
    <>
      <button className="hamburger-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <nav
        ref={sidebarRef}
        className={`side-navbar ${open ? 'open' : 'closed'}`}
      >
        <ul>
          <li>
            <NavLink
              to={`/cardDashboard?account=${accountNumber}`}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={handleLinkClick}
            >
              {t('Dashboard')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/AskCard?account=${accountNumber}`}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={handleLinkClick}
            >
              {t('Deposit Money')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/askCardWithdrawal?account=${accountNumber}`}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={handleLinkClick}
            >
              {t('Withdraw Money')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/SeeBalance?account=${accountNumber}`}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={handleLinkClick}
            >
              {t('View Balance')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/change-pin?account=${accountNumber}`}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={handleLinkClick}
            >
              {t('Change PIN')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/fundTransfer?account=${accountNumber}`}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={handleLinkClick}
            >
              {t('Fund Transfer')}
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
