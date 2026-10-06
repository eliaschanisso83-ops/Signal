import type { CSSProperties } from 'react';
import type { Confidence } from '../domain/types';
import { CAUSAL_LABEL, CONFIDENCE_LABEL, type CausalKind } from '../design-system/visuals';

/* ============================================================
   Componentes de dados da landing — Score, métricas, ranking,
   confiança e evidence chain. Só apresentação: valores e textos
   entram por props; nenhum cálculo ou lógica aqui.
   ============================================================ */

/* ---------- Score — arco semicircular com escala e marcador ---------- */

const R = 100;
const CX = 120;
const CY = 120;
const ARC_LEN = Math.PI * R;
const ARC_D = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;

function pointAt(t: number, r: number) {
  const a = Math.PI * (1 - t);
  return { x: CX + r * Math.cos(a), y: CY - r * Math.sin(a) };
}

export function ScoreCard({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const marker = pointAt(pct, R);
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return (
    <div className="sc">
      <svg className="sc-svg" viewBox="0 0 240 140" role="img" aria-label={`${label}: ${value} de ${max}`}>
        <defs>
          <linearGradient id="sc-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6480e8" />
            <stop offset="1" stopColor="#2547d0" />
          </linearGradient>
        </defs>
        <path className="sc-track" d={ARC_D} />
        <path
          className="sc-progress"
          d={ARC_D}
          strokeDasharray={ARC_LEN}
          style={{ '--sc-len': `${ARC_LEN}`, '--sc-off': `${ARC_LEN * (1 - pct)}` } as CSSProperties}
        />
        {ticks.map((t) => {
          const inner = pointAt(t, 107.5);
          const outer = pointAt(t, 113.5);
          return <line key={t} className="sc-tick" x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} />;
        })}
        <circle className="sc-marker" cx={marker.x} cy={marker.y} r="5.5" />
        <text className="sc-end" x="20" y="139">
          0
        </text>
        <text className="sc-end" x="220" y="139">
          {max}
        </text>
      </svg>
      <div className="sc-center">
        <span className="sc-num">
          {value}
          <span className="sc-of">/{max}</span>
        </span>
        <span className="sc-cap">{label}</span>
      </div>
    </div>
  );
}

/* ---------- Métrica — módulo KPI com escala e marcador ---------- */

export function MetricCard({
  label,
  value,
  displayValue,
  tone = 'accent',
}: {
  label: string;
  value: number;
  displayValue?: string;
  tone?: 'accent' | 'muted';
}) {
  const pct = Math.max(0, Math.min(100, value));
  const shown = displayValue ?? `${value}%`;
  return (
    <div className="mc" data-tone={tone}>
      <div className="mc-head">
        <span className="mc-label">{label}</span>
        <span className="mc-value">{shown}</span>
      </div>
      <div className="mc-track" role="img" aria-label={`${label}: ${shown}`}>
        <span className="mc-ticks" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="mc-fill" style={{ width: `${pct}%` }} />
        <span className="mc-dot" style={{ left: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ---------- Posição — benchmark de 7 observados ---------- */

export function RankingIndicator({
  position,
  total,
  caption = 'concorrentes observados',
}: {
  position: number;
  total: number;
  caption?: string;
}) {
  return (
    <div className="ri">
      <span className="ri-k">Posição</span>
      <div className="ri-main">
        <span className="ri-pos">#{position}</span>
        <span className="ri-of">/{total}</span>
      </div>
      <div className="ri-track" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <i
            key={i}
            className={i + 1 === position ? 'on' : undefined}
            style={{ '--i': `${i}` } as CSSProperties}
          />
        ))}
      </div>
      <span className="ri-cap">{caption}</span>
    </div>
  );
}

/* ---------- Confiança — status com medidor de 3 níveis ---------- */

const CONF_LEVEL: Record<Confidence, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };

export function ConfidenceIndicator({ value }: { value: Confidence }) {
  const level = CONF_LEVEL[value];
  return (
    <div className="ci" data-value={value}>
      <span className="ci-k">Confiança</span>
      <div className="ci-main">
        <span className="ci-track" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <i
              key={i}
              className={i < level ? 'on' : undefined}
              style={{ '--i': `${i}` } as CSSProperties}
            />
          ))}
        </span>
        <span className="ci-v">{CONFIDENCE_LABEL[value]}</span>
      </div>
    </div>
  );
}

/* ---------- Evidence chain — cadeia narrativa com entrada escalonada ---------- */

export function EvidenceStep({
  kind,
  text,
  index,
  total,
}: {
  kind: CausalKind;
  text: string;
  index: number;
  total: number;
}) {
  const delay = 320 + (index - 1) * 170;
  return (
    <li className="ec-step" data-kind={kind} style={{ '--ec-d': `${delay}` } as CSSProperties}>
      <span className="ec-node" aria-hidden="true">
        {String(index).padStart(2, '0')}
      </span>
      {index < total && <span className="ec-link" aria-hidden="true" />}
      <div className="ec-body">
        <span className="ec-label">{CAUSAL_LABEL[kind]}</span>
        <p>{text}</p>
      </div>
    </li>
  );
}

export function EvidenceChain({ steps }: { steps: Array<{ kind: CausalKind; text: string }> }) {
  return (
    <ol className="ec">
      {steps.map((s, i) => (
        <EvidenceStep key={s.kind} kind={s.kind} text={s.text} index={i + 1} total={steps.length} />
      ))}
    </ol>
  );
}
