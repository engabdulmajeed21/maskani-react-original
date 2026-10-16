import { useState } from "react"
import { Icon } from "../../components/Icon"
import { PageHeader } from "../../components/PageHeader"

export function AiAssistant({
  go,
  isGuest = false,
  onPromptGuestLogin,
}: {
  go: (screen: number) => void
  isGuest?: boolean
  onPromptGuestLogin?: () => void
}) {
  const [message, setMessage] = useState("")
  const [sentMessage, setSentMessage] = useState("")
  const prompts = [
    "أبحث عن شقة قريبة من عملي",
    "شاليه لعطلة نهاية الأسبوع",
    "فندق مناسب للعائلة",
  ]

  const sendMessage = () => {
    if (isGuest) {
      if (onPromptGuestLogin) onPromptGuestLogin()
      return
    }
    if (!message.trim()) return
    setSentMessage(message)
    setMessage("")
  }

  const handleChipClick = (prompt: string) => {
    if (isGuest) {
      if (onPromptGuestLogin) onPromptGuestLogin()
      return
    }
    setMessage(prompt)
  }

  return (
    <section className="screen ai-screen" dir="rtl">
      <PageHeader title="مساعد مسكني الذكي" go={go} />

      {isGuest && (
        <div className="mx-4 mt-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center shadow-xs">
          <p className="text-xs font-black text-amber-600 dark:text-amber-400">
            🔒 التفاعل مع المساعد الذكي يتطلب تسجيل الدخول
          </p>
          <p className="mt-1 text-[11px] leading-5 text-[var(--text-muted)]">
            أنت تتصفح كزائر للعرض فقط. يرجى تسجيل الدخول للحصول على اقتراحات مخصصة وإجراء محادثات ذكية.
          </p>
          <button
            type="button"
            onClick={() => {
              if (onPromptGuestLogin) onPromptGuestLogin()
            }}
            className="mt-2.5 h-10 w-full rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-98 transition flex items-center justify-center gap-1.5"
          >
            <span>تسجيل الدخول / إنشاء حساب</span>
            <span>↗</span>
          </button>
        </div>
      )}

      <main className="ai-content">
        <div className="ai-identity">
          <span>
            <Icon name="sparkles" />
          </span>
          <div>
            <strong>مساعد مسكني</strong>
            <small>
              <i /> متصل الآن
            </small>
          </div>
        </div>
        <div className="chat-thread">
          <div className="ai-bubble">
            مرحباً! كيف يمكنني مساعدتك في العثور على عقارك المثالي اليوم؟
            <small>الآن</small>
          </div>
          {sentMessage && (
            <>
              <div className="user-bubble">{sentMessage}</div>
              <div className="ai-bubble">
                رائع، سأبحث لك عن أفضل الخيارات المطابقة وأرتبها حسب تفضيلاتك.
              </div>
            </>
          )}
        </div>
        <div className="prompt-chips">
          <p>جرّب أن تسأل عن:</p>
          {prompts.map((prompt) => (
            <button key={prompt} onClick={() => handleChipClick(prompt)}>
              <Icon name="sparkles" />
              {prompt}
            </button>
          ))}
        </div>
      </main>
      <div className="chat-composer">
        <input
          value={message}
          onChange={(event) => {
            if (isGuest) {
              if (onPromptGuestLogin) onPromptGuestLogin()
              return
            }
            setMessage(event.target.value)
          }}
          onFocus={() => {
            if (isGuest && onPromptGuestLogin) {
              onPromptGuestLogin()
            }
          }}
          onKeyDown={(event) => event.key === "Enter" && sendMessage()}
          placeholder={isGuest ? "تسجيل الدخول مطلوب للمحادثة..." : "تحدث مع المساعد الذكي..."}
          disabled={isGuest}
        />
        <button
          onClick={sendMessage}
          aria-label="إرسال"
          className={isGuest ? "opacity-50 cursor-not-allowed" : ""}
        >
          <Icon name="send" />
        </button>
      </div>
    </section>
  )
}
