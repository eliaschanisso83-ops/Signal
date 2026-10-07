/**
 * Catálogo de idiomas do Signal.
 *
 * - `en` é o idioma-base (default do produto e fonte das traduções).
 * - Os códigos são BCP-47; hoje só variantes genéricas ("pt"), mas a lista
 *   aceita variantes regionais futuras ("pt-BR", "pt-PT", "zh-TW"…) sem
 *   mudar a lógica da aplicação: basta adicionar a entrada e o JSON.
 * - `dir` prepara o app para RTL (árabe/hebraico) sem refatorar o CSS agora.
 */

export interface Language {
  code: string;
  /** Nome do idioma no próprio idioma — é o que o seletor exibe. */
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

/** Ordem = ordem de prioridade pedida para o produto. */
export const LANGUAGES: readonly Language[] = [
  { code: 'en', nativeName: 'English', dir: 'ltr' },
  { code: 'es', nativeName: 'Español', dir: 'ltr' },
  { code: 'pt', nativeName: 'Português', dir: 'ltr' },
  { code: 'fr', nativeName: 'Français', dir: 'ltr' },
  { code: 'de', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'ja', nativeName: '日本語', dir: 'ltr' },
  { code: 'zh-CN', nativeName: '简体中文', dir: 'ltr' },
  { code: 'ko', nativeName: '한국어', dir: 'ltr' },
  { code: 'it', nativeName: 'Italiano', dir: 'ltr' },
  { code: 'nl', nativeName: 'Nederlands', dir: 'ltr' },
];

export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES: readonly string[] = LANGUAGES.map((l) => l.code);

/** Namespaces (domínios) de tradução — separação lógica, nunca um JSON gigante. */
export const NAMESPACES = ['common', 'landing', 'app', 'audit', 'report', 'errors'] as const;

export type Namespace = (typeof NAMESPACES)[number];

/** Chave do localStorage com a escolha explícita do usuário. */
export const LANGUAGE_STORAGE_KEY = 'signal.language';

const BY_LOOKUP = new Map<string, string>(LANGUAGES.map((l) => [l.code.toLowerCase(), l.code]));

/**
 * Tenta casar "pt-BR", "zh-cn", "en"… com um idioma suportado.
 * Retorna `null` quando não há correspondência (chamador decide o fallback).
 *
 * Regra: correspondência exata → subtag primária → nada.
 * "zh-TW" não casa com "zh-CN": tradição ≠ simplificada.
 */
export function matchLanguage(raw?: string | null): string | null {
  if (!raw) return null;
  const value = raw.trim().replace(/_/g, '-');
  if (!value) return null;

  const exact = BY_LOOKUP.get(value.toLowerCase());
  if (exact) return exact;

  const base = value.split('-')[0].toLowerCase();
  if (base === 'zh' && value.toLowerCase() !== 'zh' && !value.toLowerCase().startsWith('zh-cn')) return null;

  return BY_LOOKUP.get(base) ?? null;
}

/**
 * Resolve qualquer variante para um idioma suportado, com inglês como
 * última instância — nunca lança erro por causa de um idioma desconhecido.
 *
 *   "en-US" → "en" · "pt-BR" → "pt" · "pt-PT" → "pt" · "es-MX" → "es"
 *   "fr-CA" → "fr" · "de-DE" → "de" · "zh-cn" → "zh-CN" · "sv-SE" → "en"
 */
export function resolveLanguage(raw?: string | null): string {
  return matchLanguage(raw) ?? DEFAULT_LANGUAGE;
}

/** Direção de escrita do idioma (preparação RTL). */
export function directionOf(language: string): 'ltr' | 'rtl' {
  return LANGUAGES.find((l) => l.code === resolveLanguage(language))?.dir ?? 'ltr';
}

/** Locale BCP-47 válido para as APIs `Intl.*`. */
export function intlLocale(language: string): string {
  return resolveLanguage(language);
}
