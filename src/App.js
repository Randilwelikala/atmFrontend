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
import axios from 'axios';
import LogoutButton from './components/logoutButton/logoutButton';
import ProtectedRoute from './components/auth/protectedRoute';

export default function App() {
  const [user, setUser] = useState(null);
  axios.defaults.withCredentials = true;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cardless-deposit" element={<ProtectedRoute><EnterAccountNumber /></ProtectedRoute>} />
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
        <Route path="/session" element={<SessionTimeout />} />
        <Route path="/cardDashboard" element={<CardDashboard />} />
        
      </Routes>     

      <CancelButton onClick={() => window.history.back()} label="Go Back" />
      <CancelButton onClick={() => (window.location.href = '/')} />
      
      <Outlet />
    </Router>
  );
}
