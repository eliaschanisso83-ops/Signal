/**
 * Stub de `services/auth` para os testes de UI.
 *
 * O mock real é plugado assim nos arquivos de teste:
 *
 *   vi.mock('../services/auth', async () => (await import('./authStub')).authModule);
 *
 * Padrão: `authStub.reset()` liga o modo "auth configurado" (anonymous);
 * cenários autenticados fazem `authStub.reset({ session: makeSession() })`.
 * O default (`enabled: false`) é o modo demonstração, para que os testes de
 * fluxo existentes não passem por guardas.
 */
import type { Session, User } from '@supabase/supabase-js';
import type { AuthKey, AuthResult } from '../services/auth';

type Listener = (session: Session | null) => void;

export function makeSession(overrides: { email?: string; name?: string } = {}): Session {
  const email = overrides.email ?? 'ana@signal.test';
  const now = Math.floor(Date.now() / 1000);
  const user = {
    id: 'user_stub_1',
    aud: 'authenticated',
    role: 'authenticated',
    email,
    email_confirmed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { full_name: overrides.name ?? 'Ana Signal' },
    identities: [],
    is_anonymous: false,
  } as unknown as User;

  return {
    access_token: 'stub-access-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: now + 3600,
    refresh_token: 'stub-refresh-token',
    user,
  } as Session;
}

interface Stub {
  enabled: boolean;
  session: Session | null;
  listeners: Set<Listener>;
  signInResponse: AuthResult;
  signUpResponse: AuthResult<{ needsConfirmation: boolean }>;
  googleResponse: AuthResult;
  resetResponse: AuthResult;
  updateResponse: AuthResult;
  calls: string[];
}

const state: Stub = {
  enabled: false,
  session: null,
  listeners: new Set(),
  signInResponse: { ok: true },
  signUpResponse: { ok: true, data: { needsConfirmation: false } },
  googleResponse: { ok: true },
  resetResponse: { ok: true },
  updateResponse: { ok: true },
  calls: [],
};

function setSession(session: Session | null) {
  state.session = session;
  for (const listener of state.listeners) listener(session);
}

export const authStub = {
  get enabled() {
    return state.enabled;
  },
  get session() {
    return state.session;
  },
  get calls() {
    return state.calls;
  },
  reset(options: { enabled?: boolean; session?: Session | null } = {}) {
    state.enabled = options.enabled ?? true;
    state.session = options.session ?? null;
    state.listeners.clear();
    state.signInResponse = { ok: true };
    state.signUpResponse = { ok: true, data: { needsConfirmation: false } };
    state.googleResponse = { ok: true };
    state.resetResponse = { ok: true };
    state.updateResponse = { ok: true };
    state.calls = [];
  },
  failSignIn(key: AuthKey) {
    state.signInResponse = { ok: false, key };
  },
  failSignUp(key: AuthKey) {
    state.signUpResponse = { ok: false, key };
  },
  failGoogle(key: AuthKey) {
    state.googleResponse = { ok: false, key };
  },
  failReset(key: AuthKey) {
    state.resetResponse = { ok: false, key };
  },
  failUpdate(key: AuthKey) {
    state.updateResponse = { ok: false, key };
  },
  needsConfirmation(value = true) {
    state.signUpResponse = { ok: true, data: { needsConfirmation: value } };
  },
  signIn() {
    setSession(makeSession());
  },
  signOutLocal() {
    setSession(null);
  },
};

export const authModule = {
  isAuthEnabled: () => state.enabled,
  safeNext: (raw: string | null | undefined): string =>
    raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\') ? raw : '/',
  getSession: async () => state.session,
  subscribe: (listener: Listener) => {
    state.listeners.add(listener);
    return () => state.listeners.delete(listener);
  },
  signInWithPassword: async (email: string) => {
    state.calls.push(`signInWithPassword:${email}`);
    if (state.signInResponse.ok) setSession(makeSession({ email }));
    return state.signInResponse;
  },
  signUpWithPassword: async (email: string) => {
    state.calls.push(`signUpWithPassword:${email}`);
    if (state.signUpResponse.ok && !state.signUpResponse.data?.needsConfirmation) {
      setSession(makeSession({ email }));
    }
    return state.signUpResponse;
  },
  signInWithGoogle: async (redirectTo: string) => {
    state.calls.push(`signInWithGoogle:${redirectTo}`);
    if (state.googleResponse.ok) setSession(makeSession());
    return state.googleResponse;
  },
  sendPasswordReset: async (email: string, redirectTo: string) => {
    state.calls.push(`sendPasswordReset:${email}`);
    state.calls.push(`resetRedirect:${redirectTo}`);
    return state.resetResponse;
  },
  updateUserPassword: async () => {
    state.calls.push('updateUserPassword');
    return state.updateResponse;
  },
  signOut: async () => {
    state.calls.push('signOut');
    setSession(null);
  },
};
