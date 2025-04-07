import React, { createContext, useState, useEffect } from 'react';
import enTranslations from '../language/en.json';
import frTranslations from '../language/fr.json';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr'); // Langue par défaut: français
  const [translations, setTranslations] = useState(frTranslations);
  
  // Changer de langue
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('pokedex-language', lang);
  };
  
  // Charger la langue stockée au chargement
  useEffect(() => {
    const storedLanguage = localStorage.getItem('pokedex-language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);
  
  // Mettre à jour les traductions quand la langue change
  useEffect(() => {
    setTranslations(language === 'fr' ? frTranslations : enTranslations);
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};