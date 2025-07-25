import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import './cardlessSideNavbar.css';
import { useTranslation } from 'react-i18next';

export default function CardlessSideNavbar() {
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
              to={`/askReceiptforCardlessWithdraw`}
              
              onClick={handleLinkClick}
            >
              {t('Cardless Withdraw')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/cardless-deposit`}
              
              onClick={handleLinkClick}
            >
              {t('Cardless Deposit')} 
            </NavLink>
          </li>
          
          
        </ul>
      </nav>
    </>
  );
}
