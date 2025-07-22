import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './translate.css';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  // Initialize language state from i18n current language
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  useEffect(() => {
    i18n.changeLanguage(currentLang);
  }, [currentLang, i18n]);

  // Toggle language between 'en' and 'si'
  const toggleLanguage = () => {
    setCurrentLang(prev => (prev === 'en' ? 'si' : 'en'));
  };

  // Button label depending on current language
  const buttonLabel = currentLang === 'en' ? 'සිං' : 'EN';

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
