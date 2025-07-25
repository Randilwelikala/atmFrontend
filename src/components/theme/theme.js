import React, { useEffect, useState } from 'react';
import './theme.css';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';



const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    
    <button
      id="theme-toggle-btn"
      className={`theme-toggle-button ${isDark ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle light/dark mode"
    >
      {isDark ? t('Light Mode') : t('Dark Mode')}
    </button>
  );
};

export default ThemeToggle;
