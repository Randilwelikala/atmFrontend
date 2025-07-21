import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Home from './pages/home/home';
import CheckPin from './pages/checkPin/checkPin';
import GetCardAccountNumberandPin from './pages/getCardAccountNumberAndPin/getCardAccountNumberandPin';
import AccountDetails from './pages/accountDetails/accountDetails';
import CardViewBalancePin from './pages/cardViewBalancePin/cardViewBalancePin';
import Deposit from './pages/deposit/deposit';
import AskCardless from './pages/askForReceiptCardlessTransactions/askForReceiptCardlessTransactions';
import AskCard from './pages/askForReceiptCardTransactions/askForReceiptCardlTransactions';
import SeeBalance from './pages/seeBalance/seeBalance';
import ChangePin from './pages/changePin/changePin';
import EnterAccountNumber from './pages/enterAccountNumber/enterAccountNumber';
import CardDashboard from './pages/cardDashboard/cardDashboard';
import SessionTimeout from './components/sessionTimeout/sessionTimeout';
import AskCardWithdrawalReceipt from './pages/askReceiptForCardWithdrawal/askReceiptForCardWithdrawal';
import Withdraw from './pages/withdraw/withdraw';
import CancelButton from './components/cancelButton/cancelButton';
import ClearButton from './components/clearButton/clearButton';
import LogoutButton from './components/logoutButton/logoutButton';
import CardlessideNavbar from './components/cardlessSideNavbar/cardlessSideNavbar';
import CardSideNavbar from './components/cardNavbar/cardNavbar';
import axios from 'axios';
import CardlessWithdrawOTP from './pages/cardlessWithdrawOTP/cardlessWithdrawOTP';
import CardlessDashboard from './pages/cardlessDashboard/cardlessDashboard';
import AskCardlessWithdraw from './pages/askReceiptforCardlessWithdraw/askReceiptforCardlessWithdraw';
import FundTransfer from '../src/pages/fundTransfer/fundTransfer'
import CardlessSideNavbar from './components/cardlessSideNavbar/cardlessSideNavbar';
export default function App() {
  const [user, setUser] = useState(null);
  axios.defaults.withCredentials = true;

  return (
    <Router>
      <LogoutButton onClick={()=>(window.location.href = '/')}/>        
      <Routes>
        <Route path='/cardlessDashboard' element={<CardlessDashboard/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/cardless-deposit" element={<EnterAccountNumber />} />
        <Route path="/AccountDetails" element={<AccountDetails />} />
        <Route path="/check-pin" element={<CheckPin />} />
        <Route path="/Deposit" element={<Deposit />} />
        <Route path="/GetCardAccountNumberandPin" element={<GetCardAccountNumberandPin />} />        
        <Route path="/CardViewBalancePin" element={<CardViewBalancePin />} />
        <Route path="/SeeBalance" element={<SeeBalance />} />
        <Route path="/change-pin" element={<ChangePin />} />
        <Route path="/askCardless" element={<AskCardless />} />
        <Route path="/askCard" element={<AskCard />} />
        <Route path="/askCardWithdrawal" element={<AskCardWithdrawalReceipt />} />
        <Route path="/Withdraw" element={<Withdraw />} />
        <Route path="/cancelButton" element={<CancelButton />} />
        <Route path="/clearButton" element={<ClearButton />} />
        <Route path="/logoutButton" element={<LogoutButton/>} />
        <Route path="/session" element={<SessionTimeout />} />
        <Route path="/cardDashboard" element={<CardDashboard />} />
        <Route path="/cardlessWithdraw" element={<CardlessWithdrawOTP />} />
        <Route path="/askReceiptforCardlessWithdraw" element={<AskCardlessWithdraw />} />
        <Route path="/fundTransfer" element={<FundTransfer />} />
        <Route path='/cardlessSideNavbar' element={<CardlessSideNavbar/>}/>
        <Route path='/cardSideNavbar' element={<CardSideNavbar/>}/>
        
        
            
      </Routes>     

      <CancelButton onClick={() => window.history.back()} />        
      <ClearButton onClick={() => (window.location.href = '/')} />
      
      
      <Outlet />
    </Router>
  );
}
