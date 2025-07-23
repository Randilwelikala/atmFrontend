import React from 'react';
import './backButton.css';
import { useTranslation } from 'react-i18next';

const CancelButton = ({ onClick }) => {
  const { t, i18n } = useTranslation();

  return(
  <button onClick={onClick} className="cancel-btn">
    {t('Back')}
  </button>
  );
};

export default CancelButton;



