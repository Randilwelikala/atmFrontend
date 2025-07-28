import React from 'react';
import './backButton.css';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaBackspace } from 'react-icons/fa';

const CancelButton = ({ onClick }) => {
  const { t, i18n } = useTranslation();

  return(
  <button onClick={onClick} className="cancel-btn"><FaArrowLeft/>
    {/* {t('Back')} */}
  </button>
  );
};

export default CancelButton;



