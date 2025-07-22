import React, { useState, useEffect } from 'react';
import Deposit from '../cardDepositMoney/cardDepositMoney';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import './accountDetails.css';
import { useTranslation } from 'react-i18next';

export default function AccountActions() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');  
  const [transaction, setTransaction] = useState(null);
  const [user, setUser] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { t, i18n } = useTranslation();
 
  useEffect(() => {
    if (!accountNumber) return;
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/user/${accountNumber}`);
        setUser(res.data);
        setErrorMsg('');
      } catch {
        setErrorMsg('User not found');
      }
    };
    fetchUserDetails();
  }, [accountNumber]);

  const handleTransaction = (type, amount) => {
    setTransaction({ type, amount });
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleConfirmDeposit = async () => {
    try {
      const res = await axios.post('http://localhost:3001/deposit', {
        accountNumber,
        amount: Number(transaction.amount),
      });
      setSuccessMsg(` Rs.${transaction.amount} deposited. New balance: Rs.${res.data.balance}`);
      setTransaction(null);       
      const updatedUser = await axios.get(`http://localhost:3001/user/${accountNumber}`);
      setUser(updatedUser.data);
    } catch {
      setErrorMsg(' Deposit failed');
    }
  };

  return (
    <div >
      <h2>{t('Make a Transaction')}</h2>
  
     
      {user && (
        <div style={{ marginBottom: 20 }}>
          <h3>{t('Account Details')}</h3>
          <p><strong>{t('Name')}:</strong> {user.name}</p>
          <p><strong>{t('Account Number')}:</strong> {user.accountNumber}</p>
          <p><strong>{t('Branch')}:</strong> {user.branch}</p>
          <p><strong>{t('Account Type')}:</strong> {user.accountType}</p>
          <p><strong>{t('Current Balance')}:</strong> {t('Rs')}. {user.balance}</p>
        </div>
      )}
  
      {!transaction && <Deposit onSubmit={handleTransaction} />}
  
      {errorMsg && <p >{errorMsg}</p>}
      {successMsg && <p >{successMsg}</p>}
  
      {transaction && (
        <div style={{ marginTop: 30 }}>
          <h3>{t('Confirm Deposit')}</h3>
          <p><strong>Amount to Deposit:</strong> Rs. {transaction.amount}</p>
  
          <button onClick={handleConfirmDeposit} style={{ marginTop: 10 }}>
            {t("Confirm Deposit")}
          </button>
        </div>
      )}
    </div>
  );
  
}