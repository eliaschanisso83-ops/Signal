import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Field } from '../../design-system/components';
import { isAuthEnabled, signInWithGoogle, signInWithPassword } from '../../services/auth';
import {
  AuthPanel,
  AuthRule,
  FormAlert,
  FormNote,
  GoogleButton,
  PasswordInput,
  googleCallbackUrl,
  useSafeNext,
} from './shared';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const next = useSafeNext();
  const enabled = isAuthEnabled();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'form' | 'google' | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(null);

    const mail = email.trim();
    if (!EMAIL_RE.test(mail) || !password) {
      setError(t('login.invalid'));
      return;
    }

    setBusy('form');
    const result = await signInWithPassword(mail, password);
    if (result.ok) {
      navigate(next, { replace: true });
      return;
    }
    setError(t(result.key));
    setBusy(null);
  }

  async function onGoogle() {
    if (busy) return;
    setError(null);
    setBusy('google');
    const result = await signInWithGoogle(googleCallbackUrl(next));
    if (!result.ok) {
      setError(t(result.key));
      setBusy(null);
    }
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

  return (
    <AuthPanel
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      footer={
        <>
          <span className="muted">{t('login.noAccount')}</span>
          <Link to="/register">{t('login.createAccount')}</Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="stack stack-4">
        {error && <FormAlert>{error}</FormAlert>}

        <Field label={t('login.email')} htmlFor="login-email" required>
          <input
            id="login-email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            aria-invalid={error ? 'true' : undefined}
          />
        </Field>

        <Field label={t('login.password')} htmlFor="login-password" required>
          <PasswordInput id="login-password" value={password} onChange={setPassword} autoComplete="current-password" />
        </Field>

        <Button type="submit" block loading={busy === 'form'}>
          {busy === 'form' ? t('login.submitting') : t('login.submit')}
        </Button>

        <AuthRule />

        <GoogleButton label={busy === 'google' ? t('login.googleLoading') : t('login.google')} loading={busy === 'google'} onClick={onGoogle} />

        <div className="auth-row">
          <Link className="small" to="/forgot-password">
            {t('login.forgot')}
          </Link>
        </div>
      </form>
    </AuthPanel>
  );
}
