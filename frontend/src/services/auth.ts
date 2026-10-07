/**
 * Camada de autenticação do Signal — a ÚNICA que toca o Supabase Auth SDK.
 *
 * Princípios:
 * - A configuração (URL + chave publicável) continua a de `services/supabase.ts`:
 *   nada aqui cria um segundo cliente nem contorna a segurança (a confirmação
 *   de e-mail do Dashboard é respeitada — nunca há bypass silencioso).
 * - Todas as funções devolvem `{ ok, key? }`, onde `key` é uma chave **relativa
 *   ao namespace `auth`** (ex.: `errors.invalidCredentials`) pronta para `t()`.
 *   O detalhe técnico vai só para o console — nunca para a tela.
 * - Nenhum segredo aqui: só a chave publicável chega ao browser.
 */
import type { AuthError, Session } from '@supabase/supabase-js';
import { getSupabase, supabaseEnabled } from './supabase';

/** true quando o Supabase Auth está configurado neste ambiente. */
export function isAuthEnabled(): boolean {
  return supabaseEnabled;
}

/** Chaves i18n (ns `auth`) que o serviço pode devolver. */
export type AuthKey =
  | 'unavailable.desc'
  | 'forgot.disabled'
  | 'errors.invalidCredentials'
  | 'errors.emailTaken'
  | 'errors.weakPassword'
  | 'errors.samePassword'
  | 'errors.emailNotConfirmed'
  | 'errors.rateLimited'
  | 'errors.sessionExpired'
  | 'errors.invalidEmail'
  | 'errors.oauthCancelled'
  | 'errors.oauthFailed'
  | 'errors.network'
  | 'errors.unexpected';

export type AuthResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; key: AuthKey };

type AuthFail = { ok: false; key: AuthKey };

function fail(error: unknown): AuthFail {
  const key = authErrorKey(error);
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[auth] ${key}: ${message}`);
  return { ok: false, key };
}

/**
 * Mapeia o erro do Supabase Auth para uma chave i18n (ns `auth`).
 * Códigos do GoTrue + varredura da mensagem como rede de segurança.
 */
export function authErrorKey(error: unknown): AuthKey {
  const e = error as Partial<AuthError> | null | undefined;
  const code = String(e?.code ?? '').toLowerCase();
  const message = String(e?.message ?? '').toLowerCase();

  if (code === 'invalid_credentials') return 'errors.invalidCredentials';
  if (code === 'user_already_exists') return 'errors.emailTaken';
  if (code === 'weak_password') return 'errors.weakPassword';
  if (code === 'same_password') return 'errors.samePassword';
  if (code === 'email_not_confirmed') return 'errors.emailNotConfirmed';
  if (
    code === 'overload_rate_limit' ||
    code === 'rate_limit_exceeded' ||
    code === '429' ||
    message.includes('rate limit') ||
    message.includes('too many request')
  ) {
    return 'errors.rateLimited';
  }
  if (
    code === 'session_not_found' ||
    code === 'refresh_token_not_found' ||
    code === 'session_expired' ||
    message.includes('refresh token not found')
  ) {
    return 'errors.sessionExpired';
  }
  if (
    code === 'validation_failed' ||
    code === 'invalid_email' ||
    message.includes('invalid email') ||
    message.includes('invalid format') ||
    message.includes('unable to validate email')
  ) {
    return 'errors.invalidEmail';
  }
  if (code.includes('oauth') || code === 'access_denied' || message.includes('oauth')) {
    const cancelled =
      code === 'access_denied' ||
      message.includes('denied') ||
      message.includes('cancel') ||
      message.includes('approve');
    return cancelled ? 'errors.oauthCancelled' : 'errors.oauthFailed';
  }
  if (
    message.includes('failed to fetch') ||
    message.includes('load failed') ||
    message.includes('network') ||
    message.includes('fetch failed')
  ) {
    return 'errors.network';
  }
  return 'errors.unexpected';
}

async function client() {
  return getSupabase();
}

/** Sessão atual (null sem env, sem sessão ou em erro — nunca lança). */
export async function getSession(): Promise<Session | null> {
  const supabase = await client();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn(`[auth] getSession: ${error.message}`);
    return null;
  }
  return data.session;
}

/**
 * Assina mudanças de sessão (login/logout/expiração/recuperação).
 * Retorna a função de unsubscribe — segura mesmo se a assinatura ainda
 * não tiver sido registrada.
 */
export function subscribe(onSession: (session: Session | null) => void): () => void {
  let cancelled = false;
  let subscription: { unsubscribe: () => void } | null = null;
  void (async () => {
    const supabase = await client();
    if (!supabase || cancelled) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => onSession(session));
    subscription = data.subscription;
    if (cancelled) subscription.unsubscribe();
  })();
  return () => {
    cancelled = true;
    subscription?.unsubscribe();
  };
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  const supabase = await client();
  if (!supabase) return { ok: false, key: 'unavailable.desc' };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return fail(error);
  return { ok: true };
}

/**
 * Cria a conta. `needsConfirmation: true` quando o Dashboard exige confirmação
 * por e-mail (sem sessão ainda) — a UI mostra o painel "confirme seu e-mail",
 * sem contornar nada.
 */
export async function signUpWithPassword(
  email: string,
  password: string,
): Promise<AuthResult<{ needsConfirmation: boolean }>> {
  const supabase = await client();
  if (!supabase) return { ok: false, key: 'unavailable.desc' };
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return fail(error);
  return { ok: true, data: { needsConfirmation: !data.session } };
}

/** Inicia o login com Google (PKCE) — o navegador navega para o Google. */
export async function signInWithGoogle(redirectTo: string): Promise<AuthResult> {
  const supabase = await client();
  if (!supabase) return { ok: false, key: 'unavailable.desc' };
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error) return fail(error);
  return { ok: true };
}

/**
 * Envia o link de recuperação. Sem vazamento de existência de conta: um
 * `user_not_found` vira sucesso (a tela é idêntica em todos os casos).
 */
export async function sendPasswordReset(email: string, redirectTo: string): Promise<AuthResult> {
  const supabase = await client();
  if (!supabase) return { ok: false, key: 'forgot.disabled' };
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) {
    const code = String((error as AuthError).code ?? '').toLowerCase();
    if (code === 'user_not_found') return { ok: true };
    return fail(error);
  }
  return { ok: true };
}

/** Define a nova senha do usuário autenticado (tela de redefinição). */
export async function updateUserPassword(password: string): Promise<AuthResult> {
  const supabase = await client();
  if (!supabase) return { ok: false, key: 'unavailable.desc' };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return fail(error);
  return { ok: true };
}

/** Encerra a sessão (falha só logada: a UI segue em qualquer hipótese). */
export async function signOut(): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) console.warn(`[auth] signOut: ${error.message}`);
}

/**
 * Destino seguro para `?next=`: só caminhos internos (`/x`), nunca `//evil.com`
 * nem URL absoluta. Ausente/inválido → `/`.
 */
export function safeNext(raw: string | null | undefined): string {
  if (raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\')) return raw;
  return '/';
}
