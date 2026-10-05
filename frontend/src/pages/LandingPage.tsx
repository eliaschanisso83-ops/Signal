import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LinkButton } from '../design-system/components';
import { CausalChain } from '../design-system/visuals';

const FUNNEL = [
  { n: '01', name: 'Encontrado', en: 'Found', desc: 'O produto aparece no conjunto de candidatos que o sistema de descoberta considera.' },
  { n: '02', name: 'Compreendido', en: 'Understood', desc: 'A categoria, o público e o problema são associados ao produto de forma correta.' },
  { n: '03', name: 'Evidenciado', en: 'Evidenced', desc: 'Afirmações sobre o produto são sustentadas por fontes externas verificáveis.' },
  { n: '04', name: 'Recomendado', en: 'Recommended', desc: 'O produto é citado como resposta nas respostas relevantes observadas.' },
  { n: '05', name: 'Convertido', en: 'Converted', desc: 'A menção leva o decisor ao próximo passo: visitar, testar ou comprar.' },
];

const FIGURES = [
  { v: '24%', k: 'Recommendation Share', d: 'Quanto o produto é recomendado dentro das respostas relevantes observadas.' },
  { v: '60%', k: 'Intent Coverage', d: 'Percentual dos intents relevantes em que o produto aparece ao menos uma vez.' },
  { v: '50%', k: 'Evidence Coverage', d: 'Percentual de intents com evidência externa suficiente associada ao produto.' },
  { v: '40', k: 'Semantic Alignment /100', d: 'Correspondência entre o posicionamento declarado e a caracterização observada.' },
];

