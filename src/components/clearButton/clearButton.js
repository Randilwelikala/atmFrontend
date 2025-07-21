import './clearButton.css';


import React from 'react';

const ClearButton = ({ onClick }) => (
  <button onClick={onClick} className="clear-btn">
    Home
  </button>
);

export default ClearButton;
