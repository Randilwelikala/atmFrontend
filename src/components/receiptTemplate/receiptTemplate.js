import React from 'react';
import './receiptTemplate.css';

const ReceiptTemplate = ({ transactionData }) => {
  if (!transactionData) return null;

  return (
    <div className="summary" id="html-receipt">
      <h2>Foreign Money Deposit</h2>

      <div className="summary-section">
        <h3>Sender Details</h3>
        <div className="summary-grid">
          <p><strong>Name:</strong> {transactionData.sender.name}</p>
          <p><strong>Bank:</strong> {transactionData.sender.bankName}</p>
          <p><strong>Branch:</strong> {transactionData.sender.branch}</p>
          <p><strong>Account No:</strong> {transactionData.sender.accountNumber}</p>
        </div>
      </div>

      <div className="summary-section">
        <h3>Receiver Details</h3>
        <div className="summary-grid">
          <p><strong>Name:</strong> {transactionData.receiver.name}</p>
          <p><strong>Bank:</strong> {transactionData.receiver.bankName}</p>
          <p><strong>Branch:</strong> {transactionData.receiver.branch}</p>
          <p><strong>Account No:</strong> {transactionData.receiver.accountNumber}</p>
        </div>
      </div>

      <div className="summary-section">
        <h3>Transaction Details</h3>
        <div className="summary-grid">
          <p><strong>Currency:</strong> {transactionData.transaction.currency}</p>
          <p><strong>Amount Sent:</strong> {transactionData.transaction.amount}</p>
          <p><strong>LKR Deposit:</strong> Rs.{transactionData.transaction.requiredLKR}</p>
          <p><strong>Status:</strong> {transactionData.transaction.status}</p>
          <p><strong>Date & Time:</strong> {new Date(transactionData.transaction.timestamp).toLocaleString()}</p>
        </div>
      </div>

      <h3 className="success-text">Transaction Successful!</h3>
    </div>
  );
};

export default ReceiptTemplate;
