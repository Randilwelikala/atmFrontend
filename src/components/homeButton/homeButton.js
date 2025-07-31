import './homeButton.css';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { FaHome } from 'react-icons/fa';

const ClearButton = ({ onClick }) => {
  const { t, i18n } = useTranslation();

  return (
    <button onClick={onClick} className="clear-btn" title={t('Home')}><FaHome />
      
    </button>
  );
};

export default ClearButton;