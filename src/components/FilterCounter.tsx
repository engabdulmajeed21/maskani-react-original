export function FilterCounter({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex h-12 w-full shrink-0 items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 select-none">
      <span className="text-[11px] font-bold text-[var(--text)]">{label}</span>
      <div className="flex items-center gap-3 shrink-0">
        <button
          className="grid size-8 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--text)] active:scale-90 transition-transform touch-manipulation font-extrabold"
          onClick={() => onChange(Math.max(0, value - 1))}
          type="button"
          aria-label="إنقاص"
        >
          −
        </button>
        <strong className="w-8 shrink-0 text-center text-sm font-extrabold text-[var(--text)] tabular-nums">
          {value || "أي"}
        </strong>
        <button
          className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--primary-strong)] text-[var(--dark-text)] active:scale-90 transition-transform touch-manipulation font-extrabold shadow-xs"
          onClick={() => onChange(Math.min(20, value + 1))}
          type="button"
          aria-label="زيادة"
        >
          +
        </button>
      </div>
    </div>
  )
}
