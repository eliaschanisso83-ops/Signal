/**
 * Construção do bundle do relatório (mock).
 * Reflete a estrutura do Documento 4, §34 (12 seções do relatório).
 */

import type {
  Action,
  Audit,
  AuditBundle,
  CompetitorSnapshot,
  Confidence,
  Evidence,
  Gap,
  Intent,
  IntentLandscapeRow,
  Opportunity,
  Product,
  ProductProfile,
  Prompt,
  RecommendationDistribution,
  Score,
} from '../../domain/types';
import {
  ANALYSIS_DATE,
  AUDIT_MODEL,
  AUDIT_PROVIDER,
  COMPETITORS,
  INTENT_CATALOG,
  LANDSCAPE_STATS,
  METHODOLOGY_VERSION,
  OUR_RECOMMENDATIONS,
  PROMPT_SET_VERSION,
  PROMPT_TOTAL,
  RESPONSES_RELEVANT,
  SCORING_VERSION,
  SOURCES,
} from './catalog';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function statFor(intent: Intent) {
  const known = LANDSCAPE_STATS[intent.id];
  if (known) return known;
  const h = hash(intent.id);
  const competitors = COMPETITORS.map((c) => c.name);
  const presence = h % 25;
  const ourShare = Math.max(0, presence - 4);
  return {
    intentId: intent.id,
    presence,
    ourShare,
    leader: competitors[h % competitors.length],
    leaderShare: 45 + (h % 30),
  };
}

function presenceLevel(v: number): IntentLandscapeRow['presence'] {
  if (v >= 50) return 'ALTA';
  if (v >= 25) return 'MEDIA';
  if (v > 0) return 'BAIXA';
  return 'AUSENTE';
}

function gapLevel(relevance: number, presence: number): 'Baixo' | 'Médio' | 'Alto' {
  const opportunity = relevance * (100 - presence);
  if (opportunity >= 380) return 'Alto';
  if (opportunity >= 240) return 'Médio';
  return 'Baixo';
}

/* ------------------------------------------------------------------ */
/* Scores                                                              */
/* ------------------------------------------------------------------ */

function buildScores(audit: Audit, coverage: number, share: number, evidenceCoverage: number): Score[] {
  const base = {
    auditId: audit.id,
    formulaVersion: SCORING_VERSION,
    methodologyVersion: METHODOLOGY_VERSION,
  };

  const shareNorm = Math.round((share / 40) * 100); // referência interna: 40% = 100
  const score = Math.round(
    coverage * 0.25 + shareNorm * 0.25 + 63 * 0.15 + evidenceCoverage * 0.2 + 40 * 0.15,
  );

  const items: Score[] = [
    {
      ...base,
      id: 'score_discoverability',
      metric: 'Discoverability Score',
      value: score,
      displayValue: `${score} / 100`,
      confidence: 'MEDIUM',
      explanation:
        'Score experimental composto por cobertura de intents, recommendation share, posição relativa, ' +
        'evidência externa e alinhamento semântico. Os pesos são hipótese metodológica (formula v' +
        SCORING_VERSION +
        ') e não representam precisão absoluta.',
    },
    {
      ...base,
      id: 'score_share',
      metric: 'Recommendation Share',
      value: share,
      displayValue: `${share}%`,
      confidence: 'HIGH',
      explanation: `${OUR_RECOMMENDATIONS} recomendações em ${RESPONSES_RELEVANT} respostas relevantes (${PROMPT_TOTAL} prompts executados).`,
    },
    {
      ...base,
      id: 'score_coverage',
      metric: 'Intent Coverage',
      value: coverage,
      displayValue: `${coverage}%`,
      confidence: 'HIGH',
      explanation: 'Percentual dos intents relevantes em que o produto apareceu em pelo menos uma resposta.',
    },
    {
      ...base,
      id: 'score_position',
      metric: 'Competitive Position',
      value: 3,
      displayValue: '3 / 7',
      confidence: 'MEDIUM',
      explanation: 'Posição relativa do produto por frequência de recomendação entre os 7 produtos observados.',
    },
    {
      ...base,
      id: 'score_evidence',
      metric: 'Evidence Coverage',
      value: evidenceCoverage,
      displayValue: `${evidenceCoverage}%`,
      confidence: 'MEDIUM',
      explanation: 'Percentual de intents relevantes com evidência externa suficientemente associada ao produto.',
    },
    {
      ...base,
      id: 'score_semantic',
      metric: 'Semantic Alignment',
      value: 40,
      displayValue: '40 / 100',
      confidence: 'MEDIUM',
      explanation:
        'Correspondência entre o posicionamento declarado (“gestão financeira para pequenas empresas”) ' +
        'e a caracterização observada nas respostas.',
    },
  ];
  return items;
}

