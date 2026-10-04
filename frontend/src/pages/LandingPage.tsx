import { Link } from 'react-router-dom';
import { AnchorButton, Card, LinkButton } from '../design-system/components';
import { CausalChain } from '../design-system/visuals';

const FLOW = [
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
    desc: 'Quanto o produto é recomendado dentro das respostas relevantes observadas.',
    value: '24%',
  },
  {
    metric: 'Intent Coverage',
    desc: 'Percentual dos intents relevantes em que o produto aparece ao menos uma vez.',
    value: '60%',
  },
  {
    metric: 'Evidence Coverage',
    desc: 'Percentual de intents com evidência externa suficiente associada ao produto.',
    value: '50%',
  },
  {
    metric: 'Semantic Alignment',
    desc: 'Correspondência entre o posicionamento declarado e a caracterização observada.',
    value: '40/100',
  },
];

export function LandingPage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="shell hero-inner">
          <img src="/logo.svg" alt="Signal — signal.biz-flow.cloud" className="hero-logo" width={340} height={84} />
          <div className="page-eyebrow">Software Discoverability Intelligence</div>
          <h1 className="hero-title">
            Seu produto é <em>encontrado</em>, <em>compreendido</em> e <em>recomendado</em> onde as decisões acontecem?
          </h1>
          <p className="hero-lead">
            A Signal audita como sistemas de descoberta — assistentes de IA, busca e marketplaces — respondem sobre a
            sua categoria. O resultado não é uma opinião: é uma cadeia rastreável de{' '}
            <strong>observação → evidência → hipótese → ação</strong>.
          </p>
          <div className="page-actions">
            <LinkButton to="/audit/new" size="lg">
              Iniciar auditoria
            </LinkButton>
            <AnchorButton href="#como-funciona" size="lg">
              Como funciona
            </AnchorButton>
          </div>
          <p className="xsmall muted" style={{ marginTop: 'var(--sp-4)' }}>
            Demonstração com dados simulados — nenhum provider externo conectado nesta fase.
          </p>
        </div>
      </section>

      {/* ---------- Métricas ---------- */}
      <section className="shell" aria-labelledby="metrics-title">
        <div className="section-head">
          <div className="page-eyebrow">O que você mede</div>
          <h2 id="metrics-title">Métricas de discoverability com fórmula e versão explícitas</h2>
          <p>
            Nenhum número aparece sem proveniência: cada score carrega fórmula, versão de metodologia, confiança e
            explicação.
          </p>
        </div>
        <div className="grid-4">
          {METRICS.map((m) => (
            <Card key={m.metric} className="card-hover">
              <div className="metric-value mono">{m.value}</div>
              <div className="metric-name">{m.metric}</div>
              <p className="small muted" style={{ margin: 0 }}>
                {m.desc}
              </p>
            </Card>
          ))}
        </div>
        <p className="xsmall muted" style={{ marginTop: 'var(--sp-3)' }}>
          Valores ilustrativos de uma auditoria de demonstração (FluxoCaixa, mercado BR, pt-BR).
        </p>
      </section>

      {/* ---------- Fluxo ---------- */}
      <section className="shell" id="como-funciona" aria-labelledby="flow-title">
        <div className="section-head">
          <div className="page-eyebrow">Como funciona</div>
          <h2 id="flow-title">Da configuração à ação priorizada</h2>
        </div>
        <ol className="flow-list">
          {FLOW.map((f) => (
            <li key={f.n}>
              <span className="flow-num mono">{f.n}</span>
              <div>
                <h3>{f.title}</h3>
                <p className="small muted">{f.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Cadeia causal ---------- */}
      <section className="shell" aria-labelledby="causal-title">
        <div className="section-head">
          <div className="page-eyebrow">Princípio central</div>
          <h2 id="causal-title">Toda recomendação é rastreável até a evidência</h2>
          <p>
            O relatório separa visualmente o que foi observado, o que é evidência verificável, o que é hipótese e o que
            é ação recomendada.
          </p>
        </div>
        <Card>
          <CausalChain
            steps={[
              { kind: 'observed', text: 'O produto não apareceu em nenhuma das respostas observadas para “acompanhar fluxo de caixa”.' },
              { kind: 'evidence', text: 'CaixaFácil e ContaSimples aparecem em 68% das respostas do intent, sustentados por artigo, página própria e thread de comunidade.' },
              { kind: 'hypothesis', text: 'A ausência de associação explícita entre o produto e o termo “fluxo de caixa” nas fontes observadas pode estar reduzindo a presença.' },
              { kind: 'action', text: 'Criar página específica de fluxo de caixa para pequenas empresas e reforçar a associação no store listing — validar em nova auditoria em 2–4 semanas.' },
            ]}
          />
        </Card>
      </section>

      {/* ---------- CTA final ---------- */}
      <section className="shell">
        <Card className="cta-card">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <div className="page-eyebrow">Demonstração completa</div>
            <h2>Execute uma auditoria de ponta a ponta em segundos</h2>
            <p>
              Configure o produto, revise intents e prompts, acompanhe a execução e explore o relatório com evidências,
              gaps e oportunidades.
            </p>
            <div className="page-actions">
              <LinkButton to="/audit/new" size="lg">
                Começar agora
              </LinkButton>
              <Link to="/audit/new" className="small">
                Ver as etapas da auditoria →
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
