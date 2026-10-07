import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Field, LinkButton } from '../../design-system/components';
import { isAuthEnabled, signInWithGoogle, signUpWithPassword } from '../../services/auth';
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
const MIN_PASSWORD = 8;

export function RegisterPage() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const next = useSafeNext();
  const enabled = isAuthEnabled();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'form' | 'google' | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(null);

    const mail = email.trim();
    if (!EMAIL_RE.test(mail)) {
      setError(t('register.invalidEmail'));
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(t('register.weak'));
      return;
    }
    if (password !== confirm) {
      setError(t('register.mismatch'));
      return;
    }

    setBusy('form');
    const result = await signUpWithPassword(mail, password);
    if (result.ok) {
      if (result.data?.needsConfirmation) {
        setSentTo(mail);
        setBusy(null);
        return;
      }
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

  if (sentTo) {
    return (
      <AuthPanel title={t('register.successTitle')}>
        <p className="muted">{t('register.successDesc', { email: sentTo })}</p>
        <div className="page-actions">
          <LinkButton to="/login">{t('register.successCta')}</LinkButton>
        </div>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel
      title={t('register.title')}
      subtitle={t('register.subtitle')}
      footer={
        <>
          <span className="muted">{t('register.haveAccount')}</span>
          <Link to="/login">{t('register.signIn')}</Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="stack stack-4">
        {error && <FormAlert>{error}</FormAlert>}

        <Field label={t('register.email')} htmlFor="register-email" required>
          <input
            id="register-email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            aria-invalid={error ? 'true' : undefined}
          />
        </Field>

        <Field label={t('register.password')} htmlFor="register-password" hint={t('register.hint')} required>
          <PasswordInput id="register-password" value={password} onChange={setPassword} autoComplete="new-password" />
        </Field>

        <Field label={t('register.confirm')} htmlFor="register-confirm" required>
          <PasswordInput id="register-confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" />
        </Field>

        <Button type="submit" block loading={busy === 'form'}>
          {busy === 'form' ? t('register.submitting') : t('register.submit')}
        </Button>

        <AuthRule />

        <GoogleButton label={busy === 'google' ? t('register.googleLoading') : t('register.google')} loading={busy === 'google'} onClick={onGoogle} />
      </form>
    </AuthPanel>
  );
}
