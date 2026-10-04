/**
 * Catálogo mock — estrutura fiel aos documentos de especificação.
 * Conteúdo fictício para demonstração da interface (sem providers reais).
 */

import type {
  Competitor,
  Intent,
  Source,
  Platform,
} from '../../domain/types';

export const METHODOLOGY_VERSION = '1.0';
export const PROMPT_SET_VERSION = '1.2';
export const SCORING_VERSION = '0.3';
export const ANALYSIS_DATE = '04/10/2026';
export const AUDIT_PROVIDER = 'Discovery Provider (mock)';
export const AUDIT_MODEL = 'modelo-A (mock)';

/* ------------------------------------------------------------------ */
/* Produto / perfil                                                    */
/* ------------------------------------------------------------------ */

export function buildProduct(input: {
  productUrl: string;
  productName?: string;
  platform: Platform;
  market: string;
  language: string;
  category?: string;
  competitors: string[];
  audience?: string;
  auditId: string;
}) {
  const name = input.productName?.trim() || nameFromUrl(input.productUrl) || 'Produto analisado';
  return {
    id: `prod_${input.auditId}`,
    name,
    url: input.productUrl,
    platform: input.platform,
    category: input.category?.trim() || 'Finanças / Gestão',
    description:
      `${name} é uma solução de gestão financeira para pequenas empresas: controle de despesas, ` +
      `receitas, fluxo de caixa e relatórios simples, sem a complexidade de ERPs.`,
    targetAudience: input.audience?.trim() || 'Pequenas empresas e microempreendedores',
    country: input.market,
    language: input.language,
    competitors: input.competitors.length > 0 ? input.competitors : ['ContaSimples', 'CaixaFácil', 'GestorX'],
    createdAt: new Date().toISOString(),
  };
}

function nameFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    const first = host.split('.')[0];
    return first.charAt(0).toUpperCase() + first.slice(1);
  } catch {
    return '';
  }
}

export function buildProfile(productId: string) {
  return {
    productId,
    valueProposition: 'Gestão financeira simples para pequenas empresas controlarem despesas, receitas e fluxo de caixa.',
    features: ['Controle de despesas', 'Registro de receitas', 'Fluxo de caixa', 'Relatórios simples', 'Categorias de gastos'],
    useCases: ['Controle financeiro do pequeno negócio', 'Acompanhamento mensal de caixa', 'Organização sem planilhas'],
    audiences: ['Pequenas empresas', 'Microempreendedores', 'Contadores de PMEs'],
    problemsSolved: ['Falta de organização financeira', 'Dificuldade de acompanhar fluxo de caixa', 'Dependência de Excel'],
    categories: ['Finanças', 'Gestão de pequenas empresas'],
    keywords: ['controle de despesas', 'fluxo de caixa', 'gestão financeira', 'pequenas empresas'],
    semanticEntities: ['finance', 'expense-tracking', 'small-business', 'cash-flow'],
    competitors: ['ContaSimples', 'CaixaFácil', 'GestorX'],
    markets: ['BR'],
    languages: ['pt-BR'],
  };
}

/* ------------------------------------------------------------------ */
/* Catálogo de intents (unidade fundamental — Doc 3 §7)                */
/* ------------------------------------------------------------------ */

export interface IntentCatalogItem {
  id: string;
  name: string;
  description: string;
  problem: string;
  audience: string;
  context: string;
  category: Intent['category'];
  priority: Intent['priority'];
  relevance: number;
  prompts: string[];
}

