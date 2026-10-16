import { useState, type FormEvent } from "react"
import { Icon } from "../../components/Icon"
import { PageHeader } from "../../components/PageHeader"
import { PrimaryButton } from "../../components/PrimaryButton"
import { UploadZone } from "../../components/UploadZone"

export function JoinPartner({ go }: { go: (screen: number) => void }) {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [managementDetails, setManagementDetails] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(true)
  const [notice, setNotice] = useState("")

  const quickOptions = [
    "أرغب بعرض وإدارة عقاراتي الشخصية مباشرة",
    "إدارة مكتب عقاري وعرض الوحدات المتاحة",
    "عرض وإدارة حجز الفنادق والشاليهات",
    "تأجير وإدارة محلات تجارية وأراضٍ",
  ]

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    setNotice("سيتم التواصل معك بعد مراجعة بياناتك من قبل إدارة المنصة خلال اقرب وقت")
  }

  return (
    <section className="screen feature-screen relative pb-12 bg-[var(--surface-soft)]">
      <PageHeader title="انضم إلينا كشريك" go={go} />
      
      <main className="feature-content partner-content space-y-4 px-4 pt-4 overflow-y-auto max-w-lg mx-auto">
        {/* إشعار التذكير العلوي */}
        {notice && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-sm flex items-start gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white text-sm">
              ✓
            </span>
            <div className="flex-1 min-w-0">
              <strong className="block text-sm font-black mb-0.5">تم إرسال طلبك بنجاح!</strong>
              <p className="text-[11px] font-medium leading-relaxed">{notice}</p>
            </div>
          </div>
        )}

        {submitted ? (
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] p-6 text-center space-y-4 shadow-md">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 text-2xl font-black">
              ✨
            </div>
            <div>
              <h2 className="text-base font-black text-[var(--text)]">طلب الانضمام قيد المراجعة</h2>
              <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
                نشكر اهتمامك بالشراكة مع منصة مسكني. تم استلام بياناتك وسيتم التواصل معك بعد مراجعتها من قبل إدارة المنصة خلال أقرب وقت.
              </p>
            </div>
            
            <div className="rounded-2xl bg-[var(--surface-soft)] p-3.5 text-right text-xs space-y-1.5 border border-[var(--line)]">
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">مقدم الطلب:</span>
                <strong className="text-[var(--text)]">{fullName || "محمد الحيمي"}</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">رقم التواصل:</span>
                <strong className="text-[var(--text)]" dir="ltr">{phone || "+967 771 234 567"}</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">حالة الطلب:</span>
                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">قيد الدراسة والتحقق ⏳</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => go(12)}
                className="flex-1 h-11 rounded-2xl bg-[var(--primary-strong)] text-white text-xs font-black shadow-md hover:bg-[var(--primary)]"
              >
                العودة للرئيسية
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="h-11 px-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] text-xs font-bold hover:bg-[var(--surface-soft)]"
              >
                تعديل البيانات
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* كرت الترحيب والمميزات */}
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 text-xl">
                  <Icon name="userPlus" />
                </span>
                <div>
                  <h2 className="text-sm font-black text-[var(--text)]">كن شريكاً في النجاح</h2>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    عرض عقاراتك وإدارتها بسهولة والوصول لآلاف العملاء في اليمن
                  </p>
                </div>
              </div>

              {/* مميزات الشراكة */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded-xl bg-[var(--surface-soft)] p-2.5 flex items-center gap-2 border border-[var(--line)]">
                  <span className="text-emerald-500 text-xs">✓</span>
                  <span className="text-[10px] font-bold text-[var(--text)]">إدارة عقارات مباشرة</span>
                </div>
                <div className="rounded-xl bg-[var(--surface-soft)] p-2.5 flex items-center gap-2 border border-[var(--line)]">
                  <span className="text-emerald-500 text-xs">✓</span>
                  <span className="text-[10px] font-bold text-[var(--text)]">تنبيهات ورسائل فورية</span>
                </div>
                <div className="rounded-xl bg-[var(--surface-soft)] p-2.5 flex items-center gap-2 border border-[var(--line)]">
                  <span className="text-emerald-500 text-xs">✓</span>
                  <span className="text-[10px] font-bold text-[var(--text)]">توثيق رسمي وشارة شريك</span>
                </div>
                <div className="rounded-xl bg-[var(--surface-soft)] p-2.5 flex items-center gap-2 border border-[var(--line)]">
                  <span className="text-emerald-500 text-xs">✓</span>
                  <span className="text-[10px] font-bold text-[var(--text)]">دعم مخصص 24/7</span>
                </div>
              </div>
            </div>

            {/* نموذج البيانات */}
            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-xs space-y-3">
                <h3 className="text-xs font-black text-[var(--text-muted)] border-b border-[var(--line)] pb-2">
                  البيانات الشخصية
                </h3>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[var(--text)]">
                    الاسم الكامل / اسم المكتب أو المنشأة
                  </label>
                  <div className="flex items-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-2.5">
                    <span className="text-[var(--text-muted)]"><Icon name="user" /></span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أدخل اسمك الكريِم أو اسم المنشأة..."
                      required
                      className="w-full bg-transparent text-xs font-semibold text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[var(--text)]">
                    رقم الهاتف والتواصل (واتساب)
                  </label>
                  <div className="flex items-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-2.5">
                    <span className="text-[var(--text-muted)]"><Icon name="phone" /></span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+967 7xx xxx xxx"
                      required
                      className="w-full bg-transparent text-xs font-semibold text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[var(--text)]">
                    البريد الإلكتروني
                  </label>
                  <div className="flex items-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-2.5">
                    <span className="text-[var(--text-muted)]"><Icon name="mail" /></span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@domain.ye"
                      className="w-full bg-transparent text-xs font-semibold text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
                    />
                  </div>
                </div>
              </div>

              {/* حقل ادخال تفاصيل عرض العقارات وإدارتها بدلاً من اختيار نوع الحساب */}
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-[var(--text)]">
                    هل تريد عرض عقاراتك وإدارتها عبر المنصة؟
                  </label>
                  <span className="text-[9px] font-bold text-[var(--primary-text)]">مطلوب</span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] leading-normal">
                  يرجى توضيح هل ترغب بعرض عقاراتك الشخصية أم إدارة مكتب عقاري أو فندق/شاليه وتحديد نوع العقارات.
                </p>

                <textarea
                  value={managementDetails}
                  onChange={(e) => setManagementDetails(e.target.value)}
                  placeholder="أكتب تفاصيل طلبك هنا (مثال: أرغب بعرض وإدارة 3 شقق سكنية ومحل تجاري في صنعاء)..."
                  rows={3}
                  required
                  className="w-full rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] p-3 text-xs font-semibold text-[var(--text)] outline-none focus:border-[var(--primary)] placeholder:text-[var(--text-muted)]"
                />

                {/* خيارات سريعة لتعبئة الحقل بسهولة */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-[var(--text-dim)]">اختيارات سريعة للتعبئة:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setManagementDetails(option)}
                        className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--text)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] transition"
                      >
                        + {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* رفع الهوية السجل التجاري */}
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-xs space-y-2">
                <UploadZone label="رفع الهوية الوطنية / البطاقة أو السجل التجاري (اختياري)" />
              </div>

              {/* موافقة على الشروط */}
              <label className="flex items-center gap-2 px-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="size-4 rounded border-[var(--line-strong)] text-[var(--primary)]"
                />
                <span className="text-[11px] font-bold text-[var(--text-muted)]">
                  أوافق على الشروط والأحكام الخاصة بالشركاء وإدارة العقارات
                </span>
              </label>

              <PrimaryButton type="submit" disabled={!agreedTerms}>
                إرسال طلب الانضمام
              </PrimaryButton>
            </form>
          </>
        )}
      </main>
    </section>
  )
}


