import { useState, useMemo } from "react"
import { Icon } from "../../components/Icon"
import { PageHeader } from "../../components/PageHeader"
import { PropertyCard } from "../../components/PropertyCard"
import { SearchResultsMapView } from "../../components/SearchResultsMapView"
import { PropertyCompareFloatingBar } from "../../components/PropertyCompareFloatingBar"
import { PropertyCompareModal } from "../../components/PropertyCompareModal"
import type { Property } from "../../types"

export function SearchResults({
  go,
  onOpen,
  results,
  favoriteIds,
  onToggleFavorite,
  reportedPropertyIds,
  onReportProperty,
  onReset,
  isGuest = false,
  onPromptGuestLogin,
}: {
  go: (screen: number) => void
  onOpen: (property: Property) => void
  results: Property[]
  favoriteIds: Set<string>
  onToggleFavorite: (propertyId: string) => void
  reportedPropertyIds: Set<string>
  onReportProperty: (propertyId: string) => void
  onReset: () => void
  isGuest?: boolean
  onPromptGuestLogin?: () => void
}) {
  const [saved, setSaved] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [selectedCompareProperties, setSelectedCompareProperties] = useState<Property[]>([])
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const selectedCompareIds = useMemo(() => {
    return new Set(selectedCompareProperties.map((p) => p.id))
  }, [selectedCompareProperties])

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current))
    }, 3000)
  }

  const handleToggleCompare = (property: Property) => {
    if (isGuest) {
      if (onPromptGuestLogin) onPromptGuestLogin()
      return
    }
    if (selectedCompareIds.has(property.id)) {
      setSelectedCompareProperties((current) =>
        current.filter((item) => item.id !== property.id),
      )
      showToast(`تمت إزالة "${property.title}" من المقارنة`)
    } else {
      if (selectedCompareProperties.length >= 3) {
        showToast("يمكنك اختيار 3 عقارات كحد أقصى للمقارنة")
        return
      }
      setSelectedCompareProperties((current) => [...current, property])
      showToast(`تمت إضافة "${property.title}" إلى المقارنة (${selectedCompareProperties.length + 1}/3)`)
    }
  }

  const handleRemoveCompare = (propertyId: string) => {
    setSelectedCompareProperties((current) =>
      current.filter((item) => item.id !== propertyId),
    )
  }

  const handleClearCompare = () => {
    setSelectedCompareProperties([])
    showToast("تم إفراغ قائمة المقارنة")
  }

  return (
    <section className="screen feature-screen relative pb-28">
      <PageHeader title="نتائج البحث" go={go} />

      <main className="results-content">
        {/* شريط حفظ البحث */}
        <button
          className={saved ? "save-search saved" : "save-search"}
          onClick={() => {
            if (isGuest) {
              if (onPromptGuestLogin) onPromptGuestLogin()
              return
            }
            setSaved(!saved)
          }}
          type="button"
        >
          <span>
            <Icon name="bell" />
          </span>
          <div>
            <strong>{saved ? "تم حفظ البحث" : "حفظ البحث"}</strong>
            <p>سنخبرك عند إضافة عقارات جديدة مطابقة</p>
          </div>
          <b>{saved ? "✓" : "+"}</b>
        </button>

        {/* رأس النتائج: العنوان وأزرار العرض (قائمة / خريطة) وفلتر التعديل */}
        {/* رأس النتائج: العنوان وأزرار العرض (خريطة وقائمة) محاذاة كلياً لأقصى اليمين */}
        <div className="results-heading mb-4 flex w-full flex-col items-start justify-start gap-3 text-right" dir="rtl">
          {/* محاذاة عنوان العقارات المتاحة لأقصى اليمين */}
          <div className="w-full text-right flex flex-col items-start justify-start">
            <h2 className="text-base font-black text-[var(--text)] text-right">العقارات المتاحة</h2>
            <p className="mt-0.5 text-xs font-medium text-[var(--text-muted)] text-right">
              {results.length
                ? `وجدنا ${results.length} عقارات تناسب بحثك`
                : "لا توجد نتائج مطابقة"}
            </p>
          </div>

          {/* محاذاة أزرار العرض (عرض الخريطة وقائمة) وزر التعديل لأقصى اليمين */}
          <div className="flex w-full flex-wrap items-center justify-start gap-2.5 text-right" dir="rtl">
            {/* إطار التبديل محاذى تماماً لليمين */}
            <div
              className="flex items-center gap-1 rounded-2xl border-2 border-[var(--primary)] bg-[var(--surface-soft)] p-1 shadow-md shrink-0"
              role="group"
              aria-label="نوع العرض"
            >
              {/* زر عرض الخريطة على أقصى اليمين */}
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all duration-300 ${
                  viewMode === "map"
                    ? "bg-[var(--primary-strong)] text-white shadow-md ring-2 ring-[var(--primary)] scale-105"
                    : "bg-[var(--primary-soft)] text-[var(--primary-text)] hover:bg-[var(--primary)] hover:text-white"
                }`}
                aria-pressed={viewMode === "map"}
              >
                <span className="grid size-5 place-items-center rounded-full bg-black/10 text-[11px]">
                  🗺️
                </span>
                <span>عرض الخريطة</span>
                {viewMode === "map" && (
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>

              {/* زر قائمة بجانبه على اليسار */}
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-[var(--surface-raised)] text-[var(--text)] shadow-xs font-black"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
                aria-pressed={viewMode === "list"}
              >
                <Icon name="menu" />
                <span>قائمة</span>
              </button>
            </div>

            {/* زر تعديل الفلاتر */}
            <button
              onClick={() => go(16)}
              type="button"
              className="flex items-center gap-1.5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-xs font-bold text-[var(--text)] transition hover:border-[var(--primary)] hover:bg-[var(--surface-soft)] shrink-0"
            >
              <Icon name="filter" />
              <span>تعديل البحث</span>
            </button>
          </div>
        </div>

        {/* محتوى الشاشة حسب نمط العرض المحدد (قائمة أو خريطة) */}
        {results.length ? (
          viewMode === "map" ? (
            <SearchResultsMapView
              properties={results}
              onOpen={onOpen}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
              selectedCompareIds={selectedCompareIds}
              onToggleCompare={handleToggleCompare}
              isGuest={isGuest}
              onPromptGuestLogin={onPromptGuestLogin}
            />
          ) : (
            <div className="property-list">
              {results.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onOpen={onOpen}
                  favorite={favoriteIds.has(property.id)}
                  onToggleFavorite={onToggleFavorite}
                  reported={reportedPropertyIds.has(property.id)}
                  onReport={onReportProperty}
                  comparing={selectedCompareIds.has(property.id)}
                  onToggleCompare={handleToggleCompare}
                  isGuest={isGuest}
                  onPromptGuestLogin={onPromptGuestLogin}
                />
              ))}
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-6 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
              <Icon name="search" />
            </span>
            <h2 className="mt-4 text-sm font-extrabold text-[var(--text)]">
              عذراً، لم نجد عقارات مطابقة لبحثك
            </h2>
            <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
              جرّب تعديل الخيارات أو أرسل طلباً مخصصاً وسنساعدك في العثور على
              العقار.
            </p>
            <div className="mt-5 grid gap-2">
              <button
                type="button"
                className="min-h-11 rounded-xl bg-[var(--primary-strong)] px-4 text-xs font-bold text-[var(--dark-text)]"
                onClick={onReset}
              >
                إعادة ضبط الفلاتر
              </button>
              <button
                type="button"
                className="min-h-11 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-xs font-bold text-[var(--text)]"
                onClick={() => {
                  if (isGuest) {
                    if (onPromptGuestLogin) onPromptGuestLogin()
                    return
                  }
                  go(34)
                }}
              >
                <span aria-hidden="true">📝</span> طلب عقار مخصص
              </button>
              <button
                type="button"
                className="min-h-11 rounded-xl border border-[var(--primary)] bg-[var(--primary-soft)] px-4 text-xs font-bold text-[var(--primary-text)]"
                onClick={() => {
                  if (isGuest) {
                    if (onPromptGuestLogin) onPromptGuestLogin()
                    return
                  }
                  go(17)
                }}
              >
                <span aria-hidden="true">✨</span> ابحث بالذكاء الاصطناعي
              </button>
            </div>
          </div>
        )}
      </main>

      {/* الشريط العائم لمقارنة العقارات المحددة */}
      {!isGuest && (
        <PropertyCompareFloatingBar
          selectedProperties={selectedCompareProperties}
          onRemove={handleRemoveCompare}
          onClear={handleClearCompare}
          onOpenCompare={() => setIsCompareModalOpen(true)}
        />
      )}

      {/* نافذة مقارنة العقارات المنبثقة الشاملة */}
      {!isGuest && isCompareModalOpen && (
        <PropertyCompareModal
          properties={selectedCompareProperties}
          onClose={() => setIsCompareModalOpen(false)}
          onRemove={handleRemoveCompare}
          onOpenProperty={onOpen}
        />
      )}

      {/* إشعار منبثق عند التفاعل مع المقارنة */}
      {toastMessage && (
        <div
          className="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)]/95 px-4 py-2.5 text-xs font-bold text-[var(--text)] shadow-xl backdrop-blur-md transition-all animate-bounce"
          role="status"
          aria-live="polite"
        >
          {toastMessage}
        </div>
      )}
    </section>
  )
}
