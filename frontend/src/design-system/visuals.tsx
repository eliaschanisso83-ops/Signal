import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Confidence, Priority, RecommendationEventType } from '../domain/types';
import { Badge, type BadgeTone } from './components';

/* ---------------- Wizard steps ---------------- */

export interface WizardStep {
  id: string;
  label: string;
  to?: string;
}

export function WizardSteps({ steps, currentIndex }: { steps: WizardStep[]; currentIndex: number }) {
  return (
    <nav aria-label="Etapas da auditoria">
      <ol className="wizard-steps">
        {steps.map((s, i) => {
          const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'todo';
          const content = (
            <>
              <span className="step-num" aria-hidden="true">
                {i < currentIndex ? '✓' : i + 1}
              </span>
              <span>{s.label}</span>
            </>
          );
          return (
            <li key={s.id} className="wizard-step" data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
              {s.to && i < currentIndex ? (
                <Link to={s.to} style={{ color: 'inherit', display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------------- Pipeline de execução ---------------- */

export function PipelineSteps({ steps, currentIndex, done }: { steps: readonly string[]; currentIndex: number; done: boolean }) {
  return (
    <ol className="pipeline">
      {steps.map((label, i) => {
        const state = done || i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'todo';
        return (
          <li key={label} data-state={state}>
            <span className="dot" aria-hidden="true">
              {state === 'done' ? '✓' : state === 'current' ? '•' : i + 1}
            </span>
            <span className="label">
              {label}
              {state === 'current' && <span className="sr-only"> (em andamento)</span>}
              {state === 'done' && <span className="sr-only"> (concluído)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="row-between" style={{ marginBottom: 6 }}>
        <span className="small muted">{label}</span>
        <span className="small mono">{value}%</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

/* ---------------- Score gauge ---------------- */

export function ScoreGauge({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const size = 168;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  const offset = circumference * (1 - pct);

  return (
    <div className="gauge" role="img" aria-label={`${label}: ${value} de ${max}`}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle
          className="fill"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-value">{value}</span>
        <span className="gauge-of">de {max}</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
}

/* ---------------- Cadeia causal ---------------- */

export type CausalKind = 'observed' | 'evidence' | 'hypothesis' | 'action';

export const CAUSAL_LABEL: Record<CausalKind, string> = {
  observed: 'Observação',
  evidence: 'Evidência',
  hypothesis: 'Hipótese',
  action: 'Ação',
};

export function CausalItem({ kind, children }: { kind: CausalKind; children: ReactNode }) {
  return (
    <div className="causal-item" data-kind={kind}>
      <span className="causal-tag">{CAUSAL_LABEL[kind]}</span>
      <p>{children}</p>
    </div>
  );
}

export function CausalChain({ steps }: { steps: Array<{ kind: CausalKind; text: string }> }) {
  return (
    <div className="causal">
      {steps.map((s) => (
        <CausalItem key={s.kind} kind={s.kind}>
          {s.text}
        </CausalItem>
      ))}
    </div>
  );
}

/* ---------------- Tabela responsiva ---------------- */

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  numeric?: boolean;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  caption,
  emptyMessage = 'Nenhum dado disponível.',
}: {
  columns: Array<Column<T>>;
  rows: T[];
  caption: string;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="state-block">
        <p>{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="table-wrap">
      <table className="table table-responsive">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((c) => (
                <td key={c.key} data-label={c.label} className={c.numeric ? 'num' : undefined}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Mapeamentos utilitários de domínio ---------------- */

export const PRIORITY_LABEL: Record<Priority, string> = { HIGH: 'Alta', MEDIUM: 'Média', LOW: 'Baixa' };
export const CONFIDENCE_LABEL: Record<Confidence, string> = { HIGH: 'Alta', MEDIUM: 'Média', LOW: 'Baixa' };

export function ImpactBadge({ value }: { value: Priority }) {
  const tone: BadgeTone = value === 'HIGH' ? 'red' : value === 'MEDIUM' ? 'amber' : 'neutral';
  return <Badge tone={tone}>Impacto {PRIORITY_LABEL[value].toLowerCase()}</Badge>;
}

export function EffortBadge({ value }: { value: Priority }) {
  const tone: BadgeTone = value === 'LOW' ? 'green' : value === 'MEDIUM' ? 'amber' : 'red';
  return <Badge tone={tone}>Esforço {PRIORITY_LABEL[value].toLowerCase()}</Badge>;
}

export function PriorityTag({ value }: { value: Priority }) {
  const tone: BadgeTone = value === 'HIGH' ? 'red' : value === 'MEDIUM' ? 'amber' : 'neutral';
  return <Badge tone={tone}>Prioridade {PRIORITY_LABEL[value].toLowerCase()}</Badge>;
}

export const EVENT_TYPE_TONE: Record<RecommendationEventType, BadgeTone> = {
  RECOMMENDATION: 'green',
  ALTERNATIVE: 'blue',
  COMPARISON: 'neutral',
  MENTION: 'neutral',
  NEGATIVE: 'red',
  IRRELEVANT: 'outline',
};
