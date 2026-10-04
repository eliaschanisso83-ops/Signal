import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuditSession } from '../state/session';
import { Badge, Button, Card, Field, RelevancePips } from '../design-system/components';
import { WizardHeader } from '../components/layout/WizardHeader';
import { RequireDraft } from '../components/layout/Guards';
import type { Intent, IntentType } from '../domain/types';

const CATEGORY_LABEL: Record<IntentType, string> = {
  INFORMATIONAL: 'Informacional',
  EXPLORATORY: 'Exploratório',
  COMMERCIAL: 'Comercial',
  TRANSACTIONAL: 'Transacional',
  COMPARATIVE: 'Comparativo',
  PROBLEM_SPECIFIC: 'Problema específico',
};

const SOURCE_LABEL: Record<Intent['source'], string> = {
  AI_GENERATED: 'Gerado por IA',
  USER_ADDED: 'Adicionado por você',
  USER_EDITED: 'Editado por você',
  HISTORICAL: 'De auditoria anterior',
};

function IntentCard({ intent }: { intent: Intent }) {
  const { updateIntent, removeIntent } = useAuditSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(intent.name);
  const [problem, setProblem] = useState(intent.problem);

  function save() {
    updateIntent(intent.id, { name: name.trim() || intent.name, problem: problem.trim() });
    setEditing(false);
  }

  return (
    <Card className={`intent-card ${intent.selected ? '' : 'intent-off'}`}>
      <div className="row-between">
        <div className="row" style={{ gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
          <label className="check">
            <input
              type="checkbox"
              checked={intent.selected}
              onChange={(e) => updateIntent(intent.id, { selected: e.target.checked })}
              aria-label={`Incluir intent "${intent.name}" na auditoria`}
            />
            <span>Incluir</span>
          </label>
        </div>
        <div className="row" style={{ gap: 'var(--sp-2)' }}>
          <Badge tone="neutral">{CATEGORY_LABEL[intent.category]}</Badge>
          <Badge tone={intent.priority === 'HIGH' ? 'red' : intent.priority === 'MEDIUM' ? 'amber' : 'neutral'}>
            Prioridade {intent.priority === 'HIGH' ? 'alta' : intent.priority === 'MEDIUM' ? 'média' : 'baixa'}
          </Badge>
          <Badge tone={intent.source === 'AI_GENERATED' ? 'accent' : 'blue'}>{SOURCE_LABEL[intent.source]}</Badge>
        </div>
      </div>

      {editing ? (
        <div className="stack stack-3" style={{ marginTop: 'var(--sp-4)' }}>
          <Field label="Nome do intent" htmlFor={`name-${intent.id}`}>
            <input id={`name-${intent.id}`} className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Problema do usuário" htmlFor={`problem-${intent.id}`}>
            <textarea
              id={`problem-${intent.id}`}
              className="textarea"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={2}
            />
          </Field>
          <div className="row">
            <Button size="sm" onClick={save}>
              Salvar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h3 style={{ marginTop: 'var(--sp-3)' }}>{intent.name}</h3>
          <p className="small" style={{ margin: '6px 0' }}>
            {intent.description}
          </p>
          <dl className="kv" style={{ marginTop: 'var(--sp-3)' }}>
            <dt>Problema</dt>
            <dd>{intent.problem}</dd>
            <dt>Audiência</dt>
            <dd>{intent.audience}</dd>
            <dt>Contexto</dt>
            <dd>{intent.context}</dd>
          </dl>
        </>
      )}

      <div className="row-between" style={{ marginTop: 'var(--sp-4)' }}>
        <div className="row" style={{ gap: 'var(--sp-3)' }}>
          <span className="row" style={{ gap: 6 }}>
            <span className="xsmall muted strong">RELEVÂNCIA</span>
            <RelevancePips value={intent.relevance} />
            <span className="xsmall mono muted">{intent.relevance}/5</span>
          </span>
          <Badge tone={intent.confidence === 'HIGH' ? 'green' : intent.confidence === 'MEDIUM' ? 'amber' : 'red'}>
            Confiança {intent.confidence === 'HIGH' ? 'alta' : intent.confidence === 'MEDIUM' ? 'média' : 'baixa'}
          </Badge>
        </div>
        <div className="row" style={{ gap: 'var(--sp-2)' }}>
          {!editing && (
            <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
              Editar
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => removeIntent(intent.id)} aria-label={`Remover intent ${intent.name}`}>
            Remover
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function IntentsPage() {
  const { draft, addIntent } = useAuditSession();
  const navigate = useNavigate();
  const [newIntent, setNewIntent] = useState('');

  if (!draft) return <Navigate to="/audit/new" replace />;

  const selected = draft.intents.filter((i) => i.selected);
  const avgRel =
    selected.length > 0 ? selected.reduce((acc, i) => acc + i.relevance, 0) / selected.length : 0;

  function add() {
    const v = newIntent.trim();
    if (!v) return;
    addIntent(v);
    setNewIntent('');
  }

  return (
    <RequireDraft>
      <div className="shell">
        <WizardHeader currentIndex={2} />

        <div className="page-head">
          <div className="page-eyebrow">Nova auditoria · Etapa 3 de 5</div>
          <h1>Revisar intents</h1>
          <p>
            Intents são os problemas reais que as pessoas descrevem ao buscar uma solução — a unidade fundamental da
            auditoria (Doc 3, §7). Selecione quais serão analisados e edite o que estiver impreciso.
          </p>
        </div>

        <div className="summary-strip" aria-label="Resumo dos intents">
          <div>
            <span className="mono metric-mini">{draft.intents.length}</span>
            <span className="xsmall muted"> intents no total</span>
          </div>
          <div>
            <span className="mono metric-mini">{selected.length}</span>
            <span className="xsmall muted"> selecionados</span>
          </div>
          <div>
            <span className="mono metric-mini">{avgRel.toFixed(1)}</span>
            <span className="xsmall muted"> relevância média (de 5)</span>
          </div>
          <div>
            <span className="mono metric-mini">{selected.length * 5}</span>
            <span className="xsmall muted"> prompts previstos (5/intent)</span>
          </div>
        </div>

        <div className="stack stack-4">
          {draft.intents.map((i) => (
            <IntentCard key={i.id} intent={i} />
          ))}
        </div>

        <Card style={{ marginTop: 'var(--sp-5)' }}>
          <div className="field">
            <label className="field-label" htmlFor="newIntent">
              Adicionar intent manualmente
            </label>
            <div className="row" style={{ gap: 'var(--sp-2)' }}>
              <input
                id="newIntent"
                className="input"
                placeholder="Ex.: Comparar planos de software financeiro"
                value={newIntent}
                onChange={(e) => setNewIntent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    add();
                  }
                }}
              />
              <Button variant="secondary" onClick={add}>
                Adicionar intent
              </Button>
            </div>
            <span className="field-hint">Um prompt direto é criado automaticamente junto com o intent.</span>
          </div>
        </Card>

        <div className="page-actions between">
          <Button variant="secondary" onClick={() => navigate(`/audit/${draft.audit.id}/profile`)}>
            ← Voltar ao perfil
          </Button>
          <div className="row">
            {selected.length === 0 && (
              <span className="small" style={{ color: 'var(--c-gap)' }} role="alert">
                Selecione ao menos um intent para continuar.
              </span>
            )}
            <Button disabled={selected.length === 0} onClick={() => navigate(`/audit/${draft.audit.id}/prompts`)}>
              Revisar prompts →
            </Button>
          </div>
        </div>
      </div>
    </RequireDraft>
  );
}
