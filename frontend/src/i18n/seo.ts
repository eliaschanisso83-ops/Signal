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

/** Origem canônica do site — mesma configuração de domínio usada no index.html. */
export const SITE_ORIGIN = 'https://signal.biz-flow.cloud';

interface PageMeta {
  title: string;
  description: string;
  /** Caminho da rota (ex.: `/privacy`) — vira a canonical absoluta. */
  path: string;
}

/**
 * Metadados por página (SEO): título do documento, meta description,
 * canonical e tags Open Graph correspondentes. Os elementos já existem no
 * `index.html` (valores da landing); aqui são atualizados para a rota corrente
 * — criados se faltarem — e restaurados ao sair, para que a home volte ao padrão.
 */
export function usePageMeta({ title, description, path }: PageMeta) {
  useEffect(() => {
    const url = `${SITE_ORIGIN}${path}`;
    const metaTag = (name: string, value: string) => {
      const el = document.createElement('meta');
      el.setAttribute(name, value);
      return el;
    };
    const canonicalTag = () => {
      const el = document.createElement('link');
      el.setAttribute('rel', 'canonical');
      return el;
    };
    const targets: Array<{ selector: string; attr: 'content' | 'href'; value: string; make: () => HTMLElement }> = [
      { selector: 'meta[name="description"]', attr: 'content', value: description, make: () => metaTag('name', 'description') },
      { selector: 'meta[property="og:title"]', attr: 'content', value: title, make: () => metaTag('property', 'og:title') },
      { selector: 'meta[property="og:description"]', attr: 'content', value: description, make: () => metaTag('property', 'og:description') },
      { selector: 'meta[property="og:url"]', attr: 'content', value: url, make: () => metaTag('property', 'og:url') },
      { selector: 'link[rel="canonical"]', attr: 'href', value: url, make: canonicalTag },
    ];

    const previousTitle = document.title;
    document.title = title;

    const undo = targets.map(({ selector, attr, value, make }) => {
      let el = document.head.querySelector<HTMLElement>(selector);
      let created = false;
      if (!el) {
        el = make();
        document.head.appendChild(el);
        created = true;
      }
      const old = el.getAttribute(attr);
      el.setAttribute(attr, value);
      return () => {
        if (created) el?.remove();
        else el?.setAttribute(attr, old ?? '');
      };
    });

    return () => {
      document.title = previousTitle;
      for (const restore of undo) restore();
    };
  }, [title, description, path]);
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
