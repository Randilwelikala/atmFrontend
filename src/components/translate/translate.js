import React from 'react';
import { useTranslation } from 'react-i18next';
import './translate.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage('en')}>EN</button>
      <button onClick={() => changeLanguage('si')}>සිං</button>
    </div>
  );
};

export default LanguageSwitcher;
