import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ru' | 'hy';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const languageNames: Record<Language, string> = {
  en: 'English',
  ru: 'Русский',
  hy: 'Հայերեն'
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  // Load translations for current language
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Use import() to load JSON files dynamically
        const translationModule = await import(`../locales/${language}.json`);
        setTranslations(translationModule.default || translationModule);
      } catch (error) {
        console.error(`Error loading translations for ${language}:`, error);
        // Fallback to English if current language fails to load
        if (language !== 'en') {
          try {
            const fallbackModule = await import('../locales/en.json');
            setTranslations(fallbackModule.default || fallbackModule);
          } catch (fallbackError) {
            console.error('Failed to load fallback translations:', fallbackError);
          }
        }
      }
    };

    loadTranslations();
  }, [language]);

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && ['en', 'ru', 'hy'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  // Translation function with nested key support
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
