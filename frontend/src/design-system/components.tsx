import { useState, type ReactNode, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type CSSProperties, type KeyboardEvent } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Confidence, Priority, PresenceLevel, RecommendationEventType } from '../domain/types';

/* ---------------- Button ---------------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  block?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  block = false,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${size !== 'md' ? `btn-${size}` : ''} ${block ? 'btn-block' : ''} ${className}`.trim()}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

export function LinkButton({ variant = 'primary', size = 'md', className = '', ...rest }: LinkButtonProps) {
  return (
    <Link
      className={`btn btn-${variant} ${size !== 'md' ? `btn-${size}` : ''} ${className}`.trim()}
      {...rest}
    />
  );
}

interface AnchorButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

export function AnchorButton({ variant = 'secondary', size = 'md', className = '', ...rest }: AnchorButtonProps) {
  return (
    <a className={`btn btn-${variant} ${size !== 'md' ? `btn-${size}` : ''} ${className}`.trim()} {...rest} />
  );
}

/* ---------------- Badge ---------------- */

export type BadgeTone = 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'accent' | 'outline';

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

const PRIORITY_TONE: Record<Priority, BadgeTone> = { HIGH: 'red', MEDIUM: 'amber', LOW: 'neutral' };
const CONFIDENCE_TONE: Record<Confidence, BadgeTone> = { HIGH: 'green', MEDIUM: 'amber', LOW: 'red' };

export function PriorityBadge({ value }: { value: Priority }) {
  const { t } = useTranslation();
  return <Badge tone={PRIORITY_TONE[value]}>{t('badge.priority', { level: t(`levels.${value}`) })}</Badge>;
}

export function ConfidenceBadge({ value }: { value: Confidence }) {
  const { t } = useTranslation();
  return <Badge tone={CONFIDENCE_TONE[value]}>{t('badge.confidence', { level: t(`levels.${value}`) })}</Badge>;
}

const EVENT_TONE: Record<RecommendationEventType, BadgeTone> = {
  RECOMMENDATION: 'green',
  ALTERNATIVE: 'blue',
  COMPARISON: 'neutral',
  MENTION: 'neutral',
  NEGATIVE: 'red',
  IRRELEVANT: 'outline',
};

export function EventBadge({ value }: { value: RecommendationEventType }) {
  const { t } = useTranslation();
  return <Badge tone={EVENT_TONE[value]}>{t(`events.${value}`)}</Badge>;
}

const PRESENCE_TONE: Record<PresenceLevel, BadgeTone> = {
  ALTA: 'green',
  MEDIA: 'blue',
  BAIXA: 'amber',
  AUSENTE: 'red',
};

export function PresenceBadge({ value }: { value: PresenceLevel }) {
  const { t } = useTranslation();
  return <Badge tone={PRESENCE_TONE[value]}>{t('badge.presence', { level: t(`presenceLevels.${value}`) })}</Badge>;
}

/* ---------------- Card ---------------- */

export function Card({
  children,
  className = '',
  as: As = 'section',
  style,
}: {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article';
  style?: CSSProperties;
}) {
  return (
    <As className={`card card-pad ${className}`.trim()} style={style}>
      {children}
    </As>
  );
}

export function CardHeader({ eyebrow, title, desc, actions }: {
  eyebrow?: string;
  title: string;
  desc?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="card-header">
      <div>
        {eyebrow && <div className="card-eyebrow">{eyebrow}</div>}
        <h2 className="card-title">{title}</h2>
        {desc && <p className="card-desc">{desc}</p>}
      </div>
      {actions && <div className="row">{actions}</div>}
    </header>
  );
}

