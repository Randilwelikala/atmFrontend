import React, { useState } from 'react';
// import Login from './components/Login';
import Home from './pages/Home';
import CheckPin from './pages/CheckPin';
import GetCardAccountNumberandPin from './pages/GetCardAccountNumberandPin';
import GetCardAccountNumberandPin2 from './pages/GetCardAccountNumberandPin2';
import AccountDetails from './pages/AccountDetails';
import CardViewBalancePin from './pages/CardViewBalancePin';
import Deposit from './pages/Deposit';
import SeeBalance from './pages/SeeBalance';
import ChangePin from './pages/ChangePin';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnterAccountNumber from './pages/EnterAccountNumber';

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
      </Routes>
    </Router>
  );
}


<Route path="/change-pin" element={<ChangePin />} />
