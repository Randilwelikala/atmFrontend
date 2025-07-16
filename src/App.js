import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import CheckPin from './pages/checkPin/checkPin';
import GetCardAccountNumberandPin from './pages/getCardAccountNumberAndPin/getCardAccountNumberandPin';
import GetCardAccountNumberandPin2 from './pages/getCardAccountNumberAndPin2/getCardAccountNumberandPin2';
import AccountDetails from './pages/accountDetails/accountDetails';
import CardViewBalancePin from './pages/cardViewBalancePin/cardViewBalancePin';
import Deposit from './pages/deposit/deposit';
import AskCardless from './pages/askForReceiptCardlessTransactions/askForReceiptCardlessTransactions';
import AskCard from './pages/askForReceiptCardTransactions/askForReceiptCardlTransactions';
import SeeBalance from './pages/seeBalance/seeBalance';
import ChangePin from './pages/changePin/changePin';
import EnterAccountNumber from './pages/enterAccountNumber/enterAccountNumber';
import CardDashboard from './pages/cardDashboard/cardDashboard';
import AskCardWithdrawalReceipt from './pages/askReceiptForCardWithdrawal/askReceiptForCardWithdrawal';
import Withdraw from './pages/withdraw/withdraw';

export default function App() {
  const [user, setUser] = useState(null);

  // if (!user) {
  //   return <Login onLogin={setUser} />;GetCardAccountNumberandPin
  // }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cardless-deposit" element={<EnterAccountNumber />} />
        <Route path="/AccountDetails" element={<AccountDetails />} />
        <Route path="/check-pin" element={<CheckPin />} />
        <Route path="/Deposit" element={<Deposit />} />
        <Route path="/GetCardAccountNumberandPin" element={<GetCardAccountNumberandPin />} />
        <Route path="/GetCardAccountNumberandPin2" element={<GetCardAccountNumberandPin2 />} />        
        <Route path="/CardViewBalancePin" element={<CardViewBalancePin />} />
        <Route path="/SeeBalance" element={<SeeBalance />} />
        <Route path="/change-pin" element={<ChangePin />} />
        <Route path="/askCardless" element={<AskCardless />} />
        <Route path="/askCard" element={<AskCard />} />
        <Route path='/cardDashboard' element={<CardDashboard/>}/>
        <Route path="/askCardWithdrawal" element={<AskCardWithdrawalReceipt />} />
        <Route path="/Withdraw" element={<Withdraw />} />
        

              
      </Routes>
    </Router>
  );
}



