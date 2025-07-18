import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import SessionTimeout from '../../components/sessionTimeout/sessionTimeout'
import jsPDF from "jspdf";
import { useNavigate } from 'react-router-dom';
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

function Deposit() {
  const [searchParams] = useSearchParams();
  const accountNumber = searchParams.get('account');
  const [depositedAmount, setDepositedAmount] = useState('');
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // if (!accountNumber) return;
    axios.get(`http://localhost:3001/user/${accountNumber}`)
      .then(res => setUser(res.data))
    //   .catch(() => setError('User not foundddd'));
  }, [accountNumber]);

const handleDownload = () => {
  const doc = new jsPDF();
  autoTable(doc, {   // <-- note how you call autoTable passing doc as first param
    head: [['Field', 'Value']],
    body: [
      ['Account Number', user.accountNumber],
      ['Name', user.name],
      ['Branch', user.branch],
      ['Account Type', user.accountType],
      ['Deposited Amount', `Rs. ${depositedAmount}`],
      ['New Balance', `Rs. ${user.balance}`],
    ],
  });

    doc.save('transaction_receipt.pdf');
  };


  const handleDownloadDocx = async () => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: "🧾 Transaction Receipt", bold: true, size: 28 }),
          ],
        }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: `Account Number: ${user.accountNumber}` }),
        new Paragraph({ text: `Name: ${user.name}` }),
        new Paragraph({ text: `Branch: ${user.branch}` }),
        new Paragraph({ text: `Account Type: ${user.accountType}` }),
        new Paragraph({ text: `Deposited Amount: Rs. ${depositedAmount}` }),
        new Paragraph({ text: `New Balance: Rs. ${user.balance}` }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "transaction_receipt.docx");
};

  // Function to skip receipt
  const handleSkip = () => {
    navigate('/cardDashboard?account=' + accountNumber); // or any other page
  };

  const handleDeposit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:3001/deposit', {
        accountNumber,
        amount: parseFloat(amount),
      });
      setMessage(res.data.message || `Deposit successful!`);
      setUser(prev => ({ ...prev, balance: res.data.balance }));
      setDepositedAmount(amount); 
      setAmount('');
      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Something went wrong');
        }
      }

  };

  if (error) return <p >{error}</p>;
  if (!user) return <p >Loading user details...</p>;

  return (
    <div className="container">
      <SessionTimeout timeoutDuration={50000000} />
      <h2 className="title">Deposit Money</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Account Number:</strong> {user.accountNumber}</p>
      <p><strong>Branch:</strong> {user.branch}</p>
      <p><strong>Account Type:</strong> {user.accountType}</p>
      <p><strong>Current Balance:</strong> Rs. {user.balance}</p>
  
      <form onSubmit={handleDeposit} className="form">
        <label className="label">Amount to Deposit:</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}                 
          className="input"
        />
        <button type="submit" className="btn">Deposit</button>
      </form>
  
      {message && (
        localStorage.getItem('wantsReceipt') === 'yes' ? (
          <div className="receipt-box">
            <h3>🧾 Transaction Receipt</h3>
            <p><strong>Account:</strong> {user.accountNumber}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Branch:</strong> {user.branch}</p>
            <p><strong>Account Type:</strong> {user.accountType}</p>
            <p><strong>Deposited Amount:</strong> Rs. {depositedAmount}</p>
            <p><strong>New Balance:</strong> Rs. {user.balance}</p>
            <p className="success">✅ Deposit successful!</p>

            <div style={{ marginTop: '10px' }}>
              <button onClick={handleDownload} className="btn" style={{ display: 'block', width: '100%', padding: '8px' }}>
            Download PDF
          </button>
          <button onClick={handleDownloadDocx} className="btn" style={{ display: 'block', width: '100%', padding: '8px' }}>
            Download DOCX
          </button>
              <button onClick={handleSkip} className="btn" style={{ marginLeft: '10px' }}>Skip</button>
              <button onClick={handleDownloadDocx} className="btn" style={{ marginLeft: '10px' }}>Download DOCX</button>
            </div>
          </div>
        ) : (
          <p className="success">✅ Deposit successful!</p>
        )
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
  
}

export default Deposit;
