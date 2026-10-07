import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useAuditSession } from '../state/session';
import { Badge, Button, Card, Chip, Field, Tooltip } from '../design-system/components';
import { WizardHeader } from '../components/layout/WizardHeader';
import { RequireDraft } from '../components/layout/Guards';
import type { ReactNode } from 'react';

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  const { t } = useTranslation('audit');
  return (
    <div className="profile-section">
      <div className="row" style={{ gap: 6 }}>
        <h3>{title}</h3>
        {hint && <Tooltip label={t('profile.about', { title })} text={hint} />}
      </div>
      {children}
    </div>
  );
}

export function ProductProfilePage() {
  const { t } = useTranslation('audit');
  const { draft, updateProfile } = useAuditSession();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [vp, setVp] = useState('');
  const [kwDraft, setKwDraft] = useState('');

  if (!draft) return <Navigate to="/audit/new" replace />;
  const { product, profile } = draft;

  function startEdit() {
    setVp(profile.valueProposition);
    setEditing(true);
  }

  function save() {
    updateProfile({ valueProposition: vp.trim() || profile.valueProposition });
    setEditing(false);
  }

  function addKeyword() {
    const v = kwDraft.trim();
    if (!v || profile.keywords.includes(v)) return;
    updateProfile({ keywords: [...profile.keywords, v] });
    setKwDraft('');
  }

  function removeKeyword(k: string) {
    updateProfile({ keywords: profile.keywords.filter((x) => x !== k) });
  }

  return (
    <RequireDraft>
      <div className="shell">
        <WizardHeader currentIndex={1} />

        <div className="page-head">
          <div className="page-eyebrow">{t('profile.eyebrow')}</div>
          <h1>{t('profile.title')}</h1>
          <p>
            <Trans<'profile.intro', 'audit'> i18nKey="profile.intro" ns="audit" components={{ strong: <strong /> }} />
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <Section title={t('profile.sections.provided')}>
              <dl className="kv">
                <dt>{t('profile.terms.product')}</dt>
                <dd>{product.name}</dd>
                <dt>{t('profile.terms.url')}</dt>
                <dd className="mono" style={{ wordBreak: 'break-all' }}>
                  {product.url}
                </dd>
                <dt>{t('profile.terms.platform')}</dt>
                <dd>{product.platform}</dd>
                <dt>{t('profile.terms.category')}</dt>
                <dd>{product.category}</dd>
                <dt>{t('profile.terms.audience')}</dt>
                <dd>{product.targetAudience}</dd>
                <dt>{t('profile.terms.market')}</dt>
                <dd>
                  {product.country} · {product.language}
                </dd>
              </dl>
            </Section>

            <hr className="divider" />

            <Section
              title={t('profile.sections.valueProposition')}
              hint={t('profile.sections.valuePropositionHint')}
            >
              {editing ? (
                <div className="stack stack-3">
                  <Field label={t('profile.fields.valueProposition')} htmlFor="vp">
                    <textarea id="vp" className="textarea" value={vp} onChange={(e) => setVp(e.target.value)} rows={3} />
                  </Field>
                  <div className="row">
                    <Button onClick={save} size="sm">
                      {t('actions.save')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                      {t('actions.cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="stack stack-3">
                  <p style={{ margin: 0 }}>{profile.valueProposition}</p>
                  <div>
                    <Button variant="secondary" size="sm" onClick={startEdit}>
                      {t('profile.editValueProposition')}
                    </Button>
                  </div>
                </div>
              )}
            </Section>
          </Card>

          <Card>
            <Section title={t('profile.sections.features')} hint={t('profile.sections.featuresHint')}>
              <ul className="chip-list">
                {profile.features.map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </ul>
            </Section>

            <Section title={t('profile.sections.problems')}>
              <ul className="chip-list">
                {profile.problemsSolved.map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </ul>
            </Section>

            <Section title={t('profile.sections.useCases')}>
              <ul className="chip-list">
                {profile.useCases.map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </ul>
            </Section>

            <Section title={t('profile.sections.audiences')}>
              <ul className="chip-list">
                {profile.audiences.map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </ul>
            </Section>

            <Section title={t('profile.sections.competitors')}>
              <ul className="chip-list">
                {profile.competitors.map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </ul>
            </Section>
          </Card>
        </div>

        <div className="grid-2" style={{ alignItems: 'start', marginTop: 'var(--sp-4)' }}>
          <Card>
            <Section title={t('profile.sections.keywords')} hint={t('profile.sections.keywordsHint')}>
              <ul className="chip-list">
                {profile.keywords.map((k) => (
                  <Chip key={k} onRemove={() => removeKeyword(k)} removeLabel={t('aria.removeItem', { name: k })}>
                    {k}
                  </Chip>
                ))}
              </ul>
              <div className="row" style={{ marginTop: 'var(--sp-3)', gap: 'var(--sp-2)' }}>
                <input
                  className="input"
                  placeholder={t('profile.keywordPlaceholder')}
                  aria-label={t('aria.newKeyword')}
                  value={kwDraft}
                  onChange={(e) => setKwDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                />
                <Button variant="secondary" size="sm" onClick={addKeyword}>
                  {t('actions.add')}
                </Button>
              </div>
            </Section>
          </Card>

          <Card>
            <Section title={t('profile.sections.entities')}>
              <div className="stack stack-3">
                <div>
                  <div className="xsmall muted strong" style={{ marginBottom: 6 }}>
                    {t('profile.labels.semanticEntities')}
                  </div>
                  <ul className="chip-list">
                    {profile.semanticEntities.map((e) => (
                      <li key={e} className="chip mono">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="xsmall muted strong" style={{ marginBottom: 6 }}>
                    {t('profile.labels.categories')}
                  </div>
                  <ul className="chip-list">
                    {profile.categories.map((c) => (
                      <Chip key={c}>{c}</Chip>
                    ))}
                  </ul>
                </div>
                <div className="row">
                  <Badge tone="blue">{t('profile.badges.market', { value: profile.markets.join(', ') })}</Badge>
                  <Badge tone="blue">{t('profile.badges.language', { value: profile.languages.join(', ') })}</Badge>
                  <Badge tone="neutral">{t('profile.badges.normalized')}</Badge>
                </div>
              </div>
            </Section>
          </Card>
        </div>

        <div className="page-actions between">
          <Button variant="secondary" onClick={() => navigate('/audit/new')}>
            {t('profile.back')}
          </Button>
          <Button onClick={() => navigate(`/audit/${draft.audit.id}/intents`)}>{t('profile.nextIntents')}</Button>
        </div>
      </div>
    </RequireDraft>
  );
}