export const INTENT_CATALOG: IntentCatalogItem[] = [
  {
    id: 'intent_expenses',
    name: 'Controlar despesas da pequena empresa',
    description: 'Registrar e acompanhar gastos do negócio de forma simples e contínua.',
    problem: 'Gastos registrados de forma desorganizada, sem visão mensal.',
    audience: 'Donos de pequenos negócios',
    context: 'Rotina financeira semanal',
    category: 'PROBLEM_SPECIFIC',
    priority: 'HIGH',
    relevance: 5,
    prompts: [
      'Qual o melhor app para controlar despesas de uma pequena empresa?',
      'Que software posso usar para acompanhar gastos empresariais?',
      'Existe uma ferramenta simples para registrar despesas de um negócio?',
      'Como pequenas empresas podem controlar gastos sem complicação?',
      'Preciso de um aplicativo para registrar despesas do meu negócio. O que usar?',
    ],
  },
  {
    id: 'intent_cashflow',
    name: 'Acompanhar fluxo de caixa',
    description: 'Visualizar entradas, saídas e saldo projetado do negócio.',
    problem: 'Falta de previsão de caixa gera apuros financeiros.',
    audience: 'Pequenas empresas',
    context: 'Fechamento mensal / planejamento',
    category: 'PROBLEM_SPECIFIC',
    priority: 'HIGH',
    relevance: 5,
    prompts: [
      'Qual a melhor ferramenta para acompanhar fluxo de caixa de pequenas empresas?',
      'Existe algum software simples de fluxo de caixa para negócio pequeno?',
      'Como fazer controle de fluxo de caixa sem ser contador?',
      'Qual aplicativo mostra o saldo projetado do caixa da empresa?',
      'Preciso saber quanto dinheiro vai sobrar no fim do mês. Qual ferramenta usar?',
    ],
  },
  {
    id: 'intent_no_excel',
    name: 'Organizar finanças sem Excel',
    description: 'Substituir planilhas por um sistema mais simples e confiável.',
    problem: 'Planilhas manuais dão trabalho e propensam a erros.',
    audience: 'Pequenas empresas e autônomos',
    context: 'Migração de processo manual',
    category: 'COMMERCIAL',
    priority: 'HIGH',
    relevance: 5,
    prompts: [
      'Qual a melhor alternativa ao Excel para controle financeiro de pequenas empresas?',
      'Existe um software simples para substituir planilha de gastos?',
      'Quero parar de usar Excel para controlar as finanças da empresa. O que usar?',
      'Ferramenta de gestão financeira fácil para quem usa planilha hoje?',
      'O que usar no lugar de planilha do Excel para finanças do negócio?',
    ],
  },
  {
    id: 'intent_reports',
    name: 'Emitir relatórios financeiros simples',
    description: 'Gerar relatórios de gastos e resultados sem contabilidade formal.',
    problem: 'Falta de visão consolidada do desempenho financeiro.',
    audience: 'Pequenas empresas',
    context: 'Mensal / prestação de contas',
    category: 'EXPLORATORY',
    priority: 'MEDIUM',
    relevance: 4,
    prompts: [
      'Qual app gera relatório financeiro simples para pequena empresa?',
      'Como emitir relatório de gastos mensal do negócio automaticamente?',
      'Qual software mostra o resumo financeiro da empresa?',
      'Preciso de um relatório simples de receitas e despesas. Qual ferramenta?',
      'Ferramenta que monta relatório financeiro para pequenos negócios?',
    ],
  },
  {
    id: 'intent_record',
    name: 'Registrar receitas e despesas',
    description: 'Lançar movimentações do dia a dia com rapidez.',
    problem: 'Lançamentos esquecidos e histórico incompleto.',
    audience: 'Microempreendedores',
    context: 'Uso diário',
    category: 'PROBLEM_SPECIFIC',
    priority: 'MEDIUM',
    relevance: 4,
    prompts: [
      'Qual aplicativo é bom para anotar receitas e despesas da empresa?',
      'Como registrar movimentações financeiras do negócio no celular?',
      'App simples para lançar entradas e saídas do pequeno negócio?',
      'Ferramenta para controlar o que entrou e saiu no meu negócio?',
      'Melhor jeito de registrar receitas e despesas de uma pequena empresa?',
    ],
  },
  {
    id: 'intent_multi_account',
    name: 'Controlar gastos de várias contas',
    description: 'Consolidar gastos de múltiplas contas bancárias do negócio.',
    problem: 'Gastos espalhados em várias contas dificultam a visão total.',
    audience: 'Pequenas empresas com mais de uma conta',
    context: 'Gestão consolidada',
    category: 'EXPLORATORY',
    priority: 'MEDIUM',
    relevance: 3,
    prompts: [
      'Como controlar gastos de várias contas bancárias da empresa?',
      'Existe algum software que consolida finanças de mais de uma conta?',
      'Ferramenta para juntar gastos de contas diferentes do negócio?',
      'Qual app mostra o total de gastos de várias contas da empresa?',
      'Como saber quanto gastei em todas as contas do meu negócio?',
    ],
  },
  {
    id: 'intent_best_app',
    name: 'Melhor app financeiro para pequenas empresas',
    description: 'Escolha direta entre alternativas do mercado.',
    problem: 'Dificuldade de escolher entre muitas opções parecidas.',
    audience: 'Decisores de pequenas empresas',
    context: 'Avaliação / compra',
    category: 'COMMERCIAL',
    priority: 'HIGH',
    relevance: 5,
    prompts: [
      'Qual o melhor app financeiro para pequenas empresas em 2026?',
      'Melhor aplicativo de gestão financeira para negócio pequeno?',
      'Qual o melhor software financeiro para pequena empresa brasileira?',
      'O que usar para controlar dinheiro da empresa? melhores apps',
      'Qual app de finanças vale a pena para pequenos negócios?',
    ],
  },
  {
    id: 'intent_excel_alt',
    name: 'Alternativa ao Excel para controle financeiro',
    description: 'Comparação explícita entre planilhas e ferramentas dedicadas.',
    problem: 'Excel atende, mas é manual e limitado.',
    audience: 'Usuários de planilhas',
    context: 'Comparação de soluções',
    category: 'COMPARATIVE',
    priority: 'MEDIUM',
    relevance: 4,
    prompts: [
      'Qual melhor alternativa ao Excel para controle financeiro de pequena empresa?',
      'Vale a pena sair da planilha para um app financeiro?',
      'Comparativo: Excel vs software de gestão financeira para pequenas empresas?',
      'Software financeiro que substitui planilha do Excel?',
      'O que usar no lugar do Excel para controlar o caixa da empresa?',
    ],
  },
  {
    id: 'intent_collect_debt',
    name: 'Cobrar clientes em atraso',
    description: 'Acompanhar e cobrar dívidas de clientes.',
    problem: 'Recebimentos atrasados afetam o caixa.',
    audience: 'Pequenas empresas',
    context: 'Cobrança recorrente',
    category: 'PROBLEM_SPECIFIC',
    priority: 'LOW',
    relevance: 2,
    prompts: [
      'Como cobrar clientes que estão em atraso?',
      'Ferramenta para acompanhar dívidas de clientes?',
      'App que ajuda a cobrar pagamentos atrasados do negócio?',
      'Qual software controla contas a receber em atraso?',
      'Melhor jeito de controlar quem deve na minha empresa?',
    ],
  },
  {
    id: 'intent_freelancer',
    name: 'Controle financeiro para autônomos',
    description: 'Finanças simples para quem trabalha por conta própria.',
    problem: 'Confusão entre finanças pessoais e profissionais.',
    audience: 'Autônomos e freelancers',
    context: 'Uso pessoal/profissional',
    category: 'COMMERCIAL',
    priority: 'MEDIUM',
    relevance: 3,
    prompts: [
      'Qual o melhor app de controle financeiro para autônomos?',
      'Como separar gastos pessoais e profissionais sendo freelancer?',
      'Ferramenta simples de finanças para quem trabalha por conta própria?',
      'App para controlar dinheiro de freelancer?',
      'Melhor jeito de organizar finanças de autônomo?',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Landscape (Doc 4 §25)                                               */
/* ------------------------------------------------------------------ */

export interface LandscapeStat {
  intentId: string;
  presence: number;
  leader: string;
  leaderShare: number;
  ourShare: number;
}

export const LANDSCAPE_STATS: Record<string, LandscapeStat> = {
  intent_expenses: { intentId: 'intent_expenses', presence: 62, leader: 'ContaSimples', leaderShare: 71, ourShare: 58 },
  intent_cashflow: { intentId: 'intent_cashflow', presence: 4, leader: 'CaixaFácil', leaderShare: 68, ourShare: 4 },
  intent_no_excel: { intentId: 'intent_no_excel', presence: 28, leader: 'GestorX', leaderShare: 54, ourShare: 26 },
  intent_reports: { intentId: 'intent_reports', presence: 8, leader: 'ContaSimples', leaderShare: 63, ourShare: 6 },
  intent_record: { intentId: 'intent_record', presence: 55, leader: 'ContaSimples', leaderShare: 66, ourShare: 51 },
  intent_multi_account: { intentId: 'intent_multi_account', presence: 2, leader: 'CaixaFácil', leaderShare: 49, ourShare: 2 },
  intent_best_app: { intentId: 'intent_best_app', presence: 33, leader: 'ContaSimples', leaderShare: 74, ourShare: 31 },
  intent_excel_alt: { intentId: 'intent_excel_alt', presence: 14, leader: 'GestorX', leaderShare: 58, ourShare: 12 },
  intent_collect_debt: { intentId: 'intent_collect_debt', presence: 0, leader: 'MeuCaixa', leaderShare: 41, ourShare: 0 },
  intent_freelancer: { intentId: 'intent_freelancer', presence: 24, leader: 'MeuCaixa', leaderShare: 52, ourShare: 22 },
};

/* ------------------------------------------------------------------ */
/* Concorrentes (Doc 6 §18)                                            */
/* ------------------------------------------------------------------ */

export const COMPETITORS: Competitor[] = [
  { id: 'comp_contasimples', name: 'ContaSimples', canonicalUrl: 'https://contasimples.com', platform: 'WEB', category: 'Finanças / SaaS', observed: true },
  { id: 'comp_caixafacil', name: 'CaixaFácil', canonicalUrl: 'https://caixafacil.app', platform: 'GOOGLE_PLAY', category: 'Finanças', observed: true },
  { id: 'comp_gestorx', name: 'GestorX', canonicalUrl: 'https://gestorx.io', platform: 'WEB', category: 'Gestão / PME', observed: true },
  { id: 'comp_meucaixa', name: 'MeuCaixa', canonicalUrl: 'https://meucaixa.app', platform: 'GOOGLE_PLAY', category: 'Finanças', observed: true },
  { id: 'comp_orcamais', name: 'OrçaMais', canonicalUrl: 'https://orcamais.com.br', platform: 'WEB', category: 'Finanças', observed: true },
  { id: 'comp_fintrack', name: 'FinTrack', canonicalUrl: 'https://fintrack.tools', platform: 'SAAS', category: 'Finanças', observed: true },
];

/* ------------------------------------------------------------------ */
/* Fontes (Doc 6 §19)                                                  */
/* ------------------------------------------------------------------ */

export const SOURCES: Source[] = [
  { id: 'src_site', name: 'Site oficial do produto', url: 'https://example.com', domain: 'fluxoapp.com.br', category: 'OWNED' },
  { id: 'src_docs', name: 'Documentação do produto', url: 'https://docs.example.com', domain: 'docs.fluxoapp.com.br', category: 'OWNED' },
  { id: 'src_play', name: 'Google Play — página do app', url: 'https://play.google.com', domain: 'play.google.com', category: 'PLATFORM' },
  { id: 'src_blog', name: 'Artigo: “Gestão financeira para PMEs”', url: 'https://blog.example.com', domain: 'financasparapme.com.br', category: 'EARNED' },
  { id: 'src_review_site', name: 'Site de reviews de apps', url: 'https://reviews.example.com', domain: 'aplicativosbr.com', category: 'EARNED' },
  { id: 'src_youtube', name: 'Vídeo: comparativo de apps financeiros', url: 'https://youtube.com', domain: 'youtube.com', category: 'EARNED' },
  { id: 'src_reddit', name: 'Thread Reddit — controle de gastos', url: 'https://reddit.com', domain: 'reddit.com', category: 'COMMUNITY' },
  { id: 'src_forum', name: 'Fórum de pequenos empreendedores', url: 'https://forum.example.com', domain: 'empreendedores.info', category: 'COMMUNITY' },
  { id: 'src_compare', name: 'Página comparativa independente', url: 'https://compare.example.com', domain: 'versoes.app', category: 'EARNED' },
  { id: 'src_comp_site', name: 'Site do concorrente (referência)', url: 'https://contasimples.com', domain: 'contasimples.com', category: 'OWNED' },
];

/* ------------------------------------------------------------------ */
/* Classificação de menções (Doc 3 §27) — distribuição mock            */
/* ------------------------------------------------------------------ */

export const PROMPT_TOTAL = 50;
export const RESPONSES_RELEVANT = 42;
export const OUR_RECOMMENDATIONS = 10;
