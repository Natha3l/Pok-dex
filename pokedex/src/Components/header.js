import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../contexts/LanguageContext';

const Header = () => {
  const { language, changeLanguage, translations } = useContext(LanguageContext);
  
  return (
    <header className="app-header">
      <Link to="/" className="logo">
        <h1>{translations.appTitle}</h1>
      </Link>
      
      <div className="language-selector">
        <label htmlFor="language-select">{translations.language}:</label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="fr">{translations.french}</option>
          <option value="en">{translations.english}</option>
        </select>
      </div>
    </header>
  );
};

export default Header;