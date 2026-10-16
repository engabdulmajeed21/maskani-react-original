export function GuestLoginModal({
  onClose,
  onLogin,
  title = "تسجيل الدخول مطلوب",
  message = "أنت تتصفح المنصة كزائر حالياً. يرجى تسجيل الدخول أو إنشاء حساب جديد لتتمكن من إرسال الرسائل، حفظ المفضلة، والتفاعل مع عقارات المنصة.",
}: {
  onClose: () => void
  onLogin: () => void
  title?: string
  message?: string
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--overlay)] p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div className="w-full max-w-sm rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] p-6 text-center shadow-2xl space-y-4">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-500/10 text-3xl text-blue-600 dark:text-blue-400 border border-blue-500/20">
          🔒
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-black text-[var(--text)]">{title}</h3>
          <p className="text-xs leading-6 text-[var(--text-muted)]">{message}</p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={onLogin}
            className="h-12 w-full rounded-2xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <span>تسجيل الدخول / إنشاء حساب</span>
            <span>↗</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)] text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            المتابعة كزائر للعرض فقط
          </button>
        </div>
      </div>
    </div>
  )
}
