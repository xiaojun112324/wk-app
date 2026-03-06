// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';


import { DEFAULTLANG } from '@/config/languages';

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        lng: localStorage.getItem('lang') || DEFAULTLANG, // 默认从本地存储加载
        fallbackLng: DEFAULTLANG,
        backend: {
            loadPath: '/locales/{{lng}}.json',
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
