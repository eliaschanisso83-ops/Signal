import { useEffect, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Badge, LinkButton } from '../design-system/components';
import { ConfidenceIndicator, EvidenceChain, MetricCard, RankingIndicator, ScoreCard } from '../components/landing-cards';
import { DISCOVERY_LOGOS } from '../assets/logos';

const FUNNEL = [
  { n: '01', name: 'Encontrado', en: 'Found', desc: 'O produto entra no conjunto de candidatos que o sistema de descoberta considera.' },
  { n: '02', name: 'Compreendido', en: 'Understood', desc: 'Categoria, público e problema são associados ao produto de forma correta.' },
  { n: '03', name: 'Evidenciado', en: 'Evidenced', desc: 'As afirmações sobre o produto são sustentadas por fontes externas verificáveis.' },
  { n: '04', name: 'Recomendado', en: 'Recommended', desc: 'O produto é citado nas respostas relevantes observadas.' },
  { n: '05', name: 'Convertido', en: 'Converted', desc: 'A menção leva o decisor ao próximo passo: visitar, testar ou comprar.' },
];

const STAGES = [
  { n: '01', title: 'Perfil do produto', desc: 'URL, plataforma, mercado, idioma e concorrentes de referência.' },
  { n: '02', title: 'Intents', desc: 'Os problemas reais que as pessoas descrevem ao buscar uma solução.' },
  { n: '03', title: 'Prompts', desc: 'As perguntas executadas nos sistemas de descoberta, versionadas.' },
  { n: '04', title: 'Execução', desc: 'Coleta de respostas, recomendações e menções (simulada na demo).' },
  { n: '05', title: 'Evidências', desc: 'Fontes externas que sustentam — ou não — cada afirmação.' },
  { n: '06', title: 'Relatório', desc: 'Scores, gaps, oportunidades e ações priorizadas com rastreabilidade.' },
];

const FIGURES = [
  { v: '24%', k: 'Recommendation Share', d: 'Quanto o produto é recomendado dentro das respostas relevantes.' },
  { v: '60%', k: 'Intent Coverage', d: 'Intents relevantes em que o produto aparece ao menos uma vez.' },
  { v: '50%', k: 'Evidence Coverage', d: 'Intents com evidência externa suficiente associada ao produto.' },
  { v: '40/100', k: 'Semantic Alignment', d: 'Posicionamento declarado vs. caracterização observada.' },
];

const CHAIN = [
  {
    kind: 'observed' as const,
    text: 'O produto não apareceu em nenhuma das respostas observadas para “acompanhar fluxo de caixa”.',
  },
  {
    kind: 'evidence' as const,
    text: 'CaixaFácil e ContaSimples aparecem em 68% das respostas do intent, sustentados por artigo, página própria e thread de comunidade.',
  },
  {
    kind: 'hypothesis' as const,
    text: 'A ausência de associação explícita entre o produto e o termo “fluxo de caixa” nas fontes observadas pode estar reduzindo a presença.',
  },
  {
    kind: 'action' as const,
    text: 'Criar página específica de fluxo de caixa para pequenas empresas e reforçar a associação no store listing — validar em nova auditoria em 2–4 semanas.',
  },
];

