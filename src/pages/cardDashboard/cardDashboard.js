import React, {useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function CardDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');

  useEffect(() => {
  const timeout = setTimeout(() => {
    const extend = window.confirm('Session is about to expire. Do you want more time?');
    if (extend) {
      // Reset the timer by calling the same useEffect again (refresh the component)
      window.location.reload(); // quick way to reset session timer for now
    } else {
      navigate('/cardLogin'); // or use '/' to go to home
    }
  }, 5000); // 5 seconds for testing

  return () => clearTimeout(timeout);
}, [navigate]);
 
  if (!accountNumber) {
    return <p >Loading...</p>;
  }

  return (
    <div className="atm-home-container">                 
      <div className="atm-column card">
        <h2>Card Transactions</h2>
        <button onClick={() => navigate(`/AskCard?account=${accountNumber}`)}>
          Deposit Money
        </button>
        <button onClick={() => navigate(`/askCardWithdrawal?account=${accountNumber}`)}>
          Withdraw Money
        </button>        
        <button onClick={() => navigate(`/SeeBalance?account=${accountNumber}`)}>
          View Balance            
        </button>          
        <button onClick={() => navigate(`/change-pin?account=${accountNumber}`)}>
          Change PIN
        </button>
      </div>
    </div>
  );
}
