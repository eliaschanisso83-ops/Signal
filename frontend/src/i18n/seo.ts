import { useEffect } from 'react';

/**
 * Título do documento (aba do navegador).
 * Nome do produto + promessa de categoria ficam em inglês por serem marca:
 * `Signal — Software Discoverability Intelligence` é o mesmo em todos os idiomas.
 */
export const BRAND_TITLE = 'Signal — Software Discoverability Intelligence';

/** Sufixo das páginas internas, já presente no shell do app. */
export function pageTitle(label: string): string {
  return `${label} · Signal`;
}

/**
 * Mantém `document.title` sincronizado com a rota corrente.
 * O valor costuma vir de `t(...)`, então trocar o idioma reexecuta o effect
 * (o react-i18next rerenderiza o componente com as strings novas).
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
