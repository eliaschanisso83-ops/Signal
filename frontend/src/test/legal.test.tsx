import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

/* O env de teste tem Supabase configurado: sem o mock, o AuthProvider
   tentaria falar com a rede e os guardas mudariam o fluxo. */
vi.mock('../services/auth', async () => (await import('./authStub')).authModule);

import App from '../App';
import { authStub } from './authStub';

const T = { timeout: 5000 };

function go(path: string) {
  window.history.replaceState({}, '', path);
}

function bodyText(): string {
  return document.body.textContent ?? '';
}

beforeEach(() => {
  authStub.reset();
});

describe('/privacy — Política de Privacidade', () => {
  it('renderiza o documento com título, subtítulo, seções e data de atualização', async () => {
    go('/privacy');
    render(<App />);

    expect(
      (await screen.findByRole('heading', { level: 1, name: 'Política de Privacidade' }, T)).textContent,
    ).toBe('Política de Privacidade');
    expect(bodyText()).toContain('Como o Signal coleta, utiliza, armazena e protege os seus dados.');
    expect(bodyText()).toContain('Legal');
    expect(bodyText()).toContain('Última atualização: 7 de outubro de 2026');
    expect(bodyText()).toContain('aut.shopping83@gmail.com');

    /* 15 seções no índice lateral + a mesma lista no detalhe do mobile */
    expect(document.querySelectorAll('.legal-toc .legal-toc-list a').length).toBe(15);
    expect(document.querySelectorAll('.legal-toc-mobile .legal-toc-list a').length).toBe(15);

    /* nenhum placeholder visível do tipo [DATA], [EMAIL], [NOME DA EMPRESA] */
    expect(bodyText()).not.toMatch(/\[[^\]]{1,40}\]/);
  });

  it('expõe metadados próprios (title, description e canonical)', async () => {
    go('/privacy');
    render(<App />);
    await screen.findByRole('heading', { level: 1, name: 'Política de Privacidade' }, T);

    expect(document.title).toBe('Política de Privacidade | Signal');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://signal.biz-flow.cloud/privacy',
    );
    const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
    expect(desc).toContain('Política de Privacidade do Signal');
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      'https://signal.biz-flow.cloud/privacy',
    );
  });
});

describe('/terms — Termos de Uso', () => {
  it('renderiza o documento com as 18 seções e a data de atualização', async () => {
    go('/terms');
    render(<App />);

    expect((await screen.findByRole('heading', { level: 1, name: 'Termos de Uso' }, T)).textContent).toBe(
      'Termos de Uso',
    );
    expect(bodyText()).toContain('Regras para utilização da plataforma Signal.');
    expect(bodyText()).toContain('Última atualização: 7 de outubro de 2026');
    expect(document.querySelectorAll('.legal-toc .legal-toc-list a').length).toBe(18);
    expect(bodyText()).not.toMatch(/\[[^\]]{1,40}\]/);
  });

  it('expõe metadados próprios (title, description e canonical)', async () => {
    go('/terms');
    render(<App />);
    await screen.findByRole('heading', { level: 1, name: 'Termos de Uso' }, T);

    expect(document.title).toBe('Termos de Uso | Signal');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://signal.biz-flow.cloud/terms',
    );
    const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
    expect(desc).toContain('Termos de Uso do Signal');
  });
});

describe('Navegação e links', () => {
  it('o footer aponta para /privacy e /terms e navega entre as páginas', async () => {
    go('/');
    render(<App />);

    const privacyLink = await screen.findByRole('link', { name: 'Privacy' }, T);
    expect(privacyLink.getAttribute('href')).toBe('/privacy');
    const termsLink = document.querySelector('a.footer-col[href="/terms"], a[href="/terms"]');
    expect(termsLink?.getAttribute('href')).toBe('/terms');

    fireEvent.click(privacyLink);
    await waitFor(() => expect(window.location.pathname).toBe('/privacy'));
    await screen.findByRole('heading', { level: 1, name: 'Política de Privacidade' }, T);

    /* link do footer dentro da própria página leva aos Termos */
    fireEvent.click(screen.getAllByRole('link', { name: 'Terms of Use' })[0]);
    await waitFor(() => expect(window.location.pathname).toBe('/terms'));
    await screen.findByRole('heading', { level: 1, name: 'Termos de Uso' }, T);
  });

  it('as páginas legais são públicas (sem guarda de autenticação)', async () => {
    go('/privacy');
    render(<App />);
    await screen.findByRole('heading', { level: 1, name: 'Política de Privacidade' }, T);
    expect(window.location.pathname).toBe('/privacy');
    expect(window.location.search).toBe('');
  });
});
