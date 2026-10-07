/**
 * Conexão do front com o Supabase (lazy).
 *
 * Credenciais (nunca no repositório — `.env*` está no .gitignore):
 *   - dev/local: `frontend/.env.local`
 *   - produção: variáveis de ambiente da Vercel (`VITE_SUPABASE_URL`,
 *     `VITE_SUPABASE_ANON_KEY`) injetadas no build
 *
 * Só a chave **publicável** (`sb_publishable_*`) chega ao browser — ela é
 * pública por design e protegida por RLS. As chaves privadas (as de sufixo
 * `secret` e o papel de serviço) ficam exclusivamente no dashboard/Vercel.
 *
 * O SDK é carregado sob demanda (`await import(...)`) para manter a landing
 * leve: sem as duas variáveis — ou sem nenhuma chamada — o chunk do Supabase
 * nem é baixado. Sem variáveis o app segue nos mocks (`services/index.ts`).
 */
const SUPABASE_URL: string | undefined = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** true quando URL + chave publicável estão configuradas. */
export const supabaseEnabled: boolean = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

type SupabaseClient = import('@supabase/supabase-js').SupabaseClient;

let client: SupabaseClient | null = null;

/** Cliente pronto para uso; null quando as variáveis não existem. */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!supabaseEnabled) return null;
  if (client) return client;
  const { createClient } = await import('@supabase/supabase-js');
  client = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
    auth: {
      /* Sessão do Supabase Auth: persiste em localStorage, renova o token sozinha
         e, em fluxos OAuth/recuperação, troca o `?code=` da URL pela sessão
         automaticamente na inicialização (PKCE — o verifier fica no cliente,
         nunca na URL, então a URL de callback não vaza credencial alguma). */
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  });
  return client;
}
