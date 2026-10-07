import { Badge, Card, ConfidenceBadge, Meter, Tooltip } from '../../design-system/components';
import {
  CausalChain,
  DataTable,
  ScoreGauge,
  type CausalKind,
} from '../../design-system/visuals';
import { useAuditSession } from '../../state/session';
import { RequireReport } from '../../components/layout/Guards';
import { Navigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import type { PresenceLevel, RecommendationDistribution, Score } from '../../domain/types';

function ScoreCard({ score }: { score: Score }) {
  const { t } = useTranslation('report');
  return (
    <Card className="score-card">
      <div className="row-between">
        <span className="small strong">{score.metric}</span>
        <Tooltip
          label={t('scoreCard.formulaLabel', { metric: score.metric })}
          text={t('scoreCard.formulaText', {
            explanation: score.explanation,
            formula: score.formulaVersion,
            methodology: score.methodologyVersion,
          })}
        />
      </div>
      <div className="score-value mono">{score.displayValue}</div>
      <ConfidenceBadge value={score.confidence} />
      <p className="xsmall muted" style={{ margin: '10px 0 0' }}>
        {score.explanation}
      </p>
    </Card>
  );
}

function DistributionBar({ item, total }: { item: RecommendationDistribution; total: number }) {
  const { t: tc } = useTranslation('common');
  const pct = Math.round((item.count / Math.max(1, total)) * 100);
  const tone =
    item.eventType === 'RECOMMENDATION' ? 'success' : item.eventType === 'NEGATIVE' ? 'gap' : item.eventType === 'ALTERNATIVE' ? 'accent' : 'muted';
  return (
    <div className="dist-row">
      <span className="dist-label">{tc(`events.${item.eventType}`)}</span>
      <Meter label="" value={pct} displayValue={`${item.count} · ${pct}%`} tone={tone} />
    </div>
  );
}

export function AuditReportPage() {
  return (
    <RequireReport>
      <ReportSummary />
    </RequireReport>
  );
}

function ReportSummary() {
  const { bundle } = useAuditSession();
  const { auditId } = useParams();
  const { t } = useTranslation('report');
  const { t: tc } = useTranslation('common');
  if (!bundle || !auditId) return <Navigate to="/audit/new" replace />;

  const score = bundle.scores.find((s) => s.id === 'score_discoverability')!;
  const share = bundle.scores.find((s) => s.id === 'score_share')!;
  const coverage = bundle.scores.find((s) => s.id === 'score_coverage')!;
  const position = bundle.scores.find((s) => s.id === 'score_position')!;
  const evidenceScore = bundle.scores.find((s) => s.id === 'score_evidence')!;
  const semantic = bundle.scores.find((s) => s.id === 'score_semantic')!;
  const others = [share, coverage, position, evidenceScore, semantic];

  const summary = bundle.executiveSummary;
  const causal: Array<{ kind: CausalKind; text: string }> = [
    { kind: 'observed', text: summary.observations[summary.observations.length - 1] },
    { kind: 'evidence', text: summary.evidenceSummary },
    { kind: 'hypothesis', text: summary.hypothesis },
    { kind: 'action', text: summary.recommendedFocus },
  ];

  const distTotal = bundle.distribution.reduce((a, d) => a + d.count, 0);
  const positionRank = position.value;

  const presenceLabel = (presence: PresenceLevel) => {
    const label = tc(`presenceLevels.${presence}`);
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <div className="stack stack-6 reveal-group">
      {/* ---- 1. Executive summary ---- */}
      <Card>
        <div className="row-between">
          <div className="page-eyebrow">{t('summary.eyebrow')}</div>
          <Badge tone="amber">{summary.status}</Badge>
        </div>
        <h2 className="exec-headline">{summary.headline}</h2>
        <ul className="obs-list">
          {summary.observations.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
        <div className="causal-legend row" aria-hidden="false">
          <span className="legend-item" data-kind="observed">
            {tc('causal.observed')}
          </span>
          <span className="legend-item" data-kind="evidence">
            {tc('causal.evidence')}
          </span>
          <span className="legend-item" data-kind="hypothesis">
            {tc('causal.hypothesis')}
          </span>
          <span className="legend-item" data-kind="action">
            {tc('causal.action')}
          </span>
        </div>
        <CausalChain steps={causal} />
      </Card>

      {/* ---- 2. Scores ---- */}
      <section aria-labelledby="scores-title">
        <div className="section-head">
          <div className="page-eyebrow">{t('scores.eyebrow')}</div>
          <h2 id="scores-title">{t('scores.title')}</h2>
          <p>{t('scores.desc')}</p>
        </div>
        <div className="score-hero">
          <ScoreGauge value={score.value} label={t('scores.gaugeLabel')} />
          <div className="score-hero-text">
            <p className="small muted" style={{ margin: 0 }}>
              <Trans
                ns="report"
                i18nKey="scores.heroNote"
                values={{
                  metric: tc('metrics.discoverabilityScore'),
                  formula: score.formulaVersion,
                  methodology: score.methodologyVersion,
                }}
                components={{ strong: <strong /> }}
              />
            </p>
            <p className="small" style={{ margin: 'var(--sp-3) 0 0' }}>
              {score.explanation}
            </p>
            <div className="row" style={{ marginTop: 'var(--sp-3)' }}>
              <ConfidenceBadge value={score.confidence} />
              <Badge tone="neutral">{t('scores.experimental')}</Badge>
            </div>
          </div>
        </div>
        <div className="grid-3" style={{ marginTop: 'var(--sp-4)' }}>
          {others.map((s) => (
            <ScoreCard key={s.id} score={s} />
          ))}
        </div>
      </section>

      {/* ---- 3. Intent coverage / landscape ---- */}
      <section aria-labelledby="coverage-title">
        <div className="section-head">
          <div className="page-eyebrow">{t('coverage.eyebrow')}</div>
          <h2 id="coverage-title">{t('coverage.title')}</h2>
          <p>{t('coverage.desc')}</p>
        </div>
        <Card>
          <DataTable
            caption={t('coverage.tableCaption')}
            rows={bundle.landscape.map((r) => ({ ...r, id: r.intentId }))}
            emptyMessage={t('coverage.empty')}
            columns={[
              {
                key: 'intent',
                label: t('coverage.columns.intent'),
                render: (r) => (
                  <div>
                    <div className="strong">{r.intentName}</div>
                    <span className="xsmall muted">
                      {t('coverage.relevance', { level: tc(`levels.${r.priority}`) })}
                    </span>
                  </div>
                ),
              },
              {
                key: 'presence',
                label: t('coverage.columns.presence'),
                render: (r) => (
                  <span className="row" style={{ gap: 6 }}>
                    <Badge
                      tone={
                        r.presence === 'ALTA'
                          ? 'green'
                          : r.presence === 'MEDIA'
                            ? 'blue'
                            : r.presence === 'BAIXA'
                              ? 'amber'
                              : 'red'
                      }
                    >
                      {presenceLabel(r.presence)}
                    </Badge>
                    <span className="xsmall mono muted">{r.presenceValue}%</span>
                  </span>
                ),
              },
              { key: 'leader', label: t('coverage.columns.leader'), render: (r) => <span>{r.leader} · {r.leaderShare}%</span> },
              {
                key: 'our',
                label: t('coverage.columns.share'),
                render: (r) => (
                  <div style={{ minWidth: 140 }}>
                    <Meter label="" value={r.ourShare} displayValue={`${r.ourShare}%`} tone="accent" />
                  </div>
                ),
              },
              {
                key: 'gap',
                label: t('coverage.columns.gap'),
                render: (r) => (
                  <Badge tone={r.gap === 'Alto' ? 'red' : r.gap === 'Médio' ? 'amber' : 'neutral'}>
                    {r.gap === 'Alto' ? t('coverage.gap.high') : r.gap === 'Médio' ? t('coverage.gap.medium') : t('coverage.gap.low')}
                  </Badge>
                ),
              },
            ]}
          />
        </Card>
      </section>

      {/* ---- 4. Recommendation analysis + competitive ---- */}
      <section aria-labelledby="reco-title">
        <div className="section-head">
          <div className="page-eyebrow">{t('reco.eyebrow')}</div>
          <h2 id="reco-title">{t('reco.title')}</h2>
          <p>{t('reco.desc', { count: distTotal })}</p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <h3 style={{ marginBottom: 'var(--sp-4)' }}>{t('reco.distributionTitle')}</h3>
            <div className="stack stack-3">
              {bundle.distribution.map((d) => (
                <DistributionBar key={d.eventType} item={d} total={distTotal} />
              ))}
            </div>
            <p className="xsmall muted" style={{ marginTop: 'var(--sp-4)', marginBottom: 0 }}>
              {t('reco.distributionNote')}
            </p>
          </Card>

          <Card>
            <h3 style={{ marginBottom: 'var(--sp-4)' }}>{t('reco.positionTitle')}</h3>
            <div className="stack stack-3">
              {bundle.competitorSnapshots.map((c) => (
                <div key={c.id} className={`comp-row ${c.isSubject ? 'comp-subject' : ''}`}>
                  <div className="row-between">
                    <span className="strong">
                      {c.name}
                      {c.isSubject && (
                        <span className="xsmall muted" style={{ marginLeft: 6 }}>
                          {t('reco.auditedProduct')}
                        </span>
                      )}
                    </span>
                    <span className="mono small">{c.recommendationShare}%</span>
                  </div>
                  <Meter label="" value={c.recommendationShare} displayValue="" tone={c.isSubject ? 'accent' : 'muted'} />
                  <span className="xsmall muted">
                    {t('reco.coverageLine', {
                      coverage: c.coverage,
                      total: c.coverageTotal,
                      position: c.avgPosition.toFixed(1),
                    })}
                  </span>
                </div>
              ))}
            </div>
            <p className="xsmall muted" style={{ marginTop: 'var(--sp-4)', marginBottom: 0 }}>
              {t('reco.rankingNote', {
                product: bundle.product.name,
                rank: positionRank,
                count: bundle.competitorSnapshots.length,
              })}
            </p>
          </Card>
        </div>

        <Card style={{ marginTop: 'var(--sp-4)' }}>
          <h3 style={{ marginBottom: 'var(--sp-4)' }}>{t('reco.breakdownTitle')}</h3>
          <DataTable
            caption={t('reco.tableCaption')}
            rows={bundle.competitorSnapshots}
            columns={[
              { key: 'name', label: t('reco.columns.product'), render: (r) => <span className="strong">{r.name}</span> },
              {
                key: 'top',
                label: t('reco.columns.topIntents'),
                render: (r) => (r.topIntents.length > 0 ? r.topIntents.join(', ') : '—'),
              },
              {
                key: 'char',
                label: t('reco.columns.characterization'),
                render: (r) => (
                  <ul className="chip-list">
                    {r.characterizations.map((c) => (
                      <li key={c} className="chip">
                        {c}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                key: 'src',
                label: t('reco.columns.sources'),
                render: (r) => <span className="xsmall mono">{r.recurringSources.join(', ')}</span>,
              },
              { key: 'pos', label: t('reco.columns.avgPosition'), numeric: true, render: (r) => r.avgPosition.toFixed(1) },
            ]}
          />
        </Card>
      </section>

      {/* ---- 5. Semantic alignment ---- */}
      <section aria-labelledby="semantic-title">
        <div className="section-head">
          <div className="page-eyebrow">{t('semantic.eyebrow')}</div>
          <h2 id="semantic-title">{t('semantic.title')}</h2>
        </div>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <dl className="kv">
              <dt>{t('semantic.declared')}</dt>
              <dd>{bundle.semanticAlignment.intendedPositioning}</dd>
              <dt>{t('semantic.observed')}</dt>
              <dd>{bundle.semanticAlignment.observedCharacterization}</dd>
            </dl>
            <div className="row" style={{ marginTop: 'var(--sp-4)' }}>
              <Badge tone={bundle.semanticAlignment.verdict === 'GAP' ? 'red' : bundle.semanticAlignment.verdict === 'PARTIAL' ? 'amber' : 'green'}>
                {t('semantic.verdict', {
                  value:
                    bundle.semanticAlignment.verdict === 'GAP'
                      ? 'GAP'
                      : bundle.semanticAlignment.verdict === 'PARTIAL'
                        ? t('semantic.verdictPartial')
                        : t('semantic.verdictAligned'),
                })}
              </Badge>
              <ConfidenceBadge value="MEDIUM" />
            </div>
            <p className="small" style={{ marginTop: 'var(--sp-3)', marginBottom: 0 }}>
              {bundle.semanticAlignment.explanation}
            </p>
          </Card>
          <Card>
            <h3 style={{ marginBottom: 'var(--sp-4)' }}>{t('semantic.termsTitle')}</h3>
            <div className="stack stack-4">
              {Object.entries(bundle.characterizations).map(([name, terms]) => (
                <div key={name}>
                  <div className="xsmall muted strong" style={{ marginBottom: 6 }}>
                    {name.toUpperCase()}
                    {name === bundle.product.name ? ` ${t('semantic.audited')}` : ''}
                  </div>
                  <ul className="chip-list">
                    {terms.map((term) => (
                      <li key={term} className="chip">
                        {term}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ---- 6. Methodology ---- */}
      <section aria-labelledby="method-title">
        <div className="section-head">
          <div className="page-eyebrow">{t('methodology.eyebrow')}</div>
          <h2 id="method-title">{t('methodology.title')}</h2>
        </div>
        <Card>
          <div className="grid-2">
            <dl className="kv">
              <dt>{t('methodology.fields.methodology')}</dt>
              <dd className="mono">v{bundle.methodology.methodologyVersion}</dd>
              <dt>{t('methodology.fields.promptSet')}</dt>
              <dd className="mono">v{bundle.methodology.promptSetVersion}</dd>
              <dt>{t('methodology.fields.scoring')}</dt>
              <dd className="mono">v{bundle.methodology.scoringVersion}</dd>
              <dt>{t('methodology.fields.provider')}</dt>
              <dd>{bundle.methodology.provider}</dd>
              <dt>{t('methodology.fields.model')}</dt>
              <dd>{bundle.methodology.model}</dd>
              <dt>{t('methodology.fields.marketLanguage')}</dt>
              <dd>
                {bundle.methodology.market} · {bundle.methodology.language}
              </dd>
              <dt>{t('methodology.fields.analysisDate')}</dt>
              <dd>{bundle.methodology.analysisDate}</dd>
            </dl>
            <dl className="kv">
              <dt>{t('methodology.fields.intents')}</dt>
              <dd>
                {t('methodology.intentsOf', {
                  analyzed: bundle.methodology.intentsAnalyzed,
                  total: bundle.methodology.intentsTotal,
                })}
              </dd>
              <dt>{t('methodology.fields.prompts')}</dt>
              <dd>{bundle.methodology.promptsTotal}</dd>
              <dt>{t('methodology.fields.relevantResponses')}</dt>
              <dd>{bundle.methodology.responsesRelevant}</dd>
              <dt>{t('methodology.fields.sampleSize')}</dt>
              <dd>{bundle.methodology.sampleSize}</dd>
            </dl>
          </div>
          <hr className="divider" />
          <h3>{t('methodology.limitations')}</h3>
          <ul className="limit-list">
            {bundle.methodology.limitations.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
