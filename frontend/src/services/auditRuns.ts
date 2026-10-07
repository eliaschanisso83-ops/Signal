/**
 * Persistência da auditoria concluída em `public.audit_runs` (Supabase).
 *
 * Garantias:
 * - Fire-and-forget: o chamador usa `void saveAuditRun(...)`; nada aqui pode
 *   travar ou quebrar a UI (todo erro vira `false`, com `console.warn`).
 * - Sem env (`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`) ou em modo teste
 *   a gravação é simplesmente pulada — dev sem `.env.local` e a suíte de testes
 *   seguem 100% offline.
 * - A tabela é **insert-only** (RLS com policy de INSERT para `anon`, sem
 *   SELECT): por isso a chamada NÃO usa `select(...).single()` nem
 *   `Prefer: return=representation` — `RETURNING` exigiria política de leitura
 *   e falharia com 42501.
 *
 * Leitura (histórico/timeline) só entra quando existir autenticação; hoje o
 * papel `anon` tem permissão de SELECT no banco, mas sem policy de SELECT as
 * linhas voltam vazias — de propósito, enquanto não há usuário identificado.
 */
import type { AuditBundle } from '../domain/types';
import { getSupabase, supabaseEnabled } from './supabase';

/** Métrica canônica do score principal (Doc 6 §25). */
const DISCOVERABILITY_METRIC = 'Discoverability Score';

export interface AuditRunPayload {
  auditId: string;
  productUrl: string;
  platform: string;
  market: string;
  language: string;
  competitors: string[];
  bundle: AuditBundle;
}

/** Grava uma linha em `public.audit_runs`. true = gravado; false = pulado/erro. */
export async function saveAuditRun(payload: AuditRunPayload): Promise<boolean> {
  if (!supabaseEnabled) return false;
  if (import.meta.env.MODE === 'test') return false;

  const { auditId, productUrl, platform, market, language, competitors, bundle } = payload;
  const supabase = await getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('audit_runs').insert({
      audit_id: auditId,
      product_url: productUrl,
      score: bundle.scores.find((s) => s.metric === DISCOVERABILITY_METRIC)?.value ?? null,
      method_version: bundle.methodology.methodologyVersion,
      scoring_version: bundle.methodology.scoringVersion,
      input: { productUrl, platform, market, language, competitors },
      bundle,
    });
    if (error) {
      console.warn('[supabase] audit_runs não gravado:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[supabase] audit_runs falhou:', e instanceof Error ? e.message : e);
    return false;
  }
}
