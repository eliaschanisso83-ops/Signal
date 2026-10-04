/**
 * Service contracts — Documento 6, §32 (External Provider Layer).
 *
 * ESTA FASE NÃO IMPLEMENTA NENHUM DESTES PROVIDERS.
 * Aqui ficam apenas os contratos, para que a UI seja construída
 * sobre interfaces e possa trocar mocks por serviços reais sem
 * reconstruir componentes.
 */

import type { AuditBundle, Audit, Product, ProductProfile, Intent, Prompt, NewAuditInput } from '../domain/types';

/** Doc 6 §10–§11 — obtém dados do produto (website, loja, etc.). */
export interface ProductProvider {
  fetchProductProfile(url: string): Promise<Product>;
  normalizeProfile(product: Product): Promise<ProductProfile>;
}

/** Doc 6 §32 — executa consultas em ambientes de descoberta. */
export interface DiscoveryProvider {
  execute(prompt: string, config: { market: string; language: string; model?: string }): Promise<string>;
}

/** Doc 6 §19 — obtém fontes/evidências relevantes. */
export interface SearchSourceProvider {
  findSources(query: string, intentId: string): Promise<void>;
}

/** Doc 6 §47 — classificação/interpretação estruturada. */
export interface AnalysisProvider {
  classifyResponse(raw: string): Promise<void>;
}

/**
 * Caso de uso da aplicação (Doc 6 §7, Application Layer).
 * A UI consome somente esta interface.
 */
export interface AuditService {
  createAudit(input: NewAuditInput): Promise<{
    audit: Audit;
    product: Product;
    profile: ProductProfile;
    intents: Intent[];
    prompts: Prompt[];
  }>;
  getAuditBundle(auditId: string): Promise<AuditBundle>;
}
