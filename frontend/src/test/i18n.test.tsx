import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import i18next from 'i18next';
import App from '../App';
import { LANGUAGES, LANGUAGE_STORAGE_KEY, NAMESPACES, matchLanguage, resolveLanguage } from '../i18n/languages';
import { useFormat } from '../i18n/format';
import { initI18n } from '../i18n';

import en from '../i18n/locales/en/app.json';
import es from '../i18n/locales/es/app.json';

/* ResourceStore é onde o i18next guarda os bundles carregados (estrutura
   aninhada data[lang][ns]...) — usado aqui para simular uma chave ausente
   (cenario de fallback) sem tocar nos arquivos. */
type Store = { data: Record<string, Record<string, Record<string, unknown>>> };
function store(): Store {
  return (i18next.services as unknown as { resourceStore: Store }).resourceStore;
}

function switchTo(code: string) {
  const select = screen.getAllByLabelText('Language')[0] as HTMLSelectElement;
  fireEvent.change(select, { target: { value: code } });
}

describe('Seleção e persistência de idioma', () => {
  it('troca o idioma na hora, sem recarregar, e persiste a escolha', async () => {
    render(<App />);
    expect(screen.getAllByText(en.nav.startAudit).length).toBeGreaterThan(0);

    switchTo('es');
    expect(await screen.findAllByText(es.nav.startAudit)).not.toHaveLength(0);
    await waitFor(() => expect(document.documentElement.lang).toBe('es'));
    expect(document.documentElement.dir).toBe('ltr');
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');
  });

  it('abre já no idioma salvo (preferência do usuário > navegador)', async () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
    await initI18n();
    render(<App />);
    expect(await screen.findAllByText(es.nav.startAudit)).not.toHaveLength(0);
    expect(document.documentElement.lang).toBe('es');
    window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  });

  it('cai para o inglês quando a chave não existe no idioma escolhido', async () => {
    await i18next.changeLanguage('es');
    const saved = store().data['es']?.['app'] as { nav?: Record<string, string> } | undefined;
    if (!saved?.nav) throw new Error('bundle es/app não carregado');
    const original = saved.nav['startAudit'];
    if (original === undefined) throw new Error('chave nav.startAudit ausente em es');
    delete saved.nav['startAudit'];

    render(<App />);
    expect(await screen.findAllByText(en.nav.startAudit)).not.toHaveLength(0);
    expect(i18next.t('nav.startAudit', { ns: 'app' })).toBe(en.nav.startAudit);

    saved.nav['startAudit'] = original;
  });
});

describe('Catálogo de idiomas e formatação', () => {
  it('resolve variantes de idioma sem confundir tradição e simplificação', () => {
    expect(matchLanguage('pt-BR')).toBe('pt');
    expect(matchLanguage('en-US')).toBe('en');
    expect(matchLanguage('zh-TW')).toBeNull();
    expect(resolveLanguage('nl-NL')).toBe('nl');
    expect(resolveLanguage('xx')).toBe('en');
  });

  it('formata números e percentuais com o locale corrente (Intl.*)', async () => {
    function Probe() {
      const f = useFormat();
      return <span data-testid="probe">{`${f.decimal(1234.5, 1)}|${f.percent(24)}|${f.locale}`}</span>;
    }

    await i18next.changeLanguage('en');
    render(<Probe />);
    expect(screen.getByTestId('probe').textContent).toBe('1,234.5|24%|en');

    await i18next.changeLanguage('de');
    render(<Probe />);
    /* o Intl alemão usa NBSP antes do % — normalizamos para comparar */
    const norm = (s: string | null) => (s ?? '').replace(/ /g, ' ');
    expect(norm(screen.getAllByTestId('probe')[1].textContent)).toBe('1.234,5|24 %|de');
    await i18next.changeLanguage('en');
  });

  it('mantém a mesma estrutura de chaves em todos os idiomas (sem chaves órfãs ou faltando)', async () => {
    type Json = Record<string, unknown>;
    const paths = (o: Json, prefix: string[] = []): string[] =>
      Object.entries(o)
        .flatMap(([k, v]) =>
          v && typeof v === 'object' && !Array.isArray(v)
            ? paths(v as Json, [...prefix, k])
            : [[...prefix, k].join('.')],
        )
        .sort();

    const expected = {
      common: paths((await import('../i18n/locales/en/common.json')).default as Json),
      landing: paths((await import('../i18n/locales/en/landing.json')).default as Json),
      app: paths(en as unknown as Json),
      audit: paths((await import('../i18n/locales/en/audit.json')).default as Json),
      report: paths((await import('../i18n/locales/en/report.json')).default as Json),
      errors: paths((await import('../i18n/locales/en/errors.json')).default as Json),
    };

    for (const lang of LANGUAGES) {
      for (const ns of NAMESPACES) {
        if (lang.code === 'en') continue;
        const mod = (await import(`../i18n/locales/${lang.code}/${ns}.json`)) as { default: Json };
        expect.soft(paths(mod.default), `${lang.code}/${ns} — chaves divergentes de en`).toEqual(expected[ns]);
      }
    }
  });
});

beforeAll(() => {
  window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
});
