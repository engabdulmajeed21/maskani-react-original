import { Icon } from "./Icon"
import type { Property } from "../types"
import { propertyPrice } from "../utils/property"

interface PropertyCompareFloatingBarProps {
  selectedProperties: Property[]
  onRemove: (propertyId: string) => void
  onClear: () => void
  onOpenCompare: () => void
}

export function PropertyCompareFloatingBar({
  selectedProperties,
  onRemove,
  onClear,
  onOpenCompare,
}: PropertyCompareFloatingBarProps) {
  if (selectedProperties.length === 0) return null

  const maxSlots = 3
  const count = selectedProperties.length
  const emptySlotsCount = Math.max(0, maxSlots - count)

  return (
    <div
      className="fixed bottom-4 left-1/2 z-40 w-[94%] max-w-2xl -translate-x-1/2 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)]/95 p-3.5 shadow-2xl backdrop-blur-md transition-all duration-300"
      dir="rtl"
      role="region"
      aria-label="شريط مقارنة العقارات"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* معلومات العقارات المختارة */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="grid size-8 place-items-center rounded-xl bg-[var(--primary)] text-white shadow-sm">
              <Icon name="tag" />
            </span>
            <div>
              <span className="block text-xs font-black text-[var(--text)]">
                مقارنة العقارات
              </span>
              <span className="text-[10px] font-semibold text-[var(--primary-text)]">
                {count} من {maxSlots} عقارات
              </span>
            </div>
          </div>

          {/* مصغرات العقارات المحددة ومربعات الإضافة */}
          <div className="flex flex-1 items-center gap-2 overflow-x-auto py-1">
            {selectedProperties.map((property) => (
              <div
                key={property.id}
                className="group relative flex shrink-0 items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1.5 pr-2 transition hover:border-[var(--primary)]"
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="size-8 rounded-lg object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none"
                  }}
                />
                <div className="max-w-[90px] min-w-0 sm:max-w-[110px]">
                  <p className="truncate text-[10px] font-bold text-[var(--text)]">
                    {property.title}
                  </p>
                  <p className="truncate text-[9px] font-semibold text-[var(--primary-text)]">
                    {propertyPrice(property)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(property.id)}
                  className="grid size-5 place-items-center rounded-full bg-[var(--surface-soft)] text-[var(--text-muted)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger-text)]"
                  title="إزالة من المقارنة"
                  aria-label={`إزالة ${property.title} من المقارنة`}
                >
                  <Icon name="close" />
                </button>
              </div>
            ))}

            {Array.from({ length: emptySlotsCount }).map((_, index) => (
              <div
                key={`empty-slot-${index}`}
                className="hidden shrink-0 items-center justify-center rounded-xl border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)]/50 px-3 py-2 text-[10px] font-medium text-[var(--text-dim)] sm:flex"
              >
                + اختر عقاراً
              </div>
            ))}
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[var(--line)] pt-2 sm:border-0 sm:pt-0">
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl px-2.5 py-2 text-xs font-bold text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--danger-text)]"
          >
            مسح الكل
          </button>

          <button
            type="button"
            onClick={onOpenCompare}
            className="flex items-center gap-2 rounded-xl bg-[var(--primary-strong)] px-4 py-2 text-xs font-black text-white shadow-md shadow-[var(--primary)]/20 transition hover:bg-[var(--primary)] active:scale-95"
          >
            <span>عرض المقارنة</span>
            <span className="grid size-5 place-items-center rounded-full bg-white/25 text-[10px] font-extrabold">
              {count}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