/* ------------------------------------------------------------------ */
/* Evidências                                                          */
/* ------------------------------------------------------------------ */

interface EvidenceSeed {
  sourceId: string;
  intentId?: string;
  subject: 'OUR' | 'COMP';
  subjectName?: string;
  claim: string;
  context: string;
  scores: [number, number, number, number, number];
  confidence: Confidence;
}

const EVIDENCE_SEEDS: EvidenceSeed[] = [
  {
    sourceId: 'src_site',
    subject: 'OUR',
    claim: 'Página própria descreve controle de despesas para pequenas empresas.',
    context: 'Recomendações do intent “controlar despesas”.',
    scores: [5, 5, 4, 4, 5],
    confidence: 'HIGH',
  },
  {
    sourceId: 'src_play',
    intentId: 'intent_expenses',
    subject: 'OUR',
    claim: 'Store listing destaca registro rápido de gastos e categorias.',
    context: 'Respostas que recomendam o produto para despesas.',
    scores: [5, 4, 4, 5, 3],
    confidence: 'HIGH',
  },
  {
    sourceId: 'src_review_site',
    intentId: 'intent_record',
    subject: 'OUR',
    claim: 'Review descreve o app como “simples para anotar gastos do dia a dia”.',
    context: 'Menções ao produto em reviews.',
    scores: [4, 3, 3, 3, 4],
    confidence: 'MEDIUM',
  },
  {
    sourceId: 'src_reddit',
    intentId: 'intent_expenses',
    subject: 'OUR',
    claim: 'Thread cita o produto como opção iniciante para registrar despesas.',
    context: 'Discussão comunitária sobre apps de gastos.',
    scores: [3, 3, 3, 2, 5],
    confidence: 'MEDIUM',
  },
  {
    sourceId: 'src_blog',
    intentId: 'intent_cashflow',
    subject: 'COMP',
    subjectName: 'CaixaFácil',
    claim: 'Artigo associa explicitamente CaixaFácil a “fluxo de caixa para PMEs”.',
    context: 'Respostas que recomendam CaixaFácil no intent de fluxo de caixa.',
    scores: [5, 5, 4, 4, 4],
    confidence: 'HIGH',
  },
  {
    sourceId: 'src_comp_site',
    intentId: 'intent_cashflow',
    subject: 'COMP',
    subjectName: 'ContaSimples',
    claim: 'Página do concorrente possui seção dedicada a fluxo de caixa com cases.',
    context: 'Fonte mais citada em recomendações de fluxo de caixa.',
    scores: [5, 5, 5, 4, 3],
    confidence: 'HIGH',
  },
  {
    sourceId: 'src_forum',
    intentId: 'intent_cashflow',
    subject: 'COMP',
    subjectName: 'CaixaFácil',
    claim: 'Fórum discute CaixaFácil como referência de saldo projetado.',
    context: 'Comunidade de pequenos empreendedores.',
    scores: [4, 4, 3, 3, 5],
    confidence: 'MEDIUM',
  },
  {
    sourceId: 'src_youtube',
    intentId: 'intent_best_app',
    subject: 'COMP',
    subjectName: 'ContaSimples',
    claim: 'Vídeo comparativo cita ContaSimples como “mais completa para empresas”.',
    context: 'Respostas comerciais do intent “melhor app financeiro”.',
    scores: [5, 4, 4, 3, 4],
    confidence: 'MEDIUM',
  },
  {
    sourceId: 'src_compare',
    intentId: 'intent_excel_alt',
    subject: 'COMP',
    subjectName: 'GestorX',
    claim: 'Página comparativa lista GestorX como principal alternativa ao Excel.',
    context: 'Intent comparativo de planilha vs software.',
    scores: [5, 5, 4, 3, 5],
    confidence: 'HIGH',
  },
  {
    sourceId: 'src_blog',
    intentId: 'intent_reports',
    subject: 'COMP',
    subjectName: 'ContaSimples',
    claim: 'Artigo destaca relatórios automáticos da ContaSimples.',
    context: 'Intent de relatórios financeiros.',
    scores: [4, 4, 4, 4, 4],
    confidence: 'MEDIUM',
  },
  {
    sourceId: 'src_docs',
    subject: 'OUR',
    claim: 'Documentação descreve relatórios, mas em página de baixo tráfego indexado.',
    context: 'Evidência própria pouco associada a recomendações.',
    scores: [3, 3, 5, 5, 5],
    confidence: 'MEDIUM',
  },
  {
    sourceId: 'src_reddit',
    intentId: 'intent_freelancer',
    subject: 'OUR',
    claim: 'Menção ao produto como “bom para controle pessoal”, não empresarial.',
    context: 'Caracterização observada divergente do posicionamento.',
    scores: [4, 3, 3, 2, 5],
    confidence: 'MEDIUM',
  },
  {
    sourceId: 'src_play',
    intentId: 'intent_best_app',
    subject: 'OUR',
    claim: 'Avaliações elogiam simplicidade, mas citam ausência de relatórios avançados.',
    context: 'Reviews da loja associadas a comparações.',
    scores: [4, 4, 4, 5, 3],
    confidence: 'HIGH',
  },
  {
    sourceId: 'src_forum',
    subject: 'COMP',
    subjectName: 'MeuCaixa',
    claim: 'Conselho comunitário recomenda MeuCaixa para cobrança de clientes.',
    context: 'Intent de baixa relevância para o produto.',
    scores: [3, 4, 3, 3, 5],
    confidence: 'MEDIUM',
  },
];

