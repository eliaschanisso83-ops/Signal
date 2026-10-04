/**
 * MockAuditService — implementação simulada de AuditService.
 * NENHUMA chamada externa real é feita nesta fase.
 * Latências simuladas para exercitar estados de loading da UI.
 */

import type { AuditService } from '../contracts';
import type { Audit, AuditBundle, NewAuditInput } from '../../domain/types';
import {
  METHODOLOGY_VERSION,
  PROMPT_SET_VERSION,
  buildProduct,
  buildProfile,
} from './catalog';
import { buildAuditBundle, catalogIntents, catalogPrompts } from './report';

interface Draft {
  audit: Audit;
  product: ReturnType<typeof buildProduct>;
  profile: ReturnType<typeof buildProfile>;
  intents: ReturnType<typeof catalogIntents>;
  prompts: ReturnType<typeof catalogPrompts>;
}

const store = new Map<string, Draft>();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockAuditService implements AuditService {
  async createAudit(input: NewAuditInput) {
    await delay(700);

    const auditId = `audit_${Date.now().toString(36)}`;
    const product = buildProduct({ ...input, auditId });
    const profile = buildProfile(product.id);
    const audit: Audit = {
      id: auditId,
      productId: product.id,
      methodologyVersion: METHODOLOGY_VERSION,
      promptSetVersion: PROMPT_SET_VERSION,
      market: input.market,
      language: input.language,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    };
    const intents = catalogIntents(auditId);
    const prompts = catalogPrompts(intents, audit);

    store.set(auditId, { audit, product, profile, intents, prompts });

    return { audit, product, profile, intents, prompts };
  }

  async getAuditBundle(auditId: string): Promise<AuditBundle> {
    await delay(500);
    const draft = store.get(auditId);
    if (!draft) {
      // Estado esperado apenas em recarregamento de página (perda do Map em memória).
      throw new Error('AUDIT_NOT_FOUND');
    }
    return buildAuditBundle(draft);
  }
}
