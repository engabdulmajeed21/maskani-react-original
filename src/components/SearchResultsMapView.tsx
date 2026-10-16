import { useState, useMemo } from "react"
import { Icon } from "./Icon"
import type { Property } from "../types"
import { propertyAddress, propertyPrice } from "../utils/property"

interface SearchResultsMapViewProps {
  properties: Property[]
  onOpen: (property: Property) => void
  favoriteIds: Set<string>
  onToggleFavorite: (propertyId: string) => void
  selectedCompareIds: Set<string>
  onToggleCompare: (property: Property) => void
  isGuest?: boolean
  onPromptGuestLogin?: () => void
}

// إحداثيات نسبية تقريبية للمدن والأحياء اليمنية على خريطة الويب التفاعلية (%)
const LOCATION_COORDINATES: Record<string, { x: number; y: number }> = {
  // صنعاء وضواحيها
  "صنعاء-حدة": { x: 38, y: 38 },
  "صنعاء-السبعين": { x: 42, y: 41 },
  "صنعاء-بيت بوس": { x: 40, y: 44 },
  "صنعاء-الروضة": { x: 44, y: 32 },
  "صنعاء-بني الحارث": { x: 45, y: 30 },
  "صنعاء-معين": { x: 35, y: 36 },
  "صنعاء-شعوب": { x: 46, y: 36 },
  "صنعاء-حي الجامعة": { x: 36, y: 37 },
  "صنعاء": { x: 41, y: 38 },

  // عدن وضواحيها
  "عدن-خور مكسر": { x: 53, y: 76 },
  "عدن-كريتر": { x: 55, y: 79 },
  "عدن-المعلا": { x: 50, y: 78 },
  "عدن-المنصورة": { x: 51, y: 73 },
  "عدن-الشيخ عثمان": { x: 52, y: 71 },
  "عدن-العريش": { x: 56, y: 75 },
  "عدن": { x: 53, y: 76 },

  // إب
  "إب-الظهار": { x: 39, y: 55 },
  "إب-المشنة": { x: 41, y: 56 },
  "إب": { x: 40, y: 55 },

  // تعز
  "تعز-المظفر": { x: 36, y: 64 },
  "تعز-القاهرة": { x: 38, y: 65 },
  "تعز-صالة": { x: 39, y: 66 },
  "تعز": { x: 37, y: 65 },

  // حضرموت
  "حضرموت-المكلا": { x: 78, y: 68 },
  "حضرموت-فوه": { x: 75, y: 69 },
  "حضرموت-سيئون": { x: 80, y: 46 },
  "حضرموت": { x: 78, y: 65 },

  // الحديدة
  "الحديدة": { x: 25, y: 45 },

  // مأرب
  "مأرب": { x: 55, y: 38 },
}

function getPropertyCoordinates(property: Property, index: number) {
  const gov = property.location.governorate || ""
  const neighborhood = property.location.neighborhood || ""
  const keyWithNeighborhood = `${gov}-${neighborhood}`

  const base =
    LOCATION_COORDINATES[keyWithNeighborhood] ||
    LOCATION_COORDINATES[gov] || { x: 42, y: 42 }

  // توزيع عشوائي دقيق طفيف لتجنب تطابق المواقع في نفس الحي
  const jitterX = ((index * 7) % 11) - 5
  const jitterY = ((index * 5) % 11) - 5

  return {
    x: Math.min(92, Math.max(8, base.x + jitterX * 0.9)),
    y: Math.min(88, Math.max(12, base.y + jitterY * 0.9)),
  }
}

