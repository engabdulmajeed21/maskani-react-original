import { useState } from "react"
import { Icon, type IconName } from "../../components/Icon"
import { Toast } from "../../components/Toast"
import { ReportReasonModal } from "../../components/PropertyCard"
import { PropertySpecs } from "../../components/PropertySpecs"
import { InfrastructureSummary } from "../../components/InfrastructureSummary"
import { PropertyReviewsSection } from "../../components/PropertyReviewsSection"
import { propertyAddress, propertyPrice, infrastructureItems } from "../../utils/property"
import type { Owner, Property, PropertyReview } from "../../types"

function getAmenityIcon(amenityName: string): IconName {
  if (amenityName.includes("شمس") || amenityName.includes("كهربا")) return "bolt"
  if (amenityName.includes("خزان") || amenityName.includes("مياه") || amenityName.includes("شبك") || amenityName.includes("مسبح") || amenityName.includes("حمام")) return "droplet"
  if (amenityName.includes("موقف") || amenityName.includes("سيار") || amenityName.includes("كراج")) return "pin"
  if (amenityName.includes("مصعد") || amenityName.includes("طابق") || amenityName.includes("عمار")) return "building"
  if (amenityName.includes("حراس") || amenityName.includes("أمن") || amenityName.includes("كامير")) return "shield"
  if (amenityName.includes("مكيف") || amenityName.includes("تكييف") || amenityName.includes("سبلت")) return "settings"
  if (amenityName.includes("حديق") || amenityName.includes("حوش") || amenityName.includes("خضراء") || amenityName.includes("أرض")) return "land"
  if (amenityName.includes("نت") || amenityName.includes("واي فاي") || amenityName.includes("إنترنت") || amenityName.includes("Fiber") || amenityName.includes("ألياف")) return "wifi"
  if (amenityName.includes("مطبخ") || amenityName.includes("شواء")) return "kitchen"
  if (amenityName.includes("مجلس") || amenityName.includes("ديوان") || amenityName.includes("صال")) return "sofa"
  if (amenityName.includes("سرير") || amenityName.includes("غرف")) return "bed"
  if (amenityName.includes("بصير") || amenityName.includes("وثيق")) return "document"
  return "star"
}

