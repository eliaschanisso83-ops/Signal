/**
 * Domain types — Documento 6 (Arquitetura Técnica), camada Domain.
 * Estes tipos são o contrato compartilhado entre UI, mocks e,
 * futuramente, o backend real. Não derivar estruturas incompatíveis
 * com os documentos de especificação.
 */

export type AuditStatus =
  | 'DRAFT'
  | 'QUEUED'
  | 'RUNNING'
  | 'ANALYZING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type IntentType =
  | 'INFORMATIONAL'
  | 'EXPLORATORY'
  | 'COMMERCIAL'
  | 'TRANSACTIONAL'
  | 'COMPARATIVE'
  | 'PROBLEM_SPECIFIC';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type PromptVariationType =
  | 'DIRECT'
  | 'CONVERSATIONAL'
  | 'COMPARATIVE'
  | 'PROBLEM_BASED'
  | 'ROLE_BASED'
  | 'CONTEXTUAL';

export type RecommendationEventType =
  | 'RECOMMENDATION'
  | 'ALTERNATIVE'
  | 'COMPARISON'
  | 'MENTION'
  | 'NEGATIVE'
  | 'IRRELEVANT';

export type SourceCategory = 'OWNED' | 'EARNED' | 'COMMUNITY' | 'PLATFORM' | 'OTHER';

export type GapType =
  | 'RECOMMENDATION_GAP'
  | 'COVERAGE_GAP'
  | 'EVIDENCE_GAP'
  | 'SEMANTIC_GAP'
  | 'COMPETITIVE_GAP'
  | 'SOURCE_GAP'
  | 'POSITIONING_GAP'
  | 'CONVERSION_GAP';

export type ActionCategory =
  | 'POSITIONING'
  | 'STORE'
  | 'WEBSITE'
  | 'EVIDENCE'
  | 'COMMUNITY'
  | 'PRODUCT'
  | 'DISTRIBUTION';

export type Platform = 'GOOGLE_PLAY' | 'APP_STORE' | 'WEB' | 'SAAS' | 'DESKTOP';

export type IntentSource = 'AI_GENERATED' | 'USER_ADDED' | 'USER_EDITED' | 'HISTORICAL';

/** Doc 6 §10 */
export interface Product {
  id: string;
  name: string;
  url: string;
  platform: Platform;
  category: string;
  description: string;
  targetAudience: string;
  country: string;
  language: string;
  competitors: string[];
  createdAt: string;
}

/** Doc 6 §11 — interpretação normalizada (não é verdade absoluta) */
export interface ProductProfile {
  productId: string;
  valueProposition: string;
  features: string[];
  useCases: string[];
  audiences: string[];
  problemsSolved: string[];
  categories: string[];
  keywords: string[];
  semanticEntities: string[];
  competitors: string[];
  markets: string[];
  languages: string[];
}

