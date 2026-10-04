import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuditSession } from '../state/session';
import { Button, Card, Chip, Field } from '../design-system/components';
import { WizardHeader } from '../components/layout/WizardHeader';
import type { Platform } from '../domain/types';

const PLATFORMS: Array<{ value: Platform; label: string }> = [
  { value: 'GOOGLE_PLAY', label: 'Google Play' },
  { value: 'APP_STORE', label: 'App Store' },
  { value: 'WEB', label: 'Site / Web' },
  { value: 'SAAS', label: 'SaaS' },
  { value: 'DESKTOP', label: 'Desktop' },
];

const MARKETS = [
  { value: 'BR', label: 'Brasil (BR)' },
  { value: 'US', label: 'Estados Unidos (US)' },
  { value: 'PT', label: 'Portugal (PT)' },
  { value: 'ES', label: 'Espanha (ES)' },
  { value: 'MX', label: 'México (MX)' },
];

const LANGUAGES = [
  { value: 'pt-BR', label: 'Português (pt-BR)' },
  { value: 'en-US', label: 'Inglês (en-US)' },
  { value: 'es-ES', label: 'Espanhol (es-ES)' },
];

export function NewAuditPage() {
  const { createAudit, isRestoring } = useAuditSession();
  const navigate = useNavigate();

  const [productUrl, setProductUrl] = useState('https://fluxoapp.com.br');
  const [productName, setProductName] = useState('FluxoCaixa');
  const [platform, setPlatform] = useState<Platform>('GOOGLE_PLAY');
  const [market, setMarket] = useState('BR');
  const [language, setLanguage] = useState('pt-BR');
  const [category, setCategory] = useState('Finanças / Gestão');
  const [audience, setAudience] = useState('Pequenas empresas e microempreendedores');
  const [competitors, setCompetitors] = useState<string[]>(['ContaSimples', 'CaixaFácil', 'GestorX']);
  const [competitorDraft, setCompetitorDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  function addCompetitor() {
    const v = competitorDraft.trim();
    if (!v) return;
    if (!competitors.includes(v)) setCompetitors([...competitors, v]);
    setCompetitorDraft('');
  }

  function removeCompetitor(name: string) {
    setCompetitors(competitors.filter((c) => c !== name));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setUrlError(undefined);

    try {
      const parsed = new URL(productUrl.trim());
      if (!/^https?:$/.test(parsed.protocol)) throw new Error('protocolo');
    } catch {
      setUrlError('Informe uma URL válida, começando com http:// ou https://.');
      return;
    }

    setSubmitting(true);
    try {
      const id = await createAudit({
        productUrl: productUrl.trim(),
        productName: productName.trim() || undefined,
        platform,
        market,
        language,
        category: category.trim() || undefined,
        competitors,
        audience: audience.trim() || undefined,
      });
      navigate(`/audit/${id}/profile`);
    } catch {
      setError('Não foi possível criar a auditoria. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell">
      <WizardHeader currentIndex={0} />

      <div className="page-head">
        <div className="page-eyebrow">Nova auditoria · Etapa 1 de 5</div>
        <h1>Configurar o produto</h1>
        <p>
          Defina qual produto será auditado e em quais condições de mercado, idioma e concorrência a análise deve
          acontecer. Os campos abaixo vêm pré-preenchidos com dados de demonstração.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <h2 style={{ marginBottom: 'var(--sp-4)' }}>Produto</h2>
            <div className="stack stack-4">
              <Field label="URL do produto" htmlFor="productUrl" required error={urlError} hint="Ex.: https://fluxoapp.com.br">
                <input
                  id="productUrl"
                  className="input"
                  type="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  aria-invalid={urlError ? 'true' : undefined}
                  aria-describedby={urlError ? 'productUrl-error' : 'productUrl-hint'}
                  required
                />
              </Field>

              <Field label="Nome do produto" htmlFor="productName" hint="Opcional — derivado da URL se vazio.">
                <input
                  id="productName"
                  className="input"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </Field>

              <Field label="Plataforma" htmlFor="platform">
                <select id="platform" className="select" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Categoria" htmlFor="category">
                <input id="category" className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
              </Field>

              <Field label="Público-alvo" htmlFor="audience">
                <input id="audience" className="input" value={audience} onChange={(e) => setAudience(e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card>
            <h2 style={{ marginBottom: 'var(--sp-4)' }}>Condições da auditoria</h2>
            <div className="stack stack-4">
              <Field label="Mercado" htmlFor="market" hint="Determina o país das respostas observadas.">
                <select id="market" className="select" value={market} onChange={(e) => setMarket(e.target.value)}>
                  {MARKETS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Idioma" htmlFor="language" hint="Idioma dos prompts executados.">
                <select id="language" className="select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="field">
                <label className="field-label" htmlFor="competitorInput">
                  Concorrentes de referência
                </label>
                <div className="row" style={{ gap: 'var(--sp-2)' }}>
                  <input
                    id="competitorInput"
                    className="input"
                    placeholder="Adicionar concorrente…"
                    value={competitorDraft}
                    onChange={(e) => setCompetitorDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCompetitor();
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={addCompetitor}>
                    Adicionar
                  </Button>
                </div>
                <ul className="chip-list" style={{ marginTop: 'var(--sp-3)' }}>
                  {competitors.map((c) => (
                    <Chip key={c} onRemove={() => removeCompetitor(c)} removeLabel={`Remover ${c}`}>
                      {c}
                    </Chip>
                  ))}
                </ul>
                {competitors.length === 0 && (
                  <span className="field-hint">Sem concorrentes informados — o catálogo padrão será usado.</span>
                )}
              </div>
            </div>
          </Card>
        </div>

        {error && (
          <div className="state-block state-error" role="alert" style={{ marginTop: 'var(--sp-5)' }}>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        <div className="page-actions">
          <Button type="submit" size="lg" loading={submitting || isRestoring}>
            Criar rascunho e continuar
          </Button>
          <span className="small muted">Próxima etapa: revisar o perfil interpretado do produto.</span>
        </div>
      </form>
    </div>
  );
}
