import type { AuditService } from './contracts';
import { MockAuditService } from './mock/auditService';

/**
 * Service locator.
 *
 * FASE ATUAL: apenas mocks (sem chamadas externas reais).
 * FASE POSTERIOR: substituir a implementação por um cliente HTTP
 * do backend — os componentes não precisam mudar.
 *
 * Supabase já está conectado: cliente sob demanda em `./supabase`
 * (`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`, via `.env.local` ou
 * Vercel; o SDK só é baixado na primeira chamada a `getSupabase()`).
 * O ponto de troca é exatamente esta linha: quando as tabelas do
 * projeto existirem, trocar `new MockAuditService()` por um adaptador que
 * lê/escreve no Supabase — o contrato `AuditService` e os componentes
 * permanecem os mesmos.
 */
export const auditService: AuditService = new MockAuditService();

export { getSupabase, supabaseEnabled } from './supabase';
export { saveAuditRun } from './auditRuns';
export { buildAuditBundle } from './mock/report';
export type { AuditService };
