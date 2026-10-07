import { Badge, Card, ConfidenceBadge, LinkButton } from '../../design-system/components';
import { CausalChain, EffortBadge, ImpactBadge, PriorityTag, DataTable } from '../../design-system/visuals';
import { useAuditSession } from '../../state/session';
import { RequireReport } from '../../components/layout/Guards';
import { Navigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import type { Action } from '../../domain/types';

export function OpportunitiesPage() {
  return (
    <RequireReport>
      <OpportunitiesContent />
    </RequireReport>
  );
}

function OpportunitiesContent() {
  const { bundle } = useAuditSession();
  const { auditId } = useParams();
  const { t } = useTranslation('report');
  const { t: tc } = useTranslation('common');
  if (!bundle || !auditId) return <Navigate to="/audit/new" replace />;

  const gapById = new Map(bundle.gaps.map((g) => [g.id, g]));
  const oppById = new Map(bundle.opportunities.map((o) => [o.id, o]));

  return (
    <div className="stack stack-8 reveal-group">
      {/* ---- Top opportunities ---- */}
      <section aria-labelledby="opps-title">
        <div className="section-head">
          <div className="page-eyebrow">{t('opportunities.eyebrow')}</div>
          <h2 id="opps-title">{t('opportunities.title')}</h2>
          <p>{t('opportunities.desc')}</p>
        </div>

        <div className="stack stack-4">
          {bundle.opportunities.map((opp) => {
            const gap = gapById.get(opp.gapId);
            return (
              <Card key={opp.id} className="opp-card">
                <div className="opp-rank" aria-label={t('opportunities.rank', { rank: opp.rank })}>
                  <span className="mono">{opp.rank}</span>
                </div>
                <div className="opp-body">
                  <div className="row-between">
                    <h3>{opp.title}</h3>
                    <div className="row">
                      <PriorityTag value={opp.priority} />
                    </div>
                  </div>
                  <p className="small" style={{ margin: '6px 0' }}>
                    {opp.description}
                  </p>
                  <div className="row" style={{ gap: 'var(--sp-2)' }}>
                    <ImpactBadge value={opp.impact} />
                    <Badge tone="neutral">{t('opportunities.relevance', { level: tc(`levels.${opp.relevance}`) })}</Badge>
                    <ConfidenceBadge value={opp.confidence} />
                    <EffortBadge value={opp.effort} />
                  </div>
                  {gap && (
                    <div className="opp-gap">
                      <span className="xsmall strong">{t('opportunities.sourceGap')}</span>
                      <p className="small" style={{ margin: '4px 0 0' }}>
                        <strong>{gap.title}</strong> — {gap.description}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ---- Recommended actions ---- */}
      <section aria-labelledby="actions-title">
        <div className="section-head">
          <div className="page-eyebrow">{t('actions.eyebrow')}</div>
          <h2 id="actions-title">{t('actions.title')}</h2>
          <p>
            <Trans
              ns="report"
              i18nKey="actions.desc"
              components={{ strong: <strong /> }}
            />
          </p>
        </div>

        <div className="stack stack-4">
          {bundle.actions.map((action) => {
            const opp = oppById.get(action.opportunityId);
            return (
              <Card key={action.id}>
                <div className="row-between">
                  <div className="row">
                    <Badge tone="accent">{t(`actionCategories.${action.category}`)}</Badge>
                    <h3 style={{ margin: 0 }}>{opp ? `#${opp.rank} ${opp.title}` : t('actions.fallbackTitle')}</h3>
                  </div>
                  <div className="row">
                    <PriorityTag value={action.priority} />
                    <ConfidenceBadge value={action.confidence} />
                  </div>
                </div>

                <div style={{ marginTop: 'var(--sp-4)' }}>
                  <CausalChain
                    steps={[
                      { kind: 'observed', text: action.problem },
                      { kind: 'evidence', text: action.evidence },
                      { kind: 'hypothesis', text: action.hypothesis },
                      { kind: 'action', text: action.action },
                    ]}
                  />
                </div>

                <div className="validation-note">
                  <span className="xsmall strong">{t('actions.validationLabel')}</span>
                  <p className="small" style={{ margin: '4px 0 0' }}>
                    {action.validation}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ---- Full traceability ---- */}
      <section aria-labelledby="trace-title">
        <div className="section-head">
          <div className="page-eyebrow">{t('trace.eyebrow')}</div>
          <h2 id="trace-title">{t('trace.title')}</h2>
          <p>{t('trace.desc')}</p>
        </div>
        <Card>
          <DataTable
            caption={t('trace.tableCaption')}
            rows={bundle.actions}
            columns={[
              {
                key: 'action',
                label: t('trace.columns.action'),
                render: (r: Action) => (
                  <div>
                    <div className="strong small">{r.action}</div>
                    <span className="xsmall muted">{t(`actionCategories.${r.category}`)}</span>
                  </div>
                ),
              },
              {
                key: 'opp',
                label: t('trace.columns.opportunity'),
                render: (r: Action) => {
                  const o = oppById.get(r.opportunityId);
                  return o ? `#${o.rank} ${o.title}` : '—';
                },
              },
              {
                key: 'gap',
                label: t('trace.columns.gap'),
                render: (r: Action) => {
                  const o = oppById.get(r.opportunityId);
                  const g = o ? gapById.get(o.gapId) : undefined;
                  return g ? g.title : '—';
                },
              },
              {
                key: 'priority',
                label: t('trace.columns.priority'),
                render: (r: Action) => <PriorityTag value={r.priority} />,
              },
              {
                key: 'confidence',
                label: t('trace.columns.confidence'),
                render: (r: Action) => <ConfidenceBadge value={r.confidence} />,
              },
            ]}
          />
        </Card>
      </section>

      {/* ---- Next step ---- */}
      <Card className="cta-card">
        <div className="row-between">
          <div>
            <div className="page-eyebrow">{t('cta.eyebrow')}</div>
            <h2>{t('cta.title')}</h2>
            <p className="small muted" style={{ marginBottom: 0 }}>
              {t('cta.desc')}
            </p>
          </div>
          <LinkButton to="/audit/new">{t('cta.button')}</LinkButton>
        </div>
      </Card>
    </div>
  );
}
