import { Navigate, useParams } from 'react-router-dom';
import { useAuditSession } from '../../state/session';
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
