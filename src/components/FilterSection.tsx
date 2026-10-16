import type { ReactNode } from "react"

export function FilterSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="w-full min-w-0 shrink-0 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-xs">
      <h2 className="mb-3 text-xs font-extrabold text-[var(--text)] shrink-0">
        {title}
      </h2>
      <div className="w-full min-w-0 shrink-0">
        {children}
      </div>
    </section>
  )
}
