import { useState } from "react"
import { Icon } from "../../components/Icon"
import { PageHeader } from "../../components/PageHeader"
import { Field } from "../../components/Field"
import { PrimaryButton } from "../../components/PrimaryButton"
import { UploadZone } from "../../components/UploadZone"
import { SuccessBanner } from "../../components/SuccessBanner"

export function AccountVerification({
  go,
}: {
  go: (screen: number) => void
}) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="screen feature-screen">
      <PageHeader title="توثيق الحساب" go={go} />
      <main className="feature-content verification-content">
        {submitted && (
          <SuccessBanner>
            تم رفع بياناتك بنجاح، بانتظار مراجعة الإدارة
          </SuccessBanner>
        )}
        <div className="verification-intro">
          <span>
            <Icon name="shield" />
          </span>
          <div>
            <h2>وثّق هويتك</h2>
            <p>ارفع مستوى الثقة والأمان في حسابك على مسكني.</p>
          </div>
        </div>
        <form
          className="profile-form"
          onSubmit={(event) => {
            event.preventDefault()
            if (submitted) return
            setSubmitted(true)
          }}
        >
          <Field label="الاسم الرباعي" icon="user" />
          <Field label="رقم الهوية" icon="document" />
          <UploadZone label="رفع صورة الهوية" />
          <PrimaryButton type="submit" disabled={submitted}>
            {submitted ? "تم الإرسال..." : "إرسال طلب التوثيق"}
          </PrimaryButton>
        </form>
      </main>
    </section>
  )
}
