// src/providers/LanguageProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '@/i18n';
import { LANGUAGES, DEFAULTLANG } from '@/config/languages';

type LanguageContextType = {
  language: string;
  changeLanguage: (lng: string) => void;
  subscribe: (cb: () => void) => () => void; // 订阅语言变化
  languages: typeof LANGUAGES;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState(i18n.language || DEFAULTLANG);
  const [listeners] = useState<Set<() => void>>(() => new Set());

  const changeLanguage = (lng: string) => {
    if (lng === language) return;
    i18n.changeLanguage(lng);
    setLanguage(lng);
    localStorage.setItem('lng', lng);
    listeners.forEach(cb => cb()); // 通知所有订阅者
  };

  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb); // 取消订阅
  };

  useEffect(() => {
    const saved = localStorage.getItem('lng');
    if (saved && saved !== language) {
      i18n.changeLanguage(saved);
      setLanguage(saved);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, subscribe, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
