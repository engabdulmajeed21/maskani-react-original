import type { FormEvent } from "react"
import { Icon } from "../../components/Icon"
import { PageHeader } from "../../components/PageHeader"
import { Field } from "../../components/Field"

export function DeactivateAccount({ go }: { go: (screen: number) => void }) {
  const submit = (event: FormEvent) => {
    event.preventDefault()
    go(4)
  }

  return (
    <section className="screen feature-screen">
      <PageHeader title="تعطيل الحساب" go={go} />
      <main className="danger-main delete-main">
        <div className="warning-symbol warning-symbol--soft">
          <Icon name="pause" />
        </div>
        <span className="eyebrow">توقف مؤقت</span>
        <h1>هل ترغب في إيقاف حسابك مؤقتاً؟</h1>
        <p>ستتمكن من العودة متى شئت، وستظل بياناتك وحجوزاتك محفوظة بأمان.</p>
        <div className="info-note mb-4">
          <Icon name="shield" />
          لن يظهر ملفك أو نشاطك للآخرين خلال فترة التعطيل.
        </div>
        <form className="delete-form" onSubmit={submit}>
          <Field label="أدخل كلمة المرور للتأكيد" icon="lock" password />
          <button className="delete-button" type="submit">
            <Icon name="pause" />
            تأكيد تعطيل الحساب
          </button>
        </form>
      </main>
    </section>
  )
}
