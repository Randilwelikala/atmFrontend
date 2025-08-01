import React from 'react';
import { useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import './auditDashboard.css';
import '../../components/cardlessSideNavbar/cardlessSideNavbar'
import CardlessSideNavbar from '../../components/cardlessSideNavbar/cardlessSideNavbar';
import { useTranslation } from 'react-i18next';

export default function AuditDashboard() {
  const navigate = useNavigate(); 
   const { t, i18n } = useTranslation();
  
 
  return (
    <>
    
    <div className="audit-dashboard-container" id="audit-dashboard">
      <SessionTimeout timeoutDuration={500000} />  
      <CardlessSideNavbar/>      

      <div className="audit-dashboard-content">
        <h2 className="audit-title">{t('Audit Dashboard')}</h2>
        <button 
          className="audit-withdraw-btn" 
          onClick={() => navigate(`/auditAllDetails`)}
        >
          {t('See All Details')}
        </button> 

                
      </div>

      

    </div>
    </>
  );
}