function buildEvidence(product: Product): Evidence[] {
  return EVIDENCE_SEEDS.map((seed, i) => {
    const isOur = seed.subject === 'OUR';
    const compName = seed.subjectName ?? COMPETITORS[0].name;
    const comp = COMPETITORS.find((c) => c.name === compName) ?? COMPETITORS[0];
    const [relevance, specificity, credibility, freshness, independence] = seed.scores;
    return {
      id: `ev_${i + 1}`,
      sourceId: seed.sourceId,
      intentId: seed.intentId,
      subjectId: isOur ? product.id : comp.id,
      subjectName: isOur ? product.name : comp.name,
      claim: seed.claim,
      context: seed.context,
      relevance,
      specificity,
      credibility,
      freshness,
      independence,
      confidence: seed.confidence,
    };
  });
}

const EVIDENCE_STRENGTH: Record<string, number> = {
  intent_expenses: 0.9,
  intent_cashflow: 0.2,
  intent_no_excel: 0.35,
  intent_reports: 0.15,
  intent_record: 0.8,
  intent_multi_account: 0.1,
  intent_best_app: 0.55,
  intent_excel_alt: 0.3,
  intent_collect_debt: 0.2,
  intent_freelancer: 0.5,
};

/* ------------------------------------------------------------------ */
/* Gaps / Oportunidades / Ações (Doc 4 §32–§33)                        */
/* ------------------------------------------------------------------ */

interface GapSeed {
  id: string;
  type: Gap['type'];
  intentId?: string;
  title: string;
  description: string;
  evidence: string[];
  impact: Gap['impact'];
  confidence: Confidence;
}

