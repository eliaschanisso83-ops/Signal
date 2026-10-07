import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LinkButton, LoadingState } from '../../design-system/components';
import { getSession, isAuthEnabled, safeNext, subscribe } from '../../services/auth';
import { AuthPanel } from './shared';

/** Margem para a troca do `?code=` (OAuth) concluir após o redirect. */
const WAIT_MS = 4000;
const PROBE_MS = 300;

type Phase = 'checking' | 'failed' | 'cancelled';

/** Erros do provedor chegam na URL (?error=… / #error=…) — decididos na inicialização. */
function urlErrorPhase(): Phase | null {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const error = (query.get('error') ?? hash.get('error') ?? '').toLowerCase();
  const description = (query.get('error_description') ?? hash.get('error_description') ?? '').toLowerCase();
  if (!error) return null;
  return /denied|cancel/.test(`${error} ${description}`) ? 'cancelled' : 'failed';
}

/**
 * Retorno do "Continuar com Google" (PKCE): valida a sessão e segue para o
 * destino original (`?next=`), ou explica o cancelamento/falha.
 */
export function AuthCallbackPage() {
  const { t } = useTranslation('auth');
  const location = useLocation();
  const navigate = useNavigate();
  const search = location.search;
  const next = safeNext(new URLSearchParams(search).get('next'));
  const urlError = urlErrorPhase();
  const [phase, setPhase] = useState<Phase>(() => urlErrorPhase() ?? 'checking');
  const enabled = isAuthEnabled();

  useEffect(() => {
    if (!enabled) {
      navigate('/login', { replace: true });
      return;
    }
    /* O erro de provedor já está no estado inicial — só resta validar a sessão. */
    if (urlError) return;

    let cancelled = false;
    let timer: number | undefined;
    const deadline = Date.now() + WAIT_MS;

    const go = () => {
      if (!cancelled) navigate(next, { replace: true });
    };

    void (async () => {
      while (!cancelled && Date.now() < deadline) {
        const session = await getSession();
        if (cancelled) return;
        if (session?.user) {
          go();
          return;
        }
        await new Promise<void>((resolve) => {
          timer = window.setTimeout(resolve, PROBE_MS);
        });
      }
      if (!cancelled) setPhase('failed');
    })();

    const unsubscribe = subscribe((session) => {
      if (session?.user) go();
    });

    return () => {
      cancelled = true;
      unsubscribe();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [enabled, next, navigate, search, urlError]);

  if (phase === 'checking') {
    return (
      <div className="shell auth-shell">
        <div className="auth-card auth-state">
          <h1 className="sr-only">{t('callback.title')}</h1>
          <LoadingState message={t('callback.checking')} />
        </div>
      </div>
    );
  }

  const cancelled = phase === 'cancelled';
  const loginHref = next === '/' ? '/login' : `/login?next=${encodeURIComponent(next)}`;

  return (
    <AuthPanel title={cancelled ? t('callback.cancelledTitle') : t('callback.failedTitle')}>
      <p className="muted">{cancelled ? t('callback.cancelledDesc') : t('callback.failedDesc')}</p>
      <div className="page-actions">
        <LinkButton to={loginHref}>{t('callback.retry')}</LinkButton>
        <Link className="small" to="/login">
          {t('callback.backToLogin')}
        </Link>
      </div>
    </AuthPanel>
  );
}
