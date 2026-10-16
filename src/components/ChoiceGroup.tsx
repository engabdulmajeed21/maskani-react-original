export function ChoiceGroup({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex w-full min-w-0 flex-wrap gap-2 shrink-0">
      {options.map((option) => {
        const isSelected = value === option
        return (
          <button
            className={`min-h-10 shrink-0 rounded-xl px-4 text-xs font-bold transition-all active:scale-95 touch-manipulation select-none border ${
              isSelected
                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "border-[var(--line)] bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-soft)]"
            }`}
            key={option}
            onClick={() => onChange(isSelected ? "" : option)}
            type="button"
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