export function LandingPage() {
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
            <div className="lp-eyebrow anim anim-2">Demonstração pública · dados simulados</div>
            <h1 className="lp-title anim anim-3">
              Seu produto é <span className="accent">encontrado</span>, compreendido e recomendado onde as decisões
              acontecem
            </h1>
            <p className="lp-lead anim anim-4">
              A Signal audita como sistemas de descobertura — assistentes de IA, busca e marketplaces — respondem sobre a
              sua categoria. Você recebe scores com fórmula explícita e uma cadeia rastreável de observação, evidência,
              hipótese e ação.
            </p>
            <div className="lp-cta-row anim anim-5">
              <LinkButton to="/audit/new" size="lg">
                Iniciar auditoria
              </LinkButton>
              <a className="link-arrow" href="#como-funciona">
                Como funciona ↓
              </a>
            </div>
            <p className="lp-fine anim anim-5">Auditoria completa em segundos</p>
          </div>

          {/* Card premium — referência visual construída no Canva */}
          <aside className="lp-preview anim anim-6" aria-label="Prévia da interface do relatório, dados simulados">
            <div className="lp-preview-body">
              {/* Contexto da auditoria + status */}
              <div className="lp-card-head">
                <span className="lp-card-context">FluxoCaixa · mercado BR · pt-BR</span>
                <Badge tone="green">Concluída</Badge>
              </div>

              {/* N1 — score protagonista: arco + número */}
              <ScoreCard value={55} label="Discoverability Score" />

              {/* N2 — contexto secundário: confiança + posição */}
              <div className="lp-card-meta">
                <ConfidenceIndicator value="MEDIUM" />
                <RankingIndicator position={3} total={7} />
              </div>

              {/* N3 — métricas secundárias: módulos KPI */}
              <div className="lp-card-meters">
                <MetricCard label="Recommendation Share" value={24} displayValue="24%" />
                <MetricCard label="Intent Coverage" value={60} displayValue="60%" />
                <MetricCard label="Evidence Coverage" value={50} displayValue="50%" tone="muted" />
              </div>

              {/* Ação principal do card */}
              <LinkButton to="/audit/new" size="md" className="lp-card-cta btn-block">
                Executar esta auditoria →
              </LinkButton>
            </div>

            {/* Metadata / transparência */}
            <div className="lp-preview-foot">
              <span>fórmula v0.3 · metodologia v1.0</span>
              <span className="lp-sim-pill">dados simulados</span>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- Marquee: logos oficiais dos sistemas de descoberta ---------- */}
      <div className="lp-marquee" role="group" aria-label="Sistemas de descoberta cobertos pela metodologia">
        <div className="lp-marquee-label">Segmentação por sistema</div>
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
            <div className="k">Rastreabilidade</div>
            <div className="v">Observação → evidência → hipótese → ação</div>
          </div>
          <div className="lp-fact">
            <div className="k">Proveniência</div>
            <div className="v">Fórmula, versão e confiança em cada score</div>
          </div>
          <div className="lp-fact">
            <div className="k">Metodologia</div>
            <div className="v">v1.0 versionada e documentada</div>
          </div>
          <div className="lp-fact">
            <div className="k">Demonstração</div>
            <div className="v">Fluxo completo em segundos</div>
          </div>
        </div>
      </div>

      {/* ---------- Problema: narrativa + funil ---------- */}
      <section className="lp-section" id="problema" aria-labelledby="problema-title">
        <div className="shell">
          <header className="lp-section-head reveal">
            <div className="lp-eyebrow">O problema</div>
            <h2 id="problema-title">A decisão começa em uma pergunta — não em uma busca</h2>
            <p>
              Antes do clique, uma cadeia de sistemas decide quem entra na resposta, como é caracterizado e quem é
              recomendado. Se o seu produto não passa por cada elo, some da conversa sem você ver. A Signal mede exatamente
              esses cinco elos.
            </p>
          </header>
          <div className="lp-funnel">
            {FUNNEL.map((f, i) => (
              <div key={f.n} className="lp-funnel-row reveal" style={{ ['--d' as string]: `${i * 60}ms` }}>
                <span className="n">{f.n}</span>
                <span className="name">
                  {f.name}
                  <span className="en">{f.en}</span>
                </span>
                <span className="desc">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Solução: pipeline horizontal ---------- */}
      <section className="lp-section alt" id="como-funciona" aria-labelledby="flow-title">
        <div className="shell">
          <header className="lp-section-head reveal">
            <div className="lp-eyebrow">Como funciona</div>
            <h2 id="flow-title">Da configuração à ação priorizada</h2>
            <p>
              Seis etapas rastreáveis: você configura uma vez, a execução coleta as respostas e o relatório entrega o que
              fazer — com evidência para cada conclusão.
            </p>
          </header>
          <div className="lp-pipeline">
            {STAGES.map((s, i) => (
              <article key={s.n} className="lp-stage reveal" style={{ ['--d' as string]: `${(i % 3) * 70}ms` }}>
                <span className="n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Resultado: números + cadeia causal real ---------- */}
      <section className="lp-section" id="metricas" aria-labelledby="resultado-title">
        <div className="shell">
          <header className="lp-section-head reveal">
            <div className="lp-eyebrow">O que você recebe</div>
            <h2 id="resultado-title">Scores com proveniência e evidência rastreável</h2>
            <p>
              Cada número do relatório carrega fórmula, versão e confiança. Cada recomendação aponta de volta até a
              observação que a originou.
            </p>
          </header>

          <div className="lp-figures reveal">
            {FIGURES.map((f) => (
              <div key={f.k} className="lp-figure">
                <div className="v">{f.v}</div>
                <div className="k">{f.k}</div>
                <p>{f.d}</p>
              </div>
            ))}
          </div>

          <div className="lp-split">
            <div className="lp-split-copy reveal">
              <h3>Toda recomendação é rastreável até a evidência</h3>
              <p>
                O relatório separa visualmente o que foi observado, o que é evidência verificável, o que é hipótese e o
                que é ação recomendada. Nenhum passo pula o anterior: sem observação não há evidência; sem evidência não
                há ação.
              </p>
              <div className="lp-legend">
                <span>Observação</span>
                <span className="ev">Evidência</span>
                <span className="hy">Hipótese</span>
                <span className="ac">Ação</span>
              </div>
            </div>
            <div className="lp-chain-panel reveal" style={{ ['--d' as string]: '100ms' }}>
              <div className="lp-chain-head">
                <span>Evidence chain — extrato</span>
                <span>demo</span>
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
            <h2 id="final-cta-title">Execute uma auditoria de ponta a ponta em segundos</h2>
            <p>
              Configure o produto, revise intents e prompts, acompanhe a execução e explore o relatório com evidências,
              gaps e oportunidades.
            </p>
            <div className="lp-cta-row">
              <LinkButton to="/audit/new" size="lg">
                Começar agora
              </LinkButton>
              <Link to="/audit/new" className="link-arrow">
                Ver as etapas da auditoria →
              </Link>
            </div>
            <p className="lp-fine">Sem cadastro · dados simulados para demonstração</p>
          </div>
        </div>
      </section>
    </div>
  );
}