const GAP_SEEDS: GapSeed[] = [
  {
    id: 'gap_cashflow_absence',
    type: 'COVERAGE_GAP',
    intentId: 'intent_cashflow',
    title: 'Ausência crítica no intent “acompanhar fluxo de caixa”',
    description:
      'O produto não apareceu em nenhuma das 5 respostas analisadas para este intent, enquanto CaixaFácil e ContaSimples aparecem na maioria delas.',
    evidence: ['0 recomendações em 5 prompts do intent', 'Concorrente líder aparece em 68% das respostas do intent'],
    impact: 'HIGH',
    confidence: 'HIGH',
  },
  {
    id: 'gap_cashflow_evidence',
    type: 'EVIDENCE_GAP',
    intentId: 'intent_cashflow',
    title: 'Evidência externa limitada para fluxo de caixa',
    description:
      'Não foram encontradas fontes externas relevantes associando o produto ao problema de fluxo de caixa de pequenas empresas.',
    evidence: ['Força de evidência do produto: 0,2 (escala 0–1)', 'Concorrentes possuem páginas, artigos e threads dedicadas'],
    impact: 'HIGH',
    confidence: 'MEDIUM',
  },
  {
    id: 'gap_semantic',
    type: 'SEMANTIC_GAP',
    title: 'Produto caracterizado como ferramenta de uso pessoal',
    description:
      'As respostas observadas descrevem o produto com termos de uso pessoal (“simples”, “básico”), enquanto o posicionamento declarado é gestão financeira para pequenas empresas.',
    evidence: ['Characterização observada: simples, básico, pessoal', 'Posicionamento declarado: gestão financeira para PMEs'],
    impact: 'HIGH',
    confidence: 'MEDIUM',
  },
  {
    id: 'gap_reports',
    type: 'COMPETITIVE_GAP',
    intentId: 'intent_reports',
    title: 'ContaSimples domina o intent de relatórios financeiros',
    description: 'O produto aparece em 8% das respostas do intent; a ContaSimples aparece em 63%.',
    evidence: ['6% de share do produto no intent', 'Artigo externo destaca relatórios automáticos do concorrente'],
    impact: 'MEDIUM',
    confidence: 'HIGH',
  },
  {
    id: 'gap_compare_source',
    type: 'SOURCE_GAP',
    intentId: 'intent_excel_alt',
    title: 'Poucas comparações externas envolvendo o produto',
    description:
      'No intent comparativo “alternativa ao Excel”, as páginas comparativas observadas citam majoritariamente o GestorX.',
    evidence: ['Página comparativa independente lista apenas concorrentes', 'Share do produto: 12% no intent'],
    impact: 'MEDIUM',
    confidence: 'MEDIUM',
  },
];

const OPPORTUNITY_SEEDS: Array<{
  id: string;
  gapId: string;
  rank: number;
  title: string;
  description: string;
  impact: Opportunity['impact'];
  relevance: Opportunity['relevance'];
  confidence: Confidence;
  effort: Opportunity['effort'];
  priority: Opportunity['priority'];
}> = [
  {
    id: 'opp_1',
    gapId: 'gap_cashflow_absence',
    rank: 1,
    title: 'Assumir o intent “acompanhar fluxo de caixa”',
    description: 'Intent de alta relevância (5/5) onde o produto está ausente e dois concorrentes dominam as respostas.',
    impact: 'HIGH',
    relevance: 'HIGH',
    confidence: 'MEDIUM',
    effort: 'MEDIUM',
    priority: 'HIGH',
  },
  {
    id: 'opp_2',
    gapId: 'gap_semantic',
    rank: 2,
    title: 'Corrigir a caracterização “uso pessoal” para “empresarial”',
    description: 'Alinhamento semântico baixo (40/100) reduz a associação do produto com a intenção de gestão de PMEs.',
    impact: 'HIGH',
    relevance: 'HIGH',
    confidence: 'HIGH',
    effort: 'LOW',
    priority: 'HIGH',
  },
  {
    id: 'opp_3',
    gapId: 'gap_reports',
    rank: 3,
    title: 'Cobrir o intent de relatórios financeiros',
    description: 'Intent relevante (4/5) com presença quase nula e concorrente líder com forte evidência de conteúdo.',
    impact: 'MEDIUM',
    relevance: 'HIGH',
    confidence: 'MEDIUM',
    effort: 'MEDIUM',
    priority: 'MEDIUM',
  },
  {
    id: 'opp_4',
    gapId: 'gap_compare_source',
    rank: 4,
    title: 'Criar presença em páginas comparativas (Excel vs software)',
    description: 'Intent comparativo com evidência externa concentrada em um único concorrente.',
    impact: 'MEDIUM',
    relevance: 'MEDIUM',
    confidence: 'MEDIUM',
    effort: 'MEDIUM',
    priority: 'MEDIUM',
  },
];

