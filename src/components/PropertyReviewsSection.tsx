import { useState, type FormEvent } from "react"
import { Icon } from "./Icon"
import { ConfirmModal } from "./ConfirmModal"
import type { Property, PropertyReview } from "../types"

export function PropertyReviewsSection({
  property,
  reviews,
  onAddReview,
  onDeleteReview,
  isGuest = false,
  onPromptGuestLogin,
}: {
  property: Property
  reviews: PropertyReview[]
  onAddReview: (propertyId: string, rating: number, text: string) => void
  onDeleteReview: (reviewId: string) => void
  isGuest?: boolean
  onPromptGuestLogin?: () => void
}) {
  const [formOpen, setFormOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState("")
  const [feedback, setFeedback] = useState("")
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null)

  const propertyReviews = reviews
    .filter((review) => review.propertyId === property.id)
    .sort((a, b) => b.createdAt - a.createdAt)

  const average = propertyReviews.length
    ? propertyReviews.reduce((total, review) => total + review.rating, 0) /
      propertyReviews.length
    : 0

  const submitReview = (event: FormEvent) => {
    event.preventDefault()
    if (isGuest) {
      if (onPromptGuestLogin) onPromptGuestLogin()
      return
    }
    if (!rating) {
      setFeedback("اختر عدد النجوم أولاً")
      return
    }
    if (!text.trim()) {
      setFeedback("اكتب تعليقك قبل نشر التقييم")
      return
    }
    onAddReview(property.id, rating, text.trim())
    setRating(0)
    setText("")
    setFormOpen(false)
    setFeedback("تم نشر تقييمك بنجاح")
  }

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-[var(--text)]">
            التقييمات والمراجعات
          </h2>
          <p className="mt-1 text-[10px] text-[var(--text-muted)]">
            {propertyReviews.length} مراجعات
          </p>
        </div>
        <button
          className="rounded-xl bg-[var(--primary-soft)] px-3 py-2 text-[10px] font-bold text-[var(--primary-text)]"
          onClick={() => {
            if (isGuest) {
              if (onPromptGuestLogin) onPromptGuestLogin()
              return
            }
            setFormOpen((current) => !current)
            setFeedback("")
          }}
        >
          أضف تقييمك
        </button>
      </div>

      {feedback && (
        <p
          className={`mt-3 rounded-xl p-3 text-[10px] font-bold ${
            feedback === "تم نشر تقييمك بنجاح"
              ? "bg-[var(--primary-soft)] text-[var(--primary-text)]"
              : "bg-[var(--danger-soft)] text-[var(--danger-text)]"
          }`}
          role="status"
        >
          {feedback}
        </p>
      )}

      <div className="mt-4 grid grid-cols-[auto_1fr] gap-4 rounded-2xl bg-[var(--surface-soft)] p-4">
        <div className="text-center">
          <strong className="block text-3xl text-[var(--text)]">
            {average ? average.toFixed(1) : "—"}
          </strong>
          <span className="text-xs text-[var(--primary-text)]">
            {average ? "★".repeat(Math.round(average)) : "بدون تقييم"}
          </span>
          <small className="mt-1 block text-[9px] text-[var(--text-muted)]">
            {propertyReviews.length} إجمالي
          </small>
        </div>
        <div className="grid gap-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = propertyReviews.filter(
              (review) => review.rating === star,
            ).length
            const percentage = propertyReviews.length
              ? (count / propertyReviews.length) * 100
              : 0
            return (
              <div
                className="grid grid-cols-[1.5rem_1fr_1.2rem] items-center gap-2 text-[9px] text-[var(--text-muted)]"
                key={star}
              >
                <span>{star}★</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
                  <span
                    className="block h-full rounded-full bg-[var(--primary)] transition-[width]"
                    style={{ width: `${percentage}%` }}
                  />
                </span>
                <span>{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {formOpen && (
        <form
          className="mt-4 grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4"
          onSubmit={submitReview}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text)]">
                اختر تقييمك للعقار
              </span>
              {(hoverRating || rating) > 0 && (
                <span className="text-[11px] font-black text-amber-500 animate-fadeIn">
                  {(hoverRating || rating) === 5 && "⭐⭐⭐⭐⭐ ممتاز جداً (5/5)"}
                  {(hoverRating || rating) === 4 && "⭐⭐⭐⭐ جيد جداً (4/5)"}
                  {(hoverRating || rating) === 3 && "⭐⭐⭐ جيد (3/5)"}
                  {(hoverRating || rating) === 2 && "⭐⭐ مقبول (2/5)"}
                  {(hoverRating || rating) === 1 && "⭐ ضعيف (1/5)"}
                </span>
              )}
            </div>
            <div
              className="mt-2.5 flex items-center gap-1.5 p-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--line)]"
              dir="ltr"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating)
                return (
                  <button
                    className={`text-3xl transition-all duration-150 transform active:scale-90 ${
                      isFilled
                        ? "text-amber-400 scale-110 drop-shadow-[0_2px_6px_rgba(251,191,36,0.45)]"
                        : "text-slate-300 dark:text-zinc-600 hover:text-amber-200"
                    }`}
                    key={star}
                    type="button"
                    onClick={() => {
                      setRating(star)
                      setFeedback("")
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    aria-label={`${star} من 5 نجوم`}
                  >
                    ★
                  </button>
                )
              })}
            </div>
          </div>
          <textarea
            className="min-h-24 w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-3 text-xs leading-6 text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--primary)]"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="اكتب رأيك هنا..."
            maxLength={500}
          />
          <div className="flex gap-2">
            <button
              className="min-h-11 flex-1 rounded-xl bg-[var(--primary-strong)] px-4 text-xs font-bold text-[var(--dark-text)]"
              type="submit"
            >
              نشر التقييم
            </button>
            <button
              className="min-h-11 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] px-4 text-xs font-bold text-[var(--text-muted)]"
              type="button"
              onClick={() => {
                setFormOpen(false)
                setRating(0)
                setText("")
                setFeedback("")
              }}
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 grid gap-3">
        {propertyReviews.map((review) => (
          <article
            className={`rounded-2xl border p-4 ${
              review.isNew
                ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                : "border-[var(--line)] bg-[var(--surface)]"
            }`}
            key={review.id}
          >
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--surface-soft)] text-[10px] font-extrabold text-[var(--text)]">
                {review.userInitials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <strong className="block text-xs text-[var(--text)]">
                      {review.userName}
                    </strong>
                    <span className="text-[10px] text-[var(--primary-text)]">
                      {"★".repeat(review.rating)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.isNew && (
                      <span className="rounded-full bg-[var(--primary-strong)] px-2 py-1 text-[8px] font-bold text-[var(--dark-text)]">
                        جديد
                      </span>
                    )}
                    {review.isOwn && (
                      <button
                        className="text-[var(--danger-text)]"
                        onClick={() => setReviewToDelete(review.id)}
                        aria-label="حذف التقييم"
                      >
                        <Icon name="trash" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
                  {review.text}
                </p>
                <small className="mt-2 block text-[9px] text-[var(--text-dim)]">
                  {review.dateLabel}
                </small>
              </div>
            </div>
          </article>
        ))}
        {!propertyReviews.length && (
          <div className="rounded-2xl bg-[var(--surface-soft)] p-5 text-center text-xs leading-6 text-[var(--text-muted)]">
            لا توجد تقييمات بعد. كن أول من يقيّم هذا العقار.
          </div>
        )}
      </div>

      {reviewToDelete && (
        <ConfirmModal
          title="حذف التقييم"
          message="هل أنت متأكد من رغبتك في حذف تقييمك؟ لا يمكن التراجع عن هذا الإجراء."
          confirmText="حذف"
          cancelText="إلغاء"
          variant="danger"
          onConfirm={() => onDeleteReview(reviewToDelete)}
          onClose={() => setReviewToDelete(null)}
        />
      )}
    </section>
  )
}
