import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuditSession } from '../../state/session';
import { useAuth } from '../../state/auth';
import { isAuthEnabled, safeNext } from '../../services/auth';
import { LoadingState } from '../../design-system/components';
import type { ReactNode } from 'react';

/** Exige um rascunho de auditoria ativo (etapas do wizard). */
export function RequireDraft({ children }: { children: ReactNode }) {
  const { draft } = useAuditSession();
  const { auditId } = useParams();
  if (!draft) return <Navigate to="/audit/new" replace />;
  if (auditId && draft.audit.id !== auditId) return <Navigate to="/audit/new" replace />;
  return <>{children}</>;
}

/** Exige auditoria concluída (telas de relatório). */
export function RequireReport({ children }: { children: ReactNode }) {
  const { draft, status } = useAuditSession();
  const { auditId } = useParams();
  if (!draft) return <Navigate to="/audit/new" replace />;
  if (auditId && draft.audit.id !== auditId) return <Navigate to="/audit/new" replace />;
  if (status !== 'COMPLETED') return <Navigate to={`/audit/${draft.audit.id}/progress`} replace />;
  return <>{children}</>;
}

/**
 * Exige sessão ativa (rotas do produto: `/audit/*`).
 * - Sem Supabase Auth configurado → modo demonstração, deixa passar.
 * - Carregando → espera (não redireciona antes de restaurar a sessão).
 * - Sem sessão → `/login?next=<destino>` para voltar ao ponto original.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();
  const { t } = useTranslation('common');

  if (!isAuthEnabled()) return <>{children}</>;
  if (status === 'loading') {
    return (
      <div className="shell">
        <LoadingState message={t('state.loading')} />
      </div>
    );
  }
  if (status === 'anonymous') {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }
  return <>{children}</>;
}

/**
 * Para telas de acesso (login/cadastro): quem já tem sessão volta ao destino.
 * Sem Supabase Auth configurado a tela fica visível (mostra o aviso de indisponibilidade).
 */
export function RequireAnonymous({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();
  const { t } = useTranslation('common');

  if (!isAuthEnabled()) return <>{children}</>;
  if (status === 'loading') {
    return (
      <div className="shell">
        <LoadingState message={t('state.loading')} />
      </div>
    );
  }
  if (status === 'authenticated') {
    const next = safeNext(new URLSearchParams(location.search).get('next'));
    return <Navigate to={next} replace />;
  }
  return <>{children}</>;
}
