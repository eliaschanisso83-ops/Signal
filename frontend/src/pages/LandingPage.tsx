import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnchorButton, LinkButton } from '../design-system/components';
import { CausalChain } from '../design-system/visuals';

const FUNNEL = [
  { n: '01', name: 'Encontrado', en: 'Found', desc: 'O produto aparece no conjunto de candidatos que o sistema de descoberta considera.' },
  { n: '02', name: 'Compreendido', en: 'Understood', desc: 'A categoria, o público e o problema são associados ao produto de forma correta.' },
  { n: '03', name: 'Evidenciado', en: 'Evidenced', desc: 'Afirmações sobre o produto são sustentadas por fontes externas verificáveis.' },
  { n: '04', name: 'Recomendado', en: 'Recommended', desc: 'O produto é citado como resposta nas respostas relevantes observadas.' },
  { n: '05', name: 'Convertido', en: 'Converted', desc: 'A menção leva o decisor ao próximo passo: visitar, testar ou comprar.' },
];

const STEPS = [
  { n: '01', title: 'Perfil do produto', desc: 'URL, plataforma, mercado, idioma e concorrentes de referência.' },
  { n: '02', title: 'Intents', desc: 'Os problemas reais que as pessoas descrevem ao buscar uma solução.' },
  { n: '03', title: 'Prompts', desc: 'As perguntas executadas nos sistemas de descoberta, versionadas.' },
  { n: '04', title: 'Execução', desc: 'Coleta simulada de respostas, recomendações e menções.' },
  { n: '05', title: 'Evidências', desc: 'Fontes externas que sustentam (ou não) cada afirmação observada.' },
  { n: '06', title: 'Relatório', desc: 'Scores, gaps, oportunidades e ações priorizadas com rastreabilidade.' },
];

