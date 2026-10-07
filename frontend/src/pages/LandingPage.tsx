import { useEffect, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Badge, LinkButton } from '../design-system/components';
import { ConfidenceIndicator, EvidenceChain, MetricCard, RankingIndicator, ScoreCard } from '../components/landing-cards';
import { DISCOVERY_LOGOS } from '../assets/logos';
import { BRAND_TITLE, useDocumentTitle } from '../i18n/seo';

export function LandingPage() {
  const { t } = useTranslation('landing');
  const { t: tc } = useTranslation('common');
  useDocumentTitle(BRAND_TITLE);

  const FUNNEL = [
    { n: '01', id: 'found' },
    { n: '02', id: 'understood' },
    { n: '03', id: 'evidenced' },
    { n: '04', id: 'recommended' },
    { n: '05', id: 'converted' },
  ] as const;

  const STAGES = [
    { n: '01', id: 'profile' },
    { n: '02', id: 'intents' },
    { n: '03', id: 'prompts' },
    { n: '04', id: 'execution' },
    { n: '05', id: 'evidence' },
    { n: '06', id: 'report' },
  ] as const;

  const FIGURES = [
    { v: '24%', id: 'recommendationShare' },
    { v: '60%', id: 'intentCoverage' },
    { v: '50%', id: 'evidenceCoverage' },
    { v: '40/100', id: 'semanticAlignment' },
  ] as const;

  const CHAIN = [
    {
      kind: 'observed' as const,
      text: t('results.chain.steps.observed'),
    },
    {
      kind: 'evidence' as const,
      text: t('results.chain.steps.evidence'),
    },
    {
      kind: 'hypothesis' as const,
      text: t('results.chain.steps.hypothesis'),
    },
    {
      kind: 'action' as const,
      text: t('results.chain.steps.action'),
    },
  ];

  useEffect(() => {
    const root = document.querySelector('.lp');
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('.reveal'));
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="lp">
      {/* ---------- Hero: o que é / para quem / problema / ação ---------- */}
      <section className="lp-hero">
        <div className="shell lp-hero-grid">
          <div>
            <img
              src="/logo.svg"
              alt="Signal — signal.biz-flow.cloud"
              width={340}
              height={84}
              className="anim anim-1"
              style={{ width: 'min(230px, 60vw)', height: 'auto', display: 'block', marginBottom: 'var(--sp-5)' }}
            />
            <div className="lp-eyebrow anim anim-2">{t('hero.eyebrow')}</div>
            <h1 className="lp-title anim anim-3">
              <Trans<'hero.title', 'landing'>
                i18nKey="hero.title"
                ns="landing"
                components={{ accent: <span className="accent" /> }}
              />
            </h1>
            <p className="lp-lead anim anim-4">{t('hero.lead')}</p>
            <div className="lp-cta-row anim anim-5">
              <LinkButton to="/audit/new" size="lg">
                {t('hero.cta')}
              </LinkButton>
              <a className="link-arrow" href="#como-funciona">
                {t('hero.howItWorks')}
              </a>
            </div>
            <p className="lp-fine anim anim-5">{t('hero.fine')}</p>
          </div>

          {/* Card premium — referência visual construída no Canva */}
          <aside className="lp-preview anim anim-6" aria-label={t('hero.previewLabel')}>
            <div className="lp-preview-body">
              {/* Contexto da auditoria + status */}
              <div className="lp-card-head">
                <span className="lp-card-context">{t('hero.previewContext', { product: 'FluxoCaixa' })}</span>
                <Badge tone="green">{t('hero.previewStatus')}</Badge>
              </div>

              {/* N1 — score protagonista: arco + número */}
              <ScoreCard value={55} label={tc('metrics.discoverabilityScore')} />

              {/* N2 — contexto secundário: confiança + posição */}
              <div className="lp-card-meta">
                <ConfidenceIndicator value="MEDIUM" />
                <RankingIndicator position={3} total={7} />
              </div>

              {/* N3 — métricas secundárias: módulos KPI */}
              <div className="lp-card-meters">
                <MetricCard label={tc('metrics.recommendationShare')} value={24} displayValue="24%" />
                <MetricCard label={tc('metrics.intentCoverage')} value={60} displayValue="60%" />
                <MetricCard label={tc('metrics.evidenceCoverage')} value={50} displayValue="50%" tone="muted" />
              </div>

              {/* Ação principal do card */}
              <LinkButton to="/audit/new" size="md" className="lp-card-cta btn-block">
                {t('hero.previewCta')}
              </LinkButton>
            </div>

            {/* Metadata / transparência */}
            <div className="lp-preview-foot">
              <span>{t('hero.previewFoot', { formula: 'v0.3', methodology: 'v1.0' })}</span>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- Marquee: logos oficiais dos sistemas de descoberta ---------- */}
      <div className="lp-marquee" role="group" aria-label={t('marquee.label')}>
        <div className="lp-marquee-label">{t('marquee.title')}</div>
        <div className="lp-marquee-view">
          <div className="lp-marquee-track">
            <div className="lp-marquee-group">
              {DISCOVERY_LOGOS.map((b) => (
                <span
                  key={b.key}
                  className="lp-marquee-item"
                  style={{ '--brand': `#${b.hex}` } as CSSProperties}
                >
                  <svg className="lp-marquee-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d={b.path} />
                  </svg>
                  <span className="lp-marquee-name">{b.name}</span>
                </span>
              ))}
            </div>
            <div className="lp-marquee-group" aria-hidden="true">
              {DISCOVERY_LOGOS.map((b) => (
                <span key={b.key} className="lp-marquee-item" style={{ '--brand': `#${b.hex}` } as CSSProperties}>
                  <svg className="lp-marquee-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d={b.path} />
                  </svg>
                  <span className="lp-marquee-name">{b.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Faixa de fatos (prova real do produto) ---------- */}
      <div className="lp-strip">
        <div className="shell lp-strip-inner">
          <div className="lp-fact">
            <div className="k">{t('facts.traceability.k')}</div>
            <div className="v">{t('facts.traceability.v')}</div>
          </div>
          <div className="lp-fact">
            <div className="k">{t('facts.provenance.k')}</div>
            <div className="v">{t('facts.provenance.v')}</div>
          </div>
          <div className="lp-fact">
            <div className="k">{t('facts.methodology.k')}</div>
            <div className="v">{t('facts.methodology.v', { version: 'v1.0' })}</div>
          </div>
          <div className="lp-fact">
            <div className="k">{t('facts.execution.k')}</div>
            <div className="v">{t('facts.execution.v')}</div>
          </div>
        </div>
      </div>

      {/* ---------- Problema: narrativa + funil ---------- */}
      <section className="lp-section" id="problema" aria-labelledby="problema-title">
        <div className="shell">
          <header className="lp-section-head reveal">
            <div className="lp-eyebrow">{t('problem.eyebrow')}</div>
            <h2 id="problema-title">{t('problem.title')}</h2>
            <p>{t('problem.desc')}</p>
          </header>
          <div className="lp-funnel">
            {FUNNEL.map((f, i) => (
              <div key={f.n} className="lp-funnel-row reveal" style={{ ['--d' as string]: `${i * 60}ms` }}>
                <span className="n">{f.n}</span>
                <span className="name">
                  {t(`problem.funnel.${f.id}.name`)}
                  <span className="en">{t(`problem.funnel.${f.id}.gloss`)}</span>
                </span>
                <span className="desc">{t(`problem.funnel.${f.id}.desc`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Solução: pipeline horizontal ---------- */}
      <section className="lp-section alt" id="como-funciona" aria-labelledby="flow-title">
        <div className="shell">
          <header className="lp-section-head reveal">
            <div className="lp-eyebrow">{t('how.eyebrow')}</div>
            <h2 id="flow-title">{t('how.title')}</h2>
            <p>{t('how.desc')}</p>
          </header>
          <div className="lp-pipeline">
            {STAGES.map((s, i) => (
              <article key={s.n} className="lp-stage reveal" style={{ ['--d' as string]: `${(i % 3) * 70}ms` }}>
                <span className="n">{s.n}</span>
                <h3>{t(`how.stages.${s.id}.title`)}</h3>
                <p>{t(`how.stages.${s.id}.desc`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Resultado: números + cadeia causal real ---------- */}
      <section className="lp-section" id="metricas" aria-labelledby="resultado-title">
        <div className="shell">
          <header className="lp-section-head reveal">
            <div className="lp-eyebrow">{t('results.eyebrow')}</div>
            <h2 id="resultado-title">{t('results.title')}</h2>
            <p>{t('results.desc')}</p>
          </header>

          <div className="lp-figures reveal">
            {FIGURES.map((f) => (
              <div key={f.id} className="lp-figure">
                <div className="v">{f.v}</div>
                <div className="k">{tc(`metrics.${f.id}`)}</div>
                <p>{t(`results.figures.${f.id}`)}</p>
              </div>
            ))}
          </div>

          <div className="lp-split">
            <div className="lp-split-copy reveal">
              <h3>{t('results.traceable.title')}</h3>
              <p>{t('results.traceable.desc')}</p>
              <div className="lp-legend">
                <span>{tc('causal.observed')}</span>
                <span className="ev">{tc('causal.evidence')}</span>
                <span className="hy">{tc('causal.hypothesis')}</span>
                <span className="ac">{tc('causal.action')}</span>
              </div>
            </div>
            <div className="lp-chain-panel reveal" style={{ ['--d' as string]: '100ms' }}>
              <div className="lp-chain-head">
                <span>{t('results.chain.title')}</span>
                <span>{t('results.chain.tag')}</span>
              </div>
              <div className="lp-chain-body">
                <EvidenceChain steps={CHAIN} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA final: um único próximo passo ---------- */}
      <section className="lp-section" id="comecar" aria-labelledby="final-cta-title">
        <div className="shell">
          <div className="lp-final reveal">
            <h2 id="final-cta-title">{t('finalCta.title')}</h2>
            <p>{t('finalCta.desc')}</p>
            <div className="lp-cta-row">
              <LinkButton to="/audit/new" size="lg">
                {t('finalCta.primary')}
              </LinkButton>
              <Link to="/audit/new" className="link-arrow">
                {t('finalCta.secondary')}
              </Link>
            </div>
            <p className="lp-fine">{t('finalCta.fine')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
