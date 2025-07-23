import './homeButton.css';
import { useTranslation } from 'react-i18next';
import React from 'react';

const ClearButton = ({ onClick }) => {
  const { t, i18n } = useTranslation();

  return (
    <button onClick={onClick} className="clear-btn">
      {t('Home')}
    </button>
  );
};

export default ClearButton;
