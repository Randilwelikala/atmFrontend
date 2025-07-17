// In CancelButton.js
import React from 'react';

const ClearButton = ({ onClick }) => (
  <button onClick={onClick} className="cancel-btn">
    Clear
  </button>
);

export default ClearButton;