const ACTION_SEEDS: Array<Omit<Action, 'id' | 'opportunityId'> & { opportunityId: string }> = [
  {
    opportunityId: 'opp_1',
    category: 'WEBSITE',
    problem: 'O produto não aparece em nenhuma resposta observada para “acompanhar fluxo de caixa”.',
    evidence:
      '5 prompts do intent executados, 0 recomendações; CaixaFácil lidera com 68% das respostas e possui artigo + página própria associando a marca a fluxo de caixa para PMEs.',
    hypothesis:
      'A ausência de associação explícita entre o produto e o termo “fluxo de caixa” nas fontes observadas pode estar reduzindo a presença no intent.',
    action:
      'Criar página específica sobre controle de fluxo de caixa para pequenas empresas e reforçar a associação no store listing e na homepage.',
    priority: 'HIGH',
    confidence: 'MEDIUM',
    validation: 'Monitorar o intent em nova auditoria após 2–4 semanas da alteração.',
  },
  {
    opportunityId: 'opp_2',
    category: 'POSITIONING',
    problem: 'O produto é descrito como ferramenta pessoal, não como gestão financeira empresarial.',
    evidence:
      'Characterização observada: “simples”, “básico”, “pessoal” em 3 fontes distintas; posicionamento declarado é “gestão financeira para pequenas empresas”.',
    hypothesis:
      'Sinais de uso pessoal nas fontes observadas podem estar deslocando o produto da categoria “gestão para empresas”.',
    action:
      'Reescrever store listing, homepage e materiais reforçando explicitamente “para pequenas empresas”, “do seu negócio” e casos de uso empresariais.',
    priority: 'HIGH',
    confidence: 'HIGH',
    validation: 'Comparar caracterização observada antes/depois na próxima auditoria.',
  },
  {
    opportunityId: 'opp_3',
    category: 'EVIDENCE',
    problem: 'No intent “relatórios financeiros”, o produto aparece em 8% das respostas contra 63% da ContaSimples.',
    evidence: 'Artigo externo de destaque para o concorrente; documentação do produto indexada, porém sem associação ao intent.',
    hypothesis: 'A funcionalidade de relatórios existe, mas está pouco representada em conteúdo externo e na documentação pública.',
    action: 'Publicar conteúdo demonstrando relatórios financeiros simples (artigo + vídeo curto) e destacar a funcionalidade no listing.',
    priority: 'MEDIUM',
    confidence: 'MEDIUM',
    validation: 'Observar presença e menção da funcionalidade em respostas futuras do intent.',
  },
  {
    opportunityId: 'opp_4',
    category: 'DISTRIBUTION',
    problem: 'Páginas comparativas observadas citam majoritariamente o GestorX como alternativa ao Excel.',
    evidence: 'Página comparativa independente não cita o produto; share do produto no intent comparativo: 12%.',
    hypothesis: 'A ausência em comparações públicas pode estar limitando a recomendação em intenções comparativas.',
    action: 'Criar página comparativa própria (planilha vs ferramenta) e buscar menções em sites de comparação do segmento.',
    priority: 'MEDIUM',
    confidence: 'MEDIUM',
    validation: 'Verificar menção em comparações externas e share no intent comparativo na próxima auditoria.',
  },
];

/* ------------------------------------------------------------------ */
/* Bundle                                                              */
/* ------------------------------------------------------------------ */

