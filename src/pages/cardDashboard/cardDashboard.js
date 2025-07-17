import React, {useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function CardDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');

  useEffect(() => {
    // 5-minute timeout (in milliseconds)
    const timeout = setTimeout(() => {
      alert('Session expired due to inactivity.');
      navigate('/');
    }, 5 * 1000);

    // Clear timeout if user navigates away or component unmounts
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
