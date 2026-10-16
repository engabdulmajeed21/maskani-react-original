import { useState } from "react"
import { Icon } from "../../components/Icon"
import { PropertyCard, ReportReasonModal, ownerReportReasons } from "../../components/PropertyCard"
import { ConfirmModal } from "../../components/ConfirmModal"
import type { Owner, Property, PropertyReview } from "../../types"

export function OwnerProfileScreen({
  owner,
  go,
  reviews,
  followed,
  blocked,
  reported,
  favoriteIds,
  reportedPropertyIds,
  onToggleFollow,
  onContact,
  onOpenProperty,
  onToggleFavorite,
  onReportProperty,
  onBlock,
  onReport,
  isGuest = false,
  onPromptGuestLogin,
  allProperties,
}: {
  owner: Owner
  go: (screen: number) => void
  reviews: PropertyReview[]
  followed: boolean
  blocked: boolean
  reported: boolean
  favoriteIds: Set<string>
  reportedPropertyIds: Set<string>
  onToggleFollow: (ownerId: string) => void
  onContact: (owner: Owner) => void
  onOpenProperty: (property: Property) => void
  onToggleFavorite: (propertyId: string) => void
  onReportProperty: (propertyId: string) => void
  onBlock: (ownerId: string) => void
  onReport: (ownerId: string) => void
  isGuest?: boolean
  onPromptGuestLogin?: () => void
  allProperties: Property[]
}) {
  const [activeTab, setActiveTab] = useState<"properties" | "reviews" | "about">("properties")
  const [bioExpanded, setBioExpanded] = useState(false)
  const [notice, setNotice] = useState("")
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)

  const ownerProperties = allProperties.filter(
    (property) => property.owner.id === owner.id,
  )
  const ownerPropertyIds = new Set(
    ownerProperties.map((property) => property.id),
  )
  const recentReviews = reviews.filter((review) =>
    ownerPropertyIds.has(review.propertyId),
  )
  const dynamicReviewCount = owner.reviewCount + recentReviews.length
  const dynamicRating = dynamicReviewCount
    ? (owner.rating * owner.reviewCount +
        recentReviews.reduce((total, review) => total + review.rating, 0)) /
      dynamicReviewCount
    : owner.rating

  const shareOwner = async () => {
    const shareData = {
      title: `${owner.name} — مسكني`,
      text: `الملف الشخصي للمالك ${owner.name} على منصة مسكني`,
    }
    try {
      if (!navigator.share) throw new Error("Share unavailable")
      await navigator.share(shareData)
    } catch {
      await navigator.clipboard
        ?.writeText(`${shareData.title} — ${shareData.text}`)
        .catch(() => undefined)
      setNotice("تم نسخ رابط الملف الشخصي")
    }
  }

  const handleBlockConfirm = () => {
    if (isGuest) {
      if (onPromptGuestLogin) onPromptGuestLogin()
      return
    }
    onBlock(owner.id)
    setConfirmBlockOpen(false)
    setNotice("تم حظر المستخدم بنجاح")
  }

  const handleReportClick = () => {
    if (isGuest) {
      if (onPromptGuestLogin) onPromptGuestLogin()
      return
    }
    if (reported) {
      onReport(owner.id)
      setNotice("تم إلغاء البلاغ عن المالك")
    } else {
      setReportModalOpen(true)
    }
  }

  return (
    <section className="screen bg-[var(--surface-soft)] text-[var(--text)] relative pb-28">
      {/* الترويسة العلوية الأنيقة */}
      <header className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3 shadow-xs" dir="rtl">
        <button
          className="grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] shadow-xs transition hover:bg-[var(--surface-soft)] active:scale-95"
          onClick={() => go(-1)}
          aria-label="رجوع"
        >
          <Icon name="arrow" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-extrabold text-[var(--primary-text)]">
            الملف الشخصي للمالك
          </span>
          <h1 className="text-sm font-black text-[var(--text)]">{owner.name}</h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            className={`grid size-9 place-items-center rounded-xl border transition active:scale-95 ${
              reported
                ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/30"
                : "border-[var(--line)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
            onClick={handleReportClick}
            title={reported ? "تراجع عن البلاغ" : "إبلاغ عن المالك"}
          >
            <Icon name="warning" />
          </button>

          <button
            className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text-muted)] shadow-xs hover:text-[var(--text)] active:scale-95"
            onClick={shareOwner}
            title="مشاركة الملف"
          >
            <Icon name="share" />
          </button>
        </div>
      </header>

      {blocked ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-4" dir="rtl">
          <div className="grid size-20 place-items-center rounded-full bg-rose-100 text-3xl text-rose-600 dark:bg-rose-950/40">
            🚫
          </div>
          <h2 className="text-lg font-black text-[var(--text)]">هذا المستخدم محظور</h2>
          <p className="text-xs text-[var(--text-muted)] max-w-xs leading-6">
            لقد قمت بحظر {owner.name}. لا يمكنك استعراض عقاراته أو إرسال رسائل له طالما كان الحظر مفصلاً.
          </p>
          <button
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-95"
            onClick={() => {
              onBlock(owner.id)
              setNotice("تم رفع الحظر بنجاح")
            }}
          >
            رفع الحظر عن المالك
          </button>
        </div>
      ) : (
        <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 space-y-4">
          {/* كرت بطل المالك والغطاء البصري */}
          <div className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] shadow-sm" dir="rtl">
            <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 p-4 flex justify-between items-start">
              <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white">
                {owner.verified ? "مكتب عقاري معتمد ✓" : "مالك مباشر"}
              </span>
              <span className="rounded-full bg-black/30 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white flex items-center gap-1">
                <span className={`size-2 rounded-full ${owner.online ? "bg-emerald-400" : "bg-gray-400"}`} />
                {owner.online ? "متصل الآن" : owner.lastSeen}
              </span>
            </div>

            <div className="px-5 pb-5 pt-0 -mt-10 flex flex-col items-center text-center">
              <div className="relative size-20 rounded-2xl bg-blue-700 text-white font-black text-2xl flex items-center justify-center ring-4 ring-[var(--surface-raised)] shadow-lg">
                {owner.initials}
                {owner.verified && (
                  <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-emerald-500 text-white text-xs ring-2 ring-[var(--surface-raised)]" title="موثق من المنصة">
                    ✓
                  </span>
                )}
              </div>

              <h2 className="mt-3 text-base font-black text-[var(--text)] flex items-center gap-1.5">
                <span>{owner.name}</span>
              </h2>

              <p className="mt-1 text-xs text-[var(--text-muted)] flex items-center gap-2">
                <span>📍 {owner.location}</span>
                <span>•</span>
                <span>عضو منذ {owner.since}</span>
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("reviews")}
                  className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20"
                >
                  <span>⭐ {dynamicRating.toFixed(1)}</span>
                  <span>({dynamicReviewCount} تقييم)</span>
                </button>
                <button
                  onClick={() => {
                    if (isGuest) {
                      if (onPromptGuestLogin) onPromptGuestLogin()
                      return
                    }
                    onToggleFollow(owner.id)
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-bold border transition-all ${
                    followed
                      ? "bg-[var(--surface-soft)] text-[var(--text-muted)] border-[var(--line)]"
                      : "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20"
                  }`}
                  title={followed ? "إلغاء المتابعة" : "متابعة المالك"}
                >
                  <span>{owner.followerCount + (followed ? 1 : 0)} متابع</span>
                  <span className="mr-1">{followed ? "✓" : "+"}</span>
                </button>
              </div>

              {/* النبذة عن المالك */}
              <p className={`mt-3 text-xs leading-6 text-[var(--text-muted)] max-w-md ${bioExpanded ? "" : "line-clamp-2"}`}>
                {owner.bio}
              </p>
              {owner.bio && owner.bio.length > 70 && (
                <button
                  className="mt-1 text-[10px] font-bold text-[var(--primary-text)] hover:underline"
                  onClick={() => setBioExpanded(!bioExpanded)}
                >
                  {bioExpanded ? "عرض أقل" : "قراءة المزيد عن المالك"}
                </button>
              )}

              {/* زر المحادثة والتفاوض فقط */}
              <div className="mt-4 flex w-full pt-2 border-t border-[var(--line)]">
                <button
                  className="w-full min-h-12 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-98 transition"
                  onClick={() => {
                    if (isGuest) {
                      if (onPromptGuestLogin) onPromptGuestLogin()
                      return
                    }
                    onContact(owner)
                  }}
                >
                  <Icon name="chat" />
                  <span className="font-black text-sm">المحادثة والتفاوض</span>
                </button>
              </div>
            </div>
          </div>

          {/* تبويبات التنقل */}
          <div className="flex border-b border-[var(--line)] bg-[var(--surface-raised)] rounded-2xl p-1 gap-1" dir="rtl">
            <button
              onClick={() => setActiveTab("properties")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "properties"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              عقارات المالك ({ownerProperties.length})
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "reviews"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              التقييمات ({dynamicReviewCount})
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "about"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              بيانات التواصل
            </button>
          </div>

          {/* محتوى التبويبات */}
          {activeTab === "properties" && (
            <div className="space-y-3" dir="rtl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-[var(--text)]">عقارات منشورة بواسطة المالك</h3>
                <span className="text-[10px] text-[var(--text-muted)]">{ownerProperties.length} عقار</span>
              </div>

              <div className="grid gap-4">
                {ownerProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onOpen={onOpenProperty}
                    favorite={favoriteIds.has(property.id)}
                    onToggleFavorite={onToggleFavorite}
                    reported={reportedPropertyIds.has(property.id)}
                    onReport={onReportProperty}
                    isGuest={isGuest}
                    onPromptGuestLogin={onPromptGuestLogin}
                  />
                ))}
                {!ownerProperties.length && (
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-8 text-center text-xs text-[var(--text-muted)] space-y-2">
                    <p className="text-2xl">🏚️</p>
                    <p className="font-bold text-[var(--text)]">لا توجد عقارات منشورة حالياً لهذا المالك</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4" dir="rtl">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div>
                  <h3 className="text-sm font-black text-[var(--text)]">تقييمات وآراء العملاء</h3>
                  <span className="text-[10px] text-[var(--text-muted)]">إجمالي {dynamicReviewCount} تقييم حقيقي</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-black text-[var(--text)]">{dynamicRating.toFixed(1)}</span>
                  <p className="text-xs text-amber-500">{"★".repeat(Math.round(dynamicRating))}</p>
                </div>
              </div>

              <div className="space-y-3">
                {recentReviews.map((rev) => (
                  <div key={rev.id} className="rounded-xl bg-[var(--surface-soft)] p-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="font-bold text-[var(--text)]">{rev.userName}</strong>
                      <span className="text-amber-500 text-xs">{"★".repeat(rev.rating)}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-5">{rev.text}</p>
                    <span className="text-[9px] text-[var(--text-dim)] block">{rev.dateLabel}</span>
                  </div>
                ))}
                {!recentReviews.length && (
                  <p className="text-xs text-[var(--text-muted)] text-center py-6">
                    لا توجد تقييمات مكتوبة بعد على عقارات هذا المالك.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 text-xs" dir="rtl">
              <h3 className="text-sm font-black text-[var(--text)] border-b border-[var(--line)] pb-2">تفاصيل المكتب والمصداقية</h3>
              
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">نسبة الرد السريع:</span>
                  <strong className="font-bold text-emerald-600">{owner.responseRate}%</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">سرعة التفاعل:</span>
                  <strong className="font-bold text-[var(--text)]">خلال دقائق</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">مقر المكتب الرئيسي:</span>
                  <strong className="font-bold text-[var(--text)]">{owner.location}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">حالة التوثيق:</span>
                  <strong className="font-bold text-emerald-600">
                    {owner.verified ? "موثق مع الهيئة والعقارات ✓" : "غير موثق"}
                  </strong>
                </div>
              </div>

              {/* أزرار الحظر والإبلاغ */}
              <div className="pt-4 border-t border-[var(--line)] flex gap-2">
                <button
                  type="button"
                  className="flex-1 h-10 rounded-xl border border-rose-500/30 bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 text-xs font-bold hover:bg-rose-100"
                  onClick={() => {
                    if (isGuest) {
                      if (onPromptGuestLogin) onPromptGuestLogin()
                      return
                    }
                    setConfirmBlockOpen(true)
                  }}
                >
                  حظر هذا المالك
                </button>
                <button
                  type="button"
                  className={`flex-1 h-10 rounded-xl border text-xs font-bold ${
                    reported
                      ? "border-amber-500 bg-amber-50 text-amber-600"
                      : "border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                  onClick={handleReportClick}
                >
                  {reported ? "إلغاء البلاغ" : "إبلاغ عن مخالفة"}
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {notice && (
        <div className="absolute bottom-6 left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-xl bg-[var(--overlay)] px-4 py-2.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md">
          {notice}
        </div>
      )}

      {confirmBlockOpen && (
        <ConfirmModal
          title="حظر المستخدم"
          message={`هل أنت متأكد من رغبتك في حظر ${owner.name}؟ لن تتمكن من رؤية عقاراته أو مراسلته.`}
          confirmText="تأكيد الحظر"
          cancelText="إلغاء"
          variant="danger"
          onConfirm={handleBlockConfirm}
          onClose={() => setConfirmBlockOpen(false)}
        />
      )}

      {reportModalOpen && (
        <ReportReasonModal
          title="سبب الإبلاغ عن المالك"
          subtitle="اختر السبب الأقرب لمساعدتنا في مراجعة هذا الحساب."
          reasons={ownerReportReasons}
          onClose={() => setReportModalOpen(false)}
          onConfirm={() => {
            onReport(owner.id)
            setReportModalOpen(false)
            setNotice("تم إرسال البلاغ لإدارة المنصة للمراجعة")
          }}
        />
      )}
    </section>
  )
}
