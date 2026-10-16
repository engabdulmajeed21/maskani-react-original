import { BrandMini } from "../../components/BrandMini"
import { Illustration } from "../../components/Illustration"
import { PrimaryButton } from "../../components/PrimaryButton"

export function Welcome({ go }: { go: (screen: number) => void }) {
  return (
    <section className="screen welcome-screen">
      <header className="topbar auth-topbar">
        <BrandMini />
      </header>
      <main className="welcome-main">
        <Illustration kind="success" />
        <div className="copy-block">
          <span className="success-pill">تم التفعيل بنجاح</span>
          <h1>تم تفعيل حسابك بنجاح!</h1>
          <p>
            أنت جاهز الآن لاستكشاف أفضل العقارات والفنادق والشاليهات، وتواصل مباشرة مع المالك.
          </p>
        </div>
      </main>
      <footer className="screen-footer">
        <PrimaryButton onClick={() => go(12)}>
          ابدأ التصفح الآن
        </PrimaryButton>
        <p className="safe-note">
          <span>✓</span> تجربة آمنة وموثوقة مع مسكني
        </p>
      </footer>
    </section>
  )
}
