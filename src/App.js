import React, { useState } from 'react';
// import Login from './components/Login';
import Home from './components/Home';
import CheckPin from './components/CheckPin';
import GetCardAccountNumberandPin from './components/GetCardAccountNumberandPin';
import GetCardAccountNumberandPin2 from './components/GetCardAccountNumberandPin2';
// import ViewBalance from './components/ViewBalance';
import AccountDetails from './components/AccountDetails';
import CardViewBalancePin from './components/CardViewBalancePin';
import Deposit from './components/Deposit';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnterAccountNumber from './components/EnterAccountNumber';

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
        {/* <Route path="/ViewBalance" element={<ViewBalance />} /> */}
        <Route path="/CardViewBalancePin" element={<CardViewBalancePin />} />
      </Routes>
    </Router>
  );
}
