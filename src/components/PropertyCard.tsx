import { useState } from "react"
import { Icon } from "./Icon"
import { PropertySpecs } from "./PropertySpecs"
import { InfrastructureSummary } from "./InfrastructureSummary"
import type { Property } from "../types"
import { propertyAddress, propertyPrice } from "../utils/property"

export const reportReasons = [
  "عقار وهمي أو غير موجود",
  "السعر غير صحيح أو مضلل",
  "صور لا تطابق الواقع",
  "المالك لا يرد أو الرقم خاطئ",
  "سبب آخر",
]

export const ownerReportReasons = [
  "حساب وهمي أو منتحل صفة",
  "احتيال أو طلب دفع خارج المنصة",
  "المالك لا يرد أو أرقام غير صحيحة",
  "سلوك غير لائق أو مسيء",
  "سبب آخر",
]

export function ReportReasonModal({
  onClose,
  onConfirm,
  title = "سبب الإبلاغ",
  subtitle = "اختر السبب الأقرب لمساعدتنا في مراجعة العقار.",
  reasons = reportReasons,
}: {
  onClose: () => void
  onConfirm: () => void
  title?: string
  subtitle?: string
  reasons?: string[]
}) {
  const [reason, setReason] = useState("")
  const [otherReason, setOtherReason] = useState("")

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end bg-[var(--overlay)] p-4 backdrop-blur-sm"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-reason-title"
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] p-5 text-right shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <strong
              className="block text-sm font-extrabold text-[var(--text)]"
              id="report-reason-title"
            >
              {title}
            </strong>
            <p className="mt-1 text-[10px] leading-5 text-[var(--text-muted)]">
              {subtitle}
            </p>
          </div>
          <button
            className="grid size-9 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--text-muted)]"
            onClick={onClose}
            aria-label="إغلاق نافذة البلاغ"
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="grid gap-2">
          {reasons.map((item) => (
            <button
              className={`min-h-11 rounded-xl border px-3 py-2 text-right text-[10px] font-bold transition ${
                reason === item
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary-text)]"
                  : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)]"
              }`}
              key={item}
              onClick={() => setReason(item)}
              aria-pressed={reason === item}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        {reason === "سبب آخر" && (
          <input
            className="mt-3 h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-xs text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
            value={otherReason}
            onChange={(event) => setOtherReason(event.target.value)}
            placeholder="اكتب السبب باختصار (اختياري)"
            maxLength={160}
          />
        )}

        <div className="mt-5 grid gap-2">
          <button
            className="min-h-12 rounded-xl bg-[var(--primary-strong)] px-4 text-xs font-bold text-[var(--dark-text)] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onConfirm}
            disabled={!reason}
            type="button"
          >
            تأكيد إرسال البلاغ
          </button>
          <button
            className="min-h-11 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-xs font-bold text-[var(--text-muted)]"
            onClick={onClose}
            type="button"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}

export function PropertyCard({
  property,
  onOpen,
  favorite,
  onToggleFavorite,
  reported,
  onReport,
  comparing = false,
  onToggleCompare,
  isGuest = false,
  onPromptGuestLogin,
}: {
  property: Property
  onOpen: (property: Property) => void
  favorite: boolean
  onToggleFavorite: (propertyId: string) => void
  reported: boolean
  onReport: (propertyId: string) => void
  comparing?: boolean
  onToggleCompare?: (property: Property) => void
  isGuest?: boolean
  onPromptGuestLogin?: () => void
}) {
  const [notice, setNotice] = useState("")
  const [reportModalOpen, setReportModalOpen] = useState(false)

  const isolate =
    (action: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      action()
    }

  const share = async () => {
    try {
      if (!navigator.share) throw new Error("Share unavailable")
      await navigator.share({
        title: property.title,
        text: `${property.title} — ${propertyAddress(property)}`,
      })
    } catch {
      await navigator.clipboard
        ?.writeText(property.title)
        .catch(() => undefined)
      setNotice("تم نسخ معلومات العقار")
    }
  }

  const statusLabel =
    property.status === "مباع"
      ? "مباع 🚫"
      : property.status === "مؤجر"
        ? "مؤجر 🔑"
        : "متاح ✅"

  const statusBadgeStyle =
    property.status === "مباع"
      ? "bg-rose-500/90 text-white border-rose-600"
      : property.status === "مؤجر"
        ? "bg-amber-500/90 text-white border-amber-600"
        : "bg-emerald-600/90 text-white border-emerald-700"

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] text-right shadow-sm transition-all duration-300 hover:shadow-md hover:border-[var(--primary)] cursor-pointer"
      dir="rtl"
      onClick={() => onOpen(property)}
      onKeyDown={(event) => event.key === "Enter" && onOpen(property)}
      role="button"
      tabIndex={0}
      aria-label={`عرض تفاصيل ${property.title}`}
    >
      {/* قسم الصورة البصرية مع الشارات العلوية والسعر */}
      <div className="relative h-48 w-full overflow-hidden bg-[var(--surface-soft)]">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={property.image}
          alt={property.alt}
          onError={(event) => {
            event.currentTarget.style.display = "none"
          }}
        />

        {/* تدرج خفيف لتحسين تباين النصوص على الصور الساطعة */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

        {/* الشارات العلوية */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span
              className={`rounded-xl px-2.5 py-1 text-[10px] font-black border shadow-md backdrop-blur-md ${statusBadgeStyle}`}
            >
              {statusLabel}
            </span>
            <span className="rounded-xl bg-blue-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-white shadow-md border border-blue-700">
              {property.purpose}
            </span>
            {property.featured && (
              <span className="flex items-center gap-1 rounded-xl bg-amber-500/95 backdrop-blur-md px-2.5 py-1 text-[9px] font-black text-white shadow-md border border-amber-600">
                ⭐ عرض مميز
              </span>
            )}
          </div>
        </div>

        {/* الشارات السفلية على الصورة: السعر والموقع المصغر */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-end justify-between z-10 pointer-events-none">
          <div className="rounded-xl bg-black/70 backdrop-blur-md px-3 py-1 text-white shadow-lg border border-white/10">
            <b className="text-sm font-black tracking-tight" dir="rtl">
              {propertyPrice(property)}
            </b>
          </div>

          <span className="rounded-lg bg-black/50 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white/90">
            {property.images?.length
              ? `${property.images.length} صور 📷`
              : "صورة 📷"}
          </span>
        </div>
      </div>

      {/* قسم محتوى وتفاصيل العقار */}
      <div className="flex flex-col gap-2.5 p-3.5">
        {/* شريط الإجراءات والوسوم التوضيحية */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {property.category === "hotel" ? (
              <span className="rounded-lg bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-600 border border-amber-500/20">
                {"⭐".repeat(property.starRating ?? 0)}
              </span>
            ) : property.category === "chalet" ? (
              <span className="rounded-lg bg-[var(--primary-soft)] px-2 py-0.5 text-[9px] font-bold text-[var(--primary-text)]">
                {property.capacity} ضيوف
              </span>
            ) : property.paymentMethod ? (
              <span className="rounded-lg bg-[var(--primary-soft)] px-2 py-0.5 text-[9px] font-bold text-[var(--primary-text)]">
                {property.paymentMethod}
              </span>
            ) : null}

            {property.category === "land" && property.courtDeed && (
              <span className="flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2 py-0.5 text-[9px] font-black text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                📜 بصيرة محكمة
              </span>
            )}

            <span className="truncate rounded-lg bg-[var(--surface-soft)] px-2 py-0.5 text-[9px] font-bold text-[var(--text-muted)] border border-[var(--line)]">
              {property.category === "commercial"
                ? property.finishing
                : property.category === "land"
                  ? property.landType
                  : property.category === "hotel"
                    ? property.roomCategory
                    : property.category === "chalet"
                      ? property.privacy
                      : property.furnishing}
            </span>
          </div>

          {/* أزرار الإجراءات التفاعلية بالأسفل: مقارنة ومفضلة ومشاركة وإبلاغ */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleCompare && !isGuest && (
              <button
                type="button"
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-black transition ${
                  comparing
                    ? "bg-blue-600 text-white shadow-xs"
                    : "border border-[var(--line)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--text)]"
                }`}
                onClick={isolate(() => {
                  if (isGuest) {
                    if (onPromptGuestLogin) onPromptGuestLogin()
                    return
                  }
                  onToggleCompare(property)
                })}
                aria-label={
                  comparing ? "إلغاء مقارنة العقار" : "إضافة العقار للمقارنة"
                }
              >
                <span>{comparing ? "✓ مقارن" : "+ مقارنة"}</span>
              </button>
            )}

            {/* زر المفضلة بجانب المشاركة والإبلاغ */}
            <button
              type="button"
              className={`grid size-7 place-items-center rounded-lg border transition-all active:scale-90 ${
                favorite
                  ? "border-rose-500 bg-rose-500/15 text-rose-500 shadow-xs ring-1 ring-rose-500/30"
                  : "border-[var(--line)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-800"
              }`}
              onClick={isolate(() => {
                if (isGuest) {
                  if (onPromptGuestLogin) onPromptGuestLogin()
                  return
                }
                onToggleFavorite(property.id)
              })}
              aria-label={favorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
              title={favorite ? "في المفضلة" : "إضافة للمفضلة"}
            >
              <Icon name="heart" />
            </button>

            {/* زر المشاركة */}
            <button
              type="button"
              className="grid size-7 place-items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] active:scale-95 transition"
              onClick={isolate(() => void share())}
              aria-label="مشاركة العقار"
              title="مشاركة"
            >
              <Icon name="share" />
            </button>

            {/* زر الإبلاغ */}
            {!isGuest && (
              <button
                type="button"
                className={`grid size-7 place-items-center rounded-lg border transition active:scale-95 ${
                  reported
                    ? "border-amber-500 bg-amber-500/10 text-amber-600"
                    : "border-[var(--line)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-amber-600"
                }`}
                onClick={isolate(() => {
                  if (isGuest) {
                    if (onPromptGuestLogin) onPromptGuestLogin()
                    return
                  }
                  if (reported) {
                    onReport(property.id)
                    setNotice("تم إلغاء البلاغ")
                  } else {
                    setReportModalOpen(true)
                  }
                })}
                aria-label={
                  reported ? "إلغاء البلاغ عن العقار" : "إبلاغ عن العقار"
                }
                title="إبلاغ"
              >
                <Icon name="warning" />
              </button>
            )}
          </div>
        </div>

        {/* عنوان العقار والموقع */}
        <div className="space-y-0.5">
          <h3 className="truncate text-sm font-black text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {property.title}
          </h3>
          <p className="flex items-center gap-1 truncate text-[10px] text-[var(--text-muted)]">
            <Icon name="pin" />
            <span>{propertyAddress(property)}</span>
          </p>
        </div>

        {/* شبكة مواصفات العقار الموحدة */}
        <div className="pt-1">
          <PropertySpecs property={property} />
        </div>

        {/* ملخص المرافق أو البنية التحتية وفترات الحجز والوثائق */}
        {property.category === "residential" ? (
          <div className="space-y-1.5 border-t border-[var(--line)] pt-1.5">
            <InfrastructureSummary property={property} />
            {property.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity) => (
                  <span
                    className="rounded-lg bg-[var(--surface-soft)] px-2 py-0.5 text-[8px] font-semibold text-[var(--text)] border border-[var(--line)]"
                    key={amenity}
                    title={amenity}
                  >
                    ✓ {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="rounded-lg bg-[var(--surface-soft)] px-1.5 py-0.5 text-[8px] font-extrabold text-[var(--text-muted)] border border-[var(--line)]">
                    +{property.amenities.length - 3} أخرى
                  </span>
                )}
              </div>
            )}
          </div>
        ) : property.category === "chalet" ? (
          <div className="space-y-1.5 border-t border-[var(--line)] pt-2">
            {property.rentalPeriods && property.rentalPeriods.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[8px] font-black text-[var(--primary-text)]">
                  ⏱️ فترات الحجز:
                </span>
                {property.rentalPeriods.slice(0, 3).map((period) => (
                  <span
                    key={period}
                    className="rounded-md bg-teal-500/10 px-1.5 py-0.5 text-[8px] font-bold text-teal-600 dark:text-teal-400 border border-teal-500/20"
                  >
                    {period}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              {(property.chaletAmenities ?? property.amenities)
                .slice(0, 3)
                .map((amenity) => (
                  <span
                    className="rounded-lg bg-[var(--surface-soft)] px-2 py-0.5 text-[8px] font-semibold text-[var(--text)] border border-[var(--line)]"
                    key={amenity}
                    title={amenity}
                  >
                    ✓ {amenity}
                  </span>
                ))}
            </div>
          </div>
        ) : property.category === "land" ? (
          <div className="space-y-1.5 border-t border-[var(--line)] pt-2">
            {property.courtDeed && (
              <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-2.5 py-1 text-[9px] font-black text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <span>📜</span>
                <span>الوثائق: بصيرة شرعية موثقة من المحكمة</span>
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 4).map((amenity) => (
                <span
                  className="rounded-lg bg-[var(--surface-soft)] px-2 py-0.5 text-[8px] font-semibold text-[var(--text)] border border-[var(--line)]"
                  key={amenity}
                >
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="border-t border-[var(--line)] pt-2">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 4).map((amenity) => (
                <span
                  className="rounded-lg bg-[var(--surface-soft)] px-2 py-0.5 text-[8px] font-semibold text-[var(--text)] border border-[var(--line)]"
                  key={amenity}
                >
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* تذييل البطاقة: المالك والتقييم ورابط التفاصيل */}
        <div className="mt-1 flex items-center justify-between border-t border-[var(--line)] pt-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-[10px] font-black text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {property.owner.initials}
            </span>
            <div className="min-w-0">
              <span className="block truncate text-[10px] font-black text-[var(--text)]">
                {property.owner.name}
              </span>
              <span className="flex items-center gap-1 text-[8px] text-[var(--text-muted)]">
                <span className="text-amber-500">★</span>
                <span>{property.owner.rating}</span>
                <span>({property.owner.reviewCount})</span>
              </span>
            </div>
          </div>

          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-[-2px] transition-transform">
            <span>التفاصيل</span>
            <Icon name="arrow" />
          </span>
        </div>
      </div>

      {notice && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 rounded-xl bg-[var(--overlay)] px-3 py-1.5 text-[9px] font-bold text-white shadow-xl backdrop-blur-md">
          {notice}
        </span>
      )}

      {reportModalOpen && (
        <ReportReasonModal
          onClose={() => setReportModalOpen(false)}
          onConfirm={() => {
            onReport(property.id)
            setReportModalOpen(false)
            setNotice("تم إرسال البلاغ للمراجعة")
          }}
        />
      )}
    </article>
  )
}