export function buildAuditBundle(args: {
  audit: Audit;
  product: Product;
  profile: ProductProfile;
  intents: Intent[];
  prompts: Prompt[];
}): AuditBundle {
  const { audit, product, profile, intents, prompts } = args;
  const selected = intents.filter((i) => i.selected);
  const relevant = selected.length > 0 ? selected : intents;

  /* Landscape */
  const landscape: IntentLandscapeRow[] = relevant.map((intent) => {
    const stat = statFor(intent);
    const level = presenceLevel(stat.presence);
    return {
      intentId: intent.id,
      intentName: intent.name,
      priority: intent.priority,
      presence: level,
      presenceValue: stat.presence,
      leader: stat.leader,
      leaderShare: stat.leaderShare,
      ourShare: stat.ourShare,
      gap: gapLevel(intent.relevance, stat.presence),
    };
  });

  const covered = landscape.filter((r) => r.presence !== 'AUSENTE').length;
  const coverage = Math.round((covered / Math.max(1, landscape.length)) * 100);

  /* Evidência */
  const evidence = buildEvidence(product);
  const evidenceCoverageByIntent = relevant.map((i) => ({
    intentId: i.id,
    intentName: i.name,
    strength: EVIDENCE_STRENGTH[i.id] ?? 0.25,
  }));
  const strongEvidence = evidenceCoverageByIntent.filter((e) => e.strength >= 0.5).length;
  const evidenceCoverage = Math.round((strongEvidence / Math.max(1, evidenceCoverageByIntent.length)) * 100);

  /* Scores */
  const share = Math.round((OUR_RECOMMENDATIONS / RESPONSES_RELEVANT) * 100);
  const scores = buildScores(audit, coverage, share, evidenceCoverage);

  /* Distribuição de classificações */
  const distribution: RecommendationDistribution[] = [
    { eventType: 'RECOMMENDATION', label: 'Recomendado', count: OUR_RECOMMENDATIONS },
    { eventType: 'ALTERNATIVE', label: 'Alternativa', count: 9 },
    { eventType: 'COMPARISON', label: 'Comparado', count: 6 },
    { eventType: 'MENTION', label: 'Menção', count: 14 },
    { eventType: 'NEGATIVE', label: 'Negativo', count: 3 },
    { eventType: 'IRRELEVANT', label: 'Irrelevante', count: 8 },
  ];

  /* Concorrentes */
  const topIntentsByComp: Record<string, string[]> = {
    comp_contasimples: ['Controlar despesas', 'Relatórios', 'Melhor app financeiro'],
    comp_caixafacil: ['Fluxo de caixa', 'Várias contas'],
    comp_gestorx: ['Sem Excel', 'Alternativa ao Excel'],
    comp_meucaixa: ['Cobrança', 'Autônomos'],
    comp_orcamais: ['Orçamento'],
    comp_fintrack: ['Registro diário'],
  };
  const charByComp: Record<string, string[]> = {
    comp_contasimples: ['profissional', 'completo', 'integrado'],
    comp_caixafacil: ['fluxo de caixa', 'visual', 'tempo real'],
    comp_gestorx: ['alternativa ao Excel', 'planilhas', 'migração'],
    comp_meucaixa: ['autônomo', 'simples', 'cobrança'],
    comp_orcamais: ['orçamento', 'planejamento'],
    comp_fintrack: ['rápido', 'direto'],
  };
  const sourcesByComp: Record<string, string[]> = {
    comp_contasimples: ['contasimples.com', 'reddit.com', 'financasparapme.com.br'],
    comp_caixafacil: ['caixafacil.app', 'aplicativosbr.com', 'youtube.com'],
    comp_gestorx: ['gestorx.io', 'versoes.app', 'youtube.com'],
    comp_meucaixa: ['meucaixa.app', 'empreendedores.info'],
    comp_orcamais: ['orcamais.com.br'],
    comp_fintrack: ['fintrack.tools'],
  };
  const shares: Record<string, number> = {
    subject: 24,
    comp_contasimples: 57,
    comp_caixafacil: 43,
    comp_gestorx: 21,
    comp_meucaixa: 15,
    comp_orcamais: 11,
    comp_fintrack: 7,
  };
  const coverageByComp: Record<string, number> = {
    subject: covered,
    comp_contasimples: 8,
    comp_caixafacil: 7,
    comp_gestorx: 5,
    comp_meucaixa: 4,
    comp_orcamais: 3,
    comp_fintrack: 2,
  };
  const avgPos: Record<string, number> = {
    subject: 2.6,
    comp_contasimples: 1.9,
    comp_caixafacil: 2.3,
    comp_gestorx: 2.9,
    comp_meucaixa: 3.4,
    comp_orcamais: 3.8,
    comp_fintrack: 4.2,
  };

  const competitorSnapshots: CompetitorSnapshot[] = [
    {
      id: 'subject',
      name: product.name,
      isSubject: true,
      recommendationShare: shares.subject,
      coverage: covered,
      coverageTotal: landscape.length,
      avgPosition: avgPos.subject,
      topIntents: landscape.filter((l) => l.ourShare > 20).slice(0, 3).map((l) => l.intentName),
      characterizations: ['simples', 'básico', 'pessoal'],
      recurringSources: ['play.google.com', 'fluxoapp.com.br', 'aplicativosbr.com'],
    },
    ...COMPETITORS.map((c) => ({
      id: c.id,
      name: c.name,
      isSubject: false,
      recommendationShare: shares[c.id] ?? 10,
      coverage: coverageByComp[c.id] ?? 3,
      coverageTotal: landscape.length,
      avgPosition: avgPos[c.id] ?? 3.5,
      topIntents: topIntentsByComp[c.id] ?? [],
      characterizations: charByComp[c.id] ?? [],
      recurringSources: sourcesByComp[c.id] ?? [],
    })),
  ].sort((a, b) => b.recommendationShare - a.recommendationShare);

  /* Gaps / oportunidades / ações */
  const gaps: Gap[] = GAP_SEEDS.map((g) => ({ ...g, auditId: audit.id }));
  const opportunities: Opportunity[] = OPPORTUNITY_SEEDS;
  const actions: Action[] = ACTION_SEEDS.map((a, i) => ({
    ...a,
    id: `action_${i + 1}`,
    opportunityId: a.opportunityId,
  }));

  /* Raw evidence */
  const selectedIds = new Set(relevant.map((i) => i.id));
  const rawEvidence = prompts
    .filter((p) => selectedIds.has(p.intentId))
    .slice(0, 10)
    .map((p, i) => {
      const intent = relevant.find((x) => x.id === p.intentId)!;
      const stat = statFor(intent);
      const appears = (hash(p.id) % 100) < stat.presence;
      const eventType = appears ? (i % 3 === 0 ? 'RECOMMENDATION' : i % 3 === 1 ? 'ALTERNATIVE' : 'MENTION') : 'IRRELEVANT';
      const competitors = ['ContaSimples', 'CaixaFácil', 'GestorX', 'MeuCaixa'];
      const mentioned = [
        appears ? product.name : null,
        competitors[i % competitors.length],
        competitors[(i + 1) % competitors.length],
      ]
        .filter(Boolean)
        .join(', ');
      return {
        id: `raw_${i + 1}`,
        prompt: p.text,
        intentName: intent.name,
        responseExcerpt: appears
          ? `“Para ${intent.name.toLowerCase()}, ${product.name} é uma opção simples; também considere ${competitors[i % competitors.length]}…”`
          : `“Para este problema, ${competitors[i % competitors.length]} e ${competitors[(i + 1) % competitors.length]} são as opções mais citadas…”`,
        productsMentioned: mentioned,
        ourPosition: appears ? 1 + (i % 4) : null,
        eventType: eventType as (typeof distribution)[number]['eventType'],
        sources: SOURCES.slice(i % 4, (i % 4) + 2).map((s) => s.domain),
      };
    });

  return {
    audit,
    product,
    profile,
    intents,
    prompts,
    competitors: COMPETITORS,
    landscape,
    competitorSnapshots,
    distribution,
    scores,
    semanticAlignment: {
      intendedPositioning: 'Gestão financeira para pequenas empresas',
      observedCharacterization: 'Aplicativo de controle de gastos pessoais',
      verdict: 'GAP',
      explanation:
        'As respostas observadas associam o produto a uso pessoal em pelo menos 3 fontes, enquanto a intenção estratégica é a categoria “gestão para pequenas empresas”.',
    },
    characterizations: {
      [product.name]: ['simples', 'básico', 'pessoal'],
      ContaSimples: ['profissional', 'completo', 'integrado'],
      CaixaFácil: ['fluxo de caixa', 'visual', 'tempo real'],
      GestorX: ['alternativa ao Excel', 'planilhas', 'migração'],
    },
    sources: SOURCES,
    evidence,
    evidenceCoverageByIntent,
    gaps,
    opportunities,
    actions,
    executiveSummary: {
      headline: 'Presença consistente em controle de despesas, ausência crítica em fluxo de caixa e caracterização enviesada para uso pessoal.',
      status: 'DISCOVERABILITY PARCIAL — GAPS PRIORITÁRIOS IDENTIFICADOS',
      observations: [
        `${OUR_RECOMMENDATIONS} de ${RESPONSES_RELEVANT} respostas relevantes recomendaram o produto (Recommendation Share de ${share}%).`,
        `${covered} de ${landscape.length} intents relevantes com presença observável (Intent Coverage de ${coverage}%).`,
        `ContaSimples é o concorrente mais presente (57% das respostas relevantes); ${product.name} ocupa a 3ª posição entre 7 produtos.`,
        `Ausência total no intent “acompanhar fluxo de caixa”, de relevância máxima (5/5).`,
      ],
      evidenceSummary:
        'As respostas que recomendam concorrentes citam repetidamente páginas próprias, artigos e threads de comunidade associadas a fluxo de caixa e relatórios; o produto possui evidência forte apenas nos intents de despesas e registro.',
      hypothesis:
        'A menor presença em intents de alto valor pode estar relacionada à baixa cobertura de evidências externas e à caracterização do produto como ferramenta de uso pessoal.',
      recommendedFocus:
        'Testar primeiro a associação explícita entre o produto e “fluxo de caixa para pequenas empresas” (listing + página própria), medindo o intent em nova auditoria.',
    },
    methodology: {
      methodologyVersion: METHODOLOGY_VERSION,
      promptSetVersion: PROMPT_SET_VERSION,
      scoringVersion: SCORING_VERSION,
      provider: AUDIT_PROVIDER,
      model: AUDIT_MODEL,
      market: audit.market,
      language: audit.language,
      analysisDate: ANALYSIS_DATE,
      intentsTotal: intents.length,
      intentsAnalyzed: relevant.length,
      promptsTotal: prompts.length,
      responsesRelevant: RESPONSES_RELEVANT,
      sampleSize: `${prompts.length} prompts × 1 execução`,
      limitations: [
        'Execuções simuladas nesta fase (sem providers reais conectados).',
        'Amostra controlada conforme Documento 3, §20 (50–200 observações por auditoria).',
        'Resultados referem-se ao mercado/idioma configurados na auditoria.',
        'Recomendações de sistemas de IA são probabilísticas: uma fotografia não representa verdade universal.',
      ],
    },
    rawEvidence,
  };
}

