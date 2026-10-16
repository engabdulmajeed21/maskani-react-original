import { useState } from "react"
import { Icon } from "../../components/Icon"
import { PageHeader } from "../../components/PageHeader"
import { notificationItems } from "../../data/notifications"
import type { Property } from "../../types"

export function Notifications({
  go,
  onOpenProperty,
  allProperties,
}: {
  go: (screen: number) => void
  onOpenProperty: (property: Property) => void
  allProperties: Property[]
}) {
  const [readIds, setReadIds] = useState<Set<number>>(() => new Set())
  const [filter, setFilter] = useState<"all" | "property" | "requests">("all")

  const markAllRead = () => {
    setReadIds(new Set(notificationItems.map((_, idx) => idx)))
  }

  const toggleRead = (idx: number) => {
    setReadIds((current) => {
      const next = new Set(current)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const filteredItems = notificationItems.filter((item) => {
    if (filter === "all") return true
    return item.target === filter
  })

  return (
    <section className="screen feature-screen relative pb-28">
      <PageHeader title="مركز الإشعارات والتنبيهات" go={go} />

      <main className="feature-content space-y-4 px-4 pt-3 overflow-y-auto">
        {/* رابط إعدادات الإشعارات */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="flex flex-1 items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-3 text-right shadow-xs transition hover:bg-[var(--surface-soft)]"
            onClick={() => go(31)}
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
                <Icon name="settings" />
              </span>
              <div>
                <strong className="block text-xs font-bold text-[var(--text)]">
                  إعدادات التنبيهات
                </strong>
                <small className="text-[10px] text-[var(--text-muted)]">
                  تخصيص الإشعارات الفورية
                </small>
              </div>
            </div>
            <Icon name="chevron" />
          </button>

          <button
            type="button"
            onClick={markAllRead}
            className="shrink-0 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] px-3 py-3 text-xs font-bold text-[var(--primary-text)] transition hover:bg-[var(--primary-soft)]"
          >
            تحديد الكل كمرئي ✓
          </button>
        </div>

        {/* فلاتر تصنيف الإشعارات */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filter === "all"
                ? "bg-[var(--primary-strong)] text-white shadow-xs"
                : "border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--text)]"
            }`}
          >
            جميع الإشعارات ({notificationItems.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter("property")}
            className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filter === "property"
                ? "bg-[var(--primary-strong)] text-white shadow-xs"
                : "border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--text)]"
            }`}
          >
            العقارات والتحديثات
          </button>

          <button
            type="button"
            onClick={() => setFilter("requests")}
            className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filter === "requests"
                ? "bg-[var(--primary-strong)] text-white shadow-xs"
                : "border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--text)]"
            }`}
          >
            الطلبات الخاصة
          </button>
        </div>

        {/* قائمة الإشعارات التفاعلية الدقيقة */}
        <div className="notification-list space-y-2.5">
          {filteredItems.map((item, idx) => {
            const isRead = readIds.has(idx)

            return (
              <div
                key={`${item.title}-${idx}`}
                onClick={() => {
                  toggleRead(idx)
                  // الانتقال الواضح والمحدد حسب نوع الإشعار
                  if (item.target === "requests") {
                    go(29) // طلباتي
                  } else if (item.icon === "chat") {
                    go(35) // الرسائل
                  } else {
                    onOpenProperty(allProperties[0]) // تفاصيل العقار
                  }
                }}
                className={`group relative flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-all ${
                  isRead
                    ? "border-[var(--line)] bg-[var(--surface-raised)] opacity-75"
                    : "border-[var(--primary)]/60 bg-[var(--primary-soft)]/20 shadow-xs"
                }`}
              >
                {/* أيقونة نوع الإشعار */}
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary-text)] shadow-xs">
                  <Icon name={item.icon} />
                </span>

                {/* تفاصيل التنبيه */}
                <div className="min-w-0 flex-1 text-right">
                  <div className="flex items-center justify-between gap-1">
                    <strong className="truncate text-xs font-black text-[var(--text)]">
                      {item.title}
                    </strong>
                    <span className="text-[9px] font-semibold text-[var(--text-dim)]">
                      {item.time}
                    </span>
                  </div>

                  <p className="mt-1 leading-relaxed text-[11px] font-medium text-[var(--text-muted)]">
                    {item.body}
                  </p>

                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[var(--primary-text)]">
                    <span>عرض التفاصيل</span>
                    <Icon name="chevron" />
                  </span>
                </div>

                {/* نقطة الإشعار غير المقروء */}
                {!isRead && (
                  <span className="absolute top-3 left-3 size-2 rounded-full bg-[var(--primary-strong)] animate-pulse" />
                )}
              </div>
            )
          })}

          {filteredItems.length === 0 && (
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-8 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
                <Icon name="bell" />
              </span>
              <strong className="mt-3 block text-xs font-black text-[var(--text)]">
                لا توجد إشعارات حالياً
              </strong>
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                ستظهر تنبيهات العقارات والرسائل الجديدة هنا فور ورودها.
              </p>
            </div>
          )}
        </div>
      </main>
    </section>
  )
}
