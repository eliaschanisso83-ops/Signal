import { describe, it, expect } from 'vitest';
import { authErrorKey, safeNext } from '../services/auth';

/* O texto dos padrões é montado em tempo de execução para o arquivo de teste
   não se acusar (a varredura inclui o próprio src/). */
const SECRET_NEEDLES = [
  ['sb', 'secret'].join('_') + '_',
  ['service', 'role'].join('_'),
  ['SUPABASE', 'SERVICE'].join('_'),
];

describe('safeNext (anti open-redirect)', () => {
  it('aceita só caminhos internos', () => {
    expect(safeNext('/audit/new')).toBe('/audit/new');
    expect(safeNext('/audit/abc/report?tab=evidence')).toBe('/audit/abc/report?tab=evidence');
  });

  it('bloqueia externo, protocolo-relativo, barra invertida e vazio', () => {
    expect(safeNext('https://evil.com')).toBe('/');
    expect(safeNext('//evil.com')).toBe('/');
    expect(safeNext('/\\evil.com')).toBe('/');
    expect(safeNext('')).toBe('/');
    expect(safeNext(null)).toBe('/');
    expect(safeNext(undefined)).toBe('/');
  });
});

describe('authErrorKey (erros do Supabase → chaves i18n)', () => {
  it('mapeia os códigos previstos', () => {
    expect(authErrorKey({ code: 'invalid_credentials' })).toBe('errors.invalidCredentials');
    expect(authErrorKey({ code: 'user_already_exists' })).toBe('errors.emailTaken');
    expect(authErrorKey({ code: 'weak_password' })).toBe('errors.weakPassword');
    expect(authErrorKey({ code: 'same_password' })).toBe('errors.samePassword');
    expect(authErrorKey({ code: 'email_not_confirmed' })).toBe('errors.emailNotConfirmed');
    expect(authErrorKey({ code: 'overload_rate_limit' })).toBe('errors.rateLimited');
    expect(authErrorKey({ code: 'refresh_token_not_found' })).toBe('errors.sessionExpired');
    expect(authErrorKey({ code: 'validation_failed', message: 'Invalid email' })).toBe('errors.invalidEmail');
    expect(authErrorKey({ code: 'access_denied', message: 'User did not approve' })).toBe('errors.oauthCancelled');
    expect(authErrorKey({ code: 'oauth_provider_error', message: 'Provider is down' })).toBe('errors.oauthFailed');
    expect(authErrorKey(new Error('Failed to fetch'))).toBe('errors.network');
  });

  it('cai para a mensagem genérica no desconhecido (nunca vaza detalhe técnico)', () => {
    expect(authErrorKey({ code: 'mystery_code', message: 'stack trace interna' })).toBe('errors.unexpected');
    expect(authErrorKey(undefined)).toBe('errors.unexpected');
    expect(authErrorKey('algo inesperado')).toBe('errors.unexpected');
  });
});

describe('Sem credenciais no código', () => {
  it('o código-fonte e o HTML não contêm chaves secretas do Supabase', () => {
    /* Todo o src/ + index.html, lidos como texto via ?raw (sem I/O de node). */
    const sources = import.meta.glob(['../**/*.{ts,tsx}', '../../index.html'], {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>;

    const hits: string[] = [];
    for (const [file, content] of Object.entries(sources)) {
      for (const needle of SECRET_NEEDLES) {
        if (content.includes(needle)) hits.push(`${file} → ${needle}`);
      }
    }
    expect(hits).toEqual([]);
    expect(Object.keys(sources).length).toBeGreaterThan(30);
  });
});
