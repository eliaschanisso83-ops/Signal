import { NavLink, Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuditSession } from '../../state/session';
import { Badge } from '../../design-system/components';
import { pageTitle, useDocumentTitle } from '../../i18n/seo';
import type { ReactNode } from 'react';

const NAV = ['report', 'report/evidence', 'report/opportunities'];

/**
 * Shell das telas de relatório: contexto do audit + navegação de seções.
 * Estrutura de seções conforme Documento 4, §34.
 */
export function ReportShell({ children }: { children?: ReactNode }) {
  const { auditId } = useParams();
  const { draft, bundle, status } = useAuditSession();
  const { t } = useTranslation('report');
  useDocumentTitle(pageTitle(t('head.title')));
  if (!draft || !auditId) return null;

  const score = bundle?.scores.find((s) => s.id === 'score_discoverability');

  return (
    <div className="shell shell-wide">
      <header className="page-head">
        <div className="row-between">
          <div>
            <div className="page-eyebrow">{t('head.eyebrow', { name: draft.product.name })}</div>
            <h1>{t('head.title')}</h1>
            <p className="small muted" style={{ marginTop: 8 }}>
              {draft.product.category} · {t('head.market', { value: draft.audit.market })} ·{' '}
              {t('head.language', { value: draft.audit.language })} · {t('head.methodology', { version: draft.audit.methodologyVersion })} ·{' '}
              {t('head.prompts', { version: draft.audit.promptSetVersion })}
            </p>
          </div>
          <div className="row">
            {status === 'COMPLETED' && <Badge tone="green">{t('head.completed')}</Badge>}
            {score && (
              <Badge tone="accent">
                {score.metric}: {score.displayValue}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <nav className="report-nav" aria-label={t('head.sectionsNav')}>
        {NAV.map((to) => (
          <NavLink key={to} to={`/audit/${auditId}/${to}`} end={to === 'report'}>
            {t(`nav.${to === 'report' ? 'summary' : to === 'report/evidence' ? 'evidence' : 'actions'}`)}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'var(--sp-6)' }}>{children ?? <Outlet />}</div>
    </div>
  );
}
