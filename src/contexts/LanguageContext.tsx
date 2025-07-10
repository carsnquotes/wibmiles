import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const defaultLanguage: Language = 'en';

// Создаем контекст с начальными значениями
const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
});

// Языковой словарь
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'time': 'TIME',
    
    // Main screen
    'premium_auto': 'PREMIUM AUTO SERVICE',
    'we_integrate': 'We integrate',
    'experience': 'experience',
    'technology': 'technology',
    'and': 'and',
    'brand_identity': 'brand identity',
    'company_intro': 'CARS N QUOTES — your reliable partner in the world of leasing and car selection.',
    'company_description': 'We offer flexible leasing, 24/7 consultations, and an innovative car selection system that takes into account your every wish. With us, you get the perfect car without unnecessary worries.',
    'ask_in_chat': 'Ask in chat',
    
    // Statistics
    'years_experience': 'years of experience',
    'clients': 'clients',
    'satisfaction': 'satisfaction',
    'satisfied_customers': 'Satisfied customers',
    
    // Chat
    'online_assistant': 'ONLINE ASSISTANT',
    'online_chat': 'Online Chat',
    'welcome': '👋 Hi, I\'m Miles!\nI\'m here to help you explore car lease and purchase options — with real quotes, discounts, and special offers.\nJust ask me anything to get started!',
    'typing_message': 'Type your message...',
    'send': 'Send',
    'auto_reply': 'Thank you for your message. Our specialists will contact you soon. If you have any additional questions, feel free to ask.',
    
    // Footer
    'all_rights_reserved': 'All rights reserved',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Провайдер, который предоставляет язык и функции для смены языка
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Попытка получить язык из localStorage при инициализации
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || defaultLanguage;
  });

  // Функция для изменения языка
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Функция для получения перевода по ключу
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для использования языкового контекста
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext; 