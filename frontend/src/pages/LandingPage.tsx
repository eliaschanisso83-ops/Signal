import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge, ConfidenceBadge, LinkButton, Meter } from '../design-system/components';
import { CausalChain, ScoreGauge } from '../design-system/visuals';

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
            <p className="lp-fine anim anim-5">
              Auditoria completa em segundos · nenhum provider externo conectado nesta fase
            </p>
          </div>

          {/* Prévia com os componentes reais do relatório */}
          <aside className="lp-preview anim anim-6" aria-label="Prévia da interface do relatório, dados simulados">
            <div className="lp-preview-bar" aria-hidden="true">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="url">signal.biz-flow.cloud/audit/demo/report</span>
            </div>
            <div className="lp-preview-body">
              <div className="lp-preview-head">
                <div>
                  <div className="lp-preview-title">Relatório de discoverability</div>
                  <div className="lp-preview-sub">FluxoCaixa · mercado BR · pt-BR</div>
                </div>
                <Badge tone="green">Concluída</Badge>
              </div>
              <div className="lp-preview-main">
                <div className="lp-preview-gauge">
                  <ScoreGauge value={55} label="Discoverability" />
                </div>
                <div className="lp-preview-meters">
                  <Meter label="Recommendation Share" value={24} displayValue="24%" tone="accent" />
                  <Meter label="Intent Coverage" value={60} displayValue="60%" tone="accent" />
                  <Meter label="Evidence Coverage" value={50} displayValue="50%" tone="muted" />
                  <div className="lp-preview-conf">
                    <span className="muted">Confiança do score</span>
                    <ConfidenceBadge value="HIGH" />
                  </div>
                </div>
              </div>
              <div className="lp-preview-foot">
                <span>metodologia v1.3.0 · fórmula v1.2</span>
                <span>pos. 3/7</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

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
            <div className="v">v1.3.0 versionada e documentada</div>
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
      <section className="lp-section" id="como-funciona" aria-labelledby="flow-title">
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
                <CausalChain steps={CHAIN} />
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
