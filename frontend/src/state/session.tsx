/**
 * Sessão do audit — estado da experiência (Doc 4 §8, fluxo principal).
 *
 * Persistida em sessionStorage para sobreviver a reloads.
 * A troca por um backend real se dá apenas substituindo as chamadas
 * a `auditService` — os componentes não mudam.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  Audit,
  AuditBundle,
  AuditStatus,
  Intent,
  NewAuditInput,
  Product,
  ProductProfile,
  Prompt,
} from '../domain/types';
import { auditService, buildAuditBundle, saveAuditRun } from '../services';

export interface SessionDraft {
  audit: Audit;
  product: Product;
  profile: ProductProfile;
  intents: Intent[];
  prompts: Prompt[];
}

/** Etapas conceituais exibidas durante o processamento (Doc 4 §40). */
export const PIPELINE_STEPS = [
  'Preparando a análise',
  'Testando ambientes de descoberta',
  'Analisando recomendações',
  'Analisando evidências',
  'Identificando gaps',
  'Gerando oportunidades',
  'Relatório pronto',
] as const;

interface SessionState {
  draft: SessionDraft | null;
  bundle: AuditBundle | null;
  status: AuditStatus;
  stepIndex: number;
  error: string | null;
}

interface SessionContextValue extends SessionState {
  createAudit: (input: NewAuditInput) => Promise<string>;
  startAudit: () => void;
  retryAudit: () => void;
  resetSession: () => void;
  updateProfile: (patch: Partial<ProductProfile>) => void;
  updateIntent: (id: string, patch: Partial<Intent>) => void;
  removeIntent: (id: string) => void;
  addIntent: (name: string) => void;
  updatePrompt: (id: string, patch: Partial<Prompt>) => void;
  removePrompt: (id: string) => void;
  addPrompt: (intentId: string, text: string) => void;
  isRestoring: boolean;
}

const STORAGE_KEY = 'signal.audit-session.v1';

const SessionContext = createContext<SessionContextValue | null>(null);

function loadInitial(): SessionState {
  const empty: SessionState = { draft: null, bundle: null, status: 'DRAFT', stepIndex: 0, error: null };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as SessionState;
    if (!parsed.draft) return empty;
    // Relatório reconstruído localmente a partir do rascunho persistido.
    const bundle =
      parsed.status === 'COMPLETED' ? buildAuditBundle(parsed.draft) : null;
    return { ...parsed, bundle, error: null };
  } catch {
    return empty;
  }
}

let customCounter = 0;

