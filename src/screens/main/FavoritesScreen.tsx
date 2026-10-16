import { useState } from "react"
import { Icon } from "../../components/Icon"
import { PropertyCard } from "../../components/PropertyCard"
import { propertyAddress, propertyPrice } from "../../utils/property"
import type { Property } from "../../types"

export function FavoritesScreen({
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
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [searchQuery, setSearchQuery] = useState("")
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set())
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [notice, setNotice] = useState("")

  // العقارات المضافة للمفضلة
  const allFavorites = allProperties.filter((property) =>
    favoriteIds.has(property.id),
  )

  // التصفية والبحث في المفضلة
  const visibleFavorites = allFavorites
    .filter((property) => {
      if (selectedCategory === "الكل") return true
      if (selectedCategory === "سكني") return property.category === "residential"
      if (selectedCategory === "تجاري") return property.category === "commercial"
      if (selectedCategory === "فنادق") return property.category === "hotel"
      if (selectedCategory === "شاليهات") return property.category === "chalet"
      if (selectedCategory === "أراضي") return property.category === "land"
      return true
    })
    .filter(
      (property) =>
        !searchQuery.trim() ||
        property.title.includes(searchQuery) ||
        property.location.governorate.includes(searchQuery) ||
        property.location.district.includes(searchQuery),
    )

  // تبديل اختيار العقار للمقارنة
  const toggleCompare = (property: Property) => {
    if (isGuest) {
      if (onPromptGuestLogin) onPromptGuestLogin()
      return
    }
    setCompareIds((prev) => {
      const next = new Set(prev)
      if (next.has(property.id)) {
        next.delete(property.id)
      } else {
        if (next.size >= 4) {
          setNotice("يمكنك مقارنة حتى 4 عقارات فقط في نفس الوقت")
          return prev
        }
        next.add(property.id)
      }
      return next
    })
  }

  const comparedProperties = allProperties.filter((p) => compareIds.has(p.id))

  const categories = [
    { label: "الكل", val: "الكل" },
    { label: "منازل وشقق", val: "سكني" },
    { label: "تجاري ومكاتب", val: "تجاري" },
    { label: "فنادق وأجنحة", val: "فنادق" },
    { label: "شاليهات", val: "شاليهات" },
    { label: "أراضي", val: "أراضي" },
  ]

  return (
    <section className="screen !bg-[var(--surface-soft)] text-[var(--text)] relative pb-28">
      {/* الترويسة العلوية الأنيقة */}
      <header
        className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3 shadow-xs"
        dir="rtl"
      >
        <button
          className="grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] shadow-xs transition hover:bg-[var(--surface-soft)] active:scale-95"
          onClick={() => go(-1)}
          aria-label="رجوع"
        >
          <Icon name="arrow" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-black text-[var(--text)]">
            عقاراتي المفضلة ❤️
          </h1>
          <span className="text-[10px] font-bold text-[var(--primary-text)]">
            إجمالي {allFavorites.length} عقار محفوظ
          </span>
        </div>

        {compareIds.size > 0 ? (
          <button
            onClick={() => setShowCompareModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 active:scale-95"
          >
            <span>مقارنة ({compareIds.size})</span>
          </button>
        ) : (
          <div className="size-10" />
        )}
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-3 space-y-4">
        {/* شريط البحث والتصفية */}
        {allFavorites.length > 0 && (
          <div className="space-y-2.5" dir="rtl">
            <div className="relative flex items-center">
              <Icon name="search" />
              <input
                type="text"
                className="h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] pr-10 pl-4 text-xs font-bold text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-blue-500 shadow-xs"
                placeholder="ابحث في العقارات المفضلة..."
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

            {/* أزرار الفئات السريعة */}
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none]">
              {categories.map((c) => {
                const count = allFavorites.filter((p) => {
                  if (c.val === "الكل") return true
                  if (c.val === "سكني") return p.category === "residential"
                  if (c.val === "تجاري") return p.category === "commercial"
                  if (c.val === "فنادق") return p.category === "hotel"
                  if (c.val === "شاليهات") return p.category === "chalet"
                  if (c.val === "أراضي") return p.category === "land"
                  return true
                }).length

                return (
                  <button
                    key={c.val}
                    onClick={() => setSelectedCategory(c.val)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      selectedCategory === c.val
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px]">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* شريط الإحصائيات وزر فتح المقارنة إذا وجد محدد */}
        {compareIds.size > 0 && (
          <div
            className="flex items-center justify-between rounded-2xl border border-blue-500/30 bg-blue-50 dark:bg-blue-950/30 p-3 text-xs"
            dir="rtl"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-blue-600 text-white font-black text-xs">
                {compareIds.size}
              </span>
              <span className="font-bold text-[var(--text)]">
                تم تحديد عقارات للمقارنة المباشرة
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                className="rounded-xl bg-blue-600 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
              >
                عرض الجدول 📊
              </button>
              <button
                type="button"
                onClick={() => setCompareIds(new Set())}
                className="text-[10px] font-bold text-rose-500 hover:underline"
              >
                إلغاء التحديد
              </button>
            </div>
          </div>
        )}

        {/* قائمة العقارات المفضلة */}
        <div className="grid gap-4">
          {visibleFavorites.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onOpen={onOpen}
              favorite={true}
              onToggleFavorite={onToggleFavorite}
              reported={reportedPropertyIds.has(property.id)}
              onReport={onReportProperty}
              comparing={compareIds.has(property.id)}
              onToggleCompare={toggleCompare}
              isGuest={isGuest}
              onPromptGuestLogin={onPromptGuestLogin}
            />
          ))}
        </div>

        {/* حالة عدم وجود عقارات مفضلة */}
        {!visibleFavorites.length && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4" dir="rtl">
            <div className="grid size-20 place-items-center rounded-3xl bg-[var(--surface-raised)] border border-[var(--line)] text-4xl shadow-sm">
              ❤️
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-[var(--text)]">
                {allFavorites.length === 0
                  ? "لا توجد عقارات في قائمة المفضلة بعد"
                  : "لا توجد نتائج مطابقة لخيارات البحث"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-xs leading-5">
                {allFavorites.length === 0
                  ? "يمكنك إدخال أي عقار يُعجبك في المفضلة عبر النقر على رمز القلب لسهولة الوصول إليه والربط بين الخيارات."
                  : "جرب تغيير فئة التصفية أو مسح كلمة البحث."}
              </p>
            </div>

            {allFavorites.length === 0 ? (
              <button
                onClick={() => go(14)}
                className="rounded-2xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-95"
              >
                استكشف العقارات المتاحة الآن 🚀
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedCategory("الكل")
                  setSearchQuery("")
                }}
                className="rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-2 text-xs font-bold text-[var(--text)]"
              >
                إعادة ضبط البحث
              </button>
            )}
          </div>
        )}
      </main>

      {/* نافذة مقارنة العقارات المحددة */}
      {showCompareModal && (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-[var(--surface-soft)]"
          role="dialog"
          aria-modal="true"
          dir="rtl"
        >
          <header className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCompareModal(false)}
                className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-soft)]"
              >
                <Icon name="close" />
              </button>
              <div>
                <strong className="block text-sm font-black text-[var(--text)]">
                  مقارنة العقارات المختارة 📊
                </strong>
                <span className="text-[10px] text-[var(--text-muted)]">
                  مقارنة تفصيلية لـ {comparedProperties.length} عقارات
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setCompareIds(new Set())
                setShowCompareModal(false)
              }}
              className="text-xs font-bold text-rose-500 hover:underline"
            >
              مسح خيارات المقارنة
            </button>
          </header>

          <main className="flex-1 overflow-x-auto p-4">
            <div className="min-w-[640px] space-y-4">
              {/* جدول المقارنة الفاخر */}
              <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(160px,1fr))] gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-3 text-xs">
                {/* صف الصور والعناوين */}
                <div className="font-black text-[var(--text-muted)] flex items-center">
                  العقار
                </div>
                {comparedProperties.map((p) => (
                  <div key={p.id} className="space-y-2 text-center p-2 rounded-xl bg-[var(--surface-soft)]">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-24 w-full object-cover rounded-lg shadow-xs"
                    />
                    <strong className="block truncate text-xs font-black text-[var(--text)]">
                      {p.title}
                    </strong>
                    <span className="inline-block rounded-md bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold text-blue-600">
                      {p.purpose}
                    </span>
                  </div>
                ))}

                {/* صف السعر */}
                <div className="font-bold text-[var(--text-muted)] flex items-center border-t border-[var(--line)] pt-2">
                  السعر المطلوب
                </div>
                {comparedProperties.map((p) => (
                  <div key={p.id} className="text-center font-black text-blue-600 border-t border-[var(--line)] pt-2">
                    {propertyPrice(p)}
                  </div>
                ))}

                {/* صف الموقع */}
                <div className="font-bold text-[var(--text-muted)] flex items-center border-t border-[var(--line)] pt-2">
                  الموقع والحي
                </div>
                {comparedProperties.map((p) => (
                  <div key={p.id} className="text-center text-[10px] text-[var(--text)] border-t border-[var(--line)] pt-2">
                    📍 {propertyAddress(p)}
                  </div>
                ))}

                {/* صف المساحة والمواصفات */}
                <div className="font-bold text-[var(--text-muted)] flex items-center border-t border-[var(--line)] pt-2">
                  المساحة والغرف
                </div>
                {comparedProperties.map((p) => (
                  <div key={p.id} className="text-center text-[10px] text-[var(--text)] border-t border-[var(--line)] pt-2 space-y-1">
                    {p.area && <span className="block font-bold">{p.area} م²</span>}
                    {p.category === "residential" && (
                      <span className="block text-[9px] text-[var(--text-muted)]">
                        🛏️ {p.bedrooms} نوم · 🚿 {p.bathrooms} حمام
                      </span>
                    )}
                  </div>
                ))}

                {/* صف المالك والتنقل */}
                <div className="font-bold text-[var(--text-muted)] flex items-center border-t border-[var(--line)] pt-2">
                  الإجراء
                </div>
                {comparedProperties.map((p) => (
                  <div key={p.id} className="border-t border-[var(--line)] pt-2 flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        setShowCompareModal(false)
                        onOpen(p)
                      }}
                      className="w-full rounded-lg bg-blue-600 py-1.5 text-[10px] font-bold text-white shadow-xs hover:bg-blue-700"
                    >
                      فتح التفاصيل ↗
                    </button>
                    <button
                      onClick={() => {
                        setCompareIds((prev) => {
                          const next = new Set(prev)
                          next.delete(p.id)
                          return next
                        })
                      }}
                      className="text-[9px] text-rose-500 font-bold hover:underline text-center"
                    >
                      إزالة من المقارنة
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      )}

      {notice && (
        <div className="absolute bottom-6 left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-xl bg-[var(--overlay)] px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-md">
          {notice}
        </div>
      )}
    </section>
  )
}
