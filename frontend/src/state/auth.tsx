/**
 * Estado de sessão do Supabase Auth para a UI.
 *
 * - Fonte única: o provider assina `services/auth` (que por sua vez assina o
 *   SDK). Guardas, topbar e telas leem daqui — ninguém toca no SDK.
 * - `status === 'loading'` existe para a primeira restauração: enquanto ela não
 *   termina, os guards mostram carregamento em vez de redirecionar à toa.
 * - Ambiente sem variáveis (`isAuthEnabled() === false`): sessão nasce
 *   `anonymous` e as rotas protegidas seguem abertas (modo demonstração).
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import * as authService from '../services/auth';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthValue {
  status: AuthStatus;
  user: User | null;
  email: string | null;
  /** Nome de exibição: metadados do provedor (Google) > e-mail. */
  displayName: string | null;
}

const AuthContext = createContext<AuthValue>({
  status: 'anonymous',
  user: null,
  email: null,
  displayName: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const enabled = authService.isAuthEnabled();
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>(enabled ? 'loading' : 'anonymous');

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let unsubscribe = () => {};

    void (async () => {
      try {
        const current = await authService.getSession();
        if (cancelled) return;
        setSession(current);
        setStatus(current?.user ? 'authenticated' : 'anonymous');
        unsubscribe = authService.subscribe((next) => {
          if (cancelled) return;
          setSession(next);
          setStatus(next?.user ? 'authenticated' : 'anonymous');
        });
      } catch (error) {
        console.warn('[auth] não foi possível restaurar a sessão:', error);
        if (!cancelled) setStatus('anonymous');
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [enabled]);

  const value = useMemo<AuthValue>(() => {
    const user = session?.user ?? null;
    const metadata = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
    return {
      status,
      user,
      email: user?.email ?? null,
      displayName: metadata.full_name || metadata.name || user?.email || null,
    };
  }, [session, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  return useContext(AuthContext);
}
