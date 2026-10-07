import { Badge, Card, ConfidenceBadge, Meter, RelevancePips } from '../../design-system/components';
import { DataTable, ImpactBadge, type CausalKind, CausalChain } from '../../design-system/visuals';
import { useAuditSession } from '../../state/session';
import { RequireReport } from '../../components/layout/Guards';
import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Evidence, Gap, RawEvidenceRow } from '../../domain/types';

type DimensionKey = 'relevance' | 'specificity' | 'credibility' | 'freshness' | 'independence';

const DIMENSIONS: Array<{ key: DimensionKey }> = [
  { key: 'relevance' },
  { key: 'specificity' },
  { key: 'credibility' },
  { key: 'freshness' },
  { key: 'independence' },
];

export function EvidencePage() {
  return (
    <RequireReport>
      <EvidenceContent />
    </RequireReport>
  );
}

function EvidenceContent() {
  const { bundle } = useAuditSession();
  const { auditId } = useParams();
  const { t } = useTranslation('report');
  const { t: tc } = useTranslation('common');
  if (!bundle || !auditId) return <Navigate to="/audit/new" replace />;

  const sourceById = new Map(bundle.sources.map((s) => [s.id, s]));
  const ourEvidence = bundle.evidence.filter((e) => e.subjectId === bundle.product.id);
  const compEvidence = bundle.evidence.filter((e) => e.subjectId !== bundle.product.id);
  const coverage = bundle.scores.find((s) => s.id === 'score_evidence');

  return (
    <div className="stack stack-8 reveal-group">
      <section aria-labelledby="landscape-title">
        <div className="section-head">
          <div className="page-eyebrow">{t('evidenceLandscape.eyebrow')}</div>
          <h2 id="landscape-title">{t('evidenceLandscape.title')}</h2>
          <p>{t('evidenceLandscape.desc')}</p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <div className="stack stack-4">
              {bundle.evidenceCoverageByIntent.map((row) => (
                <Meter
                  key={row.intentId}
                  label={row.intentName}
                  value={Math.round(row.strength * 100)}
                  displayValue={row.strength.toFixed(2)}
                  tone={row.strength >= 0.5 ? 'evidence' : 'gap'}
                />
              ))}
            </div>
          </Card>

          <Card>
            <div className="row-between">
              <h3 style={{ margin: 0 }}>{tc('metrics.evidenceCoverage')}</h3>
              {coverage && <Badge tone="accent">{coverage.displayValue}</Badge>}
            </div>
            <p className="small muted" style={{ marginTop: 'var(--sp-3)' }}>
              {coverage?.explanation}
            </p>
            <hr className="divider" />
            <dl className="kv">
              <dt>{t('evidenceStats.total')}</dt>
              <dd className="mono">{bundle.evidence.length}</dd>
              <dt>{t('evidenceStats.aboutProduct')}</dt>
              <dd className="mono">{ourEvidence.length}</dd>
              <dt>{t('evidenceStats.aboutCompetitors')}</dt>
              <dd className="mono">{compEvidence.length}</dd>
              <dt>{t('evidenceStats.sources')}</dt>
              <dd className="mono">{bundle.sources.length}</dd>
            </dl>
            <hr className="divider" />
            <h3>{t('evidenceStats.byCategory')}</h3>
            <ul className="stack stack-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {bundle.sources.map((s) => (
                <li key={s.id} className="row-between" style={{ fontSize: 'var(--fs-sm)' }}>
                  <span>
                    <Badge tone={s.category === 'OWNED' ? 'accent' : s.category === 'COMMUNITY' ? 'blue' : 'neutral'}>
                      {t(`sourceCategories.${s.category}`)}
                    </Badge>{' '}
                    {s.name}
                  </span>
                  <span className="xsmall mono muted">{s.domain}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section aria-labelledby="gaps-title">
        <div className="section-head">
          <div className="page-eyebrow">{t('gaps.eyebrow')}</div>
          <h2 id="gaps-title">{t('gaps.title')}</h2>
          <p>{t('gaps.desc')}</p>
        </div>

        <div className="stack stack-4">
          {bundle.gaps.map((gap) => (
            <Card key={gap.id}>
              <div className="row-between">
                <div className="row">
                  <Badge tone="neutral">{t(`gapTypes.${gap.type}`)}</Badge>
                  <h3 style={{ margin: 0 }}>{gap.title}</h3>
                </div>
                <div className="row">
                  <ImpactBadge value={gap.impact} />
                  <ConfidenceBadge value={gap.confidence} />
                </div>
              </div>
              <p className="small" style={{ marginTop: 'var(--sp-3)' }}>
                {gap.description}
              </p>
              <div className="gap-evidence">
                <div className="xsmall strong" style={{ marginBottom: 6 }}>
                  {t('gaps.evidenceLabel')}
                </div>
                <ul>
                  {gap.evidence.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="raw-title">
        <div className="section-head">
          <div className="page-eyebrow">{t('raw.eyebrow')}</div>
          <h2 id="raw-title">{t('raw.title')}</h2>
          <p>{t('raw.desc')}</p>
        </div>

        <Card>
          <DataTable<RawEvidenceRow>
            caption={t('raw.tableCaption')}
            rows={bundle.rawEvidence}
            columns={[
              {
                key: 'prompt',
                label: t('raw.columns.prompt'),
                render: (r) => (
                  <div>
                    <div className="small">{r.prompt}</div>
                    <span className="xsmall muted">{r.intentName}</span>
                  </div>
                ),
              },
              {
                key: 'excerpt',
                label: t('raw.columns.excerpt'),
                render: (r) => <span className="small">{r.responseExcerpt}</span>,
              },
              {
                key: 'products',
                label: t('raw.columns.products'),
                render: (r) => <span className="small">{r.productsMentioned}</span>,
              },
              {
                key: 'position',
                label: t('raw.columns.position'),
                numeric: true,
                render: (r) =>
                  r.ourPosition === null ? '—' : t('raw.position', { count: r.ourPosition, ordinal: true }),
              },
              {
                key: 'event',
                label: t('raw.columns.event'),
                render: (r) => (
                  <Badge
                    tone={
                      r.eventType === 'RECOMMENDATION'
                        ? 'green'
                        : r.eventType === 'ALTERNATIVE'
                          ? 'blue'
                          : r.eventType === 'NEGATIVE'
                            ? 'red'
                            : r.eventType === 'IRRELEVANT'
                              ? 'outline'
                              : 'neutral'
                    }
                  >
                    {r.eventType}
                  </Badge>
                ),
              },
              {
                key: 'sources',
                label: t('raw.columns.sources'),
                render: (r) => <span className="xsmall mono">{r.sources.join(', ')}</span>,
              },
            ]}
          />
        </Card>

        <div className="grid-2" style={{ marginTop: 'var(--sp-4)', alignItems: 'start' }}>
          <Card>
            <h3 style={{ marginBottom: 'var(--sp-4)' }}>{t('evidenceLists.product')}</h3>
            <div className="stack stack-4">
              {ourEvidence.map((e) => (
                <EvidenceItem key={e.id} evidence={e} sourceName={sourceById.get(e.sourceId)?.name ?? e.sourceId} />
              ))}
            </div>
          </Card>
          <Card>
            <h3 style={{ marginBottom: 'var(--sp-4)' }}>{t('evidenceLists.competitors')}</h3>
            <div className="stack stack-4">
              {compEvidence.map((e) => (
                <EvidenceItem key={e.id} evidence={e} sourceName={sourceById.get(e.sourceId)?.name ?? e.sourceId} />
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section aria-labelledby="chain-title">
        <div className="section-head">
          <div className="page-eyebrow">{t('evidenceTrace.eyebrow')}</div>
          <h2 id="chain-title">{t('evidenceTrace.title')}</h2>
          <p>{t('evidenceTrace.desc')}</p>
        </div>
        <Card>
          <TraceChain gaps={bundle.gaps} />
        </Card>
      </section>
    </div>
  );
}

function EvidenceItem({ evidence, sourceName }: { evidence: Evidence; sourceName: string }) {
  const { t } = useTranslation('report');
  return (
    <article className="evidence-item">
      <div className="row-between">
        <span className="strong small">{evidence.subjectName}</span>
        <ConfidenceBadge value={evidence.confidence} />
      </div>
      <p className="small" style={{ margin: '6px 0' }}>
        “{evidence.claim}”
      </p>
      <div className="xsmall muted" style={{ marginBottom: 8 }}>
        {t('evidenceItem.source', { source: sourceName, contextText: evidence.context })}
      </div>
      <div className="dim-grid">
        {DIMENSIONS.map((d) => (
          <div key={String(d.key)} className="dim-row">
            <span className="xsmall muted">{t(`dimensions.${d.key}`)}</span>
            <RelevancePips value={evidence[d.key] as number} />
          </div>
        ))}
      </div>
    </article>
  );
}

function TraceChain({ gaps }: { gaps: Gap[] }) {
  const { t } = useTranslation('report');
  const top = gaps[0];
  const steps: Array<{ kind: CausalKind; text: string }> = [
    { kind: 'observed', text: top.description },
    { kind: 'evidence', text: top.evidence.join(' · ') },
    { kind: 'hypothesis', text: t('evidenceTrace.hypothesis') },
    { kind: 'action', text: t('evidenceTrace.action') },
  ];
  return <CausalChain steps={steps} />;
}