/** Doc 6 §12 */
export interface Audit {
  id: string;
  productId: string;
  methodologyVersion: string;
  promptSetVersion: string;
  market: string;
  language: string;
  status: AuditStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

/** Doc 6 §13 — unidade fundamental */
export interface Intent {
  id: string;
  auditId: string;
  name: string;
  description: string;
  problem: string;
  audience: string;
  context: string;
  category: IntentType;
  priority: Priority;
  /** Relevância 1–5 (Documento 3, §11) */
  relevance: number;
  source: IntentSource;
  confidence: Confidence;
  selected: boolean;
}

/** Doc 6 §14 — Intent ≠ Prompt */
export interface Prompt {
  id: string;
  intentId: string;
  text: string;
  language: string;
  market: string;
  variationType: PromptVariationType;
  version: string;
  active: boolean;
}

/** Doc 6 §15 */
export interface Execution {
  id: string;
  promptId: string;
  auditId: string;
  provider: string;
  model: string;
  market: string;
  language: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  latencyMs: number;
  cost: number;
}

/** Doc 6 §16 */
export interface Response {
  id: string;
  executionId: string;
  rawResponse: string;
  normalizedResponse: string;
  createdAt: string;
}

/** Doc 6 §17 — Recommendation Event */
export interface RecommendationEvent {
  id: string;
  responseId: string;
  productId: string;
  competitorId?: string;
  subjectId: string;
  subjectName: string;
  eventType: RecommendationEventType;
  position: number | null;
  context: string;
  confidence: Confidence;
}

/** Doc 6 §18 */
export interface Competitor {
  id: string;
  name: string;
  canonicalUrl: string;
  platform: Platform;
  category: string;
  observed: boolean;
}

/** Doc 6 §19 */
export interface Source {
  id: string;
  name: string;
  url: string;
  domain: string;
  category: SourceCategory;
}

/** Doc 6 §20 */
export interface Evidence {
  id: string;
  sourceId: string;
  intentId?: string;
  subjectId: string;
  subjectName: string;
  claim: string;
  context: string;
  relevance: number;
  specificity: number;
  credibility: number;
  freshness: number;
  independence: number;
  confidence: Confidence;
}

/** Doc 6 §22 */
export interface Gap {
  id: string;
  auditId: string;
  type: GapType;
  intentId?: string;
  competitorId?: string;
  title: string;
  description: string;
  evidence: string[];
  impact: Priority;
  confidence: Confidence;
}

/** Doc 6 §23 */
export interface Opportunity {
  id: string;
  gapId: string;
  rank: number;
  title: string;
  description: string;
  impact: Priority;
  relevance: Priority;
  confidence: Confidence;
  effort: Priority;
  priority: Priority;
}

/** Doc 6 §24 — rastreabilidade: Action → Opportunity → Gap → Evidence */
export interface Action {
  id: string;
  opportunityId: string;
  category: ActionCategory;
  problem: string;
  evidence: string;
  hypothesis: string;
  action: string;
  priority: Priority;
  confidence: Confidence;
  validation: string;
}

/** Doc 6 §25 — score sempre com fórmula/versão/confiança/explicação */
export interface Score {
  id: string;
  auditId: string;
  metric: string;
  value: number;
  displayValue: string;
  formulaVersion: string;
  methodologyVersion: string;
  confidence: Confidence;
  explanation: string;
}

export type PresenceLevel = 'ALTA' | 'MEDIA' | 'BAIXA' | 'AUSENTE';

/** Linha do Intent Landscape (Doc 4 §25) */
export interface IntentLandscapeRow {
  intentId: string;
  intentName: string;
  priority: Priority;
  presence: PresenceLevel;
  presenceValue: number;
  leader: string;
  leaderShare: number;
  ourShare: number;
  gap: 'Baixo' | 'Médio' | 'Alto';
}

/** Doc 4 §26 */
export interface CompetitorSnapshot {
  id: string;
  name: string;
  isSubject: boolean;
  recommendationShare: number;
  coverage: number;
  coverageTotal: number;
  avgPosition: number;
  topIntents: string[];
  characterizations: string[];
  recurringSources: string[];
}

export type CharacterizationMap = Record<string, string[]>;

/** Doc 4 §31 */
export interface SemanticAlignment {
  intendedPositioning: string;
  observedCharacterization: string;
  verdict: 'ALIGNED' | 'PARTIAL' | 'GAP';
  explanation: string;
}

/** Doc 4 §35 */
export interface ExecutiveSummary {
  headline: string;
  status: string;
  observations: string[];
  evidenceSummary: string;
  hypothesis: string;
  recommendedFocus: string;
}

/** Distribuição de classificações de menção (Doc 3 §27) */
export interface RecommendationDistribution {
  eventType: RecommendationEventType;
  label: string;
  count: number;
}

/** Snapshot metodológico exibido em Methodology (Doc 3 §17/§22) */
export interface MethodologySnapshot {
  methodologyVersion: string;
  promptSetVersion: string;
  scoringVersion: string;
  provider: string;
  model: string;
  market: string;
  language: string;
  analysisDate: string;
  intentsTotal: number;
  intentsAnalyzed: number;
  promptsTotal: number;
  responsesRelevant: number;
  sampleSize: string;
  limitations: string[];
}

/** Linha de Raw Evidence (Doc 4 §36) */
export interface RawEvidenceRow {
  id: string;
  prompt: string;
  intentName: string;
  responseExcerpt: string;
  productsMentioned: string;
  ourPosition: number | null;
  eventType: RecommendationEventType;
  sources: string[];
}

/** Empacota tudo que o relatório consome (resultado de getAuditBundle) */
export interface AuditBundle {
  audit: Audit;
  product: Product;
  profile: ProductProfile;
  intents: Intent[];
  prompts: Prompt[];
  competitors: Competitor[];
  landscape: IntentLandscapeRow[];
  competitorSnapshots: CompetitorSnapshot[];
  distribution: RecommendationDistribution[];
  scores: Score[];
  semanticAlignment: SemanticAlignment;
  characterizations: CharacterizationMap;
  sources: Source[];
  evidence: Evidence[];
  evidenceCoverageByIntent: { intentId: string; intentName: string; strength: number }[];
  gaps: Gap[];
  opportunities: Opportunity[];
  actions: Action[];
  executiveSummary: ExecutiveSummary;
  methodology: MethodologySnapshot;
  rawEvidence: RawEvidenceRow[];
}

/** Doc 4 §9 — entrada do usuário */
export interface NewAuditInput {
  productUrl: string;
  productName?: string;
  platform: Platform;
  market: string;
  language: string;
  category?: string;
  competitors: string[];
  audience?: string;
}
