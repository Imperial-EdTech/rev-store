"use client";

import { formatNaira } from "@/lib/catalog";
import styles from "./slider.module.css";

export type Range = [min: number, max: number];

/**
 * Two-handle price slider built from two native range inputs, so keyboard
 * and screen-reader support come for free. `onChange` fires while dragging
 * (labels stay in sync); `onCommit` fires on release (apply the filter).
 */
export function PriceRangeSlider({
  bounds,
  step,
  value,
  onChange,
  onCommit,
}: {
  bounds: Range;
  step: number;
  value: Range;
  onChange: (next: Range) => void;
  onCommit: (next: Range) => void;
}) {
  const [lo, hi] = value;
  const [min, max] = bounds;
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  // Handles can meet but never cross.
  const setLo = (v: number) => onChange([Math.min(v, hi), hi]);
  const setHi = (v: number) => onChange([lo, Math.max(v, lo)]);
  const commit = () => onCommit(value);

  return (
    <div className={styles.root}>
      <div aria-hidden className={styles.readout}>
        <span>{formatNaira(lo)}</span>
        <span className={styles.dash}>–</span>
        <span>{formatNaira(hi)}</span>
      </div>

      <div className={styles.track}>
        <div className={styles.fill} style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input
          aria-label="Minimum price"
          aria-valuetext={formatNaira(lo)}
          className={styles.thumb}
          max={max}
          min={min}
          onChange={(e) => setLo(Number(e.target.value))}
          onKeyUp={commit}
          onPointerUp={commit}
          step={step}
          type="range"
          value={lo}
          // Keep the lower handle grabbable when both sit at the top end.
          style={{ zIndex: lo >= max - step ? 3 : 2 }}
        />
        <input
          aria-label="Maximum price"
          aria-valuetext={formatNaira(hi)}
          className={styles.thumb}
          max={max}
          min={min}
          onChange={(e) => setHi(Number(e.target.value))}
          onKeyUp={commit}
          onPointerUp={commit}
          step={step}
          type="range"
          value={hi}
        />
      </div>

      <div aria-hidden className={styles.bounds}>
        <span>{formatNaira(min)}</span>
        <span>{formatNaira(max)}</span>
      </div>
    </div>
  );
}
