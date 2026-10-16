import { useState } from "react"
import { Icon } from "../../components/Icon"
import { PageHeader } from "../../components/PageHeader"
import { bottomNav } from "../../data/navigation"
import type { Conversation } from "../../types"

export function Chats({
  go,
  conversations,
  blockedOwnerIds,
  onDelete,
  onPin,
  onUnpin,
  onOpen,
}: {
  go: (screen: number) => void
  conversations: Conversation[]
  blockedOwnerIds?: Set<string>
  onDelete: (id: string) => void
  onPin: (id: string) => void
  onUnpin: (id: string) => void
  onOpen: (conversation: Conversation) => void
}) {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")

  const unreadConversationCount = conversations.filter(
    (conversation) => conversation.unread > 0,
  ).length

  // تصفية المحادثات بناءً على البحث
  const visibleChats = [...conversations]
    .filter((conversation) => {
      const matchesSearch =
        conversation.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        conversation.message.toLowerCase().includes(query.trim().toLowerCase())
      const matchesTab = activeTab === "all" || conversation.unread > 0
      return matchesSearch && matchesTab
    })
    .sort(
      (a, b) =>
        Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) ||
        b.updatedAt - a.updatedAt,
    )

  return (
    <section className="screen feature-screen chats-screen relative pb-28">
      <PageHeader title="الرسائل والمحادثات" go={go} />

      <main className="chats-content space-y-3 px-4 pt-3 overflow-y-auto">
        {/* شريط البحث المباشر في المحادثات */}
        <div className="flex items-center gap-2">
          <label className="chats-search flex flex-1 items-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface-raised)] px-3.5 py-2.5 shadow-xs transition focus-within:border-[var(--primary)]">
            <span className="text-[var(--text-muted)]">
              <Icon name="search" />
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث باسم المالك أو نص الرسالة..."
              className="w-full bg-transparent text-xs font-semibold text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                ✕
              </button>
            )}
          </label>

          {/* فلتر سريع غير المقروءة فقط إذا كان يوجد إشعارات */}
          {unreadConversationCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab((t) => (t === "all" ? "unread" : "all"))}
              className={`flex items-center gap-1.5 shrink-0 rounded-2xl px-3 py-2.5 text-xs font-bold transition ${
                activeTab === "unread"
                  ? "bg-[var(--primary-strong)] text-white shadow-xs"
                  : "border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--text)]"
              }`}
            >
              <span>غير مقروء</span>
              <span className="grid size-4 place-items-center rounded-full bg-white/20 text-[9px]">
                {unreadConversationCount}
              </span>
            </button>
          )}
        </div>

        {/* المساعد الذكي المباشر المـثبت */}
        <button
          type="button"
          className="pinned-bot-card flex w-full items-center gap-3 rounded-2xl border-2 border-[var(--primary)]/30 bg-[var(--primary-soft)]/50 p-3 text-right shadow-xs transition hover:border-[var(--primary)] active:scale-98"
          onClick={() => go(17)}
        >
          <span className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--primary-strong)] text-white shadow-md">
            <Icon name="sparkles" />
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-white" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <strong className="truncate text-xs font-black text-[var(--text)]">
                مساعد مسكني الذكي ✨
              </strong>
              <span className="rounded-md bg-[var(--primary-strong)] px-1.5 py-0.5 text-[8px] font-black text-white">
                مثبت
              </span>
            </div>
            <p className="mt-0.5 truncate text-[10px] font-medium text-[var(--text-muted)]">
              أنا هنا لمساعدتك في اختيار العقارات وترتيب مواعيد المعاينة!
            </p>
          </div>
        </button>

        {/* قائمة المحادثات النشطة الحقيقية */}
        <div className="conversations-list space-y-2">
          {visibleChats.map((conversation, index) => {
            const isPinned = Boolean(conversation.pinned)
            const isUnread = conversation.unread > 0
            const isBlocked = Boolean(blockedOwnerIds?.has(conversation.ownerId))

            return (
              <div
                key={conversation.id}
                className={`group relative flex items-center justify-between rounded-2xl border p-3 transition-all ${
                  isPinned
                    ? "border-[var(--primary)]/60 bg-[var(--primary-soft)]/20 shadow-xs"
                    : "border-[var(--line)] bg-[var(--surface-raised)] hover:border-[var(--line-strong)] hover:shadow-xs"
                }`}
              >
                {/* كرت المحادثة القابل للنقر */}
                <div
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
                  onClick={() => onOpen(conversation)}
                >
                  {/* رمز المستخدم أو الصورة */}
                  <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-xs font-black text-[var(--primary-text)] shadow-xs">
                    {conversation.initials}
                    {conversation.online && !isBlocked && (
                      <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-[var(--surface-raised)]" />
                    )}
                  </span>

                  {/* التفاصيل والرسالة الأخيرة */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <strong className="truncate text-xs font-black text-[var(--text)]">
                        {conversation.name}
                      </strong>
                      <span className="text-[10px] text-[var(--primary-text)]">✓</span>
                      {isBlocked && (
                        <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-black text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          مستخدم محظور
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-1 truncate text-[11px] ${
                        isUnread
                          ? "font-black text-[var(--text)]"
                          : "font-medium text-[var(--text-muted)]"
                      }`}
                    >
                      {conversation.message}
                    </p>
                  </div>
                </div>

                {/* الوقت والإجراءات والمؤشرات */}
                <div className="flex shrink-0 flex-col items-end gap-1.5 pl-1">
                  <span className="text-[9px] font-semibold text-[var(--text-dim)]">
                    {conversation.time}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* خيار تثبيت المحادثة */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isPinned) onUnpin(conversation.id)
                        else onPin(conversation.id)
                      }}
                      className={`grid size-6 place-items-center rounded-lg text-[10px] transition ${
                        isPinned
                          ? "bg-[var(--primary-soft)] text-[var(--primary-text)] font-black"
                          : "text-[var(--text-dim)] hover:text-[var(--text)]"
                      }`}
                      title={isPinned ? "إلغاء التثبيت" : "تثبيت المحادثة"}
                    >
                      📌
                    </button>

                    {/* خيار مسح المحادثة */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(conversation.id)
                      }}
                      className="grid size-6 place-items-center rounded-lg text-[var(--text-dim)] transition hover:bg-[var(--danger-soft)] hover:text-[var(--danger-text)]"
                      title="حذف المحادثة"
                    >
                      <Icon name="trash" />
                    </button>

                    {/* شارة الرسائل غير المقروءة */}
                    {isUnread && (
                      <span className="grid size-5 place-items-center rounded-full bg-[var(--primary-strong)] text-[9px] font-black text-white shadow-xs">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {visibleChats.length === 0 && (
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-8 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
                <Icon name="chat" />
              </span>
              <strong className="mt-3 block text-xs font-black text-[var(--text)]">
                لا توجد محادثات مطابقة
              </strong>
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                جرّب البحث باسم آخر أو العودة لتصفح العقارات المتاحة.
              </p>
            </div>
          )}
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
            className={index === 3 ? "active relative" : "relative"}
            onClick={() => go(item.target)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {index === 3 && unreadConversationCount > 0 && (
              <b className="absolute top-1 right-1/2 translate-x-4 grid size-4 place-items-center rounded-full bg-[var(--danger)] text-[8px] text-white">
                {unreadConversationCount}
              </b>
            )}
          </button>
        ))}
      </nav>
    </section>
  )
}
