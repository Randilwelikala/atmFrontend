import React, {useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import LogoutButton from '../../components/logoutButton/logoutButton'; 

export default function CardlessDashboard() {
  const navigate = useNavigate(); 
 
  
  return (
    <div className="atm-home-container">   
      <SessionTimeout timeoutDuration={500000} />              
      
      <div className="atm-column card">
        <h2>Cardless Transactions</h2>
        <button onClick={() => navigate(`/askReceiptforCardlessWithdraw`)}>
          Withdraw Money
        </button>
        <button onClick={() => navigate(`/askCardless`)}>
          Deposit Money
        </button>        
                 
        
        
      </div>
    </div>
  );
}
