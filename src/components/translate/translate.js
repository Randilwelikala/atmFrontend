import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './translate.css';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  useEffect(() => {
    i18n.changeLanguage(currentLang);
  }, [currentLang, i18n]);

  
  const toggleLanguage = () => {
    setCurrentLang(prev => (prev === 'en' ? 'si' : 'en'));
  };
  
  const buttonLabel = currentLang === 'en' ? 'සිංහල' : 'English';

  return (
    <button
      id="language-toggle-btn"
      className="language-toggle-button"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      title="Toggle language between English and Sinhala"
    >
      {buttonLabel}
    </button>
  );
};

export default LanguageToggle;
