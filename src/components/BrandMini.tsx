import { LogoMark } from "./LogoMark"

export function BrandMini({ subtitle }: { subtitle?: string }) {
  return (
    <div className="brand-mini flex items-center gap-2.5" dir="rtl">
      {/* اللوجو في أقصى اليمين */}
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400/30">
        <LogoMark />
      </div>

      {/* النص والوصف الفرعي مباشرة بعد اللوجو باتجاه اليسار */}
      <div className="flex flex-col text-right leading-tight">
        <span className="text-base font-black tracking-tight text-[var(--text)]">
          مسكني
        </span>
        {subtitle && (
          <span className="text-[10px] font-bold text-[var(--primary-text)] whitespace-nowrap">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
