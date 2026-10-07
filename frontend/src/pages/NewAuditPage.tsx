import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuditSession } from '../state/session';
import { Button, Card, Chip, Field } from '../design-system/components';
import { WizardHeader } from '../components/layout/WizardHeader';
import type { Platform } from '../domain/types';

export function NewAuditPage() {
  const { t } = useTranslation('audit');
  const { createAudit, isRestoring } = useAuditSession();
  const navigate = useNavigate();

  const PLATFORMS: Array<{ value: Platform; label: string }> = [
    { value: 'GOOGLE_PLAY', label: t('newAudit.platforms.GOOGLE_PLAY') },
    { value: 'APP_STORE', label: t('newAudit.platforms.APP_STORE') },
    { value: 'WEB', label: t('newAudit.platforms.WEB') },
    { value: 'SAAS', label: t('newAudit.platforms.SAAS') },
    { value: 'DESKTOP', label: t('newAudit.platforms.DESKTOP') },
  ];

  const MARKETS = [
    { value: 'BR', label: t('newAudit.markets.BR') },
    { value: 'US', label: t('newAudit.markets.US') },
    { value: 'PT', label: t('newAudit.markets.PT') },
    { value: 'ES', label: t('newAudit.markets.ES') },
    { value: 'MX', label: t('newAudit.markets.MX') },
  ];

  const LANGUAGES = [
    { value: 'pt-BR', label: t('newAudit.languages.ptBR') },
    { value: 'en-US', label: t('newAudit.languages.enUS') },
    { value: 'es-ES', label: t('newAudit.languages.esES') },
  ];

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
      setUrlError(t('newAudit.errors.url'));
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
      setError(t('newAudit.errors.create'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shell">
      <WizardHeader currentIndex={0} />

      <div className="page-head">
        <div className="page-eyebrow">{t('newAudit.eyebrow')}</div>
        <h1>{t('newAudit.title')}</h1>
        <p>{t('newAudit.intro')}</p>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <h2 style={{ marginBottom: 'var(--sp-4)' }}>{t('newAudit.sections.product')}</h2>
            <div className="stack stack-4">
              <Field label={t('newAudit.fields.url')} htmlFor="productUrl" required error={urlError} hint={t('newAudit.hints.url')}>
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

              <Field label={t('newAudit.fields.name')} htmlFor="productName" hint={t('newAudit.hints.name')}>
                <input
                  id="productName"
                  className="input"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </Field>

              <Field label={t('newAudit.fields.platform')} htmlFor="platform">
                <select id="platform" className="select" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t('newAudit.fields.category')} htmlFor="category">
                <input id="category" className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
              </Field>

              <Field label={t('newAudit.fields.audience')} htmlFor="audience">
                <input id="audience" className="input" value={audience} onChange={(e) => setAudience(e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card>
            <h2 style={{ marginBottom: 'var(--sp-4)' }}>{t('newAudit.sections.conditions')}</h2>
            <div className="stack stack-4">
              <Field label={t('newAudit.fields.market')} htmlFor="market" hint={t('newAudit.hints.market')}>
                <select id="market" className="select" value={market} onChange={(e) => setMarket(e.target.value)}>
                  {MARKETS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t('newAudit.fields.language')} htmlFor="language" hint={t('newAudit.hints.language')}>
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
                  {t('newAudit.fields.competitors')}
                </label>
                <div className="row" style={{ gap: 'var(--sp-2)' }}>
                  <input
                    id="competitorInput"
                    className="input"
                    placeholder={t('newAudit.placeholders.competitor')}
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
                    {t('actions.add')}
                  </Button>
                </div>
                <ul className="chip-list" style={{ marginTop: 'var(--sp-3)' }}>
                  {competitors.map((c) => (
                    <Chip key={c} onRemove={() => removeCompetitor(c)} removeLabel={t('aria.removeItem', { name: c })}>
                      {c}
                    </Chip>
                  ))}
                </ul>
                {competitors.length === 0 && (
                  <span className="field-hint">{t('newAudit.empty.competitors')}</span>
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
            {t('actions.createDraft')}
          </Button>
          <span className="small muted">{t('newAudit.footer.next')}</span>
        </div>
      </form>
    </div>
  );
}
