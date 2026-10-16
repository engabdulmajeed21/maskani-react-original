import type { FormEvent } from "react"
import { BrandMini } from "../../components/BrandMini"
import { Field } from "../../components/Field"
import { PrimaryButton } from "../../components/PrimaryButton"
import type { AuthHeaderProps } from "../../types"

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <>
      <header className="topbar auth-topbar">
        <BrandMini />
      </header>
      <div className="auth-heading">
        <span className="eyebrow">مرحباً بعودتك</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </>
  )
}

export function Login({
  go,
  onGuestLogin,
}: {
  go: (screen: number) => void
  onGuestLogin?: () => void
}) {
  const submit = (event: FormEvent) => {
    event.preventDefault()
    go(6)
  }

  const handleGuestLogin = () => {
    if (onGuestLogin) onGuestLogin()
    go(12) // الانتقال المباشر للشاشة الرئيسية
  }

  return (
    <section className="screen scrollable" dir="rtl">
      <AuthHeader
        title="تسجيل الدخول"
        subtitle="سجّل دخولك لتكمل رحلتك من حيث توقفت."
      />
      <form className="auth-form" onSubmit={submit}>
        <Field label="البريد الإلكتروني أو الهاتف" icon="mail" />
        <Field label="كلمة المرور" icon="lock" password />
        <div className="options-row">
          <label className="check-label">
            <input type="checkbox" defaultChecked />
            <span className="custom-check">✓</span>
            تذكرني
          </label>
          <button type="button" className="link-button" onClick={() => go(7)}>
            هل نسيت كلمة المرور؟
          </button>
        </div>
        <PrimaryButton type="submit">دخول</PrimaryButton>
      </form>

      {/* زر الدخول كزائر (تصفح فقط) */}
      <div className="mt-4 pt-3 border-t border-[var(--line)]">
        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full min-h-12 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--text)] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[var(--surface-soft)] active:scale-98 transition shadow-xs"
        >
          <span>👤 الدخول كزائر (تصفح واستكشاف فقط)</span>
        </button>
      </div>

      <p className="auth-switch">
        ليس لديك حساب؟ <button onClick={() => go(5)}>إنشاء حساب</button>
      </p>
    </section>
  )
}
