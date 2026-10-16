import { Icon } from "./Icon"
import { PrimaryButton } from "./PrimaryButton"
import { PageHeader } from "./PageHeader"

export function Placeholder({ go }: { go: (screen: number) => void }) {
  return (
    <section className="screen feature-screen">
      <PageHeader title="قيد التطوير" go={go} />
      <main className="placeholder-main">
        <div className="wip-illustration" aria-hidden="true">
          <span className="wip-orbit" />
          <Icon name="settings" />
          <i>•••</i>
        </div>
        <span className="eyebrow">نعمل عليها الآن</span>
        <h1>هذه الميزة قيد التصميم</h1>
        <p>
          نجهّز لك تجربة أفضل وأكثر سهولة. ستتوفر هذه الميزة قريباً في مسكني.
        </p>
      </main>
      <footer className="screen-footer">
        <PrimaryButton onClick={() => go(12)}>العودة للرئيسية</PrimaryButton>
      </footer>
    </section>
  )
}
