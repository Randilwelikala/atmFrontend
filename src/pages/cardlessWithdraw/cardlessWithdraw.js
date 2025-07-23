import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import './cardlessWithdraw.css';
import SideNavbar from '../../components/cardlessSideNavbar/cardlessSideNavbar';
import { useTranslation } from 'react-i18next';


function CardlessWithdraw() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const [depositedAmount, setDepositedAmount] = useState('');
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [breakdown, setBreakdown] = useState({});
  const { t, i18n } = useTranslation();


  useEffect(() => {
    axios.get(`http://localhost:3001/user/${accountNumber}`)
      .then(res => setUser(res.data))
      .catch(() => setError('User not found'));
  }, [accountNumber]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setOpen(prev => !prev);

  const downloadPDF = () => {
    setOpen(false);
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Field', 'Value']],
      body: [
        ['Withdraw ID', transactionId],
        ['Withdraw Date', transactionDate],
        ['Account Number', user.accountNumber],
        ['Name', user.name],
        ['Branch', user.branch],
        ['Account Type', user.accountType],
        ['Withdrawed Amount', `Rs. ${depositedAmount}`],
        ['New Balance', `Rs. ${user.balance}`],
      ],
    });
    doc.save('Withdraw_receipt.pdf');
  };

  const downloadDOCX = async () => {
    setOpen(false);
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "Withdraw Receipt", bold: true, size: 28 }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: `Withdraw ID: ${transactionId}` }),
          new Paragraph({ text: `Withdraw Date: ${transactionDate}` }),
          new Paragraph({ text: `Account Number: ${user.accountNumber}` }),
          new Paragraph({ text: `Name: ${user.name}` }),
          new Paragraph({ text: `Branch: ${user.branch}` }),
          new Paragraph({ text: `Account Type: ${user.accountType}` }),
          new Paragraph({ text: `Withdrawed Amount: Rs. ${depositedAmount}` }),
          new Paragraph({ text: `New Balance: Rs. ${user.balance}` }),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Withdraw_receipt.docx");
  };

  const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const handleSkip = () => {
    navigate('/cardlessDashboard');
  };

  const handleWithdraw = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:3001/withdraw', {
        accountNumber,
        amount: parseFloat(amount),
      });
      setMessage(res.data.message || `Withdraw successful!`);
      setBreakdown(res.data.breakdown || {});
      setUser(prev => ({ ...prev, balance: res.data.balance }));
      setDepositedAmount(amount);
      setAmount('');
      const newTxnId = generateTransactionId();
      setTransactionId(newTxnId);
      const now = new Date();
      setTransactionDate(now.toLocaleString());
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>{t('Loading user details...')}</p>;

  return (
    <>
    <SideNavbar/>
      
      <div className="withdraw-container" id="withdraw-page">
        <SessionTimeout timeoutDuration={50000000} />      
        <h2 className="withdraw-title">{t('Withdraw Money')}</h2>

        <div className="withdraw-user-details">
          <p><strong>{t('Name')}:</strong> {user.name}</p>
          <p><strong>{t('Account Number')}:</strong> {user.accountNumber}</p>
          <p><strong>{t('Branch')}:</strong> {user.branch}</p>
          <p><strong>{t('Account Type')}:</strong> {user.accountType}</p>
          <p><strong>{t('New Balance')}:</strong> Rs. {user.balance}</p>
          {Object.keys(breakdown).length > 0 && (
            <>
                <h4>{t('Dispensed Cash Breakdown')}:</h4>
                <ul>
                {Object.entries(breakdown).map(([note, count]) => (
                    <li key={note}><strong>Rs. {note} * </strong> {count}</li>
                ))}
                </ul>
            </>
            )}


        </div>

        <form onSubmit={handleWithdraw} className="withdraw-form">
          <label className="withdraw-label">{t('Amount to Withdraw')}:</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="withdraw-input"
          />
          <button type="submit" className="withdraw-btn">Withdraw</button>
        </form>

        {message && (
          localStorage.getItem('wantsReceipt') === 'yes' ? (
            <div className="withdraw-receipt">
              <h3>{t('Withdraw Receipt')}</h3>    
              <br/>
              <p><strong>{t('Withdraw ID')}:</strong> {transactionId}</p>
              <p><strong>{t('Withdraw Date')}:</strong> {transactionDate}</p>
              <p><strong>{t('Account')}:</strong> {user.accountNumber}</p>
              <p><strong>{t('Name')}:</strong> {user.name}</p>
              <p><strong>{t('Branch')}:</strong> {user.branch}</p>
              <p><strong>{t('Account Type')}:</strong> {user.accountType}</p>
              <p><strong>{t('Withdrawed Amount')}:</strong> {t('Rs')}. {depositedAmount}</p>
              <p><strong>{t('New Balance')}:</strong> {t('Rs')}. {user.balance}</p>
              <p className="withdraw-success">{t('Withdraw successful!')}</p>

              <div className="withdraw-download-group" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="withdraw-btn">{t('Download')} ▼</button>
                {open && (
                  <div className="withdraw-dropdown">
                    <button onClick={downloadPDF} className="withdraw-dropdown-btn">{t('Download as PDF')}</button>
                    <button onClick={downloadDOCX} className="withdraw-dropdown-btn">{t('Download as DOCX')}</button>
                  </div>
                )}
                <button onClick={handleSkip} className="withdraw-btn secondary">{t('Skip')}</button>
              </div>
            </div>
          ) : (
            <p className="withdraw-success">{t('Withdraw successful!')}</p>
          )
        )}

        {error && <p className="withdraw-error">{error}</p>}
      </div>     
    </>
  );
}

export default CardlessWithdraw;
