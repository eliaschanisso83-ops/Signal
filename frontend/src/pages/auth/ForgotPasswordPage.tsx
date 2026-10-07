import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Field, LinkButton } from '../../design-system/components';
import { isAuthEnabled, sendPasswordReset } from '../../services/auth';
import { AuthPanel, FormAlert, FormNote } from './shared';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordPage() {
  const { t } = useTranslation('auth');
  const enabled = isAuthEnabled();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(null);

    const mail = email.trim();
    if (!EMAIL_RE.test(mail)) {
      setError(t('errors.invalidEmail'));
      return;
    }

    setBusy(true);
    const result = await sendPasswordReset(mail, `${window.location.origin}/reset-password`);
    if (result.ok) {
      /* Mesma confirmação exista ou não a conta: sem vazamento de cadastro. */
      setSentTo(mail);
      setBusy(false);
      return;
    }
    setError(t(result.key));
    setBusy(false);
  }

  if (!enabled) {
    return (
      <AuthPanel title={t('forgot.title')}>
        <FormNote>{t('forgot.disabled')}</FormNote>
        <div className="page-actions">
          <LinkButton to="/login">{t('forgot.backToLogin')}</LinkButton>
        </div>
      </AuthPanel>
    );
  }

  if (sentTo) {
    return (
      <AuthPanel title={t('forgot.sentTitle')}>
        <p className="muted">{t('forgot.sentDesc', { email: sentTo })}</p>
        <div className="page-actions">
          <LinkButton to="/login">{t('forgot.backToLogin')}</LinkButton>
        </div>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel
      title={t('forgot.title')}
      subtitle={t('forgot.subtitle')}
      footer={
        <Link className="small" to="/login">
          {t('forgot.backToLogin')}
        </Link>
      }
    >
      <form onSubmit={onSubmit} noValidate className="stack stack-4">
        {error && <FormAlert>{error}</FormAlert>}

        <Field label={t('forgot.email')} htmlFor="forgot-email" required>
          <input
            id="forgot-email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            aria-invalid={error ? 'true' : undefined}
          />
        </Field>

        <Button type="submit" block loading={busy}>
          {busy ? t('forgot.submitting') : t('forgot.submit')}
        </Button>
      </form>
    </AuthPanel>
  );
}
