import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, LinkButton } from '../design-system/components';
import { useAuditSession } from '../state/session';
import { pageTitle, useDocumentTitle } from '../i18n/seo';

export function NotFoundPage() {
  const { draft, status } = useAuditSession();
  const { t } = useTranslation('errors');
  useDocumentTitle(pageTitle(t('notFound.title')));
  const fallback = draft ? `/audit/${draft.audit.id}/${status === 'COMPLETED' ? 'report' : 'progress'}` : '/';

  return (
    <div className="shell">
      <Card>
        <div className="page-eyebrow">{t('notFound.eyebrow')}</div>
        <h1>{t('notFound.title')}</h1>
        <p className="muted">{t('notFound.desc')}</p>
        <div className="page-actions">
          <LinkButton to={fallback}>
            {draft ? t('notFound.backToAudit') : t('notFound.backHome')}
          </LinkButton>
          <Link to="/" className="small">
            {t('notFound.homeLink')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
