import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Priority, RecommendationEventType } from '../domain/types';
import { Badge, type BadgeTone } from './components';

/* ---------------- Wizard steps ---------------- */

export interface WizardStep {
  id: string;
  label: string;
  to?: string;
}

export function WizardSteps({ steps, currentIndex }: { steps: WizardStep[]; currentIndex: number }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t('aria.auditSteps')}>
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
  const { t } = useTranslation();
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
              {state === 'current' && <span className="sr-only">{t('aria.inProgress')}</span>}
              {state === 'done' && <span className="sr-only">{t('aria.done')}</span>}
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

/* ---------------- Score gauge (instrumento de 0 a max) ---------------- */

const GAUGE_START = 135;
const GAUGE_SWEEP = 270;

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

export function ScoreGauge({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const { t } = useTranslation();
  const cx = 100;
  const cy = 100;
  const r = 78;
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const [sx, sy] = polar(cx, cy, r, GAUGE_START);
  const [ex, ey] = polar(cx, cy, r, GAUGE_START + GAUGE_SWEEP);
  const arcPath = `M${sx.toFixed(2)} ${sy.toFixed(2)} A${r} ${r} 0 1 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
  const offset = 100 * (1 - pct);
  const [mx, my] = polar(cx, cy, r, GAUGE_START + GAUGE_SWEEP * pct);

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const deg = GAUGE_START + (GAUGE_SWEEP * i) / 10;
    const major = i % 5 === 0;
    const [x1, y1] = polar(cx, cy, r + 9, deg);
    const [x2, y2] = polar(cx, cy, r + (major ? 17 : 14), deg);
    return { x1, y1, x2, y2, major, key: i };
  });

  const [l0x, l0y] = polar(cx, cy, r + 30, GAUGE_START);
  const [l1x, l1y] = polar(cx, cy, r + 30, GAUGE_START + GAUGE_SWEEP);

  return (
    <div className="gauge" role="img" aria-label={t('aria.scoreGauge', { label, value, max })}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <path className="track" d={arcPath} fill="none" strokeWidth={14} />
        <path
          className="fill"
          d={arcPath}
          fill="none"
          strokeWidth={14}
          pathLength={100}
          style={{ ['--gauge-off' as string]: String(offset) } as CSSProperties}
        />
        {ticks.map((tick) => (
          <line
            key={tick.key}
            className={`tick${tick.major ? ' major' : ''}`}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
          />
        ))}
        <text className="scale-label" x={l0x} y={l0y + 4} textAnchor="middle">
          0
        </text>
        <text className="scale-label" x={l1x} y={l1y + 4} textAnchor="middle">
          {max}
        </text>
        {pct > 0 && <circle className="marker" cx={mx} cy={my} r={6.5} />}
      </svg>
      <div className="gauge-center">
        <span className="gauge-value">{value}</span>
        <span className="gauge-of">{t('gauge.of', { max })}</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
}

/* ---------------- Cadeia causal ---------------- */

export type CausalKind = 'observed' | 'evidence' | 'hypothesis' | 'action';

export function CausalItem({ kind, children, index = 0 }: { kind: CausalKind; children: ReactNode; index?: number }) {
  const { t } = useTranslation();
  return (
    <div className="causal-item" data-kind={kind} style={{ ['--ci' as string]: String(index) } as CSSProperties}>
      <span className="causal-tag">{t(`causal.${kind}`)}</span>
      <p>{children}</p>
    </div>
  );
}

export function CausalChain({ steps }: { steps: Array<{ kind: CausalKind; text: string }> }) {
  return (
    <div className="causal">
      {steps.map((s, i) => (
        <CausalItem key={s.kind} kind={s.kind} index={i}>
          {s.text}
        </CausalItem>
      ))}
    </div>
  );
}

/* ---------------- Rede de processamento ---------------- */

export type NetState = 'idle' | 'processing' | 'success' | 'error';

/** Geometria da rede: origem (marca-sinal) → camadas de análise → núcleo → saídas. */
const NET_NODES: Array<{ x: number; y: number }> = [
  { x: 148, y: 160 },
  { x: 145, y: 243 },
  { x: 171, y: 98 },
  { x: 218, y: 238 },
  { x: 251, y: 91 },
  { x: 219, y: 342 },
];
const NET_MID: Array<{ x: number; y: number }> = [
  { x: 430, y: 130 },
  { x: 430, y: 275 },
];
const NET_OUT: Array<{ x: number; y: number }> = [
  { x: 930, y: 96 },
  { x: 960, y: 200 },
  { x: 930, y: 304 },
];
const NET_HUB = { x: 700, y: 200 };
const NET_CORE = { x: 100, y: 200 };

function netArc(radius: number): string {
  const [sx, sy] = polar(NET_CORE.x, NET_CORE.y, radius, -70);
  const [ex, ey] = polar(NET_CORE.x, NET_CORE.y, radius, 70);
  return `M${sx.toFixed(1)} ${sy.toFixed(1)} A${radius} ${radius} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}

/**
 * Animação de processamento na identidade do Signal: arcos-sinal emanando
 * da origem, nós de análise pulsando e dados fluindo até o núcleo do relatório.
 * Decorativa (aria-hidden) — o estado também é comunicado em texto pela página.
 */
export function SignalNetwork({
  state,
  step,
  caption,
}: {
  state: NetState;
  step?: string;
  caption?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="net" data-state={state}>
      <svg viewBox="0 0 1000 400" aria-hidden="true">
        <g className="grid" opacity="0.75">
          {[100, 200, 300].map((y) => (
            <line key={y} className="grid-line" x1="40" y1={y} x2="960" y2={y} />
          ))}
          {[260, 430, 700, 880].map((x) => (
            <line key={x} className="grid-line" x1={x} y1="52" x2={x} y2="348" />
          ))}
        </g>

        {/* arcos de emissão (marca-sinal) */}
        {[66, 124, 186].map((radius) => (
          <path key={radius} className="arc" d={netArc(radius)} />
        ))}

        {/* origem → nós de análise */}
        {NET_NODES.map((n, i) => (
          <line key={`in-${i}`} className="edge" x1={NET_CORE.x} y1={NET_CORE.y} x2={n.x} y2={n.y} />
        ))}

        {/* nós → camadas de análise */}
        {NET_NODES.map((n, i) => (
          <line
            key={`mid-${i}`}
            className={`edge${i === 4 ? ' broken' : ''}`}
            x1={n.x}
            y1={n.y}
            x2={NET_MID[i % 2].x}
            y2={NET_MID[i % 2].y}
          />
        ))}

        {/* camadas → núcleo do relatório → saídas */}
        {NET_MID.map((m, i) => (
          <line key={`hub-${i}`} className="edge" x1={m.x} y1={m.y} x2={NET_HUB.x} y2={NET_HUB.y} />
        ))}
        {NET_OUT.map((o, i) => (
          <line key={`out-${i}`} className={`edge${i === 1 ? ' broken' : ''}`} x1={NET_HUB.x} y1={NET_HUB.y} x2={o.x} y2={o.y} />
        ))}

        {/* origem da emissão */}
        <circle className="core-ring" cx={NET_CORE.x} cy={NET_CORE.y} r={22} />
        <circle className="core-halo" cx={NET_CORE.x} cy={NET_CORE.y} r={10} />
        <circle className="core" cx={NET_CORE.x} cy={NET_CORE.y} r={9} />

        {/* nós de análise */}
        {NET_NODES.map((n, i) => (
          <circle
            key={`n-${i}`}
            className="node"
            cx={n.x}
            cy={n.y}
            r={7}
            style={{ animationDelay: `${(i * 0.35).toFixed(2)}s` }}
          />
        ))}
        {NET_MID.map((m, i) => (
          <circle key={`m-${i}`} className="node" cx={m.x} cy={m.y} r={9} />
        ))}

        {/* núcleo do relatório */}
        <circle className="node hub" cx={NET_HUB.x} cy={NET_HUB.y} r={34} />
        <circle className="hub-ring" cx={NET_HUB.x} cy={NET_HUB.y} r={46} />
        <circle className="hub-core" cx={NET_HUB.x} cy={NET_HUB.y} r={6.5} />
        <g className="mark mark-ok" transform={`translate(${NET_HUB.x} ${NET_HUB.y})`}>
          <path d="M-12 0 L-4 9 L12 -9" />
        </g>
        <g className="mark mark-err" transform={`translate(${NET_HUB.x} ${NET_HUB.y})`}>
          <path d="M-9 -9 L9 9 M9 -9 L-9 9" />
        </g>

        {/* saídas do relatório */}
        {NET_OUT.map((o, i) => (
          <circle key={`o-${i}`} className="node" cx={o.x} cy={o.y} r={7} />
        ))}
      </svg>
      <span className="net-badge">
        <span className="net-led" aria-hidden="true" />
        {t(`net.${state}`)}
      </span>
      {step && <span className="net-step">{step}</span>}
      {caption && <span className="net-caption">{caption}</span>}
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
  emptyMessage,
}: {
  columns: Array<Column<T>>;
  rows: T[];
  caption: string;
  emptyMessage?: string;
}) {
  const { t } = useTranslation();
  const empty = emptyMessage ?? t('state.noData');
  if (rows.length === 0) {
    return (
      <div className="state-block">
        <p>{empty}</p>
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

export function ImpactBadge({ value }: { value: Priority }) {
  const { t } = useTranslation();
  const tone: BadgeTone = value === 'HIGH' ? 'red' : value === 'MEDIUM' ? 'amber' : 'neutral';
  return <Badge tone={tone}>{t('badge.impact', { level: t(`levels.${value}`) })}</Badge>;
}

export function EffortBadge({ value }: { value: Priority }) {
  const { t } = useTranslation();
  const tone: BadgeTone = value === 'LOW' ? 'green' : value === 'MEDIUM' ? 'amber' : 'red';
  return <Badge tone={tone}>{t('badge.effort', { level: t(`levels.${value}`) })}</Badge>;
}

export function PriorityTag({ value }: { value: Priority }) {
  const { t } = useTranslation();
  const tone: BadgeTone = value === 'HIGH' ? 'red' : value === 'MEDIUM' ? 'amber' : 'neutral';
  return <Badge tone={tone}>{t('badge.priority', { level: t(`levels.${value}`) })}</Badge>;
}

export const EVENT_TYPE_TONE: Record<RecommendationEventType, BadgeTone> = {
  RECOMMENDATION: 'green',
  ALTERNATIVE: 'blue',
  COMPARISON: 'neutral',
  MENTION: 'neutral',
  NEGATIVE: 'red',
  IRRELEVANT: 'outline',
};
