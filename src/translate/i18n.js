import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  // en: {
  //   translation: {
  //     "Withdraw Money": "Withdraw Money",
  //     "Name": "Name",
  //     "Account Number": "Account Number",
  //     "Branch": "Branch",
  //     "Account Type": "Account Type",
  //     "Current Balance": "Current Balance",
  //     "Amount to Withdraw:": "Amount to Withdraw:",
  //     "Withdraw successful!": "Withdraw successful!",
  //     "Withdraw Receipt": "Withdraw Receipt",
  //     "Homagama":"Homagama",
  //     "Welcome" : "Welcome",
  //     "Cardless Transactions" : "Cardless Transactions",
  //     // "Proceed" : "Proceed",
  //     "Card Transactions": "Card Transactions"
  //     // Add all text keys you want to translate
  //   }
  // },
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
      "Welcome" : "සාදරයෙන් පිළිගනිමු",
      "Cardless Transactions" : "කාඩ්පත් රහිත ගනුදෙනු",
      "Proceed" : "ඉදිරියට යන්න",
      "Card Transactions" : "කාඩ්පත් ගනුදෙනු",
      "Logout" : "පිටවීම",
      "Home" : "මුල් පිටුව",
      "Back" : "ආපසු",
      "Deposit Money" : "මුදල් තැන්පත් කරන්න",
      "Do you want a receipt for this Cardless transaction?" : "මෙම කාඩ්පත් රහිත ගනුදෙනුව සඳහා ඔබට රිසිට්පතක් අවශ්‍යද?",
      "yes" : "ඔව්",
      "No" : "නැත",
      "Cardless Withdraw - OTP Verification" : "කාඩ්පත් රහිත මුදල් ආපසු ගැනීම - OTP සත්‍යාපනය",
      "Enter Mobile Number:" : "ජංගම දුරකථන අංකය ඇතුලත් කරන්න:",
      "send OTP" : "OTP යවන්න",
      "OTP sent to" : "OTP යවන ලදී",
      "For testing" : "පරීක්ෂණ සඳහා",
      "OTP is" : "OTP යනු",
      "Enter OTP" : "OTP ඇතුලත් කරන්න",
      "Verify OTP" : "OTP තහවුරු කරන්න",
      "Amount to Withdraw" : "ආපසු ලබාගත යුතු මුදල",
      "Withdraw" : "ආපසු ගන්න",
      "Dispensed Cash Breakdown" : "බෙදා හරින ලද මුදල් ",
      "Withdraw Date" : "ආපසු ගැනීමේ දිනය",
      "Account" : "ගිණුම් අංකය",
      "Withdrawed Amount" : "ආපසු ගත් මුදල",
      "Withdraw ID" : "ආපසු ගැනීමේ අංකය",
      "Download" : "බාගත කරන්න",
      "Skip" : "මඟ හරින්න",
      "Download as PDF" : "PDF ලෙස ඩවුන්ලෝඩ් කරන්න",
      "Download as DOCX" : "DOCX ලෙස ඩවුන්ලෝඩ් කරන්න",
      "Enter Account Number" : "ගිණුම් අංකය ඇතුලත් කරන්න",
      "Enter account number" : "ගිණුම් අංකය ඇතුලත් කරන්න",
      "Next" : "ඊළඟ",
      "Re-enter account number" : "ගිණුම් අංකය නැවත ඇතුල් කරන්න",
      "Confirm" : "තහවුරු කරන්න",
      "Current Balance" : "වත්මන් ශේෂය",
      "Amount to Deposit" : "තැන්පත් කළ යුතු මුදල",
      "Deposit" : "තැන්පත් කිරීමට",
      "Transaction Receipt" : "ගනුදෙනු රිසිට්පත",
      "Transaction ID" : "ගනුදෙනු හැඳුනුම්පත",
      "Transaction Date" : "ගනුදෙනු දිනය",
      "Deposited Amount" : "තැන්පත් කළ මුදල",
      "Deposit successful!" : "තැන්පත් කිරීම සාර්ථකයි!",
      "Skip" : "මඟ හරින්න",
      "Homagama" : "හෝමාගම",
      "For Continue" : "දිගටම කරගෙන යාම සඳහා",
      "Card Number" : "කාඩ්පත් අංකය",
      "PIN" : "මුරපදය",
      "View Balance" : "ශේෂය බලන්න",
      "Change PIN" : "PIN එක වෙනස් කරන්න",
      "Fund Transfer" : "මුදල් හුවමාරු කිරීමට",
      "Do you want a receipt for this Card transaction?" : "මෙම කාඩ්පත් ගනුදෙනුව සඳහා ඔබට රිසිට්පතක් අවශ්‍යද?",
      "Do you want a receipt for this Card Withdraw?" : "මෙම කාඩ්පත ආපසු ගැනීම සඳහා ඔබට රිසිට්පතක් අවශ්‍යද?",
      "Account Details" : "ගිණුම් විස්තර",
      "Change Debit Card PIN" : "ඩෙබිට් කාඩ් පතේ PIN අංකය වෙනස් කිරීමට",
      "Old PIN" : "පැරණි PIN අංකය",
      "New PIN" : "නව PIN අංකය",      
      "Confirm New PIN" : "නව PIN අංකය තහවුරු කරන්න",
      "PIN changed successfully" : "PIN අංකය සාර්ථකව වෙනස් විය",
      "Same Bank Transfer" : "එකම බැංකු හුවමාරුව",
      "Other Bank Transfer" : "වෙනත් බැංකු මාරු කිරීම",
      "Your Account Number" : "ඔබගේ ගිණුම් අංකය",
      "Recipient Account Number" : "ලබන්නාගේ ගිණුම් අංකය",
      "Amount" : "මුදල",
      "Transfer" : "මාරු කරන්න",
      "From" : "සිට",
      "To" : "වෙත",
      "Type" : "බැංකු වර්ගය",
      "Remaining Balance" : "ඉතිරි ශේෂය",
      "Dashboard" : "පාලක පුවරුව",
      "Loading user data" : "පරිශීලක දත්ත පූරණය කරමින්",
      "" : "",
      "" : "",
      "" : "",
      "" : "",
      "" : "",
      "" : "",

      

      











      

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