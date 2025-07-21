import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "Withdraw Money": "Withdraw Money",
      "Name": "Name",
      "Account Number": "Account Number",
      "Branch": "Branch",
      "Account Type": "Account Type",
      "Current Balance": "Current Balance",
      "Amount to Withdraw:": "Amount to Withdraw:",
      "Withdraw successful!": "Withdraw successful!",
      "Withdraw Receipt": "Withdraw Receipt",
      "Homagama":"Homagama",
      // Add all text keys you want to translate
    }
  },
  si: {
    translation: {
      "Withdraw Money": "මුදල් ඉවත් කිරීම",
      "Name": "නම",
      "Account Number": "ගිණුම් අංකය",
      "Branch": "ශාඛාව",
      "Account Type": "ගිණුම් වර්ගය",
      "New Balance": "වත්මන් ශේෂය",
      "Amount to Withdraw:": "ඉවත් කිරීමට ඇති මුදල:",
      "Withdraw successful!": "ඉවත් කිරීම සාර්ථකයි!",
      "Withdraw Receipt": "ඉවත් කිරීමේ ලිපිනය",
    //   "Homagama"
      // Add all Sinhala translations similarly
    }
  },
  // Add more languages as needed
};

i18n
  .use(LanguageDetector) // detects user language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    }
  });

export default i18n;
