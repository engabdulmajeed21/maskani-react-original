import { useState, useEffect } from "react"
import { BrandMini } from "../../components/BrandMini"
import { Icon } from "../../components/Icon"
import { bottomNav } from "../../data/navigation"

export function Home({
  go,
  onSearch,
  onOpenFilters,
  onViewAll,
  isGuest = false,
  onPromptGuestLogin,
}: {
  go: (screen: number) => void
  onSearch: (query: string) => void
  onOpenFilters: () => void
  onViewAll: () => void
  isGuest?: boolean
  onPromptGuestLogin?: () => void
}) {
  const [query, setQuery] = useState("")
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = window.localStorage.getItem("maskani-theme")
    if (storedTheme) return storedTheme === "dark"
    return (
      document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    )
  })

  useEffect(() => {
    const theme = darkMode ? "dark" : "light"
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem("maskani-theme", theme)
  }, [darkMode])

  return (
    <section className="screen home-screen relative pb-28">
      {/* رأس الصفحة الرئيسية */}
      <header className="home-header flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3 shadow-xs" dir="rtl">
        <BrandMini subtitle="المنصة العقارية الأولى" />

        <div className="home-actions flex items-center gap-2">
          <button
            className="mode-toggle grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] shadow-xs transition hover:bg-[var(--surface-soft)]"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
            aria-pressed={darkMode}
          >
            <Icon name={darkMode ? "sun" : "moon"} />
          </button>

          <button
            className="notification-button relative grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] shadow-xs transition hover:bg-[var(--surface-soft)]"
            onClick={() => go(15)}
            aria-label="الإشعارات"
          >
            <Icon name="bell" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[var(--danger)] animate-pulse" />
          </button>
        </div>
      </header>

      <main className="home-content space-y-5 px-4 pt-4 overflow-y-auto">
        {/* شريط الترحيب والمستخدم - البروفايل في اليمين والنص في اليسار */}
        <div className="home-greeting flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-sm">
          <button
            onClick={() => go(13)}
            className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--primary-soft)] text-sm font-black text-[var(--primary-text)] ring-2 ring-[var(--primary)]/20 shadow-xs"
            title="عرض حسابي"
          >
            {isGuest ? "👤" : "مح"}
          </button>
          
          <div className="flex-1 text-right min-w-0">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--primary-text)]">
              <span className={`size-2 rounded-full ${isGuest ? "bg-amber-500" : "bg-emerald-500"}`} />
              {isGuest ? "أهلاً بك، زائر المنصة (تصفح فقط)" : "أهلاً بك، محمد أحمد"}
            </span>
            <h1 className="mt-1 text-base font-black text-[var(--text)] truncate">
              أين تريد أن تسكن اليوم؟
            </h1>
          </div>
        </div>

        {/* حقل البحث الرئيسي */}
        <form
          className="search-row flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            onSearch(query)
          }}
        >
          <label className="home-search flex flex-1 items-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] px-3.5 py-3 shadow-sm transition focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20">
            <span className="text-[var(--text-muted)]">
              <Icon name="search" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث عن منطقة، حي، أو عقار..."
              className="w-full bg-transparent text-xs font-semibold text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
              aria-label="البحث عن عقار أو وجهة"
            />
          </label>
          <button
            className="filter-button grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--primary-strong)] text-white shadow-md transition hover:bg-[var(--primary)] active:scale-95"
            type="button"
            onClick={onOpenFilters}
            aria-label="خيارات التصفية"
          >
            <Icon name="filter" />
          </button>
        </form>

        {/* قسم التصفح حسب الفئات - تصاميم عناصر متطورة وفخمة */}
        <div>
          <div className="section-heading mb-3 flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-[var(--text)] flex items-center gap-1.5">
              <Icon name="building" />
              <span>فئات العقارات المتاحة</span>
            </h2>
            <button
              onClick={onViewAll}
              className="text-[11px] font-extrabold text-[var(--primary-text)] hover:underline"
            >
              استكشاف الكل ←
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              {
                label: "المنازل والشقق",
                sub: "شقق، فلل، بيوت عائلية",
                count: "+140 عقار",
                tag: "سكني",
                icon: "building" as const,
                screen: 14,
                color: "from-amber-500/20 via-orange-500/10 to-transparent",
                badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
              },
              {
                label: "المحلات التجارية",
                sub: "مكاتب، معارض، محلات",
                count: "+55 موقع",
                tag: "تجاري",
                icon: "shop" as const,
                screen: 41,
                color: "from-blue-500/20 via-indigo-500/10 to-transparent",
                badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
              },
              {
                label: "الفنادق والستوديوهات",
                sub: "أجنحة وغرف فندقية",
                count: "+35 فندق",
                tag: "حجز يومي",
                icon: "hotel" as const,
                screen: 43,
                color: "from-emerald-500/20 via-teal-500/10 to-transparent",
                badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              },
              {
                label: "الشاليهات والمنتجعات",
                sub: "استراحات ومصايف",
                count: "+28 شاليه",
                tag: "ترفيهي",
                icon: "chalet" as const,
                screen: 44,
                color: "from-purple-500/20 via-violet-500/10 to-transparent",
                badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
              },
              {
                label: "الأراضي والاستثمار",
                sub: "زراعي، تجاري، سكني",
                count: "+80 أرض",
                tag: "استثمار",
                icon: "land" as const,
                screen: 42,
                color: "from-amber-600/20 via-yellow-600/10 to-transparent",
                badgeBg: "bg-amber-600/10 text-amber-700 dark:text-amber-300",
              },
            ].map((cat) => (
              <button
                key={cat.label}
                onClick={() => go(cat.screen)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-3.5 text-right shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-md active:scale-98"
              >
                {/* خلفية تدرج ناعمة */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-60 transition-opacity group-hover:opacity-100`}
                />

                <div className="relative z-10 flex items-start justify-between gap-1">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--surface)] text-[var(--primary-text)] shadow-xs ring-1 ring-[var(--line)] transition group-hover:bg-[var(--primary-strong)] group-hover:text-white">
                    <Icon name={cat.icon} />
                  </span>

                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-black ${cat.badgeBg}`}
                  >
                    {cat.tag}
                  </span>
                </div>

                <div className="relative z-10 mt-3 space-y-0.5">
                  <strong className="block truncate text-xs font-black text-[var(--text)] group-hover:text-[var(--primary-text)]">
                    {cat.label}
                  </strong>
                  <p className="truncate text-[10px] font-medium text-[var(--text-muted)]">
                    {cat.sub}
                  </p>
                  <span className="mt-1 block text-[9px] font-bold text-[var(--primary-text)]">
                    {cat.count} متاح الآن
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* الشريط السفلي وزر الذكاء الاصطناعي المرتفع */}
      <div className="home-bottom">
        <button
          className="ai-fab shadow-lg"
          onClick={() => {
            if (isGuest) {
              if (onPromptGuestLogin) onPromptGuestLogin()
              return
            }
            go(17)
          }}
          aria-label="البحث بالذكاء الاصطناعي"
        >
          <Icon name="sparkles" />
          <span>ابحث بالذكاء الاصطناعي ✨</span>
        </button>

        <nav className="bottom-nav" aria-label="التنقل الرئيسي">
          {bottomNav.map((item, index) => (
            <button
              key={item.label}
              className={index === 0 ? "active" : ""}
              onClick={() => {
                if (isGuest && (item.target === 29 || item.target === 35)) {
                  if (onPromptGuestLogin) onPromptGuestLogin()
                  return
                }
                go(item.target)
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  )
}
