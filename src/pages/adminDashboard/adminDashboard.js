import React from 'react';
import { useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import './adminDashboard.css';
import '../../components/cardlessSideNavbar/cardlessSideNavbar'
import CardlessSideNavbar from '../../components/cardlessSideNavbar/cardlessSideNavbar';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const navigate = useNavigate(); 
   const { t, i18n } = useTranslation();
  
 
  return (
    <>
    
    <div className="admin-dashboard-container" id="admin-dashboard">
      <SessionTimeout timeoutDuration={500000} />  
      <CardlessSideNavbar/>      

      <div className="admin-dashboard-content">
        <h2 className="admin-title">{t('Admin Dashboard')}</h2>
        <button 
          className="admin-withdraw-btn" 
          onClick={() => navigate(`/adminAddMoney`)}
        >
          {t('Add Money')}
        </button>
        
      </div>
    </div>
    </>
  );
}
