import type { FormEvent } from "react"
import { Field } from "../../components/Field"
import { PrimaryButton } from "../../components/PrimaryButton"
import { AuthHeader } from "./Login"

export function SignUp({ go }: { go: (screen: number) => void }) {
  const submit = (event: FormEvent) => {
    event.preventDefault()
    go(6)
  }

  return (
    <section className="screen scrollable">
      <AuthHeader
        title="إنشاء حساب جديد"
        subtitle="خطوة واحدة تفصلك عن تجربة مسكني."
      />
      <form className="auth-form signup-form" onSubmit={submit}>
        <Field label="الاسم الكامل" icon="user" />
        <Field label="رقم الهاتف أو البريد" icon="phone" />
        <Field label="كلمة المرور" icon="lock" password />
        <Field label="تأكيد كلمة المرور" icon="lock" password />
        <PrimaryButton type="submit">تسجيل</PrimaryButton>
      </form>
      <p className="auth-switch">
        لديك حساب بالفعل؟ <button onClick={() => go(4)}>تسجيل الدخول</button>
      </p>
    </section>
  )
}
