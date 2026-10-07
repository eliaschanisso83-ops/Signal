import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuditSession } from '../state/session';
import { Badge, Button, Card, Field, RelevancePips } from '../design-system/components';
import { WizardHeader } from '../components/layout/WizardHeader';
import { RequireDraft } from '../components/layout/Guards';
import type { Intent, IntentType } from '../domain/types';

function IntentCard({ intent }: { intent: Intent }) {
  const { t } = useTranslation('audit');
  const { updateIntent, removeIntent } = useAuditSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(intent.name);
  const [problem, setProblem] = useState(intent.problem);

  const CATEGORY_LABEL: Record<IntentType, string> = {
    INFORMATIONAL: t('intents.categories.INFORMATIONAL'),
    EXPLORATORY: t('intents.categories.EXPLORATORY'),
    COMMERCIAL: t('intents.categories.COMMERCIAL'),
    TRANSACTIONAL: t('intents.categories.TRANSACTIONAL'),
    COMPARATIVE: t('intents.categories.COMPARATIVE'),
    PROBLEM_SPECIFIC: t('intents.categories.PROBLEM_SPECIFIC'),
  };

  const SOURCE_LABEL: Record<Intent['source'], string> = {
    AI_GENERATED: t('intents.sources.AI_GENERATED'),
    USER_ADDED: t('intents.sources.USER_ADDED'),
    USER_EDITED: t('intents.sources.USER_EDITED'),
    HISTORICAL: t('intents.sources.HISTORICAL'),
  };

  const PRIORITY_LABEL: Record<Intent['priority'], string> = {
    HIGH: t('intents.priority.HIGH'),
    MEDIUM: t('intents.priority.MEDIUM'),
    LOW: t('intents.priority.LOW'),
  };

  const CONFIDENCE_LABEL: Record<Intent['confidence'], string> = {
    HIGH: t('intents.confidence.HIGH'),
    MEDIUM: t('intents.confidence.MEDIUM'),
    LOW: t('intents.confidence.LOW'),
  };

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
              aria-label={t('aria.includeIntent', { name: intent.name })}
            />
            <span>{t('intents.include')}</span>
          </label>
        </div>
        <div className="row" style={{ gap: 'var(--sp-2)' }}>
          <Badge tone="neutral">{CATEGORY_LABEL[intent.category]}</Badge>
          <Badge tone={intent.priority === 'HIGH' ? 'red' : intent.priority === 'MEDIUM' ? 'amber' : 'neutral'}>
            {PRIORITY_LABEL[intent.priority]}
          </Badge>
          <Badge tone={intent.source === 'AI_GENERATED' ? 'accent' : 'blue'}>{SOURCE_LABEL[intent.source]}</Badge>
        </div>
      </div>

      {editing ? (
        <div className="stack stack-3" style={{ marginTop: 'var(--sp-4)' }}>
          <Field label={t('intents.fields.name')} htmlFor={`name-${intent.id}`}>
            <input id={`name-${intent.id}`} className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label={t('intents.fields.problem')} htmlFor={`problem-${intent.id}`}>
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
              {t('actions.save')}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              {t('actions.cancel')}
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
            <dt>{t('intents.terms.problem')}</dt>
            <dd>{intent.problem}</dd>
            <dt>{t('intents.terms.audience')}</dt>
            <dd>{intent.audience}</dd>
            <dt>{t('intents.terms.context')}</dt>
            <dd>{intent.context}</dd>
          </dl>
        </>
      )}

      <div className="row-between" style={{ marginTop: 'var(--sp-4)' }}>
        <div className="row" style={{ gap: 'var(--sp-3)' }}>
          <span className="row" style={{ gap: 6 }}>
            <span className="xsmall muted strong">{t('intents.relevance')}</span>
            <RelevancePips value={intent.relevance} />
            <span className="xsmall mono muted">{intent.relevance}/5</span>
          </span>
          <Badge tone={intent.confidence === 'HIGH' ? 'green' : intent.confidence === 'MEDIUM' ? 'amber' : 'red'}>
            {CONFIDENCE_LABEL[intent.confidence]}
          </Badge>
        </div>
        <div className="row" style={{ gap: 'var(--sp-2)' }}>
          {!editing && (
            <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
              {t('actions.edit')}
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => removeIntent(intent.id)} aria-label={t('aria.removeIntent', { name: intent.name })}>
            {t('actions.remove')}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function IntentsPage() {
  const { t } = useTranslation('audit');
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
          <div className="page-eyebrow">{t('intents.eyebrow')}</div>
          <h1>{t('intents.title')}</h1>
          <p>{t('intents.intro')}</p>
        </div>

        <div className="summary-strip" aria-label={t('aria.intentsSummary')}>
          <div>
            <span className="mono metric-mini">{draft.intents.length}</span>
            <span className="xsmall muted"> {t('intents.summary.total', { count: draft.intents.length })}</span>
          </div>
          <div>
            <span className="mono metric-mini">{selected.length}</span>
            <span className="xsmall muted"> {t('intents.summary.selected')}</span>
          </div>
          <div>
            <span className="mono metric-mini">{avgRel.toFixed(1)}</span>
            <span className="xsmall muted"> {t('intents.summary.avgRelevance')}</span>
          </div>
          <div>
            <span className="mono metric-mini">{selected.length * 5}</span>
            <span className="xsmall muted"> {t('intents.summary.plannedPrompts')}</span>
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
              {t('intents.add.label')}
            </label>
            <div className="row" style={{ gap: 'var(--sp-2)' }}>
              <input
                id="newIntent"
                className="input"
                placeholder={t('intents.add.placeholder')}
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
                {t('intents.add.button')}
              </Button>
            </div>
            <span className="field-hint">{t('intents.add.hint')}</span>
          </div>
        </Card>

        <div className="page-actions between">
          <Button variant="secondary" onClick={() => navigate(`/audit/${draft.audit.id}/profile`)}>
            {t('intents.back')}
          </Button>
          <div className="row">
            {selected.length === 0 && (
              <span className="small" style={{ color: 'var(--c-gap)' }} role="alert">
                {t('intents.validation')}
              </span>
            )}
            <Button disabled={selected.length === 0} onClick={() => navigate(`/audit/${draft.audit.id}/prompts`)}>
              {t('intents.next')}
            </Button>
          </div>
        </div>
      </div>
    </RequireDraft>
  );
}
