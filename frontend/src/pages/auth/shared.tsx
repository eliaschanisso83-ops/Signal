/**
 * Peças compartilhadas das telas de autenticação: painel central, campo de
 * senha com mostrar/ocultar, botão do Google (SVG oficial) e alertas de
 * formulário. Reutiliza o design system (Card/Field/Button) — nada de novo.
 */
import { useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../../design-system/components';
import { safeNext } from '../../services/auth';

/** `?next=` seguro (caminho interno apenas) — usado por todas as telas. */
export function useSafeNext(): string {
  const [search] = useSearchParams();
  return safeNext(search.get('next'));
}

/** URL de retorno do OAuth (`/auth/callback?next=…`), preservando o destino. */
export function googleCallbackUrl(next: string): string {
  const base = `${window.location.origin}/auth/callback`;
  return next === '/' ? base : `${base}?next=${encodeURIComponent(next)}`;
}

export function AuthPanel({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="shell auth-shell">
      <Card className="auth-card">
        <div className="page-head auth-head">
          <h1>{title}</h1>
          {subtitle && <p className="auth-sub">{subtitle}</p>}
        </div>
        {children}
        {footer && <div className="auth-alt">{footer}</div>}
      </Card>
    </div>
  );
}

/** Alerta de erro do formulário (`role="alert"`). */
export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <p className="form-alert" role="alert">
      {children}
    </p>
  );
}

/** Nota informativa (indisponibilidade, avisos). */
export function FormNote({ children }: { children: ReactNode }) {
  return <p className="form-note">{children}</p>;
}

/** Input de senha com alternar visibilidade (rótulo localizado). */
export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  required = true,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  required?: boolean;
}) {
  const { t } = useTranslation('auth');
  const [visible, setVisible] = useState(false);
  return (
    <div className="input-wrap">
      <input
        id={id}
        className="input"
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
      />
      <button
        type="button"
        className="input-eye"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-label={t(visible ? 'login.hidePassword' : 'login.showPassword')}
      >
        {t(visible ? 'login.hidePassword' : 'login.showPassword')}
      </button>
    </div>
  );
}

/** Botão "Continuar com Google" (SVG nas cores oficiais da marca). */
export function GoogleButton({
  label,
  loading = false,
  onClick,
}: {
  label: string;
  loading?: boolean;
  onClick: () => void;
}) {
  return (
    <Button type="button" variant="secondary" block loading={loading} onClick={onClick} className="btn-google">
      <svg className="google-g" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.636-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.797 2.716v2.258h2.909c1.702-1.567 2.684-3.875 2.684-6.615z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.468-.806 5.956-2.18l-2.909-2.258c-.806.54-1.835.859-3.047.859-2.344 0-4.328-1.585-5.037-3.714H.956v2.332A9 9 0 0 0 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.963 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.281-1.707V4.961H.956A9 9 0 0 0 0 9c0 1.452.347 2.827.956 4.039l3.007-2.332z"
        />
        <path
          fill="#EA4335"
          d="M9 3.579c1.322 0 2.508.454 3.441 1.346l2.581-2.581C13.464.892 11.426 0 9 0A9 9 0 0 0 .956 4.961l3.007 2.332C4.672 5.164 6.656 3.579 9 3.579z"
        />
      </svg>
      {label}
    </Button>
  );
}

/** Linha divisória vazia (sem texto: o "ou" não existe nas chaves). */
export function AuthRule() {
  return <hr className="auth-rule" aria-hidden="true" />;
}
