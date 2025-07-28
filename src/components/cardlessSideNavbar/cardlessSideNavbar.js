import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBars } from 'react-icons/fa';
import './cardlessSideNavbar.css';  

export default function CardlessSideNavbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleNavbar = () => {
    setIsOpen(prev => !prev);
  };
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.classList.contains('hamburger-btn')
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="navbar-container">
      <button className="hamburger-btn" onClick={toggleNavbar}>
        <FaBars />
      </button>

      <nav ref={sidebarRef} className={`side-navbar ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <NavLink to="/askReceiptforCardlessWithdraw" onClick={() => setIsOpen(false)}>
              {t('Cardless Withdraw')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/cardless-deposit" onClick={() => setIsOpen(false)}>
              {t('Cardless Deposit')}
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
