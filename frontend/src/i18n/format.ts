/**
 * Localização de valores (não de texto).
 *
 * Separa o que é dado interno do que é apresentação: a lógica matemática
 * continua recebendo `number`/`Date` puros; só a formatação muda com o
 * idioma. Nada aqui altera cálculo de score, percentual ou posição.
 */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { intlLocale } from './languages';

export interface Formatters {
  locale: string;
  /** 1234567 → "1,234,567" (ou "1.234.567" em pt/es) */
  number: (value: number, options?: Intl.NumberFormatOptions) => string;
  /** 24 → "24%" · 0.55 → "55%" */
  percent: (value: number, options?: Intl.NumberFormatOptions) => string;
  /** "55/100" vindo do dado é preservado; aqui só números puros. */
  decimal: (value: number, digits?: number) => string;
  date: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => string;
  dateTime: (value: string | number | Date) => string;
  /** ["a","b","c"] → "a, b e c" */
  list: (items: string[], type?: Intl.ListFormatType) => string;
}

export function useFormat(): Formatters {
  const { i18n } = useTranslation();
  const locale = intlLocale(i18n.resolvedLanguage ?? i18n.language);

  return useMemo<Formatters>(() => {
    const n = (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options).format(value);

    return {
      locale,
      number: n,
      percent: (value, options) =>
        new Intl.NumberFormat(locale, {
          style: 'percent',
          maximumFractionDigits: 0,
          ...options,
        }).format(value / 100),
      decimal: (value, digits = 1) =>
        new Intl.NumberFormat(locale, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value),
      date: (value, options) =>
        new Intl.DateTimeFormat(locale, options ?? { dateStyle: 'medium' }).format(new Date(value)),
      dateTime: (value) =>
        new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)),
      list: (items, type = 'conjunction') =>
        new Intl.ListFormat(locale, { style: 'long', type }).format(items),
    };
  }, [locale]);
}
