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
import type { RecommendationDistribution, Score } from '../../domain/types';

function ScoreCard({ score }: { score: Score }) {
  return (
    <Card className="score-card">
      <div className="row-between">
        <span className="small strong">{score.metric}</span>
        <Tooltip
          label={`Fórmula ${score.metric}`}
          text={`${score.explanation} · fórmula v${score.formulaVersion} · metodologia v${score.methodologyVersion}`}
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
  const pct = Math.round((item.count / Math.max(1, total)) * 100);
  const tone =
    item.eventType === 'RECOMMENDATION' ? 'success' : item.eventType === 'NEGATIVE' ? 'gap' : item.eventType === 'ALTERNATIVE' ? 'accent' : 'muted';
  return (
    <div className="dist-row">
      <span className="dist-label">{item.label}</span>
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

  return (
    <div className="stack stack-6 reveal-group">
      {/* ---- 1. Executive summary ---- */}
      <Card>
        <div className="row-between">
          <div className="page-eyebrow">Resumo executivo</div>
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
            Observação
          </span>
          <span className="legend-item" data-kind="evidence">
            Evidência
          </span>
          <span className="legend-item" data-kind="hypothesis">
            Hipótese
          </span>
          <span className="legend-item" data-kind="action">
            Ação
          </span>
        </div>
        <CausalChain steps={causal} />
      </Card>

      {/* ---- 2. Scores ---- */}
      <section aria-labelledby="scores-title">
        <div className="section-head">
          <div className="page-eyebrow">Scores</div>
          <h2 id="scores-title">Diagnóstico quantitativo</h2>
          <p>Cada score exibe valor, fórmula, versão e confiança — nenhum número sem proveniência.</p>
        </div>
        <div className="score-hero">
          <ScoreGauge value={score.value} label="Discoverability" />
          <div className="score-hero-text">
            <p className="small muted" style={{ margin: 0 }}>
              <strong>Discoverability Score</strong> — score composto (fórmula v{score.formulaVersion}, metodologia v
              {score.methodologyVersion}).
            </p>
            <p className="small" style={{ margin: 'var(--sp-3) 0 0' }}>
              {score.explanation}
            </p>
            <div className="row" style={{ marginTop: 'var(--sp-3)' }}>
              <ConfidenceBadge value={score.confidence} />
              <Badge tone="neutral">Experimental</Badge>
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
          <div className="page-eyebrow">Intent coverage</div>
          <h2 id="coverage-title">Landscape de intents</h2>
          <p>
            Presença do produto em cada intent relevante, líder do intent e tamanho do gap (relevância × ausência).
          </p>
        </div>
        <Card>
          <DataTable
            caption="Presença por intent"
            rows={bundle.landscape.map((r) => ({ ...r, id: r.intentId }))}
            emptyMessage="Nenhum intent selecionado."
            columns={[
              {
                key: 'intent',
                label: 'Intent',
                render: (r) => (
                  <div>
                    <div className="strong">{r.intentName}</div>
                    <span className="xsmall muted">Relevância {r.priority === 'HIGH' ? 'alta' : r.priority === 'MEDIUM' ? 'média' : 'baixa'}</span>
                  </div>
                ),
              },
              {
                key: 'presence',
                label: 'Presença',
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
                      {r.presence === 'MEDIA' ? 'Média' : r.presence.charAt(0) + r.presence.slice(1).toLowerCase()}
                    </Badge>
                    <span className="xsmall mono muted">{r.presenceValue}%</span>
                  </span>
                ),
              },
              { key: 'leader', label: 'Líder do intent', render: (r) => <span>{r.leader} · {r.leaderShare}%</span> },
              {
                key: 'our',
                label: 'Share do produto',
                render: (r) => (
                  <div style={{ minWidth: 140 }}>
                    <Meter label="" value={r.ourShare} displayValue={`${r.ourShare}%`} tone="accent" />
                  </div>
                ),
              },
              {
                key: 'gap',
                label: 'Gap',
                render: (r) => (
                  <Badge tone={r.gap === 'Alto' ? 'red' : r.gap === 'Médio' ? 'amber' : 'neutral'}>{r.gap}</Badge>
                ),
              },
            ]}
          />
        </Card>
      </section>

      {/* ---- 4. Recommendation analysis + competitive ---- */}
      <section aria-labelledby="reco-title">
        <div className="section-head">
          <div className="page-eyebrow">Recommendation analysis</div>
          <h2 id="reco-title">Recomendações e posição competitiva</h2>
          <p>
            Distribuição das classificações de menção em {distTotal} observações e comparativo entre os produtos
            analisados.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <h3 style={{ marginBottom: 'var(--sp-4)' }}>Distribuição de classificações</h3>
            <div className="stack stack-3">
              {bundle.distribution.map((d) => (
                <DistributionBar key={d.eventType} item={d} total={distTotal} />
              ))}
            </div>
            <p className="xsmall muted" style={{ marginTop: 'var(--sp-4)', marginBottom: 0 }}>
              Classificação conforme Documento 3, §27. “Irrelevante” foge ao escopo do produto.
            </p>
          </Card>

          <Card>
            <h3 style={{ marginBottom: 'var(--sp-4)' }}>Posição competitiva</h3>
            <div className="stack stack-3">
              {bundle.competitorSnapshots.map((c) => (
                <div key={c.id} className={`comp-row ${c.isSubject ? 'comp-subject' : ''}`}>
                  <div className="row-between">
                    <span className="strong">
                      {c.name}
                      {c.isSubject && (
                        <span className="xsmall muted" style={{ marginLeft: 6 }}>
                          (produto auditado)
                        </span>
                      )}
                    </span>
                    <span className="mono small">{c.recommendationShare}%</span>
                  </div>
                  <Meter label="" value={c.recommendationShare} displayValue="" tone={c.isSubject ? 'accent' : 'muted'} />
                  <span className="xsmall muted">
                    Cobertura {c.coverage}/{c.coverageTotal} intents · posição média {c.avgPosition.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
            <p className="xsmall muted" style={{ marginTop: 'var(--sp-4)', marginBottom: 0 }}>
              Ranking por Recommendation Share. {bundle.product.name} ocupa a {positionRank}ª posição entre{' '}
              {bundle.competitorSnapshots.length} produtos.
            </p>
          </Card>
        </div>

        <Card style={{ marginTop: 'var(--sp-4)' }}>
          <h3 style={{ marginBottom: 'var(--sp-4)' }}>Detalhamento por concorrente</h3>
          <DataTable
            caption="Snapshot dos concorrentes"
            rows={bundle.competitorSnapshots}
            columns={[
              { key: 'name', label: 'Produto', render: (r) => <span className="strong">{r.name}</span> },
              {
                key: 'top',
                label: 'Intents mais fortes',
                render: (r) => (r.topIntents.length > 0 ? r.topIntents.join(', ') : '—'),
              },
              {
                key: 'char',
                label: 'Caracterização observada',
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
                label: 'Fontes recorrentes',
                render: (r) => <span className="xsmall mono">{r.recurringSources.join(', ')}</span>,
              },
              { key: 'pos', label: 'Posição média', numeric: true, render: (r) => r.avgPosition.toFixed(1) },
            ]}
          />
        </Card>
      </section>

      {/* ---- 5. Semantic alignment ---- */}
      <section aria-labelledby="semantic-title">
        <div className="section-head">
          <div className="page-eyebrow">Semantic alignment</div>
          <h2 id="semantic-title">Posicionamento declarado × caracterização observada</h2>
        </div>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <dl className="kv">
              <dt>Declarado</dt>
              <dd>{bundle.semanticAlignment.intendedPositioning}</dd>
              <dt>Observado</dt>
              <dd>{bundle.semanticAlignment.observedCharacterization}</dd>
            </dl>
            <div className="row" style={{ marginTop: 'var(--sp-4)' }}>
              <Badge tone={bundle.semanticAlignment.verdict === 'GAP' ? 'red' : bundle.semanticAlignment.verdict === 'PARTIAL' ? 'amber' : 'green'}>
                Veredicto: {bundle.semanticAlignment.verdict === 'GAP' ? 'GAP' : bundle.semanticAlignment.verdict === 'PARTIAL' ? 'PARCIAL' : 'ALINHADO'}
              </Badge>
              <ConfidenceBadge value="MEDIUM" />
            </div>
            <p className="small" style={{ marginTop: 'var(--sp-3)', marginBottom: 0 }}>
              {bundle.semanticAlignment.explanation}
            </p>
          </Card>
          <Card>
            <h3 style={{ marginBottom: 'var(--sp-4)' }}>Termos associados a cada produto</h3>
            <div className="stack stack-4">
              {Object.entries(bundle.characterizations).map(([name, terms]) => (
                <div key={name}>
                  <div className="xsmall muted strong" style={{ marginBottom: 6 }}>
                    {name.toUpperCase()}
                    {name === bundle.product.name ? ' (AUDITADO)' : ''}
                  </div>
                  <ul className="chip-list">
                    {terms.map((t) => (
                      <li key={t} className="chip">
                        {t}
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
          <div className="page-eyebrow">Methodology</div>
          <h2 id="method-title">Como esta auditoria foi produzida</h2>
        </div>
        <Card>
          <div className="grid-2">
            <dl className="kv">
              <dt>Metodologia</dt>
              <dd className="mono">v{bundle.methodology.methodologyVersion}</dd>
              <dt>Conjunto de prompts</dt>
              <dd className="mono">v{bundle.methodology.promptSetVersion}</dd>
              <dt>Scoring</dt>
              <dd className="mono">v{bundle.methodology.scoringVersion}</dd>
              <dt>Provider</dt>
              <dd>{bundle.methodology.provider}</dd>
              <dt>Modelo</dt>
              <dd>{bundle.methodology.model}</dd>
              <dt>Mercado / idioma</dt>
              <dd>
                {bundle.methodology.market} · {bundle.methodology.language}
              </dd>
              <dt>Data da análise</dt>
              <dd>{bundle.methodology.analysisDate}</dd>
            </dl>
            <dl className="kv">
              <dt>Intents</dt>
              <dd>
                {bundle.methodology.intentsAnalyzed} de {bundle.methodology.intentsTotal} analisados
              </dd>
              <dt>Prompts</dt>
              <dd>{bundle.methodology.promptsTotal}</dd>
              <dt>Respostas relevantes</dt>
              <dd>{bundle.methodology.responsesRelevant}</dd>
              <dt>Tamanho da amostra</dt>
              <dd>{bundle.methodology.sampleSize}</dd>
            </dl>
          </div>
          <hr className="divider" />
          <h3>Limitações</h3>
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
