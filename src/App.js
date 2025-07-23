import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Home from './pages/home/home';
import GetCardAccountNumberandPin from './pages/getCardAccountNumberAndPin/getCardAccountNumberandPin';
import Deposit from './pages/cardDepositMoney/cardDepositMoney';
import AskCardless from './pages/askForReceiptCardlessTransactions/askForReceiptCardlessTransactions';
import AskCard from './pages/askForReceiptCardTransactions/askForReceiptCardlTransactions';
import SeeBalance from './pages/seeBalance/seeBalance';
import ChangePin from './pages/changePin/changePin';
import EnterAccountNumber from './pages/enterAccountNumber/enterAccountNumber';
import CardDashboard from './pages/cardDashboard/cardDashboard';
import SessionTimeout from './components/sessionTimeout/sessionTimeout';
import AskCardWithdrawalReceipt from './pages/askReceiptForCardWithdrawal/askReceiptForCardWithdrawal';
import Withdraw from './pages/withdraw/withdraw';
import CancelButton from './components/backButton/backButton';
import ClearButton from './components/homeButton/homeButton';
import LogoutButton from './components/logoutButton/logoutButton';
import CardSideNavbar from './components/cardSideNavbar/cardSideNavbar';
import axios from 'axios';
import CardlessWithdrawOTP from './pages/cardlessWithdrawOTP/cardlessWithdrawOTP';
import CardlessDashboard from './pages/cardlessDashboard/cardlessDashboard';
import AskCardlessWithdraw from './pages/askReceiptforCardlessWithdraw/askReceiptforCardlessWithdraw';
import FundTransfer from '../src/pages/fundTransfer/fundTransfer'
import CardlessSideNavbar from './components/cardlessSideNavbar/cardlessSideNavbar';
import CardlessDeposit from './pages/cardlessDepositMoney/cardlessDepositMoney';
import CardlessWithdraw from './pages/cardlessWithdraw/cardlessWithdraw';
import './translate/i18n';
import LanguageSwitcher from './components/translate/translate';
import ThemeToggle from'./components/theme/theme';
import TransactionHistory from './pages/pastTransaction/pastTransaction'
import DownloadHistoryOTP from './pages/downloadHistoryOTP/downloadHistoryOTP';




export default function App() {
  const [user, setUser] = useState(null);
  axios.defaults.withCredentials = true;

  return (
    <Router>
      <LogoutButton onClick={()=>(window.location.href = '/')}/>      
        <ClearButton onClick={() => (window.location.href = '/')} />
        <CancelButton onClick={() => window.history.back()} />    
        <LanguageSwitcher/>
        <ThemeToggle/>

      <Routes>
        <>
        <Route path='/cardlessDashboard' element={<CardlessDashboard/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/cardless-deposit" element={<EnterAccountNumber />} />
        <Route path="/Deposit" element={<Deposit />} />
        <Route path="/GetCardAccountNumberandPin" element={<GetCardAccountNumberandPin />} />        
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
        <Route path='/cardlessDeposit' element={<CardlessDeposit/>}/>
        <Route path='/cardlessWithdrawto' element={<CardlessWithdraw/>}/>
        <Route path='/pastTransaction' element={<TransactionHistory/>}/>
        <Route path='/downloadHistoryOTP' element={<DownloadHistoryOTP/>}/>
        </>
        
            
      </Routes>     
      
           
      
      <Outlet />
    </Router>
  );
}