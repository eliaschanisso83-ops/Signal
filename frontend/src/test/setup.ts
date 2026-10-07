import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { initI18n, storedLanguage } from '../i18n';
import { LANGUAGE_STORAGE_KEY } from '../i18n/languages';

beforeAll(async () => {
  /* Testes rodam em inglês (idioma-fonte), a não ser que o teste mude antes. */
  if (!storedLanguage()) window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
  await initI18n();
});

afterEach(async () => {
  cleanup();
  sessionStorage.clear();
  window.history.replaceState({}, '', '/');
  window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  const { default: i18next } = await import('i18next');
  await i18next.changeLanguage('en');
});
