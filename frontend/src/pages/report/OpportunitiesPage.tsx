import { Badge, Card, ConfidenceBadge, LinkButton } from '../../design-system/components';
import { CausalChain, EffortBadge, ImpactBadge, PriorityTag, DataTable } from '../../design-system/visuals';
import { useAuditSession } from '../../state/session';
import { RequireReport } from '../../components/layout/Guards';
import { Navigate, useParams } from 'react-router-dom';
import type { Action, Opportunity } from '../../domain/types';

const ACTION_CATEGORY_LABEL: Record<Action['category'], string> = {
  POSITIONING: 'Posicionamento',
  STORE: 'Store listing',
  WEBSITE: 'Site / conteúdo',
  EVIDENCE: 'Evidência externa',
  COMMUNITY: 'Comunidade',
  PRODUCT: 'Produto',
  DISTRIBUTION: 'Distribuição',
};

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
  if (!bundle || !auditId) return <Navigate to="/audit/new" replace />;

  const gapById = new Map(bundle.gaps.map((g) => [g.id, g]));
  const oppById = new Map(bundle.opportunities.map((o) => [o.id, o]));

  return (
    <div className="stack stack-8 reveal-group">
      {/* ---- Top opportunities ---- */}
      <section aria-labelledby="opps-title">
        <div className="section-head">
          <div className="page-eyebrow">Top opportunities</div>
          <h2 id="opps-title">Oportunidades priorizadas</h2>
          <p>
            Cada oportunidade aponta o gap que a originou e é classificada por impacto, relevância, confiança, esforço e
            prioridade final.
          </p>
        </div>

        <div className="stack stack-4">
          {bundle.opportunities.map((opp) => {
            const gap = gapById.get(opp.gapId);
            return (
              <Card key={opp.id} className="opp-card">
                <div className="opp-rank" aria-label={`Posição ${opp.rank}`}>
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
                    <Badge tone="neutral">Relevância {labelOf(opp.relevance)}</Badge>
                    <ConfidenceBadge value={opp.confidence} />
                    <EffortBadge value={opp.effort} />
                  </div>
                  {gap && (
                    <div className="opp-gap">
                      <span className="xsmall strong">GAP DE ORIGEM</span>
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
          <div className="page-eyebrow">Recommended actions</div>
          <h2 id="actions-title">Ações recomendadas com rastreabilidade</h2>
          <p>
            Cada ação segue a cadeia <strong>problema observado → evidência → hipótese → ação</strong>, com validação
            definida. Isso é o oposto de uma recomendação sem lastro.
          </p>
        </div>

        <div className="stack stack-4">
          {bundle.actions.map((action) => {
            const opp = oppById.get(action.opportunityId);
            return (
              <Card key={action.id}>
                <div className="row-between">
                  <div className="row">
                    <Badge tone="accent">{ACTION_CATEGORY_LABEL[action.category]}</Badge>
                    <h3 style={{ margin: 0 }}>{opp ? `#${opp.rank} ${opp.title}` : 'Ação'}</h3>
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
                  <span className="xsmall strong">COMO VALIDAR</span>
                  <p className="small" style={{ margin: '4px 0 0' }}>
                    {action.validation}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ---- Rastreabilidade completa ---- */}
      <section aria-labelledby="trace-title">
        <div className="section-head">
          <div className="page-eyebrow">Traceability</div>
          <h2 id="trace-title">Action → Opportunity → Gap</h2>
          <p>Visão tabular do encadeamento completo, para auditoria interna do resultado.</p>
        </div>
        <Card>
          <DataTable
            caption="Rastreabilidade das ações"
            rows={bundle.actions}
            columns={[
              {
                key: 'action',
                label: 'Ação',
                render: (r: Action) => (
                  <div>
                    <div className="strong small">{r.action}</div>
                    <span className="xsmall muted">{ACTION_CATEGORY_LABEL[r.category]}</span>
                  </div>
                ),
              },
              {
                key: 'opp',
                label: 'Oportunidade',
                render: (r: Action) => {
                  const o = oppById.get(r.opportunityId);
                  return o ? `#${o.rank} ${o.title}` : '—';
                },
              },
              {
                key: 'gap',
                label: 'Gap',
                render: (r: Action) => {
                  const o = oppById.get(r.opportunityId);
                  const g = o ? gapById.get(o.gapId) : undefined;
                  return g ? g.title : '—';
                },
              },
              {
                key: 'priority',
                label: 'Prioridade',
                render: (r: Action) => <PriorityTag value={r.priority} />,
              },
              {
                key: 'confidence',
                label: 'Confiança',
                render: (r: Action) => <ConfidenceBadge value={r.confidence} />,
              },
            ]}
          />
        </Card>
      </section>

      {/* ---- Próximo passo ---- */}
      <Card className="cta-card">
        <div className="row-between">
          <div>
            <div className="page-eyebrow">Próximo ciclo</div>
            <h2>Execute a validação e reaudite</h2>
            <p className="small muted" style={{ marginBottom: 0 }}>
              Após 2–4 semanas de alterações, execute uma nova auditoria para comparar presença, share e caracterização.
            </p>
          </div>
          <LinkButton to="/audit/new">Iniciar nova auditoria</LinkButton>
        </div>
      </Card>
    </div>
  );
}

function labelOf(v: Opportunity['impact']): string {
  return v === 'HIGH' ? 'alta' : v === 'MEDIUM' ? 'média' : 'baixa';
}
