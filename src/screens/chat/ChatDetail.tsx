import { useState, useEffect } from "react"
import { Icon } from "../../components/Icon"
import { BackButton } from "../../components/BackButton"
import { ConfirmModal } from "../../components/ConfirmModal"
import { propertyAddress, propertyPrice } from "../../utils/property"
import type { Conversation, Property } from "../../types"

export function ChatDetail({
  go,
  property,
  conversation,
  isBlocked: isBlockedProp,
  onDelete,
  onBlock,
  onUnblock,
  onReport,
  muted,
  onToggleMute,
  onSendMessage,
  onViewOwner,
  onOpenProperty,
}: {
  go: (screen: number) => void
  property?: Property
  conversation?: Conversation
  isBlocked?: boolean
  onDelete: (id?: string) => void
  onBlock: (id?: string) => void
  onUnblock?: (id?: string) => void
  onReport: (id?: string) => void
  muted: boolean
  onToggleMute: (id?: string) => void
  onSendMessage: (id: string | undefined, message: string) => void
  onViewOwner: () => void
  onOpenProperty: (property: Property) => void
}) {
  const [message, setMessage] = useState("")
  const [notice, setNotice] = useState("")
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [voicePlaying, setVoicePlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [isPreviewingAudio, setIsPreviewingAudio] = useState(false)
  const [previewPlaying, setPreviewPlaying] = useState(false)
  const [localMuted, setLocalMuted] = useState(false)
  const [internalBlocked, setInternalBlocked] = useState(false)
  const isBlocked = isBlockedProp ?? internalBlocked
  const [isReported, setIsReported] = useState(false)
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false)
  const [confirmReportOpen, setConfirmReportOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  useEffect(() => {
    let interval: number | undefined
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      setRecordingSeconds(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleMicClick = () => {
    if (isBlocked) {
      showNotice("المستخدم محظور حالياً")
      return
    }
    if (isRecording) {
      // Stop recording and enter preview mode
      setIsRecording(false)
      setIsPreviewingAudio(true)
      showNotice("تم إيقاف التسجيل. يمكنك الاستماع إلى الصوت قبل الإرسال 🎧")
    } else if (isPreviewingAudio) {
      setPreviewPlaying((c) => !c)
    } else {
      // Start recording
      setIsRecording(true)
      setRecordingSeconds(0)
      setIsPreviewingAudio(false)
      showNotice("جاري تسجيل الصوت... انقر على زر التوقيف عند الانتهاء 🔴")
    }
  }

  const sendRecordedVoice = () => {
    const secs = recordingSeconds < 10 ? `0:0${recordingSeconds}` : `0:${recordingSeconds}`
    const voiceText = `🎙️ [رسالة صوتية مسجلة - ${secs}]`
    onSendMessage(conversation?.id, voiceText)
    setIsPreviewingAudio(false)
    setPreviewPlaying(false)
    setRecordingSeconds(0)
    showNotice("تم إرسال الرسالة الصوتية بنجاح 🎙️")
  }

  const discardRecordedVoice = () => {
    setIsPreviewingAudio(false)
    setPreviewPlaying(false)
    setRecordingSeconds(0)
    showNotice("تم حذف التسجيل الصوتي")
  }

  const isMuted = conversation ? muted : localMuted
  const contactName =
    conversation?.name ?? property?.owner.name ?? "أحمد القاسمي"
  const contactInitials =
    conversation?.initials ?? property?.owner.initials ?? "أق"

  const showNotice = (text: string) => {
    setNotice(text)
    window.setTimeout(() => setNotice(""), 2200)
  }

  const sendMessage = () => {
    if (!message.trim()) return
    if (isBlocked) {
      showNotice("لا يمكنك إرسال رسالة إلى مستخدم محظور")
      return
    }
    const nextMessage = message.trim()
    onSendMessage(conversation?.id, nextMessage)
    setMessage("")
  }

  const sendQuickAction = (text: string) => {
    if (isBlocked) {
      showNotice("المستخدم محظور حالياً")
      return
    }
    onSendMessage(conversation?.id, text)
    showNotice("تم إرسال الطلب المباشر للمالك")
  }

  const handleBlockConfirm = () => {
    setInternalBlocked(true)
    setConfirmBlockOpen(false)
    setOptionsOpen(false)
    onBlock(conversation?.id)
    showNotice(`تم حظر ${contactName}`)
  }

  const handleUnblock = () => {
    setInternalBlocked(false)
    if (onUnblock) {
      onUnblock(conversation?.id)
    } else {
      onBlock(conversation?.id)
    }
    showNotice(`تم رفع الحظر عن ${contactName}`)
  }

  const handleReportConfirm = () => {
    setIsReported(true)
    onReport(conversation?.id)
    showNotice("تم إرسال البلاغ لمراجعة الإدارة")
    setConfirmReportOpen(false)
    setOptionsOpen(false)
  }

  const handleUndoReport = () => {
    setIsReported(false)
    showNotice("تم إلغاء البلاغ عن المحادثة")
  }

  const handleDeleteConfirm = () => {
    setConfirmDeleteOpen(false)
    setOptionsOpen(false)
    onDelete(conversation?.id)
  }

  const matchingMessages = (conversation?.messages ?? []).filter((item) =>
    item.text
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase()),
  )

  return (
    <section className="screen chat-detail-screen flex h-full flex-col bg-[var(--surface-soft)]">
      {/* رأس المحادثة */}
      <header className="chat-detail-header flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3">
        <div className="flex items-center gap-2">
          <BackButton onClick={() => go(-1)} />
          <div
            className="chat-contact flex cursor-pointer items-center gap-2"
            onClick={onViewOwner}
          >
            <span className="relative flex size-10 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-xs font-black text-[var(--primary-text)]">
              {contactInitials}
              {!isBlocked && (
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--surface-raised)]" />
              )}
            </span>
            <div>
              <strong className="block text-xs font-black text-[var(--text)]">
                {contactName}
                <span className="mr-1 text-[10px] text-[var(--primary-text)]">✓</span>
              </strong>
              <small
                className={`text-[10px] font-bold ${
                  isBlocked
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {isBlocked ? "مستخدم محظور" : "متصل الآن"}
              </small>
            </div>
          </div>
        </div>

        <div className="chat-header-actions flex items-center gap-1">
          <button
            onClick={() => setOptionsOpen(true)}
            aria-label="المزيد من الخيارات"
            className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
          >
            <Icon name="more" />
          </button>
        </div>
      </header>

      {/* البحث في المحادثة */}
      {isSearching && (
        <div className="chat-message-search flex items-center gap-2 border-b border-[var(--line)] bg-[var(--surface-raised)] px-4 py-2">
          <label className="flex flex-1 items-center gap-2 rounded-xl bg-[var(--surface-soft)] px-3 py-1.5 text-xs">
            <Icon name="search" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ابحث في الرسائل..."
              className="w-full bg-transparent text-xs text-[var(--text)] outline-none"
              autoFocus
            />
          </label>
          {searchQuery && (
            <span className="text-[10px] font-bold text-[var(--text-muted)]">
              {matchingMessages.length} نتيجة
            </span>
          )}
          <button
            onClick={() => {
              setSearchQuery("")
              setIsSearching(false)
            }}
            className="text-xs font-bold text-[var(--primary-text)]"
          >
            إلغاء
          </button>
        </div>
      )}

      {/* شريط الإشعار عند حظر المستخدم دون حذف المحادثة */}
      {isBlocked && (
        <div className="flex items-center justify-between bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-700 dark:text-amber-300 border-b border-amber-500/20">
          <span className="flex items-center gap-1.5">
            <span>⚠️</span> تم حظر هذا المستخدم. لن تتمكن من إرسال رسائل جديدة.
          </span>
          <button
            onClick={handleUnblock}
            className="rounded-lg bg-amber-500 px-2.5 py-1 text-[10px] font-black text-white shadow-xs"
          >
            إلغاء الحظر
          </button>
        </div>
      )}

      {/* شريط الإشعار عند إبلاغ عن المحادثة مع إمكانية التراجع */}
      {isReported && (
        <div className="flex items-center justify-between bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 border-b border-rose-500/20">
          <span className="flex items-center gap-1.5">
            <span>🚨</span> تم إرسال بلاغ عن هذه المحادثة للإدارة.
          </span>
          <button
            onClick={handleUndoReport}
            className="rounded-lg border border-rose-500 bg-transparent px-2.5 py-1 text-[10px] font-black text-rose-600 hover:bg-rose-500 hover:text-white"
          >
            تراجع عن البلاغ
          </button>
        </div>
      )}

      {/* محتوى المحادثة والرسائل */}
      <main className="messages-thread flex-1 space-y-5 overflow-y-auto p-4">
        {/* كرت العقار المرتبط بالمحادثة */}
        <button
          type="button"
          className="shared-property-card flex w-full items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-3.5 text-right shadow-xs transition hover:border-[var(--primary)] active:scale-98"
          onClick={() => (property ? onOpenProperty(property) : go(14))}
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
            <Icon name="building" />
          </span>
          <div className="min-w-0 flex-1">
            <small className="block text-[10px] font-bold text-[var(--primary-text)]">
              العقار المستفسر عنه
            </small>
            <strong className="block truncate text-xs font-black text-[var(--text)]">
              {property?.title ?? "شقة فاخرة مع حديقة في حي حدة"}
            </strong>
            <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)]">
              📍 {property ? propertyAddress(property) : "صنعاء، السبعين، حدة"}
            </p>
          </div>
          <b className="shrink-0 text-xs font-black text-[var(--primary-text)]">
            {property ? propertyPrice(property) : "85,000,000 ر.ي"}
          </b>
        </button>

        {/* أزرار الإجراءات السريعة للمستخدم */}
        {!isBlocked && (
          <div className="flex items-center gap-2 overflow-x-auto py-1.5 [scrollbar-width:none]">
            <button
              type="button"
              onClick={() => sendQuickAction("📍 هل يمكن إرسال موقع العقار بدقة على الخريطة؟")}
              className="shrink-0 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] px-3.5 py-2 text-xs font-bold text-[var(--text)] shadow-2xs hover:bg-[var(--surface-soft)] transition"
            >
              📍 إرسال الموقع
            </button>
            <button
              type="button"
              onClick={() => sendQuickAction("📅 أود ترتيب موعد مناسب لمعاينة العقار")}
              className="shrink-0 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] px-3.5 py-2 text-xs font-bold text-[var(--text)] shadow-2xs hover:bg-[var(--surface-soft)] transition"
            >
              📅 طلب معاينة
            </button>
            <button
              type="button"
              onClick={() => sendQuickAction("🏷️ هل هناك إمكانية للتفاوض في السعر؟")}
              className="shrink-0 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] px-3.5 py-2 text-xs font-bold text-[var(--text)] shadow-2xs hover:bg-[var(--surface-soft)] transition"
            >
              🏷️ تقديم عرض سعر
            </button>
          </div>
        )}

        <div className="chat-date-divider text-center my-3">
          <span className="rounded-full bg-[var(--surface-soft)] px-3.5 py-1 text-[10px] font-bold text-[var(--text-muted)] border border-[var(--line)]">
            اليوم
          </span>
        </div>

        {/* الرسائل المخزنة في قاعدة البيانات / المحادثة مع تباعد محسّن */}
        {(conversation?.messages ?? [
          { id: "m-1", text: "السلام عليكم، هل يمكن ترتيب موعد لمعاينة العقار يوم الغد؟", sentAt: "10:34 ص" },
          { id: "m-2", text: "وعليكم السلام ورحمة الله، أهلاً بك! نعم بالتأكيد الموعد مناسب غداً بعد الساعة الرابعة عصراً.", sentAt: "10:36 ص" },
        ]).map((msg, index) => {
          const isOutgoing = index % 2 === 1 || msg.id.startsWith("message-")
          return isOutgoing ? (
            <div className="message-row outgoing flex justify-end" key={msg.id}>
              <div className="message-bubble max-w-[80%] rounded-2xl rounded-tl-xs bg-[var(--primary-strong)] px-4 py-3 text-xs font-semibold text-white shadow-sm space-y-1">
                <p className="leading-5">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 text-[9px] opacity-80" dir="ltr">
                  <span>{msg.sentAt}</span>
                  <span>✓✓</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="message-row incoming flex items-start gap-2.5" key={msg.id}>
              <span className="mini-chat-avatar grid size-8 shrink-0 place-items-center rounded-2xl bg-[var(--primary-soft)] text-xs font-black text-[var(--primary-text)] shadow-xs">
                {contactInitials}
              </span>
              <div className="message-bubble max-w-[80%] rounded-2xl rounded-tr-xs border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3 text-xs font-semibold text-[var(--text)] shadow-sm space-y-1">
                <p className="leading-5">{msg.text}</p>
                <div className="flex items-center justify-end text-[9px] text-[var(--text-muted)]" dir="ltr">
                  <span>{msg.sentAt}</span>
                </div>
              </div>
            </div>
          )
        })}
      </main>

      {/* حقل كتابة وتكوين الرسالة مع تصميم متجاوب لجميع المقاسات */}
      <div className="message-composer flex flex-col gap-2.5 border-t border-[var(--line)] bg-[var(--surface-raised)] p-3 sm:p-4">
        {isRecording && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-rose-600 animate-ping" />
              جاري تسجيل الصوت... (0:0{recordingSeconds})
            </span>
            <button
              type="button"
              onClick={handleMicClick}
              className="flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-white text-[11px] font-black shadow-xs hover:bg-rose-700"
            >
              <span>⏹️ توقيف التسجيل</span>
            </button>
          </div>
        )}

        {isPreviewingAudio && (
          <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl bg-[var(--primary-soft)] px-4 py-3 text-xs font-bold text-[var(--primary-text)] border border-[var(--primary)]/30">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setPreviewPlaying(!previewPlaying)}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--primary-strong)] text-white shadow-xs"
                title={previewPlaying ? "إيقاف مؤقت" : "استماع للتسجيل"}
              >
                {previewPlaying ? "❚❚" : "▶"}
              </button>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs font-black">
                  {previewPlaying ? "جاري تشغيل المعاينة الصوتية..." : "جاهز للإرسال (0:0" + (recordingSeconds || 3) + ")"}
                </span>
                <small className="text-[10px] text-[var(--text-muted)]">معاينة الصوت قبل الإرسال</small>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={discardRecordedVoice}
                className="rounded-xl border border-rose-500 bg-rose-500/10 px-3 py-1.5 text-xs font-black text-rose-600 hover:bg-rose-500 hover:text-white transition"
                title="حذف التسجيل"
              >
                ✕ حذف
              </button>
              <button
                type="button"
                onClick={sendRecordedVoice}
                className="rounded-xl bg-[var(--primary-strong)] px-3.5 py-1.5 text-xs font-black text-white hover:bg-[var(--primary)] transition shadow-xs"
                title="إرسال التسجيل"
              >
                ✓ إرسال
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 min-w-0">
          <label className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-[var(--line)] text-[var(--text-muted)] hover:bg-[var(--surface-soft)] transition">
            <input
              type="file"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) showNotice(`تم اختيار الملف: ${file.name}`)
                event.target.value = ""
              }}
            />
            <Icon name="paperclip" />
          </label>

          <div className="composer-input flex flex-1 min-w-0 items-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] px-3.5 py-2.5">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && sendMessage()}
              placeholder={isBlocked ? "المستخدم محظور حالياً..." : isRecording ? "جاري التسجيل..." : isPreviewingAudio ? "معاينة التسجيل الصوتي..." : "اكتب رسالتك..."}
              disabled={isBlocked || isRecording || isPreviewingAudio}
              className="w-full min-w-0 bg-transparent text-xs font-semibold text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
            />
            <button
              type="button"
              onClick={() => setMessage((current) => `${current}😊`)}
              className="text-[var(--text-muted)] hover:text-[var(--text)] shrink-0"
              disabled={isBlocked || isRecording || isPreviewingAudio}
              aria-label="إدراج رمز تعبيري"
            >
              <Icon name="smile" />
            </button>
          </div>

          {/* زر المايك/التوقيف وزر الإرسال جنباً إلى جنب بشكل متجاوب */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleMicClick}
              disabled={isBlocked}
              className={`grid size-10 shrink-0 place-items-center rounded-2xl text-white shadow-md transition active:scale-95 disabled:opacity-50 ${
                isRecording ? "bg-rose-600 animate-pulse" : isPreviewingAudio ? "bg-emerald-600" : "bg-gray-600 hover:bg-gray-700"
              }`}
              title={isRecording ? "توقيف التسجيل ومعاينته" : isPreviewingAudio ? "تشغيل/إيقاف المعاينة" : "بدء التسجيل الصوتي"}
            >
              <Icon name={isRecording ? "close" : isPreviewingAudio ? "video" : "mic"} />
            </button>

            <button
              type="button"
              onClick={isPreviewingAudio ? sendRecordedVoice : message.trim() ? sendMessage : () => showNotice("اكتب رسالتك أو سجل صوتاً أولاً")}
              disabled={isBlocked}
              className="composer-send grid size-10 shrink-0 place-items-center rounded-2xl bg-[var(--primary-strong)] text-white shadow-md transition hover:bg-[var(--primary)] active:scale-95 disabled:opacity-50"
              title="إرسال المحادثة"
            >
              <Icon name="send" />
            </button>
          </div>
        </div>
      </div>

      {/* خيارات المحادثة */}
      {optionsOpen && (
        <div className="chat-options-layer fixed inset-0 z-50 flex items-end justify-center bg-[var(--overlay)] backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-t-3xl border-t border-[var(--line)] bg-[var(--surface-raised)] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div>
                <strong className="text-sm font-black text-[var(--text)]">خيارات المحادثة</strong>
                <p className="text-[10px] text-[var(--text-muted)]">{contactName}</p>
              </div>
              <button
                type="button"
                onClick={() => setOptionsOpen(false)}
                className="grid size-8 place-items-center rounded-full bg-[var(--surface-soft)] text-[var(--text-muted)]"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onViewOwner()
                  setOptionsOpen(false)
                }}
                className="flex w-full items-center justify-between rounded-xl bg-[var(--surface)] p-3 text-xs font-bold text-[var(--text)] hover:bg-[var(--surface-soft)]"
              >
                <span className="flex items-center gap-2">
                  <Icon name="user" /> عرض الملف الشخصي للمالك
                </span>
                <Icon name="chevron" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (conversation) onToggleMute(conversation.id)
                  else setLocalMuted((current) => !current)
                  showNotice(isMuted ? "تم تشغيل الإشعارات" : "تم كتم الإشعارات")
                }}
                className="flex w-full items-center justify-between rounded-xl bg-[var(--surface)] p-3 text-xs font-bold text-[var(--text)] hover:bg-[var(--surface-soft)]"
              >
                <span className="flex items-center gap-2">
                  <Icon name={isMuted ? "bellOff" : "bell"} /> {isMuted ? "تشغيل الإشعارات" : "كتم الإشعارات"}
                </span>
                <span className={`text-[10px] font-black ${isMuted ? "text-[var(--danger-text)]" : "text-emerald-600"}`}>
                  {isMuted ? "مكتوم" : "مفعل"}
                </span>
              </button>

              {/* حظر أو رفع الحظر دون حذف المحادثة */}
              <button
                type="button"
                onClick={() => {
                  setOptionsOpen(false)
                  if (isBlocked) {
                    handleUnblock()
                  } else {
                    setConfirmBlockOpen(true)
                  }
                }}
                className={`flex w-full items-center justify-between rounded-xl p-3 text-xs font-bold transition ${
                  isBlocked
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon name="warning" /> {isBlocked ? "رفع الحظر عن المستخدم" : "حظر المستخدم"}
                </span>
                <span className="rounded-md px-2 py-0.5 text-[10px] font-black">
                  {isBlocked ? "رفع الحظر" : "حظر"}
                </span>
              </button>

              {/* إبلاغ مع إمكانية التراجع */}
              <button
                type="button"
                onClick={() => {
                  if (isReported) handleUndoReport()
                  else setConfirmReportOpen(true)
                }}
                className="flex w-full items-center gap-2 rounded-xl bg-[var(--surface)] p-3 text-xs font-bold text-[var(--text)] hover:bg-[var(--surface-soft)]"
              >
                <Icon name="document" /> {isReported ? "التراجع عن البلاغ" : "إبلاغ عن المحادثة"}
              </button>

              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(true)}
                className="flex w-full items-center gap-2 rounded-xl bg-[var(--danger-soft)] p-3 text-xs font-bold text-[var(--danger-text)] hover:bg-[var(--danger)] hover:text-white"
              >
                <Icon name="trash" /> مسح المحادثة
              </button>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-[var(--overlay)] px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-md">
          {notice}
        </div>
      )}

      {confirmBlockOpen && (
        <ConfirmModal
          title="حظر المستخدم"
          message={`هل أنت متأكد من رغبتك في حظر ${contactName}؟ ستظل المحادثة محفوظة لديك.`}
          confirmText="حظر"
          cancelText="إلغاء"
          variant="danger"
          onConfirm={handleBlockConfirm}
          onClose={() => setConfirmBlockOpen(false)}
        />
      )}

      {confirmReportOpen && (
        <ConfirmModal
          title="إبلاغ عن المحادثة"
          message="هل تريد إرسال بلاغ عن هذه المحادثة لمراجعتها؟ يمكنك التراجع عن البلاغ في أي وقت."
          confirmText="إرسال البلاغ"
          cancelText="إلغاء"
          variant="default"
          onConfirm={handleReportConfirm}
          onClose={() => setConfirmReportOpen(false)}
        />
      )}

      {confirmDeleteOpen && (
        <ConfirmModal
          title="مسح المحادثة"
          message="هل أنت متأكد من مسح هذه المحادثة نهائياً؟"
          confirmText="مسح نهائي"
          cancelText="إلغاء"
          variant="danger"
          onConfirm={handleDeleteConfirm}
          onClose={() => setConfirmDeleteOpen(false)}
        />
      )}
    </section>
  )
}
