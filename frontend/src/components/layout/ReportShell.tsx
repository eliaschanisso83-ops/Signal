import { NavLink, Outlet, useParams } from 'react-router-dom';
import { useAuditSession } from '../../state/session';
import { Badge } from '../../design-system/components';
import type { ReactNode } from 'react';

const NAV = [
  { to: 'report', label: 'Resumo & diagnóstico' },
  { to: 'report/evidence', label: 'Evidências' },
  { to: 'report/opportunities', label: 'Oportunidades & ações' },
];

/**
 * Shell das telas de relatório: contexto do audit + navegação de seções.
 * Estrutura de seções conforme Documento 4, §34.
 */
export function ReportShell({ children }: { children?: ReactNode }) {
  const { auditId } = useParams();
  const { draft, bundle, status } = useAuditSession();
  if (!draft || !auditId) return null;

  const score = bundle?.scores.find((s) => s.id === 'score_discoverability');

  return (
    <div className="shell shell-wide">
      <header className="page-head">
        <div className="row-between">
          <div>
            <div className="page-eyebrow">Discoverability Audit · {draft.product.name}</div>
            <h1>Relatório de discoverability</h1>
            <p className="small muted" style={{ marginTop: 8 }}>
              {draft.product.category} · Mercado {draft.audit.market} · Idioma {draft.audit.language} · Metodologia v
              {draft.audit.methodologyVersion} · Prompts v{draft.audit.promptSetVersion}
            </p>
          </div>
          <div className="row">
            {status === 'COMPLETED' && <Badge tone="green">Auditoria concluída</Badge>}
            {score && <Badge tone="accent">{score.metric}: {score.displayValue}</Badge>}
          </div>
        </div>
      </header>

      <nav className="report-nav" aria-label="Seções do relatório">
        {NAV.map((n) => (
          <NavLink key={n.to} to={`/audit/${auditId}/${n.to}`} end={n.to === 'report'}>
            {n.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'var(--sp-6)' }}>{children ?? <Outlet />}</div>
    </div>
  );
}
