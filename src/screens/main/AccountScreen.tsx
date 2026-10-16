import { useState } from "react"
import { BrandMini } from "../../components/BrandMini"
import { Icon } from "../../components/Icon"
import { bottomNav, drawerGroups } from "../../data/navigation"

export function AccountScreen({
  go,
  favoriteIds,
  followedOwnerIds,
  userSpecialRequests,
  isGuest = false,
  onPromptGuestLogin,
}: {
  go: (screen: number) => void
  favoriteIds?: Set<string>
  followedOwnerIds?: Set<string>
  userSpecialRequests?: Array<unknown>
  isGuest?: boolean
  onPromptGuestLogin?: () => void
}) {
  const [shareNotice, setShareNotice] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches)
    )
  })

  const toggleTheme = () => {
    const nextMode = !isDarkMode
    setIsDarkMode(nextMode)
    const themeName = nextMode ? "dark" : "light"
    document.documentElement.dataset.theme = themeName
    window.localStorage.setItem("maskani-theme", themeName)
  }

  const shareApp = async () => {
    const shareData = {
      title: "مسكني",
      text: "اكتشف أفضل العقارات والفنادق والشاليهات مع مسكني",
    }

    try {
      if (!navigator.share) throw new Error("Web Share is unavailable")
      await navigator.share(shareData)
    } catch {
      try {
        await navigator.clipboard?.writeText(
          `${shareData.title} — ${shareData.text}`,
        )
      } catch {
        // Clipboard access inside embedded preview
      }
      setShareNotice(true)
      window.setTimeout(() => setShareNotice(false), 2800)
    }
  }

  return (
    <section className="screen account-screen relative pb-28">
      {/* رأس شاشة حسابي الموحد */}
      <header className="account-header flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3 shadow-xs" dir="rtl">
        <BrandMini subtitle="الملف الشخصي والبروفايل" />

        <div className="account-actions flex items-center gap-2">
          <button
            className="notification-button relative grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] shadow-xs transition hover:bg-[var(--surface-soft)]"
            onClick={() => go(15)}
            aria-label="الإشعارات"
            title="الإشعارات"
          >
            <Icon name="bell" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[var(--danger)] animate-pulse" />
          </button>
        </div>
      </header>

      <main className="account-page-content space-y-4 px-4 py-4 overflow-y-auto">
        {/* كرت بطل الملف الشخصي */}
        <div className="relative flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-sm">
          {isGuest ? (
            <div className="space-y-3" dir="rtl">
              <div className="flex items-center gap-3">
                <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gray-600 text-base font-black text-white shadow-md">
                  👤
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="truncate text-sm font-black text-[var(--text)]">
                      زائر المنصة
                    </strong>
                    <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-600">
                      تصفح وعرض فقط 👁️
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-[var(--text-muted)]">
                    قم بتسجيل الدخول للتفاعل وإرسال الرسائل
                  </p>
                </div>
              </div>

              {/* بنر الدعوة للتسجيل للزائر */}
              <div className="rounded-xl bg-blue-500/10 p-3 text-center border border-blue-500/20 space-y-2">
                <p className="text-xs font-bold text-[var(--text)]">
                  سجل دخولك الآن للتواصل المباشر وحفظ عقاراتك المفضلة!
                </p>
                <button
                  type="button"
                  onClick={() => go(4)}
                  className="w-full h-10 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-98 transition"
                >
                  تسجيل الدخول / إنشاء حساب جديد ↗
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-strong)] text-base font-black text-white shadow-md">
                مح
                <span
                  className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-emerald-500 text-[10px] text-white ring-2 ring-[var(--surface-raised)]"
                  title="حساب موثق"
                >
                  ✓
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <strong className="truncate text-sm font-black text-[var(--text)]">
                    محمد أحمد الحيمي
                  </strong>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                    حساب موثق ✅
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] font-medium text-[var(--text-muted)]">
                  +967 771 234 567 · m.ahmed@maskani.ye
                </p>
              </div>

              <button
                onClick={() => go(23)}
                className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                aria-label="تعديل الملف الشخصي"
              >
                <Icon name="settings" />
              </button>
            </div>
          )}

          {/* إحصائيات سريعة للمستخدم */}
          <div className="grid grid-cols-3 gap-2 border-t border-[var(--line)] pt-3 text-center">
            <button
              type="button"
              onClick={() => go(37)}
              className="flex flex-col items-center justify-center rounded-xl bg-[var(--surface-soft)] p-2 transition hover:bg-[var(--primary-soft)] active:scale-95"
            >
              <b className="text-xs font-black text-[var(--primary-text)]">{favoriteIds?.size ?? 0}</b>
              <span className="text-[10px] font-semibold text-[var(--text-muted)]">المفضلة ❤️</span>
            </button>

            <button
              type="button"
              onClick={() => go(29)}
              className="flex flex-col items-center justify-center rounded-xl bg-[var(--surface-soft)] p-2 transition hover:bg-[var(--primary-soft)] active:scale-95"
            >
              <b className="text-xs font-black text-[var(--primary-text)]">{userSpecialRequests?.length ?? 0}</b>
              <span className="text-[10px] font-semibold text-[var(--text-muted)]">طلباتي 📋</span>
            </button>

            <button
              type="button"
              onClick={() => go(25)}
              className="flex flex-col items-center justify-center rounded-xl bg-[var(--surface-soft)] p-2 transition hover:bg-[var(--primary-soft)] active:scale-95"
            >
              <b className="text-xs font-black text-[var(--primary-text)]">{followedOwnerIds?.size ?? 0}</b>
              <span className="text-[10px] font-semibold text-[var(--text-muted)]">المتابَعين 👥</span>
            </button>
          </div>
        </div>

        {/* قسم إعدادات الحساب الرئيسي */}
        <section className="account-menu-group space-y-2">
          <h2 className="text-xs font-black text-[var(--text-muted)] px-1">
            إعدادات الحساب والأمان
          </h2>

          <div className="divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)]">
            <button
              className="flex w-full items-center justify-between p-3.5 text-right transition hover:bg-[var(--surface-soft)]"
              onClick={() => go(27)}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
                  <Icon name="shield" />
                </span>
                <div>
                  <b className="block text-xs font-bold text-[var(--text)]">إدارة وأمان الحساب</b>
                  <small className="text-[10px] text-[var(--text-muted)]">كلمة المرور والحماية</small>
                </div>
              </div>
              <Icon name="chevron" />
            </button>

            <button
              className="flex w-full items-center justify-between p-3.5 text-right transition hover:bg-[var(--surface-soft)]"
              onClick={() => go(24)}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
                  <Icon name="shield" />
                </span>
                <div>
                  <b className="block text-xs font-bold text-[var(--text)]">توثيق الحساب</b>
                  <small className="text-[10px] text-[var(--text-muted)]">توثيق الهوية الرسمية</small>
                </div>
              </div>
              <Icon name="chevron" />
            </button>

            <button
              className="flex w-full items-center justify-between p-3.5 text-right transition hover:bg-[var(--surface-soft)]"
              onClick={() => go(28)}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
                  <Icon name="globe" />
                </span>
                <div>
                  <b className="block text-xs font-bold text-[var(--text)]">اللغة</b>
                  <small className="text-[10px] text-[var(--text-muted)]">العربية (اليمن)</small>
                </div>
              </div>
              <Icon name="chevron" />
            </button>

            {/* زر تبديل الوضع الليلي / النهاري */}
            <button
              className="flex w-full items-center justify-between p-3.5 text-right transition hover:bg-[var(--surface-soft)]"
              onClick={toggleTheme}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
                  <Icon name={isDarkMode ? "sun" : "moon"} />
                </span>
                <div>
                  <b className="block text-xs font-bold text-[var(--text)]">مظهر التطبيق</b>
                  <small className="text-[10px] text-[var(--text-muted)]">
                    {isDarkMode ? "الوضع الداكن (الليلي) 🌙" : "الوضع الفاتح (النهاري) ☀️"}
                  </small>
                </div>
              </div>
              <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--primary-text)] border border-[var(--line)]">
                {isDarkMode ? "تفعيل النهاري ☀️" : "تفعيل الليلي 🌙"}
              </span>
            </button>

            {/* ميزة الانضمام كشريك - محفوظة بالكامل */}
            <button
              className="flex w-full items-center justify-between p-3.5 text-right transition hover:bg-[var(--surface-soft)]"
              onClick={() => go(26)}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                  <Icon name="userPlus" />
                </span>
                <div>
                  <b className="block text-xs font-bold text-[var(--text)]">انضم إلينا كشريك/مالك</b>
                  <small className="text-[10px] text-[var(--text-muted)]">قدّم طلبك لإضافة عقاراتك بالمنصة</small>
                </div>
              </div>
              <Icon name="chevron" />
            </button>
          </div>
        </section>

        {/* المجموعات الأخرى المنسدلة من بيانات الإبحار */}
        <div className="account-menu space-y-3">
          {drawerGroups.map((group) => (
            <section className="account-menu-group space-y-2" key={group.title}>
              <h2 className="text-xs font-black text-[var(--text-muted)] px-1">
                {group.title}
              </h2>
              <div className="divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)]">
                {group.items.map((item) => (
                  <button
                    className="flex w-full items-center justify-between p-3.5 text-right transition hover:bg-[var(--surface-soft)]"
                    key={item.label}
                    onClick={() => go(item.target)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
                        <Icon name={item.icon} />
                      </span>
                      <b className="block text-xs font-bold text-[var(--text)]">{item.label}</b>
                    </div>
                    <Icon name="chevron" />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* إجراءات المشاركة وتسجيل الخروج */}
        <div className="account-page-actions flex items-center gap-2 pt-2">
          <button
            onClick={() => go(4)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--danger)] bg-[var(--danger-soft)] py-2.5 text-xs font-bold text-[var(--danger-text)] transition hover:bg-[var(--danger)] hover:text-white"
          >
            <Icon name="logout" />
            <span>تسجيل الخروج</span>
          </button>

          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] py-2.5 text-xs font-bold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
            onClick={() => void shareApp()}
          >
            <Icon name="share" />
            <span>مشاركة التطبيق</span>
          </button>
        </div>
      </main>

      {/* الشريط السفلي */}
      <nav
        className="bottom-nav account-bottom-nav"
        aria-label="التنقل الرئيسي"
      >
        {bottomNav.map((item, index) => (
          <button
            key={item.label}
            className={index === 4 ? "active" : ""}
            onClick={() => go(item.target)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {shareNotice && (
        <div className="account-share-notice fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[var(--overlay)] px-4 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-md">
          ✓ تم نسخ معلومات مشاركة التطبيق
        </div>
      )}
    </section>
  )
}
