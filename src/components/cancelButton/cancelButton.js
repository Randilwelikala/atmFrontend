// In CancelButton.js
import React from 'react';

const CancelButton = ({ onClick }) => (
  <button onClick={onClick} className="cancel-btn">
    Cancel
  </button>
);

export default CancelButton;
