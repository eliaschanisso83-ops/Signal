import type { AuditService } from './contracts';
import { MockAuditService } from './mock/auditService';

/**
 * Service locator.
 *
 * FASE ATUAL: apenas mocks (sem chamadas externas reais).
 * FASE POSTERIOR: substituir a implementação por um cliente HTTP
 * do backend — os componentes não precisam mudar.
 */
export const auditService: AuditService = new MockAuditService();

export { buildAuditBundle } from './mock/report';
export type { AuditService };
