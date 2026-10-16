import { useState, type FormEvent } from "react"
import { Icon } from "../../components/Icon"
import { PageHeader } from "../../components/PageHeader"
import { PrimaryButton } from "../../components/PrimaryButton"
import { SuccessBanner } from "../../components/SuccessBanner"

export function EditProfile({ go }: { go: (screen: number) => void }) {
  const [saved, setSaved] = useState(false)
  
  const [fullName, setFullName] = useState("محمد أحمد الحيمي")
  const [phone, setPhone] = useState("+967 771 234 567")
  const [email, setEmail] = useState("m.ahmed@maskani.ye")
  const [city, setCity] = useState("صنعاء")
  const [bio, setBio] = useState("باحث عن عقار مناسب للسكن العائلي")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const yemeniCities = ["صنعاء", "عدن", "تعز", "إب", "الحديدة", "المكلا", "ذمار"]

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSaved(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => setSaved(false), 4000)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <section className="screen feature-screen relative pb-28" dir="rtl">
      <PageHeader title="الملف الشخصي — المعلومات الشخصية" go={go} />

      <main className="feature-content space-y-5 px-4 pt-4 overflow-y-auto">
        {saved && (
          <SuccessBanner>
            ✨ تم حفظ بيانات الملف الشخصي بنجاح!
          </SuccessBanner>
        )}

        {/* كرت البطل العلوي الموحد مع معاينة فورية للصورة */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--primary-strong)] text-xl font-black text-white shadow-md ring-4 ring-[var(--surface-soft)]">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="الصورة الشخصية"
                  className="size-full object-cover"
                />
              ) : (
                "مح"
              )}
              <label
                htmlFor="avatar-upload-input"
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100 hover:opacity-100"
                title="تغيير الصورة"
              >
                <span className="grid size-8 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md">
                  <Icon name="upload" />
                </span>
              </label>
              <input
                id="avatar-upload-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <strong className="truncate text-base font-black text-[var(--text)]">
                  {fullName}
                </strong>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  موثق ✅
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs font-medium text-[var(--text-muted)]" dir="ltr">
                {phone}
              </p>
              <label
                htmlFor="avatar-upload-input"
                className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-extrabold text-[var(--primary-text)] hover:underline"
              >
                <Icon name="upload" />
                <span>تغيير الصورة الشخصية</span>
              </label>
            </div>
          </div>
        </div>

        {/* نموذج البيانات الشخصية فقط */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3.5 rounded-3xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-sm">
            <label className="block space-y-1.5 text-right">
              <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <Icon name="user" />
                <span>الاسم الكامل</span>
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-xs font-semibold text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </label>

            <label className="block space-y-1.5 text-right">
              <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <Icon name="phone" />
                <span>رقم الهاتف</span>
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                dir="ltr"
                className="w-full rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-xs font-semibold text-[var(--text)] text-right outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </label>

            <label className="block space-y-1.5 text-right">
              <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <Icon name="mail" />
                <span>البريد الإلكتروني</span>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
                className="w-full rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-xs font-semibold text-[var(--text)] text-right outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </label>

            <div className="space-y-2 text-right">
              <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <Icon name="pin" />
                <span>المدينة الحالية</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {yemeniCities.map((cityName) => (
                  <button
                    key={cityName}
                    type="button"
                    onClick={() => setCity(cityName)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      city === cityName
                        ? "bg-[var(--primary-strong)] text-white shadow-xs"
                        : "border border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    {cityName}
                  </button>
                ))}
              </div>
            </div>

            <label className="block space-y-1.5 text-right">
              <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <Icon name="document" />
                <span>نبذة بسيطة (اختياري)</span>
              </span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-xs font-semibold text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 resize-none"
              />
            </label>
          </div>

          <PrimaryButton type="submit">
            حفظ البيانات الشخصية 💾
          </PrimaryButton>
        </form>
      </main>
    </section>
  )
}
