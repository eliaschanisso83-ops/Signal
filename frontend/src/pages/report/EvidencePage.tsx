import { Badge, Card, ConfidenceBadge, Meter, RelevancePips } from '../../design-system/components';
import { DataTable, ImpactBadge, type CausalKind, CausalChain } from '../../design-system/visuals';
import { useAuditSession } from '../../state/session';
import { RequireReport } from '../../components/layout/Guards';
import { Navigate, useParams } from 'react-router-dom';
import type { Evidence, Gap, RawEvidenceRow, Source } from '../../domain/types';

const DIMENSIONS: Array<{ key: keyof Evidence; label: string }> = [
  { key: 'relevance', label: 'Relevância' },
  { key: 'specificity', label: 'Especificidade' },
  { key: 'credibility', label: 'Credibilidade' },
  { key: 'freshness', label: 'Atualidade' },
  { key: 'independence', label: 'Independência' },
];

const SOURCE_CATEGORY_LABEL: Record<Source['category'], string> = {
  OWNED: 'Própria',
  EARNED: 'Imprensa / conteúdo',
  COMMUNITY: 'Comunidade',
  PLATFORM: 'Plataforma',
  OTHER: 'Outra',
};

const GAP_TYPE_LABEL: Record<Gap['type'], string> = {
  RECOMMENDATION_GAP: 'Gap de recomendação',
  COVERAGE_GAP: 'Gap de cobertura',
  EVIDENCE_GAP: 'Gap de evidência',
  SEMANTIC_GAP: 'Gap semântico',
  COMPETITIVE_GAP: 'Gap competitivo',
  SOURCE_GAP: 'Gap de fonte',
  POSITIONING_GAP: 'Gap de posicionamento',
  CONVERSION_GAP: 'Gap de conversão',
};

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
  if (!bundle || !auditId) return <Navigate to="/audit/new" replace />;

  const sourceById = new Map(bundle.sources.map((s) => [s.id, s]));
  const ourEvidence = bundle.evidence.filter((e) => e.subjectId === bundle.product.id);
  const compEvidence = bundle.evidence.filter((e) => e.subjectId !== bundle.product.id);
  const coverage = bundle.scores.find((s) => s.id === 'score_evidence');

  return (
    <div className="stack stack-8">
      <section aria-labelledby="landscape-title">
        <div className="section-head">
          <div className="page-eyebrow">Evidence landscape</div>
          <h2 id="landscape-title">Força da evidência por intent</h2>
          <p>
            Quanto de evidência externa associada ao produto existe para cada intent relevante (escala 0–1). Valores
            abaixo de 0,5 contam como cobertura insuficiente.
          </p>
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
              <h3 style={{ margin: 0 }}>Evidence Coverage</h3>
              {coverage && <Badge tone="accent">{coverage.displayValue}</Badge>}
            </div>
            <p className="small muted" style={{ marginTop: 'var(--sp-3)' }}>
              {coverage?.explanation}
            </p>
            <hr className="divider" />
            <dl className="kv">
              <dt>Evidências totais</dt>
              <dd className="mono">{bundle.evidence.length}</dd>
              <dt>Sobre o produto</dt>
              <dd className="mono">{ourEvidence.length}</dd>
              <dt>Sobre concorrentes</dt>
              <dd className="mono">{compEvidence.length}</dd>
              <dt>Fontes observadas</dt>
              <dd className="mono">{bundle.sources.length}</dd>
            </dl>
            <hr className="divider" />
            <h3>Fontes por categoria</h3>
            <ul className="stack stack-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {bundle.sources.map((s) => (
                <li key={s.id} className="row-between" style={{ fontSize: 'var(--fs-sm)' }}>
                  <span>
                    <Badge tone={s.category === 'OWNED' ? 'accent' : s.category === 'COMMUNITY' ? 'blue' : 'neutral'}>
                      {SOURCE_CATEGORY_LABEL[s.category]}
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
          <div className="page-eyebrow">Evidence gaps</div>
          <h2 id="gaps-title">Lacunas identificadas</h2>
          <p>
            Cada gap carrega as evidências que o sustentam, impacto e confiança — nenhuma afirmação sem lastro.
          </p>
        </div>

        <div className="stack stack-4">
          {bundle.gaps.map((gap) => (
            <Card key={gap.id}>
              <div className="row-between">
                <div className="row">
                  <Badge tone="neutral">{GAP_TYPE_LABEL[gap.type]}</Badge>
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
                  EVIDÊNCIAS
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
          <div className="page-eyebrow">Raw evidence</div>
          <h2 id="raw-title">Evidência bruta observada</h2>
          <p>Amostra das respostas e das fontes que sustentam as conclusões (Doc 4, §36).</p>
        </div>

        <Card>
          <DataTable<RawEvidenceRow>
            caption="Amostra de respostas observadas"
            rows={bundle.rawEvidence}
            columns={[
              {
                key: 'prompt',
                label: 'Prompt',
                render: (r) => (
                  <div>
                    <div className="small">{r.prompt}</div>
                    <span className="xsmall muted">{r.intentName}</span>
                  </div>
                ),
              },
              {
                key: 'excerpt',
                label: 'Trecho da resposta',
                render: (r) => <span className="small">{r.responseExcerpt}</span>,
              },
              { key: 'products', label: 'Produtos citados', render: (r) => <span className="small">{r.productsMentioned}</span> },
              {
                key: 'position',
                label: 'Posição',
                numeric: true,
                render: (r) => (r.ourPosition === null ? '—' : `${r.ourPosition}º`),
              },
              {
                key: 'event',
                label: 'Classificação',
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
              { key: 'sources', label: 'Fontes', render: (r) => <span className="xsmall mono">{r.sources.join(', ')}</span> },
            ]}
          />
        </Card>

        <div className="grid-2" style={{ marginTop: 'var(--sp-4)', alignItems: 'start' }}>
          <Card>
            <h3 style={{ marginBottom: 'var(--sp-4)' }}>Evidências sobre o produto</h3>
            <div className="stack stack-4">
              {ourEvidence.map((e) => (
                <EvidenceItem key={e.id} evidence={e} sourceName={sourceById.get(e.sourceId)?.name ?? e.sourceId} />
              ))}
            </div>
          </Card>
          <Card>
            <h3 style={{ marginBottom: 'var(--sp-4)' }}>Evidências sobre concorrentes</h3>
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
          <div className="page-eyebrow">Rastreabilidade</div>
          <h2 id="chain-title">Como as evidências viram decisões</h2>
          <p>Exemplo do gap de maior impacto: da observação até a ação recomendada.</p>
        </div>
        <Card>
          <TraceChain gaps={bundle.gaps} />
        </Card>
      </section>
    </div>
  );
}

function EvidenceItem({ evidence, sourceName }: { evidence: Evidence; sourceName: string }) {
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
        Fonte: {sourceName} · {evidence.context}
      </div>
      <div className="dim-grid">
        {DIMENSIONS.map((d) => (
          <div key={String(d.key)} className="dim-row">
            <span className="xsmall muted">{d.label}</span>
            <RelevancePips value={evidence[d.key] as number} />
          </div>
        ))}
      </div>
    </article>
  );
}

function TraceChain({ gaps }: { gaps: Gap[] }) {
  const top = gaps[0];
  const steps: Array<{ kind: CausalKind; text: string }> = [
    { kind: 'observed', text: top.description },
    { kind: 'evidence', text: top.evidence.join(' · ') },
    { kind: 'hypothesis', text: 'Hipótese: a associação ausente entre o produto e o tema do intent pode estar reduzindo a presença nas respostas.' },
    { kind: 'action', text: 'Ação: ver “Oportunidades & ações” para a intervenção priorizada e o plano de validação.' },
  ];
  return <CausalChain steps={steps} />;
}