const STEPS = [
  { n: '01', title: 'Perfil do produto', desc: 'URL, plataforma, mercado, idioma e concorrentes de referência.' },
  { n: '02', title: 'Intents', desc: 'Os problemas reais que as pessoas descrevem ao buscar uma solução.' },
  { n: '03', title: 'Prompts', desc: 'As perguntas executadas nos sistemas de descoberta, versionadas.' },
  { n: '04', title: 'Execução', desc: 'Coleta simulada de respostas, recomendações e menções.' },
  { n: '05', title: 'Evidências', desc: 'Fontes externas que sustentam (ou não) cada afirmação observada.' },
  { n: '06', title: 'Relatório', desc: 'Scores, gaps, oportunidades e ações priorizadas com rastreabilidade.' },
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
      {/* ---------- Masthead ---------- */}
      <div className="lp-masthead" aria-hidden="true">
        <span>Signal</span>
        <span className="hide-sm">Software Discoverability Intelligence</span>
        <span>Nº 001 · Demonstração · pt-BR</span>
      </div>

      {/* ---------- Hero assimétrico ---------- */}
      <section className="lp-hero">
        <div className="shell lp-hero-grid">
          <div>
            <img
              src="/logo.svg"
              alt="Signal — signal.biz-flow.cloud"
              className="lp-logo anim anim-1"
              width={340}
              height={84}
            />
            <div className="lp-kicker anim anim-2">Auditoria de discoverability — demonstração pública</div>
            <h1 className="lp-title anim anim-3">
              Seu produto é <mark>encontrado</mark>, compreendido e recomendado onde as decisões acontecem
            </h1>
            <p className="lp-lead anim anim-4">
              A Signal audita como sistemas de descobertura — assistentes de IA, busca e marketplaces — respondem sobre a
              sua categoria. O resultado não é uma opinião: é uma cadeia rastreável de observação, evidência, hipótese e
              ação.
            </p>
            <div className="lp-cta-row anim anim-5">
              <LinkButton to="/audit/new" size="lg">
                Iniciar auditoria
              </LinkButton>
              <a className="link-arrow" href="#principio">
                Ler o método ↓
              </a>
            </div>
            <p className="lp-fine anim anim-5">
              Dados simulados — nenhum provider externo conectado nesta fase.
            </p>
          </div>

          {/* Espécime: trecho real de um relatório, como tabela impressa */}
          <aside className="lp-specimen anim anim-6" aria-label="Espécime do relatório, dados simulados">
            <div className="lp-specimen-head">
              <span>Relatório — espécime</span>
              <span>Dados simulados</span>
            </div>
            <div className="lp-specimen-score">
              <span className="label">
                Discoverability
                <br />
                Score
              </span>
              <b>55</b>
              <span className="den">/100</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th scope="col">Métrica</th>
                  <th scope="col" style={{ textAlign: 'right' }}>
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Recommendation Share</td>
                  <td className="v">24%</td>
                </tr>
                <tr>
                  <td>Intent Coverage</td>
                  <td className="v">60%</td>
                </tr>
                <tr>
                  <td>Evidence Coverage</td>
                  <td className="v">50%</td>
                </tr>
                <tr>
                  <td>Posição entre concorrentes</td>
                  <td className="v">3 / 7</td>
                </tr>
              </tbody>
            </table>
            <div className="lp-specimen-foot">FluxoCaixa · BR · pt-BR · metodologia v1.3.0</div>
          </aside>
        </div>
      </section>

      {/* ---------- Ticker de achados ---------- */}
      <div className="lp-ticker" aria-hidden="true">
        <div className="lp-ticker-track">
          <span>Found → Understood → Evidenced → Recommended → Converted</span>
          <span className="hi">Recommendation Share 24%</span>
          <span>Intent Coverage 60%</span>
          <span className="hi">Evidence Coverage 50%</span>
          <span>Semantic Alignment 40/100</span>
          <span className="hi">Posição 3/7</span>
          <span>Found → Understood → Evidenced → Recommended → Converted</span>
          <span className="hi">Recommendation Share 24%</span>
          <span>Intent Coverage 60%</span>
          <span className="hi">Evidence Coverage 50%</span>
          <span>Semantic Alignment 40/100</span>
          <span className="hi">Posição 3/7</span>
        </div>
      </div>

      {/* ---------- § 01 Métricas ---------- */}
      <section className="lp-section" id="metricas" aria-labelledby="metrics-title">
        <div className="shell">
          <header className="lp-sec-head reveal">
            <span className="lp-sec-no">§ 01</span>
            <h2 id="metrics-title">Métricas com fórmula, versão e confiança</h2>
            <p className="lp-sec-meta">
              Nenhum número aparece sem proveniência: cada métrica carrega fórmula, versão da metodologia e explicação do
              que observa.
            </p>
          </header>
          <div className="lp-figures">
            {FIGURES.map((f, i) => (
              <div
                key={f.k}
                className="lp-figure reveal"
                style={{ ['--d' as string]: `${i * 70}ms` }}
              >
                <div className="v">{f.v}</div>
                <div className="k">{f.k}</div>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
          <p className="lp-note reveal">Valores ilustrativos de uma auditoria de demonstração (FluxoCaixa, mercado BR).</p>
        </div>
      </section>

      {/* ---------- § 02 Funil ---------- */}
      <section className="lp-section" id="descoberta" aria-labelledby="funnel-title">
        <div className="shell">
          <header className="lp-sec-head reveal">
            <span className="lp-sec-no">§ 02</span>
            <h2 id="funnel-title">A decisão começa em uma pergunta — não em uma busca</h2>
            <p className="lp-sec-meta">
              Antes do clique, existe uma cadeia de sistemas que escolhem, caracterizam e recomendam. A Signal mede cada
              elo dessa cadeia.
            </p>
          </header>
          <div className="lp-funnel">
            {FUNNEL.map((f, i) => (
              <div
                key={f.n}
                className="lp-funnel-row reveal"
                style={{ ['--d' as string]: `${i * 60}ms` }}
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

      {/* ---------- § 03 Princípio ---------- */}
      <section className="lp-section" id="principio" aria-labelledby="principle-title">
        <div className="shell lp-split">
          <div className="lp-split-copy reveal">
            <header className="lp-sec-head" style={{ marginBottom: 'var(--sp-5)' }}>
              <span className="lp-sec-no">§ 03</span>
              <h2 id="principle-title">Toda recomendação é rastreável até a evidência</h2>
            </header>
            <p>
              O relatório separa visualmente o que foi observado, o que é evidência verificável, o que é hipótese e o
              que é ação recomendada. Nenhum passo pula o anterior: sem observação não há evidência; sem evidência não há
              ação.
            </p>
            <div className="lp-legend">
              <span className="ob">Observação</span>
              <span className="ev">Evidência</span>
              <span className="hy">Hipótese</span>
              <span className="ac">Ação</span>
            </div>
          </div>
          <div className="lp-transcription reveal" style={{ ['--d' as string]: '100ms' }}>
            <div className="lp-transcription-head">
              <span>Transcrição — evidence chain</span>
              <span>demo</span>
            </div>
            <div className="lp-transcription-body">
              <CausalChain steps={CHAIN} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- § 04 Como funciona ---------- */}
      <section className="lp-section" id="como-funciona" aria-labelledby="flow-title">
        <div className="shell">
          <header className="lp-sec-head reveal">
            <span className="lp-sec-no">§ 04</span>
            <h2 id="flow-title">Da configuração à ação priorizada</h2>
            <p className="lp-sec-meta">Seis etapas, todas rastreáveis — em segundos nesta demonstração.</p>
          </header>
          <div className="lp-steps">
            {STEPS.map((s, i) => (
              <article
                key={s.n}
                className="lp-step reveal"
                style={{ ['--d' as string]: `${(i % 3) * 80}ms` }}
              >
                <span className="num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- § 05 Chamada final ---------- */}
      <section className="lp-final" id="comecar" aria-labelledby="final-cta-title">
        <div className="shell">
          <span className="lp-sec-no">§ 05</span>
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
        </div>
      </section>
    </div>
  );
}
