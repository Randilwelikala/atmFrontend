// In CancelButton.js
import React from 'react';
import './cancelButton.css';

const CancelButton = ({ onClick }) => (
  <button onClick={onClick} className="cancel-btn">
    Cancel
  </button>
);

export default CancelButton;
