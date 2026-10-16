import { BrandMini } from "../components/BrandMini"

export const flowScreens = [
  { label: "البداية", screen: 0 },
  { label: "الترحيب (1)", screen: 1 },
  { label: "الترحيب (2)", screen: 2 },
  { label: "الترحيب (3)", screen: 3 },
  { label: "تسجيل الدخول", screen: 4 },
  { label: "إنشاء حساب", screen: 5 },
  { label: "رمز التحقق", screen: 6 },
  { label: "استعادة كلمة المرور", screen: 7 },
  { label: "كلمة المرور المؤقتة", screen: 8 },
  { label: "كلمة مرور جديدة", screen: 9 },
  { label: "ترحيب المستخدم", screen: 10 },
  { label: "الرئيسية", screen: 12 },
  { label: "حسابي", screen: 13 },
  { label: "المنازل والشقق", screen: 14 },
  { label: "الإشعارات", screen: 15 },
  { label: "تصفية البحث", screen: 16 },
  { label: "المساعد الذكي", screen: 17 },
  { label: "تعطيل الحساب", screen: 18 },
  { label: "حذف الحساب", screen: 19 },
  { label: "الاقتراحات", screen: 20 },
  { label: "حول المنصة", screen: 21 },
  { label: "نتائج البحث", screen: 22 },
  { label: "تعديل الملف الشخصي", screen: 23 },
  { label: "توثيق الحساب", screen: 24 },
  { label: "قائمة المتابعة", screen: 25 },
  { label: "انضم كشريك", screen: 26 },
  { label: "إدارة وأمان الحساب", screen: 27 },
  { label: "اللغة", screen: 28 },
  { label: "طلباتي", screen: 29 },
  { label: "إعدادات الإشعارات", screen: 31 },
  { label: "المساعدة والتواصل", screen: 32 },
  { label: "الشروط والأحكام", screen: 33 },
  { label: "رفع طلب عقار جديد", screen: 34 },
  { label: "الرسائل", screen: 35 },
  { label: "المحادثة", screen: 36 },
  { label: "المفضلة", screen: 37 },
  { label: "تفاصيل العقار", screen: 38 },
  { label: "الملف الشخصي للمالك", screen: 40 },
  { label: "المحلات التجارية", screen: 41 },
  { label: "الأراضي", screen: 42 },
  { label: "الفنادق", screen: 43 },
  { label: "الشاليهات", screen: 44 },
  { label: "العروض المميزة", screen: 45 },
]

interface FlowNavigationSidebarProps {
  currentScreen: number
  onNavigate: (screenIndex: number) => void
}

export function FlowNavigationSidebar({
  currentScreen,
  onNavigate,
}: FlowNavigationSidebarProps) {
  return (
    <aside className="flow-nav">
      <div className="flow-brand">
        <BrandMini />
        <p>تدفق الدخول والتسجيل</p>
      </div>
      <nav aria-label="شاشات التطبيق">
        {flowScreens.map((item, index) => (
          <button
            key={item.label}
            className={currentScreen === item.screen ? "active" : ""}
            onClick={() => onNavigate(item.screen)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="flow-meta">
        <span>Maskani mobile</span>
        <span>RTL · {flowScreens.length} screens</span>
      </div>
    </aside>
  )
}
