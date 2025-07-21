import React from 'react';
import { useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import LogoutButton from '../../components/logoutButton/logoutButton'; 
import './cardlessDashboard.css';
import '../../components/cardlessSideNavbar/cardlessSideNavbar'
import CardlessSideNavbar from '../../components/cardlessSideNavbar/cardlessSideNavbar';

export default function CardlessDashboard() {
  const navigate = useNavigate(); 
 
  return (
    <>
    
    <div className="cardless-dashboard-container" id="cardless-dashboard">
      <SessionTimeout timeoutDuration={500000} />  
      <CardlessSideNavbar/>      

      <div className="cardless-dashboard-content">
        <h2 className="cardless-title">Cardless Transactions</h2>
        <button 
          className="cardless-withdraw-btn" 
          onClick={() => navigate(`/askReceiptforCardlessWithdraw`)}
        >
          Withdraw Money
        </button>
        <button 
          className="cardless-deposit-btn" 
          onClick={() => navigate(`/askCardless`)}
        >
          Deposit Money
        </button>        
      </div>
    </div>
    </>
  );
}
