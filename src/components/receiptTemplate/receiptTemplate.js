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
          <p><strong>Name:</strong> {transactionData?.sender?.name || 'N/A'}</p>
          <p><strong>Bank:</strong> {transactionData?.sender?.bankName || 'N/A'}</p>
          <p><strong>Branch:</strong> {transactionData?.sender?.branch || 'N/A'}</p>
          <p><strong>Account No:</strong> {transactionData?.sender?.accountNumber || 'N/A'}</p>
        </div>
      </div>

      <div className="summary-section">
        <h3>Receiver Details</h3>
        <div className="summary-grid">
          <p><strong>Name:</strong> {transactionData?.receiver?.name || 'N/A'}</p>
          <p><strong>Bank:</strong> {transactionData?.receiver?.bankName || 'N/A'}</p>
          <p><strong>Branch:</strong> {transactionData?.receiver?.branch || 'N/A'}</p>
          <p><strong>Account No:</strong> {transactionData?.receiver?.accountNumber || 'N/A'}</p>
        </div>
      </div>

      <div className="summary-section">
        <h3>Transaction Details</h3>
        <div className="summary-grid">
          <p><strong>Currency:</strong> {transactionData?.transaction?.currency || 'N/A'}</p>
          <p><strong>Amount Sent:</strong> {transactionData?.transaction?.amount || 'N/A'}</p>
          <p><strong>LKR Deposit:</strong> Rs.{transactionData?.transaction?.requiredLKR || '0.00'}</p>
          <p><strong>Status:</strong> {transactionData?.transaction?.status || 'N/A'}</p>
          <p>
            <strong>Date & Time:</strong>{' '}
            {transactionData?.transaction?.timestamp
              ? new Date(transactionData.transaction.timestamp).toLocaleString()
              : 'N/A'}
          </p>
        </div>
      </div>

      <h3 className="success-text">Transaction Successful!</h3>
    </div>
  );
};

export default ReceiptTemplate;