const METRICS = [
  {
    metric: 'Recommendation Share',
    value: '24%',
    desc: 'Quanto o produto é recomendado dentro das respostas relevantes observadas.',
  },
  {
    metric: 'Intent Coverage',
    value: '60%',
    desc: 'Percentual dos intents relevantes em que o produto aparece ao menos uma vez.',
  },
  {
    metric: 'Evidence Coverage',
    value: '50%',
    desc: 'Percentual de intents com evidência externa suficiente associada ao produto.',
  },
  {
    metric: 'Semantic Alignment',
    value: '40/100',
    desc: 'Correspondência entre o posicionamento declarado e a caracterização observada.',
  },
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
      {/* ---------- Hero ---------- */}
      <section className="lp-hero">
        <div className="shell lp-hero-inner">
          <img
            src="/logo.svg"
            alt="Signal — signal.biz-flow.cloud"
            className="lp-hero-logo anim anim-1"
            width={340}
            height={84}
          />
          <div className="anim anim-2">
            <span className="lp-pill">
              <span className="dot" aria-hidden="true" />
              Nova auditoria de demonstração disponível
            </span>
          </div>
          <h1 className="lp-title anim anim-3">
            Seu produto é <em>encontrado</em>, <em>compreendido</em> e <em>recomendado</em> onde as decisões acontecem
          </h1>
          <p className="lp-sub anim anim-4">
            A Signal audita como sistemas de descobertura — assistentes de IA, busca e marketplaces — respondem sobre a
            sua categoria. O resultado não é uma opinião: é uma cadeia rastreável de{' '}
            <strong>observação → evidência → hipótese → ação</strong>.
          </p>
          <div className="lp-cta-row anim anim-5">
            <LinkButton to="/audit/new" size="lg">
              Iniciar auditoria
            </LinkButton>
            <AnchorButton href="#principio" size="lg">
              Ver o método
            </AnchorButton>
          </div>
          <p className="lp-fine anim anim-5">
            Demonstração com dados simulados — nenhum provider externo conectado nesta fase.
          </p>

          {/* Artefato: trecho real do relatório, não um screenshot genérico */}
          <div className="lp-artifact anim anim-6">
            <span className="lp-float-chip">
              Score <span className="mono">55/100</span>
            </span>
            <div className="lp-window">
              <div className="lp-window-bar" aria-hidden="true">
                <span className="wd" />
                <span className="wd" />
                <span className="wd" />
                <span className="lp-window-url">signal.biz-flow.cloud/audit/demo/report</span>
              </div>
              <div className="lp-window-body">
                <div className="lp-side" aria-hidden="true">
                  <span className="nav on">Resumo</span>
                  <span className="nav">Evidências</span>
                  <span className="nav">Oportunidades</span>
                  <span className="nav">Ações</span>
                  <span className="nav" style={{ marginTop: 'auto' }}>
                    metodologia v1.3.0
                  </span>
                </div>
                <div className="lp-main-pane">
                  <div className="lp-pane-title">Auditoria · FluxoCaixa (demo)</div>
                  <div className="lp-stat-row">
                    <div className="lp-stat">
                      <div className="v">55</div>
                      <div className="k">Score /100</div>
                    </div>
                    <div className="lp-stat">
                      <div className="v">24%</div>
                      <div className="k">Rec. Share</div>
                    </div>
                    <div className="lp-stat">
                      <div className="v">3º</div>
                      <div className="k">Posição /7</div>
                    </div>
                  </div>
                  <div className="lp-causal-mini" aria-hidden="true">
                    <div className="row ev">
                      <span className="tag">Evidência</span>
                      <span>Fontes externas sustentam 50% dos intents observados.</span>
                    </div>
                    <div className="row hy">
                      <span className="tag">Hipótese</span>
                      <span>Associação fraca entre o produto e o termo “fluxo de caixa”.</span>
                    </div>
                    <div className="row ac">
                      <span className="tag">Ação</span>
                      <span>Página dedicada ao intent + reforço no listing — validar em 2–4 semanas.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Métricas (prova) ---------- */}
      <section className="lp-section alt" id="metricas" aria-labelledby="metrics-title">
        <div className="shell">
          <div className="lp-section-head reveal">
            <div className="lp-eyebrow">Auditoria de demonstração</div>
            <h2 id="metrics-title">Scores com fórmula, versão e confiança</h2>
            <p>
              Nenhum número aparece sem proveniência: cada métrica carrega fórmula, versão da metodologia e explicação
              do que observa.
            </p>
          </div>
          <div className="lp-metrics">
            {METRICS.map((m, i) => (
              <article
                key={m.metric}
                className="lp-metric reveal"
                style={{ ['--d' as string]: `${i * 80}ms` }}
              >
                <div className="v">{m.value}</div>
                <div className="k">{m.metric}</div>
                <p>{m.desc}</p>
              </article>
            ))}
          </div>
          <p className="lp-note reveal">
            Valores ilustrativos de uma auditoria de demonstração (FluxoCaixa, mercado BR, pt-BR).
          </p>
        </div>
      </section>

      {/* ---------- Funil de descoberta ---------- */}
      <section className="lp-section" id="descoberta" aria-labelledby="funnel-title">
        <div className="shell">
          <div className="lp-section-head reveal">
            <div className="lp-eyebrow">O novo funil</div>
            <h2 id="funnel-title">A decisão começa em uma pergunta — não em uma busca</h2>
            <p>
              Antes do clique, existe uma cadeia de sistemas que escolhem, caracterizam e recomendam. A Signal mede cada
              elo dessa cadeia.
            </p>
          </div>
          <div className="lp-funnel">
            {FUNNEL.map((f, i) => (
              <div
                key={f.n}
                className="lp-funnel-step reveal"
                style={{ ['--d' as string]: `${i * 70}ms` }}
              >
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

      {/* ---------- Princípio central ---------- */}
      <section className="lp-section alt" id="principio" aria-labelledby="principle-title">
        <div className="shell lp-split">
          <div className="lp-split-copy reveal">
            <div className="lp-eyebrow">Princípio central</div>
            <h2 id="principle-title">Toda recomendação é rastreável até a evidência</h2>
            <p>
              O relatório separa visualmente o que foi observado, o que é evidência verificável, o que é hipótese e o
              que é ação recomendada. Nenhum passo pula o anterior: sem observação não há evidência; sem evidência não
              há ação.
            </p>
            <div className="lp-legend">
              <span className="ob">Observação</span>
              <span className="ev">Evidência</span>
              <span className="hy">Hipótese</span>
              <span className="ac">Ação</span>
            </div>
          </div>
          <div className="lp-chain-card reveal" style={{ ['--d' as string]: '120ms' }}>
            <CausalChain steps={CHAIN} />
          </div>
        </div>
      </section>

      {/* ---------- Como funciona ---------- */}
      <section className="lp-section" id="como-funciona" aria-labelledby="flow-title">
        <div className="shell">
          <div className="lp-section-head reveal">
            <div className="lp-eyebrow">Como funciona</div>
            <h2 id="flow-title">Da configuração à ação priorizada</h2>
            <p>Seis etapas, todas rastreáveis — em segundos nesta demonstração.</p>
          </div>
          <div className="lp-steps">
            {STEPS.map((s, i) => (
              <article
                key={s.n}
                className="lp-step reveal"
                style={{ ['--d' as string]: `${(i % 3) * 90}ms` }}
              >
                <span className="num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA final ---------- */}
      <section className="lp-section" id="comecar" aria-labelledby="final-cta-title">
        <div className="shell">
          <div className="lp-final reveal">
            <div className="lp-eyebrow">Demonstração completa</div>
            <h2 id="final-cta-title">Execute uma auditoria de ponta a ponta em segundos</h2>
            <p>
              Configure o produto, revise intents e prompts, acompanhe a execução e explore o relatório com evidências,
              gaps e oportunidades.
            </p>
            <div className="lp-cta-row">
              <LinkButton to="/audit/new" size="lg">
                Começar agora
              </LinkButton>
              <Link to="/audit/new" className="lp-sub" style={{ alignSelf: 'center', fontSize: 'var(--fs-sm)' }}>
                Ver as etapas da auditoria →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
