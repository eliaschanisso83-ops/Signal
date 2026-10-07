import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useAuditSession } from '../state/session';
import { Badge, Button, Card, EmptyState, Field, Tabs } from '../design-system/components';
import { WizardHeader } from '../components/layout/WizardHeader';
import { RequireDraft } from '../components/layout/Guards';
import type { Prompt, PromptVariationType } from '../domain/types';

function PromptRow({ prompt }: { prompt: Prompt }) {
  const { t } = useTranslation('audit');
  const { updatePrompt, removePrompt } = useAuditSession();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(prompt.text);

  const VARIATIONS: Record<PromptVariationType, string> = {
    DIRECT: t('prompts.variations.DIRECT'),
    CONVERSATIONAL: t('prompts.variations.CONVERSATIONAL'),
    COMPARATIVE: t('prompts.variations.COMPARATIVE'),
    PROBLEM_BASED: t('prompts.variations.PROBLEM_BASED'),
    ROLE_BASED: t('prompts.variations.ROLE_BASED'),
    CONTEXTUAL: t('prompts.variations.CONTEXTUAL'),
  };

  function save() {
    updatePrompt(prompt.id, { text: text.trim() || prompt.text });
    setEditing(false);
  }

  return (
    <li className={`prompt-row ${prompt.active ? '' : 'prompt-off'}`}>
      <div className="prompt-main">
        {editing ? (
          <div className="stack stack-3">
            <Field label={t('prompts.fields.text')} htmlFor={`p-${prompt.id}`}>
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
                {t('actions.save')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                {t('actions.cancel')}
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
          {!prompt.active && <Badge tone="amber">{t('prompts.inactive')}</Badge>}
        </div>
      </div>
      <div className="prompt-actions">
        {!editing && (
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
            {t('actions.edit')}
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => updatePrompt(prompt.id, { active: !prompt.active })}
          aria-label={prompt.active ? t('aria.disablePrompt') : t('aria.enablePrompt')}
        >
          {prompt.active ? t('actions.deactivate') : t('actions.activate')}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => removePrompt(prompt.id)}
          aria-label={t('aria.removePrompt', { preview: prompt.text.slice(0, 30) })}
        >
          {t('actions.remove')}
        </Button>
      </div>
    </li>
  );
}

export function PromptsPage() {
  const { t } = useTranslation('audit');
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
          <div className="page-eyebrow">{t('prompts.eyebrow')}</div>
          <h1>{t('prompts.title')}</h1>
          <p>
            <Trans<'prompts.intro', 'audit'> i18nKey="prompts.intro" ns="audit" components={{ strong: <strong /> }} />
          </p>
        </div>

        <div className="summary-strip" aria-label={t('aria.promptsSummary')}>
          <div>
            <span className="mono metric-mini">{draft.prompts.length}</span>
            <span className="xsmall muted"> {t('prompts.summary.total', { count: draft.prompts.length })}</span>
          </div>
          <div>
            <span className="mono metric-mini">{activePrompts.length}</span>
            <span className="xsmall muted"> {t('prompts.summary.active')}</span>
          </div>
          <div>
            <span className="mono metric-mini">{selectedIntents.length}</span>
            <span className="xsmall muted"> {t('prompts.summary.selectedIntents', { count: selectedIntents.length })}</span>
          </div>
          <div>
            <span className="mono metric-mini">{draft.audit.promptSetVersion}</span>
            <span className="xsmall muted"> {t('prompts.summary.setVersion')}</span>
          </div>
        </div>

        {selectedIntents.length === 0 ? (
          <EmptyState
            title={t('prompts.empty.title')}
            desc={t('prompts.empty.desc')}
            action={
              <Button variant="secondary" onClick={() => navigate(`/audit/${draft.audit.id}/intents`)}>
                {t('prompts.empty.action')}
              </Button>
            }
          />
        ) : (
          <Card>
            <Tabs
              ariaLabel={t('aria.selectedIntentsTabs')}
              items={selectedIntents.map((intent) => ({
                id: intent.id,
                label: intent.name,
                content: (
                  <div className="stack stack-4">
                    <div className="row-between">
                      <div className="row">
                        <span className="small muted">
                          {t('prompts.perIntent', {
                            count: draft.prompts.filter((p) => p.intentId === intent.id).length,
                          })}
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
                        {t('prompts.add.label')}
                      </label>
                      <div className="row" style={{ gap: 'var(--sp-2)' }}>
                        <input
                          id={`add-${intent.id}`}
                          className="input"
                          placeholder={t('prompts.add.placeholder')}
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
                          {t('actions.add')}
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
            {t('prompts.back')}
          </Button>
          <div className="row">
            {activePrompts.length === 0 && (
              <span className="small" style={{ color: 'var(--c-gap)' }} role="alert">
                {t('prompts.validation')}
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
              {t('prompts.start')}
            </Button>
          </div>
        </div>
      </div>
    </RequireDraft>
  );
}
