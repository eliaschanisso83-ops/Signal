import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuditSession } from '../state/session';
import { Badge, Button, Card, EmptyState, Field, Tabs } from '../design-system/components';
import { WizardHeader } from '../components/layout/WizardHeader';
import { RequireDraft } from '../components/layout/Guards';
import type { Prompt, PromptVariationType } from '../domain/types';

const VARIATIONS: Record<PromptVariationType, string> = {
  DIRECT: 'Direto',
  CONVERSATIONAL: 'Conversacional',
  COMPARATIVE: 'Comparativo',
  PROBLEM_BASED: 'Baseado em problema',
  ROLE_BASED: 'Papel do usuário',
  CONTEXTUAL: 'Contextual',
};

function PromptRow({ prompt }: { prompt: Prompt }) {
  const { updatePrompt, removePrompt } = useAuditSession();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(prompt.text);

  function save() {
    updatePrompt(prompt.id, { text: text.trim() || prompt.text });
    setEditing(false);
  }

  return (
    <li className={`prompt-row ${prompt.active ? '' : 'prompt-off'}`}>
      <div className="prompt-main">
        {editing ? (
          <div className="stack stack-3">
            <Field label="Texto do prompt" htmlFor={`p-${prompt.id}`}>
              <textarea
                id={`p-${prompt.id}`}
                className="textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
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
          <p className="prompt-text">{prompt.text}</p>
        )}
        <div className="row" style={{ gap: 'var(--sp-2)', marginTop: 8 }}>
          <Badge tone="blue">{VARIATIONS[prompt.variationType]}</Badge>
          <Badge tone="neutral">v{prompt.version}</Badge>
          <Badge tone="neutral">
            {prompt.language} · {prompt.market}
          </Badge>
          {!prompt.active && <Badge tone="amber">Inativo — não será executado</Badge>}
        </div>
      </div>
      <div className="prompt-actions">
        {!editing && (
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
            Editar
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => updatePrompt(prompt.id, { active: !prompt.active })}
          aria-label={prompt.active ? 'Desativar prompt' : 'Ativar prompt'}
        >
          {prompt.active ? 'Desativar' : 'Ativar'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => removePrompt(prompt.id)}
          aria-label={`Remover prompt ${prompt.text.slice(0, 30)}`}
        >
          Remover
        </Button>
      </div>
    </li>
  );
}

export function PromptsPage() {
  const { draft, startAudit, addPrompt } = useAuditSession();
  const navigate = useNavigate();
  // Rascunho de novo prompt, isolado por intent (evita vazamento entre abas).
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  if (!draft) return <Navigate to="/audit/new" replace />;

  const selectedIntents = draft.intents.filter((i) => i.selected);
  const selectedIds = new Set(selectedIntents.map((i) => i.id));
  const activePrompts = draft.prompts.filter((p) => selectedIds.has(p.intentId) && p.active);

  function setText(intentId: string, value: string) {
    setDrafts((d) => ({ ...d, [intentId]: value }));
  }

  function handleAddPrompt(intentId: string) {
    const v = (drafts[intentId] ?? '').trim();
    if (!v) return;
    addPrompt(intentId, v);
    setDrafts((d) => ({ ...d, [intentId]: '' }));
  }

  return (
    <RequireDraft>
      <div className="shell">
        <WizardHeader currentIndex={3} />

        <div className="page-head">
          <div className="page-eyebrow">Nova auditoria · Etapa 4 de 5</div>
          <h1>Revisar prompts</h1>
          <p>
            Prompts são as perguntas efetivamente executadas — <strong>Intent ≠ Prompt</strong> (Doc 6, §14). Cada intent
            selecionado possui 5 variações versionadas. Edite, desative ou remova o que não deva ser executado.
          </p>
        </div>

        <div className="summary-strip" aria-label="Resumo dos prompts">
          <div>
            <span className="mono metric-mini">{draft.prompts.length}</span>
            <span className="xsmall muted"> prompts no total</span>
          </div>
          <div>
            <span className="mono metric-mini">{activePrompts.length}</span>
            <span className="xsmall muted"> ativos para execução</span>
          </div>
          <div>
            <span className="mono metric-mini">{selectedIntents.length}</span>
            <span className="xsmall muted"> intents selecionados</span>
          </div>
          <div>
            <span className="mono metric-mini">{draft.audit.promptSetVersion}</span>
            <span className="xsmall muted"> versão do conjunto</span>
          </div>
        </div>

        {selectedIntents.length === 0 ? (
          <EmptyState
            title="Nenhum intent selecionado"
            desc="Volte à etapa anterior e selecione ao menos um intent para gerar prompts."
            action={
              <Button variant="secondary" onClick={() => navigate(`/audit/${draft.audit.id}/intents`)}>
                Ir para intents
              </Button>
            }
          />
        ) : (
          <Card>
            <Tabs
              ariaLabel="Intents selecionados"
              items={selectedIntents.map((intent) => ({
                id: intent.id,
                label: intent.name,
                content: (
                  <div className="stack stack-4">
                    <div className="row-between">
                      <div className="row">
                        <span className="small muted">
                          {draft.prompts.filter((p) => p.intentId === intent.id).length} prompts para este intent
                        </span>
                      </div>
                    </div>
                    <ul className="prompt-list">
                      {draft.prompts
                        .filter((p) => p.intentId === intent.id)
                        .map((p) => (
                          <PromptRow key={p.id} prompt={p} />
                        ))}
                    </ul>
                    <div className="field">
                      <label className="field-label" htmlFor={`add-${intent.id}`}>
                        Adicionar prompt neste intent
                      </label>
                      <div className="row" style={{ gap: 'var(--sp-2)' }}>
                        <input
                          id={`add-${intent.id}`}
                          className="input"
                          placeholder="Nova pergunta a executar…"
                          value={drafts[intent.id] ?? ''}
                          onChange={(e) => setText(intent.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddPrompt(intent.id);
                            }
                          }}
                        />
                        <Button variant="secondary" onClick={() => handleAddPrompt(intent.id)}>
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        )}

        <div className="page-actions between">
          <Button variant="secondary" onClick={() => navigate(`/audit/${draft.audit.id}/intents`)}>
            ← Voltar aos intents
          </Button>
          <div className="row">
            {activePrompts.length === 0 && (
              <span className="small" style={{ color: 'var(--c-gap)' }} role="alert">
                Nenhum prompt ativo para executar.
              </span>
            )}
            <Button
              disabled={activePrompts.length === 0}
              size="lg"
              onClick={() => {
                startAudit();
                navigate(`/audit/${draft.audit.id}/progress`);
              }}
            >
              Iniciar auditoria
            </Button>
          </div>
        </div>
      </div>
    </RequireDraft>
  );
}
