import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Field, LinkButton, LoadingState } from '../../design-system/components';
import { getSession, isAuthEnabled, signOut, subscribe, updateUserPassword } from '../../services/auth';
import { AuthPanel, FormAlert, FormNote, PasswordInput } from './shared';

const MIN_PASSWORD = 8;
/** Margem para a troca do `?code=` da URL concluir antes de invalidar o link. */
const GRACE_MS = 2000;

type Phase = 'checking' | 'form' | 'invalid' | 'success';

/** Link expirado/inválido: o Supabase devolve ?error=… (query ou hash). */
function hasUrlError(): boolean {
  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return Boolean(
    params.get('error') || hash.get('error') || params.get('error_code') || hash.get('error_code'),
  );
}

export function ResetPasswordPage() {
  const { t } = useTranslation('auth');
  const enabled = isAuthEnabled();

  /* Erro já vem na URL do link: estado inicial, sem setState dentro do efeito. */
  const [phase, setPhase] = useState<Phase>(() => (enabled && hasUrlError() ? 'invalid' : 'checking'));
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let grace: number | undefined;

    void (async () => {
      const session = await getSession();
      if (cancelled) return;
      if (session?.user) {
        setPhase('form');
        return;
      }
      /* A sessão pode chegar logo após (evento INITIAL_SESSION/recovery). */
      grace = window.setTimeout(() => {
        if (!cancelled) setPhase('invalid');
      }, GRACE_MS);
    })();

    const unsubscribe = subscribe((session) => {
      if (cancelled) return;
      if (session?.user) {
        if (grace !== undefined) window.clearTimeout(grace);
        setPhase('form');
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
      if (grace !== undefined) window.clearTimeout(grace);
    };
  }, [enabled]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(null);

    if (password.length < MIN_PASSWORD) {
      setError(t('reset.weak'));
      return;
    }
    if (password !== confirm) {
      setError(t('reset.mismatch'));
      return;
    }

    setBusy(true);
    const result = await updateUserPassword(password);
    if (result.ok) {
      /* Sai da sessão de recuperação: quem redefine entra de novo pelo /login. */
      await signOut();
      setPhase('success');
      setBusy(false);
      return;
    }
    setError(t(result.key));
    setBusy(false);
  }

  if (!enabled) {
    return (
      <AuthPanel title={t('unavailable.title')}>
        <FormNote>{t('unavailable.desc')}</FormNote>
        <div className="page-actions">
          <Link to="/" className="small">
            {t('callback.backToLogin')}
          </Link>
        </div>
      </AuthPanel>
    );
  }

  if (phase === 'checking') {
    return (
      <div className="shell auth-shell">
        <div className="auth-card auth-state">
          <h1 className="sr-only">{t('reset.title')}</h1>
          <LoadingState message={t('reset.checking')} />
        </div>
      </div>
    );
  }

  if (phase === 'invalid') {
    return (
      <AuthPanel title={t('reset.invalidTitle')}>
        <p className="muted">{t('reset.invalidDesc')}</p>
        <div className="page-actions">
          <LinkButton to="/forgot-password">{t('reset.requestNew')}</LinkButton>
          <Link className="small" to="/login">
            {t('callback.backToLogin')}
          </Link>
        </div>
      </AuthPanel>
    );
  }

  if (phase === 'success') {
    return (
      <AuthPanel title={t('reset.successTitle')}>
        <p className="muted">{t('reset.successDesc')}</p>
        <div className="page-actions">
          <LinkButton to="/login">{t('reset.successCta')}</LinkButton>
        </div>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel title={t('reset.title')} subtitle={t('reset.subtitle')}>
      <form onSubmit={onSubmit} noValidate className="stack stack-4">
        {error && <FormAlert>{error}</FormAlert>}

        <Field label={t('reset.password')} htmlFor="reset-password" hint={t('register.hint')} required>
          <PasswordInput id="reset-password" value={password} onChange={setPassword} autoComplete="new-password" />
        </Field>

        <Field label={t('reset.confirm')} htmlFor="reset-confirm" required>
          <PasswordInput id="reset-confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" />
        </Field>

        <Button type="submit" block loading={busy}>
          {busy ? t('reset.submitting') : t('reset.submit')}
        </Button>
      </form>
    </AuthPanel>
  );
}
