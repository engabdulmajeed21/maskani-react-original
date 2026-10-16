export function DualRangeSlider({
  minValue,
  maxValue,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  minValue: string
  maxValue: string
  min: number
  max: number
  step: number
  unit: string
  onChange: (minValue: string, maxValue: string) => void
}) {
  const selectedMin = minValue === "" ? min : Number(minValue)
  const selectedMax = maxValue === "" ? max : Number(maxValue)
  const formatValue = (value: number) =>
    `${value.toLocaleString("ar-SA")} ${unit}`.trim()

  return (
    <div className="w-full min-w-0 space-y-3 shrink-0 select-none" style={{ touchAction: "none" }}>
      <label className="block w-full min-w-0 shrink-0">
        <span className="mb-1.5 flex h-5 items-center justify-between gap-2 text-[10px] text-[var(--text-muted)] font-semibold">
          <b className="text-[var(--text)] font-extrabold">الحد الأدنى</b>
          <span className="tabular-nums font-bold text-[var(--primary-text)]">{formatValue(selectedMin)}</span>
        </span>
        <input
          className="dual-range-input h-8 w-full cursor-pointer touch-none"
          type="range"
          min={min}
          max={max}
          step={step}
          value={selectedMin}
          onChange={(event) =>
            onChange(
              String(Math.min(Number(event.target.value), selectedMax)),
              String(selectedMax),
            )
          }
          dir="ltr"
        />
      </label>
      <label className="block w-full min-w-0 shrink-0">
        <span className="mb-1.5 flex h-5 items-center justify-between gap-2 text-[10px] text-[var(--text-muted)] font-semibold">
          <b className="text-[var(--text)] font-extrabold">الحد الأعلى</b>
          <span className="tabular-nums font-bold text-[var(--primary-text)]">{formatValue(selectedMax)}</span>
        </span>
        <input
          className="dual-range-input h-8 w-full cursor-pointer touch-none"
          type="range"
          min={min}
          max={max}
          step={step}
          value={selectedMax}
          onChange={(event) =>
            onChange(
              String(selectedMin),
              String(Math.max(Number(event.target.value), selectedMin)),
            )
          }
          dir="ltr"
        />
      </label>
    </div>
  )
}