/* ---------------- Field ---------------- */

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="req" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <span className="field-hint" id={`${htmlFor}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span className="field-error" id={`${htmlFor}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

/* ---------------- Tabs (acessível) ---------------- */

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ items, ariaLabel }: { items: TabItem[]; ariaLabel: string }) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  // Se a aba ativa deixou de existir (ex.: intent removido), cai para a primeira.
  const activeId = items.some((t) => t.id === active) ? active : (items[0]?.id ?? '');

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const idx = items.findIndex((t) => t.id === activeId);
    if (e.key === 'ArrowRight') setActive(items[(idx + 1) % items.length].id);
    if (e.key === 'ArrowLeft') setActive(items[(idx - 1 + items.length) % items.length].id);
  }

  return (
    <div>
      <div className="tabs" role="tablist" aria-label={ariaLabel} onKeyDown={onKeyDown}>
        {items.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            className="tab"
            aria-selected={t.id === activeId}
            aria-controls={`panel-${t.id}`}
            tabIndex={t.id === activeId ? 0 : -1}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== activeId}
          style={{ paddingTop: 'var(--sp-5)' }}
        >
          {t.id === activeId && t.content}
        </div>
      ))}
    </div>
  );
}

/* ---------------- Estados ---------------- */

export function LoadingState({ message }: { message?: string }) {
  const { t } = useTranslation();
  return (
    <div className="state-block" role="status" aria-live="polite">
      <div className="row" style={{ justifyContent: 'center' }}>
        <span className="spinner" aria-hidden="true" />
        <strong>{message ?? t('state.loading')}</strong>
      </div>
    </div>
  );
}

export function ErrorState({ title, desc, onRetry }: { title?: string; desc?: string; onRetry?: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="state-block state-error" role="alert">
      <h3>{title ?? t('state.errorTitle')}</h3>
      {desc && <p>{desc}</p>}
      {onRetry && (
        <div className="row" style={{ justifyContent: 'center', marginTop: 'var(--sp-4)' }}>
          <Button variant="secondary" onClick={onRetry}>
            {t('state.retry')}
          </Button>
        </div>
      )}
    </div>
  );
}

export function EmptyState({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="state-block">
      <h3>{title}</h3>
      {desc && <p>{desc}</p>}
      {action && <div style={{ marginTop: 'var(--sp-4)' }}>{action}</div>}
    </div>
  );
}

export function Skeleton({ height = 16, width = '100%' }: { height?: number; width?: number | string }) {
  return <div className="skeleton" style={{ height, width }} aria-hidden="true" />;
}

/* ---------------- Meter / Tooltip / extras ---------------- */

export function Meter({
  label,
  value,
  displayValue,
  tone = 'accent',
  note,
}: {
  label: string;
  value: number;
  displayValue?: string;
  tone?: 'accent' | 'evidence' | 'gap' | 'success' | 'muted';
  note?: string;
}) {
  return (
    <div className="meter">
      <div className="meter-head">
        <span className="meter-label">{label}</span>
        <span className="meter-value">{displayValue ?? `${value}%`}</span>
      </div>
      <div
        className="meter-track"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className="meter-fill" data-tone={tone} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      {note && <span className="meter-note">{note}</span>}
    </div>
  );
}

export function Tooltip({ text, label }: { text: string; label: string }) {
  return (
    <span className="tooltip-wrap">
      <button type="button" className="tooltip-trigger" aria-label={label}>
        i
      </button>
      <span role="tooltip" className="tooltip-bubble">
        {text}
      </span>
    </span>
  );
}

export function Chip({ children, onRemove, removeLabel }: { children: ReactNode; onRemove?: () => void; removeLabel?: string }) {
  const { t } = useTranslation();
  return (
    <li className="chip">
      {children}
      {onRemove && (
        <button type="button" className="chip-remove" onClick={onRemove} aria-label={removeLabel ?? t('state.remove')}>
          ×
        </button>
      )}
    </li>
  );
}

export function RelevancePips({ value, max = 5 }: { value: number; max?: number }) {
  const { t } = useTranslation();
  return (
    <span className="relevance" aria-label={t('aria.relevance', { value, max })}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className="pip" data-on={i < value ? 'true' : 'false'} />
      ))}
    </span>
  );
}

export function KeyValue({ items }: { items: Array<{ k: string; v: ReactNode }> }) {
  return (
    <dl className="kv">
      {items.map((it) => (
        <div key={it.k} style={{ display: 'contents' }}>
          <dt>{it.k}</dt>
          <dd>{it.v}</dd>
        </div>
      ))}
    </dl>
  );
}