export function SearchResultsMapView({
  properties,
  onOpen,
  favoriteIds,
  onToggleFavorite,
  selectedCompareIds,
  onToggleCompare,
  isGuest = false,
  onPromptGuestLogin,
}: SearchResultsMapViewProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    properties[0]?.id ?? null,
  )
  const [activeCity, setActiveCity] = useState<string>("الكل")
  const [zoomLevel, setZoomLevel] = useState<number>(1)

  // استخراج قائمة المدن الموجودة في العقارات
  const availableCities = useMemo(() => {
    const set = new Set<string>()
    properties.forEach((p) => {
      if (p.location.governorate) set.add(p.location.governorate)
    })
    return ["الكل", ...Array.from(set)]
  }, [properties])

  // تصفية العقارات بناءً على المدينة المحددة في الخريطة
  const displayedProperties = useMemo(() => {
    if (activeCity === "الكل") return properties
    return properties.filter((p) => p.location.governorate === activeCity)
  }, [properties, activeCity])

  const selectedProperty = useMemo(() => {
    return (
      displayedProperties.find((p) => p.id === selectedPropertyId) ||
      displayedProperties[0] ||
      null
    )
  }, [displayedProperties, selectedPropertyId])

  // اختصار السعر لعرضه في الدبوس
  const formatShortPrice = (property: Property) => {
    if (property.price >= 1000000) {
      return `${(property.price / 1000000).toFixed(0)} م`
    }
    if (property.price >= 1000) {
      return `${(property.price / 1000).toFixed(0)} ألف`
    }
    return `${property.price}`
  }

  return (
    <div
      className="relative flex h-[78vh] min-h-[550px] w-full flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-lg"
      dir="rtl"
    >
      {/* شريط أدوات الخريطة والفلترة السريعة للمدن */}
      <div className="z-20 flex shrink-0 items-center justify-between gap-2 border-b border-[var(--line)] bg-[var(--surface-raised)]/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="shrink-0 text-[11px] font-bold text-[var(--text-muted)]">
            المنطقة:
          </span>
          {availableCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setActiveCity(city)
                const firstInCity =
                  city === "الكل"
                    ? properties[0]?.id
                    : properties.find((p) => p.location.governorate === city)?.id
                if (firstInCity) setSelectedPropertyId(firstInCity)
              }}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeCity === city
                  ? "bg-[var(--primary-strong)] text-white shadow-sm"
                  : "border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-soft)]"
              }`}
            >
              {city}
              {city !== "الكل" && (
                <span className="mr-1 text-[10px] opacity-75">
                  (
                  {properties.filter((p) => p.location.governorate === city).length}
                  )
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <span className="flex items-center gap-1.5 rounded-xl bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-black text-[var(--primary-text)]">
            <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
            {displayedProperties.length} عقارات على الخريطة
          </span>
        </div>
      </div>

      {/* لوحة الخريطة التفاعلية */}
      <div className="relative flex-1 select-none overflow-hidden bg-slate-100 dark:bg-[#0c1418]">
        {/* خلفية الخريطة الجغرافية والطرق والمسطحات المائية */}
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center center",
          }}
        >
          {/* طبقة SVG الطبوغرافية لليمن */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none opacity-40 dark:opacity-25"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="map-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  className="text-[var(--line)]"
                />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#map-grid)" />

            {/* مسار ساحل خليج عدن والبحر الأحمر التوضيحي */}
            <path
              d="M 120 700 Q 180 500 220 400 T 320 280 T 450 180"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="18"
              strokeLinecap="round"
              className="opacity-20"
            />
            <path
              d="M 220 700 Q 400 660 520 620 T 750 560 T 980 520"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="24"
              strokeLinecap="round"
              className="opacity-25"
            />

            {/* شبكة الطرق السريعة الرئيسية */}
            <path
              d="M 380 200 L 410 320 L 420 480 L 470 560 L 530 640"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeDasharray="4 4"
              className="text-[var(--line-strong)]"
            />
            <path
              d="M 410 320 L 600 340 L 780 440 L 820 540"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-[var(--line-strong)]"
            />
            <path
              d="M 420 480 L 360 540 L 390 600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-[var(--line-strong)]"
            />
          </svg>

          {/* أسماء المعالم والمناطق الرئيسية على الخريطة */}
          <div className="absolute left-[38%] top-[25%] pointer-events-none rounded-lg bg-[var(--surface)]/70 px-2 py-0.5 text-[10px] font-black text-[var(--text-muted)] shadow-xs backdrop-blur-xs">
            صنعاء العاصمة
          </div>
          <div className="absolute left-[50%] top-[78%] pointer-events-none rounded-lg bg-[var(--surface)]/70 px-2 py-0.5 text-[10px] font-black text-[var(--text-muted)] shadow-xs backdrop-blur-xs">
            عدن
          </div>
          <div className="absolute left-[34%] top-[66%] pointer-events-none rounded-lg bg-[var(--surface)]/70 px-2 py-0.5 text-[10px] font-black text-[var(--text-muted)] shadow-xs backdrop-blur-xs">
            تعز
          </div>
          <div className="absolute left-[37%] top-[54%] pointer-events-none rounded-lg bg-[var(--surface)]/70 px-2 py-0.5 text-[10px] font-black text-[var(--text-muted)] shadow-xs backdrop-blur-xs">
            إب الخضراء
          </div>
          <div className="absolute left-[75%] top-[62%] pointer-events-none rounded-lg bg-[var(--surface)]/70 px-2 py-0.5 text-[10px] font-black text-[var(--text-muted)] shadow-xs backdrop-blur-xs">
            المكلا / حضرموت
          </div>

          {/* دبابيس العقارات التفاعلية */}
          {displayedProperties.map((property, idx) => {
            const coords = getPropertyCoordinates(property, idx)
            const isSelected = selectedProperty?.id === property.id
            const isComparing = selectedCompareIds.has(property.id)

            return (
              <div
                key={property.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-full transition-all duration-300"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedPropertyId(property.id)}
                  className={`group relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black shadow-lg transition-transform hover:scale-110 active:scale-95 ${
                    isSelected
                      ? "bg-[var(--primary-strong)] text-white ring-4 ring-[var(--primary)]/30 scale-110 z-30"
                      : isComparing
                        ? "bg-amber-500 text-white ring-2 ring-amber-300"
                        : "border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--text)] hover:border-[var(--primary)]"
                  }`}
                  aria-label={`تحديد عقار: ${property.title}`}
                >
                  <span className="grid size-4 place-items-center rounded-full bg-black/15 text-[9px]">
                    📍
                  </span>
                  <span>{formatShortPrice(property)}</span>
                  <span className="text-[10px] opacity-80">{property.currency}</span>

                  {isComparing && (
                    <span
                      className="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-amber-600 text-[8px] font-black text-white shadow"
                      title="في قائمة المقارنة"
                    >
                      ✓
                    </span>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* أزرار التحكم في تقريب وتكبير الخريطة */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
            className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] text-sm font-bold text-[var(--text)] shadow hover:bg-[var(--surface-soft)]"
            title="تكبير"
            aria-label="تكبير الخريطة"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.9, z - 0.2))}
            className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] text-sm font-bold text-[var(--text)] shadow hover:bg-[var(--surface-soft)]"
            title="تصغير"
            aria-label="تصغير الخريطة"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] text-xs font-bold text-[var(--text-muted)] shadow hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
            title="إعادة ضبط المنظور"
            aria-label="إعادة ضبط حجم الخريطة"
          >
            ⊙
          </button>
        </div>

        {/* بطاقة المعاينة العائمة للعقار المحدد أسفل الخريطة */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-4 right-4 z-30 mx-auto max-w-xl animate-fade-in">
            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-3 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center">
              {/* صورة العقار */}
              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[var(--surface-soft)] sm:h-24 sm:w-28">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none"
                  }}
                />
                <span className="absolute bottom-1.5 right-1.5 rounded-md bg-[var(--surface)]/90 px-1.5 py-0.5 text-[9px] font-black text-[var(--text)]">
                  {selectedProperty.type}
                </span>
              </div>

              {/* تفاصيل العقار المحدد */}
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-[var(--primary-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--primary-text)]">
                      {selectedProperty.purpose}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (isGuest) {
                          onPromptGuestLogin?.()
                          return
                        }
                        onToggleFavorite(selectedProperty.id)
                      }}
                      className={`grid size-7 place-items-center rounded-full ${
                        favoriteIds.has(selectedProperty.id)
                          ? "text-[var(--danger-text)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text)]"
                      }`}
                      aria-label="حفظ في المفضلة"
                    >
                      <Icon name="heart" />
                    </button>
                  </div>

                  <strong className="mt-1 block truncate text-xs font-black text-[var(--text)] sm:text-sm">
                    {selectedProperty.title}
                  </strong>

                  <p className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                    <Icon name="pin" />
                    <span className="truncate">{propertyAddress(selectedProperty)}</span>
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="text-xs font-black text-[var(--primary-text)]">
                    {propertyPrice(selectedProperty)}
                  </div>

                  {/* أزرار الإجراءات على العقار المعروض */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (isGuest) {
                          onPromptGuestLogin?.()
                          return
                        }
                        onToggleCompare(selectedProperty)
                      }}
                      className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[10px] font-extrabold transition ${
                        selectedCompareIds.has(selectedProperty.id)
                          ? "bg-amber-500 text-white shadow-xs"
                          : "border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-soft)]"
                      }`}
                    >
                      <span>
                        {selectedCompareIds.has(selectedProperty.id) ? "✓ مقارن" : "+ مقارنة"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpen(selectedProperty)}
                      className="rounded-xl bg-[var(--primary-strong)] px-3 py-1.5 text-[10px] font-black text-white shadow-sm transition hover:bg-[var(--primary)]"
                    >
                      التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
