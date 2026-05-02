"use client";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const LanguageContext = createContext();

const languageLabel = (code) => {
  switch ((code || '').toLowerCase()) {
    case 'en':
      return 'English';
    case 'hi':
      return 'Hindi';
    case 'kn':
      return 'Kannada';
    case 'fr':
      return 'French';
    case 'zh':
      return 'Chinese';
    default:
      return code || 'English';
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [cacheVersion, setCacheVersion] = useState(0);

  const cacheRef = useRef(new Map()); // key: `${lang}::${text}` -> string

  const cacheKey = useCallback((text, lang) => `${lang}::${text}`, []);

  const translate = useCallback(
    async (text, targetLang = language) => {
      if (!text || typeof text !== 'string') return '';
      if (!targetLang || targetLang === 'en') return text;

      const key = cacheKey(text, targetLang);
      const cached = cacheRef.current.get(key);
      if (typeof cached === 'string') return cached;

      const puter = typeof window !== 'undefined' ? window.puter : undefined;
      const targetLanguage = languageLabel(targetLang);

      if (!puter?.ai?.chat) {
        // Puter.js not loaded yet; fall back to original text
        return text;
      }

      const prompt = `Translate the following text to ${targetLanguage}. Output only the translated text—no explanations, comments, or additional notes:\n\n${text}`;
      const translatedTextRaw = await puter.ai.chat(prompt, { model: 'gpt-5-nano' });
      const translatedText =
        typeof translatedTextRaw === 'string' && translatedTextRaw.trim()
          ? translatedTextRaw.trim()
          : text;

      cacheRef.current.set(key, translatedText);
      setCacheVersion((v) => v + 1);
      return translatedText;
    },
    [cacheKey, language]
  );

  // Sync read: returns cached translation or original until fetched.
  const t = useCallback(
    (text) => {
      if (!text || typeof text !== 'string') return '';
      if (!language || language === 'en') return text;
      const cached = cacheRef.current.get(cacheKey(text, language));
      return typeof cached === 'string' ? cached : text;
    },
    [cacheKey, language]
  );

  const prefetch = useCallback(
    async (texts) => {
      if (!language || language === 'en') return;
      const unique = Array.from(new Set((texts || []).filter((x) => typeof x === 'string' && x)));
      if (unique.length === 0) return;

      await Promise.all(
        unique.map(async (text) => {
          try {
            await translate(text, language);
          } catch (e) {
            // swallow; UI can fall back to original text
          }
        })
      );
    },
    [language, translate]
  );

  const value = useMemo(
    () => ({ language, setLanguage, translate, t, prefetch }),
    [language, prefetch, t, translate, cacheVersion]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
