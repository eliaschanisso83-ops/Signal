import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PIPELINE_STEPS, useAuditSession } from '../state/session';
import { Badge, Button, Card, ErrorState, LinkButton } from '../design-system/components';
import { WizardHeader } from '../components/layout/WizardHeader';
import { PipelineSteps, ProgressBar, SignalNetwork, type NetState } from '../design-system/visuals';
import { RequireDraft } from '../components/layout/Guards';

export function AuditProgressPage() {
  const { t } = useTranslation('audit');
  const { draft, status, stepIndex, startAudit, retryAudit } = useAuditSession();
  const navigate = useNavigate();

  const running = status === 'QUEUED' || status === 'RUNNING' || status === 'ANALYZING';
  const done = status === 'COMPLETED';
  const failed = status === 'FAILED' || status === 'CANCELLED';

  const STATUS_LABEL: Record<string, string> = {
    DRAFT: t('progress.status.DRAFT'),
    QUEUED: t('progress.status.QUEUED'),
    RUNNING: t('progress.status.RUNNING'),
    ANALYZING: t('progress.status.ANALYZING'),
    COMPLETED: t('progress.status.COMPLETED'),
    FAILED: t('progress.status.FAILED'),
    CANCELLED: t('progress.status.CANCELLED'),
  };

  const STEP_LABEL: Record<(typeof PIPELINE_STEPS)[number], string> = {
    preparing: t('progress.steps.preparing'),
    testing: t('progress.steps.testing'),
    analyzing: t('progress.steps.analyzing'),
    evidence: t('progress.steps.evidence'),
    gaps: t('progress.steps.gaps'),
    opportunities: t('progress.steps.opportunities'),
    ready: t('progress.steps.ready'),
  };
  const stepLabels = PIPELINE_STEPS.map((id) => STEP_LABEL[id]);

  const pct =
    status === 'QUEUED'
      ? 4
      : Math.min(98, Math.round(((stepIndex + 1) / PIPELINE_STEPS.length) * 100));

  const netState: NetState = failed ? 'error' : done ? 'success' : status === 'DRAFT' ? 'idle' : 'processing';
  const currentStep = stepLabels[Math.min(stepIndex, PIPELINE_STEPS.length - 1)];
  const netCaption = failed
    ? t('progress.net.failed')
    : done
      ? t('progress.net.done')
      : status === 'DRAFT'
        ? t('progress.net.idle')
        : t('progress.net.running');

  useEffect(() => {
    if (!done || !draft) return;
    const t1 = window.setTimeout(() => navigate(`/audit/${draft.audit.id}/report`, { replace: true }), 1800);
    return () => window.clearTimeout(t1);
  }, [done, draft, navigate]);

  if (!draft) return <Navigate to="/audit/new" replace />;

  return (
    <RequireDraft>
      <div className="shell shell-wide">
        <WizardHeader currentIndex={4} />

        <div className="page-head">
          <div className="page-eyebrow">{t('progress.eyebrow')}</div>
          <h1>{done ? t('progress.title.done') : t('progress.title.running')}</h1>
          <p>{done ? t('progress.intro.done') : t('progress.intro.running')}</p>
        </div>

        <SignalNetwork
          state={netState}
          step={netState === 'processing' || netState === 'success' ? currentStep : undefined}
          caption={netCaption}
        />

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <div className="row-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <h2 style={{ margin: 0 }}>{t('progress.sections.progress')}</h2>
              <Badge tone={done ? 'green' : failed ? 'red' : 'accent'}>
                {STATUS_LABEL[status] ?? status}
              </Badge>
            </div>

            <ProgressBar value={done ? 100 : pct} label={t('progress.progressBar')} />

            <div style={{ marginTop: 'var(--sp-5)' }}>
              <PipelineSteps steps={stepLabels} currentIndex={stepIndex} done={done} />
            </div>

            {status === 'DRAFT' && (
              <div className="row" style={{ marginTop: 'var(--sp-4)' }}>
                <Button onClick={startAudit}>{t('progress.start')}</Button>
                <Button variant="ghost" onClick={() => navigate(`/audit/${draft.audit.id}/prompts`)}>
                  {t('progress.back')}
                </Button>
              </div>
            )}

            {running && (
              <p className="small muted" style={{ marginTop: 'var(--sp-4)' }} role="status" aria-live="polite">
                {t('progress.processing')}
              </p>
            )}

            {done && (
              <div className="row" style={{ marginTop: 'var(--sp-4)' }}>
                <LinkButton to={`/audit/${draft.audit.id}/report`}>{t('progress.viewReport')}</LinkButton>
                <span className="small muted">{t('progress.autoOpen')}</span>
              </div>
            )}

            {failed && (
              <div style={{ marginTop: 'var(--sp-4)' }}>
                <ErrorState
                  title={t('progress.error.title')}
                  desc={t('progress.error.desc')}
                  onRetry={retryAudit}
                />
              </div>
            )}
          </Card>

          <Card>
            <h2 style={{ marginBottom: 'var(--sp-4)' }}>{t('progress.sections.context')}</h2>
            <dl className="kv">
              <dt>{t('progress.terms.id')}</dt>
              <dd className="mono">{draft.audit.id}</dd>
              <dt>{t('progress.terms.product')}</dt>
              <dd>{draft.product.name}</dd>
              <dt>{t('progress.terms.market')}</dt>
              <dd>
                {draft.audit.market} · {draft.audit.language}
              </dd>
              <dt>{t('progress.terms.intents')}</dt>
              <dd>{t('progress.selected', { count: draft.intents.filter((i) => i.selected).length })}</dd>
              <dt>{t('progress.terms.activePrompts')}</dt>
              <dd>{draft.prompts.filter((p) => p.active).length}</dd>
              <dt>{t('progress.terms.methodology')}</dt>
              <dd className="mono">v{draft.audit.methodologyVersion}</dd>
              <dt>{t('progress.terms.promptSet')}</dt>
              <dd className="mono">v{draft.audit.promptSetVersion}</dd>
            </dl>

            <hr className="divider" />
            <div className="xsmall muted">
              <strong>{t('progress.currentStep')}</strong> {currentStep}
            </div>
          </Card>
        </div>
      </div>
    </RequireDraft>
  );
}
