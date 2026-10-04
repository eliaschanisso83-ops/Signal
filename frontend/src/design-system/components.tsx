import { useState, type ReactNode, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type CSSProperties, type KeyboardEvent } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
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

export function PriorityBadge({ value }: { value: Priority }) {
  const map: Record<Priority, { label: string; tone: BadgeTone }> = {
    HIGH: { label: 'Alta', tone: 'red' },
    MEDIUM: { label: 'Média', tone: 'amber' },
    LOW: { label: 'Baixa', tone: 'neutral' },
  };
  const { label, tone } = map[value];
  return <Badge tone={tone}>Prioridade {label.toLowerCase()}</Badge>;
}

export function ConfidenceBadge({ value }: { value: Confidence }) {
  const map: Record<Confidence, { label: string; tone: BadgeTone }> = {
    HIGH: { label: 'Alta', tone: 'green' },
    MEDIUM: { label: 'Média', tone: 'amber' },
    LOW: { label: 'Baixa', tone: 'red' },
  };
  const { label, tone } = map[value];
  return <Badge tone={tone}>Confiança {label.toLowerCase()}</Badge>;
}

const EVENT_LABEL: Record<RecommendationEventType, { label: string; tone: BadgeTone }> = {
  RECOMMENDATION: { label: 'Recomendado', tone: 'green' },
  ALTERNATIVE: { label: 'Alternativa', tone: 'blue' },
  COMPARISON: { label: 'Comparado', tone: 'neutral' },
  MENTION: { label: 'Menção', tone: 'neutral' },
  NEGATIVE: { label: 'Negativo', tone: 'red' },
  IRRELEVANT: { label: 'Irrelevante', tone: 'outline' },
};

export function EventBadge({ value }: { value: RecommendationEventType }) {
  const { label, tone } = EVENT_LABEL[value];
  return <Badge tone={tone}>{label}</Badge>;
}

const PRESENCE_LABEL: Record<PresenceLevel, { label: string; tone: BadgeTone }> = {
  ALTA: { label: 'Alta', tone: 'green' },
  MEDIA: { label: 'Média', tone: 'blue' },
  BAIXA: { label: 'Baixa', tone: 'amber' },
  AUSENTE: { label: 'Ausente', tone: 'red' },
};

export function PresenceBadge({ value }: { value: PresenceLevel }) {
  const { label, tone } = PRESENCE_LABEL[value];
  return <Badge tone={tone}>Presença {label.toLowerCase()}</Badge>;
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

export function LoadingState({ message = 'Carregando…' }: { message?: string }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <div className="row" style={{ justifyContent: 'center' }}>
        <span className="spinner" aria-hidden="true" />
        <strong>{message}</strong>
      </div>
    </div>
  );
}

export function ErrorState({ title = 'Algo deu errado', desc, onRetry }: { title?: string; desc?: string; onRetry?: () => void }) {
  return (
    <div className="state-block state-error" role="alert">
      <h3>{title}</h3>
      {desc && <p>{desc}</p>}
      {onRetry && (
        <div className="row" style={{ justifyContent: 'center', marginTop: 'var(--sp-4)' }}>
          <Button variant="secondary" onClick={onRetry}>
            Tentar novamente
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
  return (
    <li className="chip">
      {children}
      {onRemove && (
        <button type="button" className="chip-remove" onClick={onRemove} aria-label={removeLabel ?? 'Remover'}>
          ×
        </button>
      )}
    </li>
  );
}

export function RelevancePips({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="relevance" aria-label={`Relevância ${value} de ${max}`}>
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
