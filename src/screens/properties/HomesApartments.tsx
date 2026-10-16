import { useState } from "react"
import { Icon } from "../../components/Icon"
import { PropertyCard } from "../../components/PropertyCard"
import { bottomNav } from "../../data/navigation"
import type { Property } from "../../types"

export function HomesApartments({
  go,
  onOpenFilters,
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
  onOpenFilters: () => void
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
  const [purpose, setPurpose] = useState("الكل")
  const [searchQuery, setSearchQuery] = useState("")
  const [sort, setSort] = useState("الأحدث")

  const categoryMap: Record<string, Property["type"] | undefined> = {
    الكل: undefined,
    شقق: "شقة",
    "منازل مستقلة": "منزل مستقل",
    فلل: "فيلا",
  }

  const allResidential = allProperties.filter(
    (property) => property.category === "residential",
  )

  const visible = allResidential
    .filter(
      (property) =>
        !categoryMap[category] || property.type === categoryMap[category],
    )
    .filter(
      (property) =>
        purpose === "الكل" || property.purpose === purpose,
    )
    .filter(
      (property) =>
        !searchQuery.trim() ||
        property.title.includes(searchQuery) ||
        property.location.governorate.includes(searchQuery) ||
        property.location.district.includes(searchQuery),
    )
    .sort((a, b) => {
      if (sort === "السعر: الأقل") return a.price - b.price
      if (sort === "السعر: الأعلى") return b.price - a.price
      return Date.parse(b.createdAt) - Date.parse(a.createdAt)
    })

  return (
    <section className="screen !bg-[var(--surface-soft)] text-[var(--text)] relative pb-28">
      {/* الترويسة العلوية الفخمة */}
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
            <h1 className="text-base font-black text-[var(--text)]">
              المنازل والشقق
            </h1>
            <span className="text-[10px] font-bold text-[var(--primary-text)]">
              مجموع {allResidential.length} عقار سكني متاح
            </span>
          </div>

          <button
            className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-95"
            onClick={onOpenFilters}
            aria-label="فتح تصفية البحث"
          >
            <Icon name="filter" />
          </button>
        </div>

        {/* شريط البحث المباشر */}
        <div className="relative flex items-center">
          <Icon name="search" />
          <input
            type="text"
            className="h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] pr-10 pl-4 text-xs font-bold text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-blue-500 focus:bg-[var(--surface)] transition-all"
            placeholder="ابحث بالاسم، المدينة، أو الحي (مثل: حدة، صنعاء)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-3 space-y-4">
        {/* أزرار التصفية والهدف */}
        <div className="flex flex-col gap-2" dir="rtl">
          {/* الغرض: الكل / للبيع / للإيجار */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-1">
            {["الكل", "للبيع", "للإيجار"].map((p) => (
              <button
                key={p}
                onClick={() => setPurpose(p)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                  purpose === p
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* فئات السكني */}
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none]">
            {Object.keys(categoryMap).map((item) => {
              const count = allResidential.filter(
                (p) => !categoryMap[item] || p.type === categoryMap[item],
              ).length
              return (
                <button
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    category === item
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
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
                        : "bg-[var(--surface-soft)] text-[var(--primary-text)]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* شريط التحكم بالنتائج والترتيب */}
        <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)]" dir="rtl">
          <span>تم إيجاد <strong className="text-[var(--primary-text)]">{visible.length}</strong> عقار</span>
          
          <div className="flex items-center gap-1.5">
            <span>الترتيب:</span>
            <select
              className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-2 py-1 text-xs font-bold text-[var(--text)] outline-none focus:border-blue-500"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option>الأحدث</option>
              <option>السعر: الأقل</option>
              <option>السعر: الأعلى</option>
            </select>
          </div>
        </div>

        {/* قائمة العقارات السكنية */}
        <div className="grid gap-4">
          {visible.map((property) => (
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

        {!visible.length && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="grid size-16 place-items-center rounded-2xl bg-[var(--surface-raised)] border border-[var(--line)] text-3xl shadow-sm">
              🏠
            </div>
            <p className="text-sm font-extrabold text-[var(--text)]">لا توجد عقارات مطابقة لخيارات البحث</p>
            <p className="text-xs text-[var(--text-muted)] max-w-xs">جرّب تغيير كلمات البحث أو إعادة ضبط الفلاتر للحصول على نتائج أكثر.</p>
            <button
              onClick={() => {
                setCategory("الكل")
                setPurpose("الكل")
                setSearchQuery("")
              }}
              className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}
      </main>

      {/* شريط التنقل السفلي */}
      <nav className="bottom-nav account-bottom-nav" aria-label="التنقل الرئيسي">
        {bottomNav.map((item, index) => (
          <button
            key={item.label}
            className={index === 0 ? "active" : ""}
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