export function PropertyDetailsScreen({
  property,
  go,
  favorite,
  onToggleFavorite,
  onChat,
  reviews,
  onAddReview,
  onDeleteReview,
  onOpenOwner,
  reported,
  onReportProperty,
  isGuest = false,
  onPromptGuestLogin,
}: {
  property: Property
  go: (screen: number) => void
  favorite: boolean
  onToggleFavorite: (propertyId: string) => void
  onChat: () => void
  reviews: PropertyReview[]
  onAddReview: (propertyId: string, rating: number, text: string) => void
  onDeleteReview: (reviewId: string) => void
  onOpenOwner: (owner: Owner) => void
  reported: boolean
  onReportProperty: (propertyId: string) => void
  isGuest?: boolean
  onPromptGuestLogin?: () => void
}) {
  const gallery = property.images.length ? property.images : [property.image]
  const [activeImage, setActiveImage] = useState(0)
  const [notice, setNotice] = useState("")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [mapModalOpen, setMapModalOpen] = useState(false)
  const services = infrastructureItems(property)

  const openExternalGoogleMaps = () => {
    const fullAddress = `${property.title} ${propertyAddress(property)}`
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    window.open(mapsUrl, "_blank")
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

  const allInfoCards =
    property.category === "commercial"
      ? [
          property.area ? { icon: "land" as IconName, label: "المساحة", value: `${property.area} م²` } : null,
          property.commercialType ? { icon: "shop" as IconName, label: "نوع المحل", value: property.commercialType } : null,
          property.shopLocation ? { icon: "pin" as IconName, label: "الموقع", value: property.shopLocation } : null,
          property.finishing ? { icon: "building" as IconName, label: "التشطيب", value: property.finishing } : null,
        ]
      : property.category === "land"
        ? [
            property.area ? { icon: "land" as IconName, label: "المساحة", value: `${property.area} م²` } : null,
            property.landType ? { icon: "land" as IconName, label: "نوع الأرض", value: property.landType } : null,
            property.frontage && property.frontage.length > 0 ? { icon: "pin" as IconName, label: "الواجهة", value: property.frontage.join("، ") } : null,
            property.streetWidth ? { icon: "building" as IconName, label: "عرض الشارع", value: property.streetWidth } : null,
          ]
        : property.category === "hotel"
          ? [
              property.starRating ? { icon: "hotel" as IconName, label: "التصنيف", value: "⭐".repeat(property.starRating) } : null,
              property.roomCategory ? { icon: "bed" as IconName, label: "نوع الغرفة", value: property.roomCategory } : null,
              property.bedCount ? { icon: "bed" as IconName, label: "عدد السراير", value: property.bedCount } : null,
              property.bedType ? { icon: "sofa" as IconName, label: "نوع السرير", value: property.bedType } : null,
            ]
          : property.category === "chalet"
            ? [
                property.capacity ? { icon: "user" as IconName, label: "السعة", value: `${property.capacity} ضيوف` } : null,
                property.privacy ? { icon: "shield" as IconName, label: "الخصوصية", value: property.privacy } : null,
                property.chaletAmenities?.length ? { icon: "droplet" as IconName, label: "المميزات", value: property.chaletAmenities[0] } : null,
              ]
        : [
            property.bedrooms ? { icon: "bed" as IconName, label: "غرف النوم", value: property.bedrooms } : null,
            property.halls ? { icon: "sofa" as IconName, label: "الصالات", value: property.halls } : null,
            property.kitchens ? { icon: "kitchen" as IconName, label: "المطابخ", value: property.kitchens } : null,
            property.bathrooms ? { icon: "bath" as IconName, label: "الحمامات", value: property.bathrooms } : null,
          ]

  const infoCards = allInfoCards.filter((c): c is NonNullable<typeof c> => Boolean(c))

  return (
    <section className="screen !bg-[var(--surface-soft)] text-[var(--text)] flex flex-col h-full">
      {/* الترويسة العلوية الأنيقة أعلى الصورة (خارج الصورة بالكامل) */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3 shadow-xs"
        dir="rtl"
      >
        <button
          className="grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] shadow-xs transition hover:bg-[var(--surface-soft)] active:scale-95"
          onClick={() => go(-1)}
          aria-label="رجوع"
        >
          <Icon name="arrow" />
        </button>

        <div className="text-center min-w-0 px-2 flex-1">
          <h1 className="text-sm font-black text-[var(--text)]">
            تفاصيل العقار
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            className={`grid size-9 place-items-center rounded-xl border transition active:scale-95 ${
              favorite
                ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/40"
                : "border-[var(--line)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-rose-500"
            }`}
            onClick={() => onToggleFavorite(property.id)}
            aria-label={favorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            title="المفضلة"
          >
            <Icon name="heart" />
          </button>

          <button
            className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text-muted)] shadow-xs hover:text-[var(--text)] active:scale-95 transition"
            onClick={() => void share()}
            aria-label="مشاركة العقار"
            title="مشاركة"
          >
            <Icon name="share" />
          </button>

          <button
            className={`grid size-9 place-items-center rounded-xl border transition active:scale-95 ${
              reported
                ? "border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950/40"
                : "border-[var(--line)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-amber-500"
            }`}
            onClick={() => {
              if (isGuest) {
                if (onPromptGuestLogin) onPromptGuestLogin()
                return
              }
              if (reported) {
                onReportProperty(property.id)
                setNotice("تم إلغاء البلاغ")
              } else {
                setReportModalOpen(true)
              }
            }}
            aria-label={reported ? "إلغاء البلاغ عن العقار" : "إبلاغ عن العقار"}
            title="إبلاغ عن مخالفة"
          >
            <Icon name="warning" />
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto pb-36 [scrollbar-width:none]">
        <div className="relative h-64 overflow-hidden bg-[var(--line)]">
          <button
            className="h-full w-full cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
            aria-label="فتح الصورة بالحجم الكامل"
          >
            <img
              className="h-full w-full object-cover"
              src={gallery[activeImage]}
              alt={`${property.alt} - صورة ${activeImage + 1}`}
            />
          </button>

          <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
            <span className="inline-flex items-center gap-1" dir="ltr">
              <Icon name="image" />
              {activeImage + 1}/{gallery.length}
            </span>
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto bg-[var(--surface-raised)] px-4 py-3 [scrollbar-width:none]">
          {gallery.map((image, index) => (
            <button
              className={`h-14 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                activeImage === index
                  ? "border-[var(--primary)]"
                  : "border-[var(--transparent)]"
              }`}
              key={`${image}-${index}`}
              onClick={() => setActiveImage(index)}
              aria-label={`عرض الصورة ${index + 1}`}
            >
              <img className="h-full w-full object-cover" src={image} alt="" />
            </button>
          ))}
        </div>

        <div className="space-y-3 p-4">
          <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {/* شارة حالة توفر العرض المباشرة */}
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-extrabold border ${
                  (property.status || "متاح") === "مباع"
                    ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    : (property.status || "متاح") === "مؤجر"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                }`}
              >
                {(property.status || "متاح") === "مباع"
                  ? "مباع 🚫"
                  : (property.status || "متاح") === "مؤجر"
                    ? "مؤجر 🔑"
                    : "متاح ✅"}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                  property.purpose === "للبيع"
                    ? "bg-[var(--primary-soft)] text-[var(--primary-text)]"
                    : property.purpose === "للإيجار"
                      ? "bg-[var(--primary-soft)] text-[var(--primary-text)]"
                      : "bg-[var(--primary-soft)] text-[var(--primary-text)]"
                }`}
              >
                {property.purpose}
              </span>
              {property.category === "hotel" ? (
                <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-[10px] font-bold text-[var(--primary-text)]">
                  {"⭐".repeat(property.starRating ?? 0)}
                </span>
              ) : property.category === "chalet" ? (
                <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-[10px] font-bold text-[var(--primary-text)]">
                  {property.capacity} ضيوف
                </span>
              ) : property.paymentMethod ? (
                <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-[10px] font-bold text-[var(--primary-text)]">
                  {property.paymentMethod}
                </span>
              ) : null}
              <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-[10px] font-bold text-[var(--text-muted)]">
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
            <h1 className="!text-xl !font-extrabold !text-[var(--text)]">
              {property.title}
            </h1>
            <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
              {property.subtitle}
            </p>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              <Icon name="pin" />
              {propertyAddress(property)}
            </p>
            <b className="mt-4 block text-xl font-extrabold text-[var(--text)]">
              {propertyPrice(property)}
            </b>
          </section>

          <section className="grid grid-cols-4 divide-x divide-x-reverse divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] py-4 shadow-sm">
            {infoCards.map((item) => (
              <div
                className="flex min-w-0 flex-col items-center gap-1 text-center"
                key={item.label}
              >
                <span className="text-[var(--primary-text)]">
                  <Icon name={item.icon} />
                </span>
                <b
                  className={`w-full px-1 text-center text-[var(--text)] ${
                    property.category !== "residential"
                      ? "line-clamp-2 text-[9px] leading-4"
                      : "text-sm"
                  }`}
                >
                  {item.value}
                </b>
                <small className="truncate text-[8px] text-[var(--text-muted)]">
                  {item.label}
                </small>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[var(--primary-text)]">
                <Icon name="document" />
              </span>
              <h2 className="text-sm font-extrabold text-[var(--text)]">
                وصف العقار
              </h2>
            </div>
            <p className="text-xs leading-7 text-[var(--text-muted)]">
              {property.description}
            </p>
          </section>

          {property.category === "residential" && services.length > 0 && (
            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[var(--primary-text)]">
                  <Icon name="settings" />
                </span>
                <h2 className="text-sm font-extrabold text-[var(--text)]">
                  خدمات البنية التحتية
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <div
                    className="flex min-w-0 items-center gap-2 rounded-xl bg-[var(--surface-soft)] p-3"
                    key={service.label}
                  >
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                        service.status === "unavailable"
                          ? "bg-[var(--line)] text-[var(--text-muted)]"
                          : "bg-[var(--primary-soft)] text-[var(--primary-text)]"
                      }`}
                    >
                      <Icon name={service.icon} />
                    </span>
                    <span className="min-w-0">
                      <b className="block truncate text-[9px] text-[var(--text-muted)]">
                        {service.label}
                      </b>
                      <small className="block break-words text-[10px] font-bold leading-4 text-[var(--text)]">
                        {service.value}
                      </small>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-blue-500/10 text-blue-600 font-bold text-xs">
                  ✨
                </span>
                <h2 className="text-sm font-black text-[var(--text)]">
                  {property.category === "chalet"
                    ? "المميزات والخدمات الترفيهية"
                    : "المرافق والخدمات المتاحة"}
                </h2>
              </div>
              <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--text-muted)] border border-[var(--line)]">
                {(property.category === "chalet"
                  ? property.chaletAmenities ?? []
                  : property.amenities
                ).length} خدمات
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(property.category === "chalet"
                ? property.chaletAmenities ?? []
                : property.amenities
              ).map((amenity) => (
                <div
                  className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-2.5 transition hover:border-[var(--primary)]"
                  key={amenity}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary-text)]">
                    <Icon name={getAmenityIcon(amenity)} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-xs font-bold text-[var(--text)]">
                      {amenity}
                    </b>
                    <small className="block truncate text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ متوفر وجاهز
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </section>



          <button
            className="flex w-full items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 text-right shadow-sm"
            onClick={() => onOpenOwner(property.owner)}
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--primary-soft)] text-xs font-extrabold text-[var(--primary-text)]">
              {property.owner.initials}
            </span>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-sm text-[var(--text)]">
                {property.owner.name}
              </b>
              <small className="mt-0.5 block text-[10px] text-[var(--text-muted)]">
                مالك العقار
              </small>
              <small className="mt-1 flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                <span className="text-[var(--primary-text)]">
                  <Icon name="star" />
                </span>
                {property.owner.rating} ({property.owner.reviewCount} تقييم)
              </small>
            </span>
            <Icon name="chevron" />
          </button>

          <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-xl bg-[var(--danger-soft)] text-[var(--danger-text)]">
                  <Icon name="pin" />
                </span>
                <div>
                  <b className="block text-sm text-[var(--text)]">موقع العقار على الخريطة</b>
                  <small className="text-[10px] text-[var(--text-muted)]">
                    📍 {propertyAddress(property)}
                  </small>
                </div>
              </div>

              <button
                type="button"
                onClick={openExternalGoogleMaps}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] px-2.5 py-1.5 text-[10px] font-bold text-[var(--primary-text)] hover:bg-[var(--primary-soft)] transition"
              >
                <span>خرائط جوجل</span>
                <span className="text-xs">↗</span>
              </button>
            </div>

            {/* معاينة الخريطة التفاعلية القابلة للنقر */}
            <div
              onClick={() => setMapModalOpen(true)}
              className="relative cursor-pointer group flex flex-col items-center justify-center h-28 w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-br from-emerald-900/10 via-[var(--surface-soft)] to-cyan-900/10 p-3 text-center transition hover:border-[var(--primary)] active:scale-98"
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px]" />
              <span className="z-10 grid size-10 place-items-center rounded-full bg-[var(--surface-raised)] text-[var(--danger-text)] shadow-md group-hover:scale-110 transition-transform">
                <Icon name="pin" />
              </span>
              <span className="z-10 mt-2 text-xs font-black text-[var(--text)]">
                انقر لعرض الخريطة التفاعلية 🗺️
              </span>
              <span className="z-10 text-[9px] font-bold text-[var(--primary-text)]">
                اضغط للتكبير واستكشاف الموقع بالتفصيل
              </span>
            </div>
          </section>

          <PropertyReviewsSection
            property={property}
            reviews={reviews}
            onAddReview={onAddReview}
            onDeleteReview={onDeleteReview}
            isGuest={isGuest}
            onPromptGuestLogin={onPromptGuestLogin}
          />
        </div>
      </main>

      {/* شريط التواصل والتفاوض في الأسفل */}
      <div className="absolute inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--surface-raised)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl" dir="rtl">
        <button
          type="button"
          className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-98 transition"
          onClick={() => {
            if (isGuest) {
              if (onPromptGuestLogin) onPromptGuestLogin()
              return
            }
            onChat()
          }}
        >
          <Icon name="chat" />
          <span className="text-sm font-black">المحادثة والتفاوض</span>
        </button>
      </div>

      {notice && (
        <div className="absolute bottom-24 left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-xl bg-[var(--overlay)] px-4 py-2 text-[10px] text-[var(--dark-text)] shadow-xl">
          {notice}
        </div>
      )}
      {lightboxOpen && (
        <div
          className="absolute inset-0 z-[70] flex flex-col justify-between bg-[var(--overlay)] p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="معرض صور العقار"
          dir="rtl"
        >
          <div className="flex items-center justify-between gap-3">
            <button
              className="grid size-11 place-items-center rounded-full bg-[var(--surface-raised)] text-[var(--text)] shadow-lg"
              onClick={() => setLightboxOpen(false)}
              aria-label="إغلاق معرض الصور"
            >
              <Icon name="close" />
            </button>
            <span
              className="rounded-full bg-[var(--surface-raised)] px-3 py-2 text-xs font-bold text-[var(--text)] shadow-lg"
              dir="ltr"
            >
              {activeImage + 1} / {gallery.length}
            </span>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center py-4">
            <img
              className="max-h-full w-full object-contain"
              src={gallery[activeImage]}
              alt={`${property.alt} - معاينة الصورة ${activeImage + 1}`}
            />
            {gallery.length > 1 && (
              <>
                <button
                  className="absolute right-0 grid size-11 place-items-center rounded-full bg-[var(--surface-raised)] text-[var(--text)] shadow-lg"
                  onClick={() =>
                    setActiveImage(
                      (current) =>
                        (current - 1 + gallery.length) % gallery.length,
                    )
                  }
                  aria-label="الصورة السابقة"
                >
                  <span className="rotate-180">
                    <Icon name="chevron" />
                  </span>
                </button>
                <button
                  className="absolute left-0 grid size-11 place-items-center rounded-full bg-[var(--surface-raised)] text-[var(--text)] shadow-lg"
                  onClick={() =>
                    setActiveImage(
                      (current) => (current + 1) % gallery.length,
                    )
                  }
                  aria-label="الصورة التالية"
                >
                  <Icon name="chevron" />
                </button>
              </>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto rounded-2xl bg-[var(--surface-raised)] p-3 [scrollbar-width:none]">
            {gallery.map((image, index) => (
              <button
                className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                  activeImage === index
                    ? "border-[var(--primary)]"
                    : "border-[var(--transparent)]"
                }`}
                key={`${image}-lightbox-${index}`}
                onClick={() => setActiveImage(index)}
                aria-label={`عرض الصورة ${index + 1}`}
              >
                <img className="h-full w-full object-cover" src={image} alt="" />
              </button>
            ))}
          </div>
        </div>
      )}
      {reportModalOpen && (
        <ReportReasonModal
          onClose={() => setReportModalOpen(false)}
          onConfirm={() => {
            onReportProperty(property.id)
            setReportModalOpen(false)
            setNotice("تم إرسال البلاغ للمراجعة")
          }}
        />
      )}

      {mapModalOpen && (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-[var(--surface-soft)]"
          role="dialog"
          aria-modal="true"
          dir="rtl"
        >
          <header className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMapModalOpen(false)}
                className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-soft)]"
              >
                <Icon name="close" />
              </button>
              <div>
                <strong className="block text-xs font-black text-[var(--text)]">موقع العقار التفاعلي</strong>
                <span className="text-[10px] text-[var(--text-muted)]">{propertyAddress(property)}</span>
              </div>
            </div>

            <button
              onClick={openExternalGoogleMaps}
              className="flex items-center gap-1.5 rounded-xl bg-[var(--primary-strong)] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary)]"
            >
              <span>فتح في خرائط جوجل 🗺️</span>
            </button>
          </header>

          <main className="relative flex-1 bg-[var(--surface)] p-4 flex flex-col justify-between">
            {/* واجهة الخريطة التفاعلية */}
            <div className="relative flex-1 w-full rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] overflow-hidden flex flex-col items-center justify-center p-6 shadow-inner">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#059669_2px,transparent_2px)] [background-size:20px_20px]" />
              
              <div className="z-10 text-center space-y-3">
                <div className="relative inline-block">
                  <span className="grid size-16 place-items-center rounded-full bg-rose-500 text-white shadow-xl animate-bounce">
                    <Icon name="pin" />
                  </span>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-4 rounded-full bg-rose-500/30 blur-xs" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-[var(--text)]">{property.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">📍 {propertyAddress(property)}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <span className="rounded-xl bg-[var(--primary-soft)] px-3 py-1 text-[10px] font-bold text-[var(--primary-text)]">
                    سكن راقٍ ومجاور للخدمات العامة
                  </span>
                  <span className="rounded-xl bg-[var(--surface-soft)] px-3 py-1 text-[10px] font-bold text-[var(--text-muted)]">
                    الموقع الدقيق والموثق
                  </span>
                </div>
              </div>
            </div>

            {/* أزرار الحصول على الاتجاهات ونسخ العنوان */}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={openExternalGoogleMaps}
                className="flex-1 h-12 rounded-2xl bg-[var(--primary-strong)] text-white text-xs font-black shadow-lg flex items-center justify-center gap-2 hover:bg-[var(--primary)] active:scale-98"
              >
                <span>🗺️ الحصول على الاتجاهات والملاحة</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(propertyAddress(property))
                  setNotice("تم نسخ عنوان العقار إلى الحافظة")
                  setMapModalOpen(false)
                }}
                className="h-12 px-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--text)] text-xs font-bold hover:bg-[var(--surface-soft)]"
              >
                نسخ العنوان
              </button>
            </div>
          </main>
        </div>
      )}
    </section>
  )
}

