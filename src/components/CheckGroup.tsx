export function CheckGroup({
  options,
  values,
  onChange,
}: {
  options: string[]
  values: string[]
  onChange: (values: string[]) => void
}) {
  return (
    <div className="flex w-full min-w-0 flex-wrap gap-2 shrink-0">
      {options.map((option) => {
        const checked = values.includes(option)
        return (
          <label
            className={`min-h-10 shrink-0 inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition-all select-none touch-manipulation active:scale-95 ${
              checked
                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "border-[var(--line)] bg-[var(--surface-raised)] text-[var(--text-muted)] hover:border-[var(--line-strong)] hover:text-[var(--text)]"
            }`}
            key={option}
          >
            <input
              className="sr-only"
              type="checkbox"
              checked={checked}
              onChange={() =>
                onChange(
                  checked
                    ? values.filter((item) => item !== option)
                    : [...values, option],
                )
              }
            />
            <span
              className={`grid size-4 shrink-0 place-items-center rounded-md border text-[9px] font-black ${
                checked
                  ? "border-white bg-white text-blue-600"
                  : "border-[var(--line-strong)] bg-[var(--surface-soft)] text-transparent"
              }`}
            >
              ✓
            </span>
            <span className="whitespace-nowrap text-xs font-bold leading-none">
              {option}
            </span>
          </label>
        )
      })}
    </div>
  )
}
