import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuditSession } from '../state/session';
import { Badge, Button, Card, Chip, Field, Tooltip } from '../design-system/components';
import { WizardHeader } from '../components/layout/WizardHeader';
import { RequireDraft } from '../components/layout/Guards';
import type { ReactNode } from 'react';

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="profile-section">
      <div className="row" style={{ gap: 6 }}>
        <h3>{title}</h3>
        {hint && <Tooltip label={`Sobre ${title}`} text={hint} />}
      </div>
      {children}
    </div>
  );
}

export function ProductProfilePage() {
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
          <div className="page-eyebrow">Nova auditoria · Etapa 2 de 5</div>
          <h1>Perfil interpretado do produto</h1>
          <p>
            Esta é a interpretação normalizada que orienta a geração de intents e prompts.{' '}
            <strong>Não é uma verdade absoluta</strong> — revise e corrija antes de continuar.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <Section title="Dados fornecidos">
              <dl className="kv">
                <dt>Produto</dt>
                <dd>{product.name}</dd>
                <dt>URL</dt>
                <dd className="mono" style={{ wordBreak: 'break-all' }}>
                  {product.url}
                </dd>
                <dt>Plataforma</dt>
                <dd>{product.platform}</dd>
                <dt>Categoria</dt>
                <dd>{product.category}</dd>
                <dt>Público</dt>
                <dd>{product.targetAudience}</dd>
                <dt>Mercado</dt>
                <dd>
                  {product.country} · {product.language}
                </dd>
              </dl>
            </Section>

            <hr className="divider" />

            <Section
              title="Proposta de valor (interpretada)"
              hint="Texto derivado automaticamente da URL e da categoria — edite se estiver impreciso."
            >
              {editing ? (
                <div className="stack stack-3">
                  <Field label="Proposta de valor" htmlFor="vp">
                    <textarea id="vp" className="textarea" value={vp} onChange={(e) => setVp(e.target.value)} rows={3} />
                  </Field>
                  <div className="row">
                    <Button onClick={save} size="sm">
                      Salvar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="stack stack-3">
                  <p style={{ margin: 0 }}>{profile.valueProposition}</p>
                  <div>
                    <Button variant="secondary" size="sm" onClick={startEdit}>
                      Editar proposta de valor
                    </Button>
                  </div>
                </div>
              )}
            </Section>
          </Card>

          <Card>
            <Section title="Funcionalidades" hint="Lista interpretada — usada para gerar linguagem nos prompts.">
              <ul className="chip-list">
                {profile.features.map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </ul>
            </Section>

            <Section title="Problemas resolvidos">
              <ul className="chip-list">
                {profile.problemsSolved.map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </ul>
            </Section>

            <Section title="Casos de uso">
              <ul className="chip-list">
                {profile.useCases.map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </ul>
            </Section>

            <Section title="Audiências">
              <ul className="chip-list">
                {profile.audiences.map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </ul>
            </Section>

            <Section title="Concorrentes observados">
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
            <Section title="Palavras-chave" hint="Entidades semânticas que o produto deve associar à sua marca.">
              <ul className="chip-list">
                {profile.keywords.map((k) => (
                  <Chip key={k} onRemove={() => removeKeyword(k)} removeLabel={`Remover ${k}`}>
                    {k}
                  </Chip>
                ))}
              </ul>
              <div className="row" style={{ marginTop: 'var(--sp-3)', gap: 'var(--sp-2)' }}>
                <input
                  className="input"
                  placeholder="Nova palavra-chave…"
                  aria-label="Nova palavra-chave"
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
                  Adicionar
                </Button>
              </div>
            </Section>
          </Card>

          <Card>
            <Section title="Entidades e categorias">
              <div className="stack stack-3">
                <div>
                  <div className="xsmall muted strong" style={{ marginBottom: 6 }}>
                    ENTIDADES SEMÂNTICAS
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
                    CATEGORIAS
                  </div>
                  <ul className="chip-list">
                    {profile.categories.map((c) => (
                      <Chip key={c}>{c}</Chip>
                    ))}
                  </ul>
                </div>
                <div className="row">
                  <Badge tone="blue">Mercado {profile.markets.join(', ')}</Badge>
                  <Badge tone="blue">Idioma {profile.languages.join(', ')}</Badge>
                  <Badge tone="neutral">Interpretação normalizada · Doc 6 §11</Badge>
                </div>
              </div>
            </Section>
          </Card>
        </div>

        <div className="page-actions between">
          <Button variant="secondary" onClick={() => navigate('/audit/new')}>
            ← Voltar
          </Button>
          <Button onClick={() => navigate(`/audit/${draft.audit.id}/intents`)}>Revisar intents →</Button>
        </div>
      </div>
    </RequireDraft>
  );
}
