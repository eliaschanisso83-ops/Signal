/**
 * Inicialização do i18n do Signal (i18next + react-i18next).
 *
 * Decisões de arquitetura:
 * - `en` é o idioma-fonte e o default: carregado de forma síncrona junto com
 *   o bundle, então a primeira pintura nunca fica sem texto.
 * - Os demais 9 idiomas entram por chunk assíncrono (dynamic import) — trocar
 *   de idioma não recarrega a página nem engorda o bundle inicial.
 * - Preferência explícita do usuário (localStorage) > idioma do navegador >
 *   inglês.
 * - Fallback: idioma pedido → inglês. Chave ausente nunca aparece na tela.
 * - `document.documentElement.lang/dir` são atualizados a cada troca (SEO e
 *   preparação RTL).
 */
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
  NAMESPACES,
  SUPPORTED_LANGUAGES,
  directionOf,
  matchLanguage,
  resolveLanguage,
  type Namespace,
} from './languages';
import enCommon from './locales/en/common.json';
import enLanding from './locales/en/landing.json';
import enApp from './locales/en/app.json';
import enAudit from './locales/en/audit.json';
import enReport from './locales/en/report.json';
import enErrors from './locales/en/errors.json';
import enAuth from './locales/en/auth.json';

/** Bundle do idioma-fonte: garante texto na tela mesmo antes de qualquer troca. */
const enResources = {
  common: enCommon,
  landing: enLanding,
  app: enApp,
  audit: enAudit,
  report: enReport,
  errors: enErrors,
  auth: enAuth,
};

type EnResources = typeof enResources;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: EnResources;
    returnNull: false;
  }
}

/**
 * Loader dos idiomas não-ingleses: um chunk por idioma+namespace.
 * Não é um sistema de tradução alternativo — é só o adapter de carga do
 * i18next (mesmo papel do `i18next-http-backend`, sem dependência extra).
 */
const localeBackend = {
  type: 'backend' as const,
  read(language: string, namespace: string, callback: (error: Error | null, data?: Record<string, unknown>) => void) {
    if (!SUPPORTED_LANGUAGES.includes(language) || !NAMESPACES.includes(namespace as Namespace)) {
      callback(new Error(`i18n: recurso não suportado ${language}/${namespace}`));
      return;
    }
    import(`./locales/${language}/${namespace}.json`)
      .then((mod) => callback(null, mod.default as Record<string, unknown>))
      .catch((error: unknown) => callback(error instanceof Error ? error : new Error(String(error))));
  },
};

export function storedLanguage(): string | null {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Preferência salva → idiomas do navegador (na ordem) → inglês. */
export function detectLanguage(): string {
  const saved = storedLanguage();
  if (saved) return resolveLanguage(saved);

  const candidates: readonly string[] =
    typeof navigator !== 'undefined' ? (navigator.languages ?? [navigator.language]) : [];

  for (const candidate of candidates) {
    const matched = matchLanguage(candidate);
    if (matched) return matched;
  }
  return DEFAULT_LANGUAGE;
}

/** Troca explícita pelo usuário: persiste e troca sem recarregar a página. */
export async function changeUserLanguage(language: string): Promise<string> {
  const code = resolveLanguage(language);
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  } catch {
    /* modo privado / storage indisponível: a troca continua valendo nesta sessão */
  }
  await i18next.changeLanguage(code);
  return code;
}

/** Idioma corrente normalizado (ex.: "pt" mesmo quando o i18next reporta "pt-BR"). */
export function currentLanguage(): string {
  return resolveLanguage(i18next.resolvedLanguage ?? i18next.language);
}

function applyDocumentLanguage(language: string) {
  if (typeof document === 'undefined') return;
  const code = resolveLanguage(language);
  document.documentElement.lang = code;
  document.documentElement.dir = directionOf(code);
}

export const i18n = i18next;

export async function initI18n() {
  await i18next.use(initReactI18next).use(localeBackend).init({
    lng: detectLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    load: 'currentOnly',
    defaultNS: 'common',
    ns: [...NAMESPACES],
    resources: { [DEFAULT_LANGUAGE]: enResources },
    partialBundledLanguages: true,
    interpolation: { escapeValue: false },
    returnNull: false,
    returnEmptyString: false,
    react: { useSuspense: false },
    debug: false,
  });
  applyDocumentLanguage(i18next.resolvedLanguage ?? DEFAULT_LANGUAGE);
  i18next.on('languageChanged', applyDocumentLanguage);
  return i18next;
}

/** Idiomas no formato exigido pelo seletor (nome no próprio idioma). */
export { LANGUAGES, NAMESPACES, SUPPORTED_LANGUAGES, resolveLanguage, directionOf };
export type { Namespace };