/* ------------------------------------------------------------------ */
/* Intents / prompts a partir do catálogo                              */
/* ------------------------------------------------------------------ */

export function catalogIntents(auditId: string): Intent[] {
  return INTENT_CATALOG.map((item) => ({
    id: item.id,
    auditId,
    name: item.name,
    description: item.description,
    problem: item.problem,
    audience: item.audience,
    context: item.context,
    category: item.category,
    priority: item.priority,
    relevance: item.relevance,
    source: 'AI_GENERATED',
    confidence: item.relevance >= 4 ? 'HIGH' : 'MEDIUM',
    selected: true,
  }));
}

export function catalogPrompts(intents: Intent[], audit: Audit): Prompt[] {
  const out: Prompt[] = [];
  for (const intent of intents) {
    const item = INTENT_CATALOG.find((c) => c.id === intent.id);
    const texts = item?.prompts ?? [intent.name];
    texts.forEach((text, i) => {
      out.push({
        id: `prompt_${intent.id}_${i + 1}`,
        intentId: intent.id,
        text,
        language: audit.language,
        market: audit.market,
        variationType: (['DIRECT', 'PROBLEM_BASED', 'CONVERSATIONAL', 'CONTEXTUAL', 'COMPARATIVE'] as const)[i % 5],
        version: PROMPT_SET_VERSION,
        active: true,
      });
    });
  }
  return out;
}
