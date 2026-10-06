import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PIPELINE_STEPS, useAuditSession } from '../state/session';
import { Badge, Button, Card, ErrorState, LinkButton } from '../design-system/components';
import { WizardHeader } from '../components/layout/WizardHeader';
import { PipelineSteps, ProgressBar, SignalNetwork, type NetState } from '../design-system/visuals';
import { RequireDraft } from '../components/layout/Guards';

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Rascunho',
  QUEUED: 'Na fila',
  RUNNING: 'Executando',
  ANALYZING: 'Analisando',
  COMPLETED: 'Concluída',
  FAILED: 'Falhou',
  CANCELLED: 'Cancelada',
};

export function AuditProgressPage() {
  const { draft, status, stepIndex, startAudit, retryAudit } = useAuditSession();
  const navigate = useNavigate();

  const running = status === 'QUEUED' || status === 'RUNNING' || status === 'ANALYZING';
  const done = status === 'COMPLETED';
  const failed = status === 'FAILED' || status === 'CANCELLED';

  const pct =
    status === 'QUEUED'
      ? 4
      : Math.min(98, Math.round(((stepIndex + 1) / PIPELINE_STEPS.length) * 100));

  const netState: NetState = failed ? 'error' : done ? 'success' : status === 'DRAFT' ? 'idle' : 'processing';
  const currentStep = PIPELINE_STEPS[Math.min(stepIndex, PIPELINE_STEPS.length - 1)];
  const netCaption = failed
    ? 'Execução interrompida — reinicie para reprocessar as mesmas etapas'
    : done
      ? 'Todas as etapas concluídas · relatório pronto'
      : status === 'DRAFT'
        ? 'Rede ociosa · nenhuma coleta em andamento'
        : 'Coleta e análise ativas · a rede avança etapa a etapa';

  useEffect(() => {
    if (!done || !draft) return;
    const t = window.setTimeout(() => navigate(`/audit/${draft.audit.id}/report`, { replace: true }), 1800);
    return () => window.clearTimeout(t);
  }, [done, draft, navigate]);

  if (!draft) return <Navigate to="/audit/new" replace />;

  return (
    <RequireDraft>
      <div className="shell shell-wide">
        <WizardHeader currentIndex={4} />

        <div className="page-head">
          <div className="page-eyebrow">Nova auditoria · Etapa 5 de 5</div>
          <h1>{done ? 'Auditoria concluída' : 'Executando a auditoria'}</h1>
          <p>
            {done
              ? 'Todas as etapas foram processadas. O relatório com scores, evidências e oportunidades está pronto.'
              : 'A coleta e a análise avançam pelas etapas abaixo. Os dados desta demonstração são simulados localmente.'}
          </p>
        </div>

        <SignalNetwork
          state={netState}
          step={netState === 'processing' || netState === 'success' ? currentStep : undefined}
          caption={netCaption}
        />

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <div className="row-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <h2 style={{ margin: 0 }}>Progresso</h2>
              <Badge tone={done ? 'green' : failed ? 'red' : 'accent'}>
                {STATUS_LABEL[status] ?? status}
              </Badge>
            </div>

            <ProgressBar value={done ? 100 : pct} label="Etapas concluídas" />

            <div style={{ marginTop: 'var(--sp-5)' }}>
              <PipelineSteps steps={PIPELINE_STEPS} currentIndex={stepIndex} done={done} />
            </div>

            {status === 'DRAFT' && (
              <div className="row" style={{ marginTop: 'var(--sp-4)' }}>
                <Button onClick={startAudit}>Iniciar execução</Button>
                <Button variant="ghost" onClick={() => navigate(`/audit/${draft.audit.id}/prompts`)}>
                  ← Revisar prompts
                </Button>
              </div>
            )}

            {running && (
              <p className="small muted" style={{ marginTop: 'var(--sp-4)' }} role="status" aria-live="polite">
                Processando… isso leva poucos segundos nesta demonstração.
              </p>
            )}

            {done && (
              <div className="row" style={{ marginTop: 'var(--sp-4)' }}>
                <LinkButton to={`/audit/${draft.audit.id}/report`}>Ver relatório agora →</LinkButton>
                <span className="small muted">Abrindo automaticamente…</span>
              </div>
            )}

            {failed && (
              <div style={{ marginTop: 'var(--sp-4)' }}>
                <ErrorState
                  title="A execução não foi concluída"
                  desc="A auditoria foi interrompida. Você pode reiniciar a execução com os mesmos intents e prompts."
                  onRetry={retryAudit}
                />
              </div>
            )}
          </Card>

          <Card>
            <h2 style={{ marginBottom: 'var(--sp-4)' }}>Contexto da auditoria</h2>
            <dl className="kv">
              <dt>ID</dt>
              <dd className="mono">{draft.audit.id}</dd>
              <dt>Produto</dt>
              <dd>{draft.product.name}</dd>
              <dt>Mercado</dt>
              <dd>
                {draft.audit.market} · {draft.audit.language}
              </dd>
              <dt>Intents</dt>
              <dd>{draft.intents.filter((i) => i.selected).length} selecionados</dd>
              <dt>Prompts ativos</dt>
              <dd>{draft.prompts.filter((p) => p.active).length}</dd>
              <dt>Metodologia</dt>
              <dd className="mono">v{draft.audit.methodologyVersion}</dd>
              <dt>Conjunto de prompts</dt>
              <dd className="mono">v{draft.audit.promptSetVersion}</dd>
            </dl>

            <hr className="divider" />
            <div className="xsmall muted">
              <strong>Etapa atual:</strong> {currentStep}
            </div>
          </Card>
        </div>
      </div>
    </RequireDraft>
  );
}
