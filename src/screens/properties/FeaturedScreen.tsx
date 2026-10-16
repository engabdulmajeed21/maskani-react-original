import { useState } from "react"
import { Icon } from "../../components/Icon"
import { PropertyCard } from "../../components/PropertyCard"
import { bottomNav } from "../../data/navigation"
import type { Property } from "../../types"

export function FeaturedScreen({
  go,
  onOpen,
  favoriteIds,
  onToggleFavorite,
  reportedPropertyIds,
  onReportProperty,
  allProperties,
  isGuest = false,
  onPromptGuestLogin,
}: {
  go: (screen: number) => void
  onOpen: (property: Property) => void
  favoriteIds: Set<string>
  onToggleFavorite: (propertyId: string) => void
  reportedPropertyIds: Set<string>
  onReportProperty: (propertyId: string) => void
  allProperties: Property[]
  isGuest?: boolean
  onPromptGuestLogin?: () => void
}) {
  const [category, setCategory] = useState("الكل")
  const [sort, setSort] = useState("الأحدث")

  const categories = [
    "الكل",
    "المنازل والشقق",
    "المحلات التجارية",
    "الأراضي",
    "الفنادق",
    "الشاليهات",
  ]

  const featured = allProperties
    .filter((property) => property.featured === true)
    .filter((property) => {
      if (category === "الكل") return true
      if (category === "المنازل والشقق") return property.category === "residential"
      if (category === "المحلات التجارية") return property.category === "commercial"
      if (category === "الأراضي") return property.category === "land"
      if (category === "الفنادق") return property.category === "hotel"
      if (category === "الشاليهات") return property.category === "chalet"
      return true
    })
    .sort((a, b) => {
      if (sort === "السعر: الأقل") return a.price - b.price
      if (sort === "السعر: الأعلى") return b.price - a.price
      return Date.parse(b.createdAt) - Date.parse(a.createdAt)
    })

  return (
    <section className="screen !bg-[var(--surface-soft)] text-[var(--text)] relative pb-36">
      <header
        className="flex flex-col gap-3 border-b border-[var(--line)] bg-[var(--surface-raised)] px-4 pb-3 pt-4 shadow-xs"
        dir="rtl"
      >
        <div className="flex items-center justify-between">
          <button
            className="grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] shadow-xs transition hover:bg-[var(--surface-soft)] active:scale-95"
            onClick={() => go(-1)}
            aria-label="رجوع"
          >
            <Icon name="arrow" />
          </button>
          
          <div className="text-center">
            <h1 className="text-base font-black text-[var(--text)] flex items-center justify-center gap-1.5">
              <span>⭐</span> العروض المميزة
            </h1>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
              أفضل العقارات المختارة بعناية فائقة
            </span>
          </div>

          <div className="size-10" />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-3 space-y-4 pb-36">
        <div className="flex flex-col gap-2" dir="rtl">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none]">
            {categories.map((item) => {
              const count = allProperties
                .filter((p) => p.featured === true)
                .filter((p) => {
                  if (item === "الكل") return true
                  if (item === "المنازل والشقق") return p.category === "residential"
                  if (item === "المحلات التجارية") return p.category === "commercial"
                  if (item === "الأراضي") return p.category === "land"
                  if (item === "الفنادق") return p.category === "hotel"
                  if (item === "الشاليهات") return p.category === "chalet"
                  return true
                }).length

              return (
                <button
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    category === item
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                      : "border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--text)] hover:bg-[var(--surface-soft)]"
                  }`}
                  key={item}
                  onClick={() => setCategory(item)}
                >
                  <span>{item}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${
                      category === item
                        ? "bg-white/20 text-white"
                        : "bg-[var(--surface-soft)] text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)]" dir="rtl">
          <span>تم إيجاد <strong className="text-amber-600 dark:text-amber-400">{featured.length}</strong> عرض مميز</span>
          
          <div className="flex items-center gap-1.5">
            <span>الترتيب:</span>
            <select
              className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-2 py-1 text-xs font-bold text-[var(--text)] outline-none focus:border-amber-500"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option>الأحدث</option>
              <option>السعر: الأقل</option>
              <option>السعر: الأعلى</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          {featured.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onOpen={onOpen}
              favorite={favoriteIds.has(property.id)}
              onToggleFavorite={onToggleFavorite}
              reported={reportedPropertyIds.has(property.id)}
              onReport={onReportProperty}
              isGuest={isGuest}
              onPromptGuestLogin={onPromptGuestLogin}
            />
          ))}
        </div>

        {!featured.length && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="grid size-16 place-items-center rounded-2xl bg-[var(--surface-raised)] border border-[var(--line)] text-3xl shadow-sm">
              ⭐
            </div>
            <p className="text-sm font-extrabold text-[var(--text)]">لا توجد عروض مميزة ضمن هذا التصنيف</p>
            <p className="text-xs text-[var(--text-muted)] max-w-xs">جرّب اختيار تصنيف آخر لعرض العقارات المميزة المتاحة.</p>
            <button
              onClick={() => setCategory("الكل")}
              className="mt-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-600"
            >
              عرض كافة العروض المميزة
            </button>
          </div>
        )}
      </main>

      <nav className="bottom-nav account-bottom-nav" aria-label="التنقل الرئيسي">
        {bottomNav.map((item, index) => (
          <button
            key={item.label}
            className={index === 2 ? "active" : ""}
            onClick={() => go(item.target)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </section>
  )
}
