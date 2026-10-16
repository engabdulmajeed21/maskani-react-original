import { useState, useId } from "react"
import { Icon } from "./Icon"
import type { Property } from "../types"
import { propertyAddress, propertyPrice } from "../utils/property"

interface PropertyCompareModalProps {
  properties: Property[]
  onClose: () => void
  onRemove: (propertyId: string) => void
  onOpenProperty: (property: Property) => void
}

export function PropertyCompareModal({
  properties,
  onClose,
  onRemove,
  onOpenProperty,
}: PropertyCompareModalProps) {
  const [highlightDifferences, setHighlightDifferences] = useState(false)
  const titleId = useId()

  if (properties.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir="rtl"
      >
        <div className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] p-6 text-center shadow-2xl">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
            <Icon name="tag" />
          </div>
          <h2 id={titleId} className="text-base font-extrabold text-[var(--text)]">
            لا توجد عقارات في المقارنة
          </h2>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            يرجى تحديد عقار واحد على الأقل للبدء في المقارنة جنباً إلى جنب.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-xl bg-[var(--primary-strong)] py-2.5 text-xs font-bold text-white shadow"
          >
            العودة إلى النتائج
          </button>
        </div>
      </div>
    )
  }

  // جمع قائمة بجميع المميزات في العقارات المعروضة
  const allAmenities = Array.from(
    new Set(
      properties.flatMap((item) => [
        ...item.amenities,
        ...(item.chaletAmenities ?? []),
      ]),
    ),
  )

  // مساعد للتحقق مما إذا كانت القيم مختلفة بين العقارات
  const areValuesDifferent = (
    values: (string | number | boolean | undefined)[],
  ) => {
    if (values.length <= 1) return false
    const first = values[0]
    return values.some((val) => val !== first)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--overlay)] p-3 sm:p-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="relative my-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* شريط رأس النافذة */}
        <header className="flex shrink-0 items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
              <Icon name="tag" />
            </span>
            <div>
              <h2 id={titleId} className="text-sm font-black text-[var(--text)] sm:text-base">
                مقارنة العقارات جنباً إلى جنب
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                مقارنة دقيقة وشاملة بين {properties.length} عقارات مختارة (الحد الأقصى 3)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {properties.length > 1 && (
              <label className="hidden items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] sm:flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={highlightDifferences}
                  onChange={(event) => setHighlightDifferences(event.target.checked)}
                  className="rounded border-[var(--line)] text-[var(--primary)] focus:ring-0"
                />
                <span>تمييز الفروقات فقط</span>
              </label>
            )}

            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
              aria-label="إغلاق نافذة المقارنة"
            >
              <Icon name="close" />
            </button>
          </div>
        </header>

        {/* محتوى جدول المقارنة القابل للتمرير */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
          <div className="min-w-[620px]">
            {/* بطاقات رؤوس العقارات المقارنة */}
            <div className="grid grid-cols-[140px_repeat(auto-fit,minmax(180px,1fr))] gap-3 border-b border-[var(--line)] pb-5">
              <div className="flex flex-col justify-end pb-3 text-xs font-black text-[var(--text-dim)]">
                <span>بيانات العقار</span>
              </div>

              {properties.map((property) => (
                <div
                  key={property.id}
                  className="relative flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 shadow-sm transition hover:border-[var(--primary)]"
                >
                  <button
                    type="button"
                    onClick={() => onRemove(property.id)}
                    className="absolute left-2 top-2 z-10 grid size-7 place-items-center rounded-full bg-[var(--surface)]/90 text-[var(--text-muted)] shadow hover:bg-[var(--danger-soft)] hover:text-[var(--danger-text)]"
                    title="حذف من المقارنة"
                    aria-label={`حذف ${property.title} من المقارنة`}
                  >
                    <Icon name="close" />
                  </button>

                  <div className="relative mb-2.5 h-28 w-full overflow-hidden rounded-xl bg-[var(--surface-soft)]">
                    <img
                      src={property.image}
                      alt={property.alt || property.title}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none"
                      }}
                    />
                    <span className="absolute bottom-2 right-2 rounded-lg bg-[var(--surface)]/90 px-2 py-0.5 text-[9px] font-extrabold text-[var(--text)] backdrop-blur-sm">
                      {property.type}
                    </span>
                  </div>

                  <strong className="line-clamp-1 text-xs font-black text-[var(--text)]" title={property.title}>
                    {property.title}
                  </strong>

                  <p className="mt-1 line-clamp-1 text-[10px] text-[var(--text-muted)]">
                    {propertyAddress(property)}
                  </p>

                  <div className="mt-2 text-xs font-black text-[var(--primary-text)]">
                    {propertyPrice(property)}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenProperty(property)
                      onClose()
                    }}
                    className="mt-3 rounded-xl bg-[var(--primary-strong)] py-2 text-center text-[11px] font-bold text-white transition hover:bg-[var(--primary)] active:scale-95"
                  >
                    عرض التفاصيل
                  </button>
                </div>
              ))}
            </div>

            {/* صفوف المقارنة التفصيلية */}
            <div className="divide-y divide-[var(--line)] text-xs">
              {/* قسم المواصفات الأساسية */}
              <div className="py-3">
                <h3 className="mb-2 text-[11px] font-black uppercase tracking-wider text-[var(--primary-text)]">
                  المواصفات العامة
                </h3>

                <ComparisonRow
                  label="الغرض"
                  values={properties.map((p) => p.purpose)}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="طريقة الدفع"
                  values={properties.map((p) => p.paymentMethod || "غير محدد")}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="التأثيث"
                  values={properties.map((p) => p.furnishing)}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="المساحة"
                  values={properties.map((p) => (p.area ? `${p.area} م²` : "غير محددة"))}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="غرف النوم"
                  values={properties.map((p) => (p.bedrooms ? `${p.bedrooms} غرف` : "—"))}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="دورات المياه"
                  values={properties.map((p) => (p.bathrooms ? `${p.bathrooms} حمامات` : "—"))}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="الصالات"
                  values={properties.map((p) => (p.halls ? `${p.halls} صالات` : "—"))}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="المطابخ"
                  values={properties.map((p) => (p.kitchens ? `${p.kitchens} مطابخ` : "—"))}
                  highlight={highlightDifferences}
                />
              </div>

              {/* قسم الموقع الجغرافي */}
              <div className="py-3">
                <h3 className="mb-2 text-[11px] font-black uppercase tracking-wider text-[var(--primary-text)]">
                  الموقع والمنطقة
                </h3>

                <ComparisonRow
                  label="المحافظة"
                  values={properties.map((p) => p.location.governorate)}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="المديرية"
                  values={properties.map((p) => p.location.district)}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="الحي السكني"
                  values={properties.map((p) => p.location.neighborhood || "حي عام")}
                  highlight={highlightDifferences}
                />
              </div>

              {/* قسم البنية التحتية */}
              <div className="py-3">
                <h3 className="mb-2 text-[11px] font-black uppercase tracking-wider text-[var(--primary-text)]">
                  البنية التحتية والخدمات
                </h3>

                <ComparisonRow
                  label="الكهرباء"
                  values={properties.map(
                    (p) => p.infrastructure.electricity?.value || "غير متوفر",
                  )}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="المياه"
                  values={properties.map(
                    (p) => p.infrastructure.water?.value || "غير متوفر",
                  )}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="الصرف الصحي"
                  values={properties.map(
                    (p) => p.infrastructure.sewage?.value || "غير متوفر",
                  )}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="الاتصالات / الإنترنت"
                  values={properties.map(
                    (p) => p.infrastructure.telecommunications?.value || "غير متوفر",
                  )}
                  highlight={highlightDifferences}
                />
              </div>

              {/* قسم المميزات والمرافق */}
              <div className="py-3">
                <h3 className="mb-2 text-[11px] font-black uppercase tracking-wider text-[var(--primary-text)]">
                  المميزات والمرافق الإضافية
                </h3>

                {allAmenities.length > 0 ? (
                  allAmenities.map((amenity) => {
                    const presence = properties.map((p) => {
                      const list = [...p.amenities, ...(p.chaletAmenities ?? [])]
                      return list.includes(amenity)
                    })
                    const isDiff = areValuesDifferent(presence)

                    if (highlightDifferences && !isDiff) return null

                    return (
                      <div
                        key={amenity}
                        className={`grid grid-cols-[140px_repeat(auto-fit,minmax(180px,1fr))] items-center gap-3 py-2 ${
                          highlightDifferences && isDiff ? "bg-[var(--primary-soft)]/40 rounded-xl px-2" : ""
                        }`}
                      >
                        <span className="font-bold text-[var(--text-muted)] text-[11px]">
                          {amenity}
                        </span>

                        {properties.map((p) => {
                          const has =
                            p.amenities.includes(amenity) ||
                            (p.chaletAmenities ?? []).includes(amenity)
                          return (
                            <div key={p.id} className="flex items-center text-xs">
                              {has ? (
                                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-bold text-emerald-600">
                                  <span>✓</span> متوفر
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-[var(--text-dim)]">
                                  <span>✕</span> غير متاح
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-[11px] text-[var(--text-muted)]">
                    لا توجد مرافق إضافية مسجلة.
                  </p>
                )}
              </div>

              {/* قسم المعلن والمالك */}
              <div className="py-3">
                <h3 className="mb-2 text-[11px] font-black uppercase tracking-wider text-[var(--primary-text)]">
                  المعلن / المالك
                </h3>

                <ComparisonRow
                  label="اسم المعلن"
                  values={properties.map((p) => p.owner.name)}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="نوع الحساب"
                  values={properties.map((p) => p.owner.type)}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="التقييم"
                  values={properties.map((p) => `⭐ ${p.owner.rating} (${p.owner.reviewCount} تقييم)`)}
                  highlight={highlightDifferences}
                />

                <ComparisonRow
                  label="حالة التوثيق"
                  values={properties.map((p) => (p.owner.verified ? "موثق رسمي ✅" : "غير موثق"))}
                  highlight={highlightDifferences}
                />
              </div>
            </div>
          </div>
        </div>

        {/* شريط ذيل النافذة */}
        <footer className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--surface)] px-5 py-3">
          <span className="text-[11px] text-[var(--text-muted)]">
            يمكنك إزالة أي عقار لإضافة عقار آخر من نتائج البحث.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
          >
            إغلاق
          </button>
        </footer>
      </div>
    </div>
  )
}

function ComparisonRow({
  label,
  values,
  highlight,
}: {
  label: string
  values: string[]
  highlight: boolean
}) {
  const isDiff = values.length > 1 && values.some((val) => val !== values[0])

  if (highlight && !isDiff) return null

  return (
    <div
      className={`grid grid-cols-[140px_repeat(auto-fit,minmax(180px,1fr))] items-center gap-3 py-2 text-xs ${
        highlight && isDiff ? "bg-[var(--primary-soft)]/40 rounded-xl px-2" : ""
      }`}
    >
      <span className="font-bold text-[var(--text-muted)] text-[11px]">{label}</span>
      {values.map((val, idx) => (
        <span
          key={`row-${label}-${idx}`}
          className={`font-semibold ${
            isDiff && highlight ? "font-black text-[var(--primary-text)]" : "text-[var(--text)]"
          }`}
        >
          {val}
        </span>
      ))}
    </div>
  )
}