export function AuditSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(loadInitial);
  const [isRestoring, setIsRestoring] = useState(false);
  const finishingRef = useRef(false);

  /* ---- persistência ---- */
  useEffect(() => {
    try {
      const { draft, status, stepIndex } = state;
      const toSave: SessionState = { draft, bundle: null, status, stepIndex, error: null };
      if (draft) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* armazenamento indisponível — segue sem persistir */
    }
  }, [state]);

  /* ---- máquina de execução ---- */
  useEffect(() => {
    const { draft, status } = state;
    if (!draft) return;

    if (status === 'QUEUED') {
      const t = window.setTimeout(() => {
        setState((s) => ({ ...s, status: 'RUNNING' }));
      }, 800);
      return () => window.clearTimeout(t);
    }

    if (status === 'RUNNING' || status === 'ANALYZING') {
      if (finishingRef.current) return;
      const t = window.setTimeout(() => {
        const next = state.stepIndex + 1;
        if (next >= PIPELINE_STEPS.length - 1) {
          void finish();
        } else {
          setState((s) => ({
            ...s,
            stepIndex: next,
            status: next >= 4 ? 'ANALYZING' : 'RUNNING',
          }));
        }
      }, 850);
      return () => window.clearTimeout(t);
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, state.stepIndex, state.draft]);

  const finish = useCallback(async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setState((s) => (s.draft ? { ...s, status: 'ANALYZING', stepIndex: PIPELINE_STEPS.length - 1 } : s));

    const draft = state.draft;
    if (!draft) {
      finishingRef.current = false;
      return;
    }

    let bundle: AuditBundle;
    try {
      bundle = await auditService.getAuditBundle(draft.audit.id);
    } catch {
      // Fallback: reconstrói o bundle do rascunho local (ex.: reload da página).
      bundle = buildAuditBundle(draft);
    }

    setState((s) => ({
      ...s,
      bundle,
      status: 'COMPLETED',
      error: null,
      draft: s.draft
        ? { ...s.draft, audit: { ...s.draft.audit, status: 'COMPLETED', completedAt: new Date().toISOString() } }
        : s.draft,
    }));
    // Persistência opcional (Supabase `public.audit_runs`): fire-and-forget,
    // sem env/em teste é no-op — nunca atrasa nem quebra a conclusão.
    void saveAuditRun({
      auditId: draft.audit.id,
      productUrl: draft.product.url,
      platform: draft.product.platform,
      market: draft.audit.market,
      language: draft.audit.language,
      competitors: draft.product.competitors,
      bundle,
    });
    finishingRef.current = false;
    setIsRestoring(false);
  }, [state.draft]);

  /* ---- ações ---- */
  const createAudit = useCallback(async (input: NewAuditInput) => {
    setIsRestoring(true);
    const created = await auditService.createAudit(input);
    finishingRef.current = false;
    setState({
      draft: created,
      bundle: null,
      status: 'DRAFT',
      stepIndex: 0,
      error: null,
    });
    setIsRestoring(false);
    return created.audit.id;
  }, []);

  const startAudit = useCallback(() => {
    finishingRef.current = false;
    setState((s) =>
      s.draft
        ? {
            ...s,
            status: 'QUEUED',
            stepIndex: 0,
            bundle: null,
            error: null,
            draft: { ...s.draft, audit: { ...s.draft.audit, status: 'QUEUED', startedAt: new Date().toISOString() } },
          }
        : s,
    );
  }, []);

  const retryAudit = useCallback(() => startAudit(), [startAudit]);

  const resetSession = useCallback(() => {
    finishingRef.current = false;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setState({ draft: null, bundle: null, status: 'DRAFT', stepIndex: 0, error: null });
  }, []);

  const syncDraft = useCallback((fn: (draft: SessionDraft) => SessionDraft) => {
    setState((s) => (s.draft ? { ...s, draft: fn(s.draft) } : s));
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<ProductProfile>) => {
      syncDraft((d) => ({ ...d, profile: { ...d.profile, ...patch } }));
    },
    [syncDraft],
  );

  const updateIntent = useCallback(
    (id: string, patch: Partial<Intent>) => {
      syncDraft((d) => ({
        ...d,
        intents: d.intents.map((i) =>
          i.id === id ? { ...i, ...patch, source: patch.source ?? (i.source === 'AI_GENERATED' ? 'USER_EDITED' : i.source) } : i,
        ),
      }));
    },
    [syncDraft],
  );

  const removeIntent = useCallback(
    (id: string) => {
      syncDraft((d) => ({
        ...d,
        intents: d.intents.filter((i) => i.id !== id),
        prompts: d.prompts.filter((p) => p.intentId !== id),
      }));
    },
    [syncDraft],
  );

  const addIntent = useCallback(
    (name: string) => {
      customCounter += 1;
      const id = `intent_custom_${Date.now().toString(36)}_${customCounter}`;
      syncDraft((d) => {
        const intent: Intent = {
          id,
          auditId: d.audit.id,
          name: name.trim(),
          description: 'Intent adicionado manualmente pelo usuário.',
          problem: name.trim(),
          audience: d.product.targetAudience,
          context: 'Adicionado na revisão do audit',
          category: 'EXPLORATORY',
          priority: 'MEDIUM',
          relevance: 3,
          source: 'USER_ADDED',
          confidence: 'LOW',
          selected: true,
        };
        const prompt: Prompt = {
          id: `prompt_${id}_1`,
          intentId: id,
          text: name.trim(),
          language: d.audit.language,
          market: d.audit.market,
          variationType: 'DIRECT',
          version: d.audit.promptSetVersion,
          active: true,
        };
        return { ...d, intents: [...d.intents, intent], prompts: [...d.prompts, prompt] };
      });
    },
    [syncDraft],
  );

  const updatePrompt = useCallback(
    (id: string, patch: Partial<Prompt>) => {
      syncDraft((d) => ({ ...d, prompts: d.prompts.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
    },
    [syncDraft],
  );

  const removePrompt = useCallback(
    (id: string) => {
      syncDraft((d) => ({ ...d, prompts: d.prompts.filter((p) => p.id !== id) }));
    },
    [syncDraft],
  );

  const addPrompt = useCallback(
    (intentId: string, text: string) => {
      customCounter += 1;
      syncDraft((d) => {
        const prompt: Prompt = {
          id: `prompt_${intentId}_${Date.now().toString(36)}_${customCounter}`,
          intentId,
          text: text.trim(),
          language: d.audit.language,
          market: d.audit.market,
          variationType: 'DIRECT',
          version: d.audit.promptSetVersion,
          active: true,
        };
        return { ...d, prompts: [...d.prompts, prompt] };
      });
    },
    [syncDraft],
  );

  const value = useMemo<SessionContextValue>(
    () => ({
      ...state,
      isRestoring,
      createAudit,
      startAudit,
      retryAudit,
      resetSession,
      updateProfile,
      updateIntent,
      removeIntent,
      addIntent,
      updatePrompt,
      removePrompt,
      addPrompt,
    }),
    [
      state,
      isRestoring,
      createAudit,
      startAudit,
      retryAudit,
      resetSession,
      updateProfile,
      updateIntent,
      removeIntent,
      addIntent,
      updatePrompt,
      removePrompt,
      addPrompt,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useAuditSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useAuditSession deve ser usado dentro de AuditSessionProvider');
  return ctx;
}
