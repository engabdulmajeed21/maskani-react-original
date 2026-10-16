import { useState, useMemo } from "react"
import { Icon } from "../../components/Icon"
import { CheckGroup } from "../../components/CheckGroup"
import { ChoiceGroup } from "../../components/ChoiceGroup"
import { DualRangeSlider } from "../../components/DualRangeSlider"
import { FilterCounter } from "../../components/FilterCounter"
import { FilterSection } from "../../components/FilterSection"
import { createDefaultFilters } from "../../utils/filters"
import type { SearchFilterState, SearchFilterContext, Property } from "../../types"

// دليل التقسيم الإداري الكامل لليمن (المحافظات -> المديريات -> الأحياء)
const yemenLocationDirectory: Record<
  string,
  { districts: string[]; neighborhoods: Record<string, string[]> }
> = {
  "أمانة العاصمة (صنعاء)": {
    districts: [
      "السبعين",
      "حدة",
      "الوحدة",
      "التحرير",
      "معين",
      "شعوب",
      "الثورة",
      "بني الحارث",
      "الصافية",
      "أزالم",
    ],
    neighborhoods: {
      السبعين: ["حي الأصبحي", "حي الخمسين", "حي بيت بوس", "حي بيت زبطان", "حي عطان"],
      حدة: ["حي حدة المدينة", "شارع حدة العام", "حي الكميم", "حي الدبلوماسيين", "حارة صفر"],
      الوحدة: ["شارع الجزائر", "شارع صخر", "حي بغداد", "حي الميثاق"],
      التحرير: ["حي التحرير", "شارع علي عبدالمغني", "حي القاع", "حارة بئر العزب"],
      معين: ["حي مذبح", "حي السنينة", "شارع الستين الغربي", "حي شملان"],
      شعوب: ["حي الحصبة", "حي شعوب", "حي شارع مارب", "حي القيادة"],
      الثورة: ["حي الروضة", "حي الجراف", "حي الحصبة الشمالية", "حي المطار"],
      "بني الحارث": ["حي المطار القديم", "حي بني حوات", "حي الرحبة"],
      الصافية: ["حي الصافية", "حي حارة النصر", "شارع تعز"],
      أزالم: ["حي نقم", "حي ظهر حمير", "حي مسيك"],
    },
  },
  عدن: {
    districts: [
      "خور مكسر",
      "كريتر (صيرة)",
      "المعلا",
      "التواهي",
      "الشيخ عثمان",
      "المنصورة",
      "دار سعد",
      "البريقة",
    ],
    neighborhoods: {
      "خور مكسر": ["حي السفارات", "حي السعادة", "حي أكتوبر", "شارع المطار", "حي العريش"],
      "كريتر (صيرة)": ["حي الميدان", "حي العيدروس", "حي الطويلة", "حي الرزميت"],
      المعلا: ["شارع مدرم", "حي الدائري", "حي كابوتا", "حي المعلا الرئيسي"],
      التواهي: ["حي الفتح", "حي القلوعة", "حي جبل هيل"],
      "الشيخ عثمان": ["حي السيلة", "حي الممدارة", "حي عبد القوي", "حي العروبة"],
      المنصورة: ["حي ريمي", "حي عبد العزيز", "حي القاهرة", "حي كابوتا", "حي التقنية"],
      "دار سعد": ["حي اللحوم", "حي دار سعد الشرقية", "حي مصعبين"],
      البريقة: ["حي صلاح الدين", "حي الكسارة", "حي الخيسة", "حي فقم"],
    },
  },
  تعز: {
    districts: ["القاهرة", "المظفر", "صالة", "التعزية"],
    neighborhoods: {
      القاهرة: ["حي المسبح", "شارع جمال", "حي ديلوكس", "حي ثعبات"],
      المظفر: ["حي بير باشا", "حي المرور", "حي الحصب"],
      صالة: ["حي صالة", "حي العسكري", "حي الكمب"],
      التعزية: ["حي الحوبان", "حي الجند", "حي الهشمة"],
    },
  },
  إب: {
    districts: ["الظهار", "المشنة", "جبلة", "يريم", "السدة", "العدين"],
    neighborhoods: {
      الظهار: ["حي الدائري", "حي المعاين", "حي أبلان", "حي أوقاف"],
      المشنة: ["حي المدينة القديمة", "حي المجلية", "حي الجبانه"],
      جبلة: ["حي جبلة التاريخي", "حي الشارع العام"],
      يريم: ["حي يريم الدائري", "حي السوق المركزية"],
      السدة: ["حي السدة المركزية", "حي جبل شعر"],
      العدين: ["حي السوق", "حي العدين الجديد"],
    },
  },
  حضرموت: {
    districts: ["المكلا", "سيئون", "تريم", "الشحر"],
    neighborhoods: {
      المكلا: ["حي الشرج", "حي فوه", "حي السلام", "حي روكب", "حي خلف"],
      سيئون: ["حي مريمة", "حي القرون", "حي السحيل", "حي بور"],
      تريم: ["حي تريم القديمة", "حي الخليف", "حي عيديد"],
      الشحر: ["حي المجرف", "حي الخور", "حي دفيقة"],
    },
  },
  الحديدة: {
    districts: ["الحوك", "المينا", "الحالي", "باجل"],
    neighborhoods: {
      الحوك: ["حي شارع صنعاء", "حي 7 يوليو", "حي الربصة"],
      المينا: ["حي الكورنيش", "حي غليل", "حي التجاري"],
      الحالي: ["حي كيلو 16", "حي المطار", "حي زايد"],
      باجل: ["حي باجل المركزية", "حي شارع تعز"],
    },
  },
  ذمار: {
    districts: ["مدينة ذمار", "عنس", "معبر (جهران)"],
    neighborhoods: {
      "مدينة ذمار": ["حي الدائري الغربي", "حي الجدد", "حي هران"],
      عنس: ["حي ذمار القرن", "حي ذمار العالي"],
      "معبر (جهران)": ["حي معبر المركزية", "حي شارع صنعاء"],
    },
  },
  عمران: {
    districts: ["مدينة عمران", "ريدة", "خمر"],
    neighborhoods: {
      "مدينة عمران": ["حي مصنعة عمران", "حي شبيل", "حي حجز السجن"],
      ريدة: ["حي ريدة السوق"],
      خمر: ["حي خمر التاريخية"],
    },
  },
  صعدة: {
    districts: ["صعدة (المدينة)", "سحار"],
    neighborhoods: {
      "صعدة (المدينة)": ["حي رحبان", "حي العند", "حي صعدة القديمة"],
      سحار: ["حي الطلح", "حي آل عقاب"],
    },
  },
  شبوة: {
    districts: ["عتق", "بيحان", "جردان"],
    neighborhoods: {
      عتق: ["حي النصب", "حي الشارقة", "حي الدائري"],
      بيحان: ["حي بيحان العليا"],
      جردان: ["حي يثرب"],
    },
  },
  مأرب: {
    districts: ["مدينة مأرب", "الوادي"],
    neighborhoods: {
      "مدينة مأرب": ["حي المجمع", "حي الروضة", "حي الشركة"],
      الوادي: ["حي صافر", "حي الجفينة"],
    },
  },
  المهرة: {
    districts: ["الغيضة", "حوف"],
    neighborhoods: {
      الغيضة: ["حي السادة", "حي المحضار", "حي المطار"],
      حوف: ["حي محمية حوف"],
    },
  },
}

// مكون حقل إدخال الموقع التفاعلي المزود بقائمة منسدلة جانبية
function ComboLocationInput({
  label,
  placeholder,
  value,
  onChange,
  options,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (val: string) => void
  options: string[]
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0 flex-1">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-extrabold text-[var(--text-muted)]">{label}</span>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[9px] font-bold text-rose-500 hover:underline"
          >
            مسح
          </button>
        )}
      </div>
      <div className="relative flex items-center">
        <input
          type="text"
          className="h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] pr-3 pl-9 text-xs font-bold text-[var(--text)] outline-none focus:border-blue-500 shadow-xs transition-all placeholder:text-[var(--text-muted)]"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {/* سهم وقائمة الخيارات المنسدلة الجانبية */}
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-lg bg-[var(--surface-soft)] border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-blue-500 transition">
          <select
            className="absolute inset-0 size-full cursor-pointer opacity-0 text-xs font-bold z-20"
            value=""
            onChange={(e) => {
              if (e.target.value) onChange(e.target.value)
            }}
            aria-label={`اختر ${label}`}
          >
            <option value="" disabled>
              اختر من قائمة {label}...
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="text-xs font-black">▾</span>
        </div>
      </div>
    </div>
  )
}

export function SearchFilters({
  go,
  filters,
  setFilters,
  onApply,
  context,
  allProperties,
}: {
  go: (screen: number) => void
  filters: SearchFilterState
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>
  onApply: () => void
  context: SearchFilterContext
  allProperties: Property[]
}) {
  const [locationMessage, setLocationMessage] = useState("")



  const update = <K extends keyof SearchFilterState,>(
    key: K,
    value: SearchFilterState[K],
  ) => setFilters((current) => ({ ...current, [key]: value }))

  const resetFilters = () =>
    setFilters({
      ...createDefaultFilters(),
      propertyType:
        context === "commercial"
          ? "محلات"
          : context === "land"
            ? "أرض"
            : context === "hotel"
              ? "فندق"
              : context === "chalet"
                ? "شاليه"
                : "",
    })

  // 1. حساب جميع المحافظات المتاحة
  const allGovernorates = useMemo(() => {
    const fromDirectory = Object.keys(yemenLocationDirectory)
    const fromData = allProperties.map((p) => p.location.governorate)
    return [...new Set([...fromDirectory, ...fromData])]
  }, [allProperties])

  // 2. حساب المديريات التابعة تلقائياً للمحافظة المحددة
  const availableDistricts = useMemo(() => {
    if (!filters.governorate) {
      // إذا لم تُحدد محافظة بعد، اجمع كافة المديريات
      const allD = Object.values(yemenLocationDirectory).flatMap((g) => g.districts)
      const dataD = allProperties.map((p) => p.location.district)
      return [...new Set([...allD, ...dataD])]
    }

    // البحث عن المحافظة المحددة في الدليل
    const matchedGovKey = Object.keys(yemenLocationDirectory).find(
      (k) => k.includes(filters.governorate) || filters.governorate.includes(k),
    )

    const directoryDistricts = matchedGovKey
      ? yemenLocationDirectory[matchedGovKey].districts
      : []

    const dataDistricts = allProperties
      .filter(
        (p) =>
          p.location.governorate.includes(filters.governorate) ||
          filters.governorate.includes(p.location.governorate),
      )
      .map((p) => p.location.district)

    return [...new Set([...directoryDistricts, ...dataDistricts])]
  }, [filters.governorate, allProperties])

  // 3. حساب الأحياء التابعة تلقائياً للمديرية والمحافظة المحددة
  const availableNeighborhoods = useMemo(() => {
    if (!filters.governorate && !filters.district) {
      // إرجاع كافة الأحياء المتاحة
      const allN = Object.values(yemenLocationDirectory).flatMap((g) =>
        Object.values(g.neighborhoods).flat(),
      )
      const dataN = allProperties
        .map((p) => p.location.neighborhood)
        .filter((n): n is string => Boolean(n))
      return [...new Set([...allN, ...dataN])]
    }

    // العثور على المحافظة والمديرية المطابقة
    const matchedGovKey = Object.keys(yemenLocationDirectory).find(
      (k) => k.includes(filters.governorate) || filters.governorate.includes(k),
    )

    let directoryNeighborhoods: string[] = []
    if (matchedGovKey) {
      const govObj = yemenLocationDirectory[matchedGovKey]
      if (filters.district) {
        const matchedDistKey = Object.keys(govObj.neighborhoods).find(
          (d) => d.includes(filters.district) || filters.district.includes(d),
        )
        if (matchedDistKey) {
          directoryNeighborhoods = govObj.neighborhoods[matchedDistKey]
        }
      } else {
        directoryNeighborhoods = Object.values(govObj.neighborhoods).flat()
      }
    }

    const dataNeighborhoods = allProperties
      .filter((p) => {
        const matchGov =
          !filters.governorate ||
          p.location.governorate.includes(filters.governorate) ||
          filters.governorate.includes(p.location.governorate)
        const matchDist =
          !filters.district ||
          p.location.district.includes(filters.district) ||
          filters.district.includes(p.location.district)
        return matchGov && matchDist
      })
      .map((p) => p.location.neighborhood)
      .filter((n): n is string => Boolean(n))

    return [...new Set([...directoryNeighborhoods, ...dataNeighborhoods])]
  }, [filters.governorate, filters.district, allProperties])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("خدمة الموقع غير متاحة على هذا الجهاز")
      return
    }
    setLocationMessage("جارٍ تحديد موقعك الجغرافي...")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const cities = [
          { name: "أمانة العاصمة (صنعاء)", lat: 15.3694, lon: 44.1910 },
          { name: "عدن", lat: 12.7855, lon: 45.0187 },
          { name: "تعز", lat: 13.5789, lon: 44.0219 },
          { name: "إب", lat: 13.9667, lon: 44.1833 },
          { name: "الحديدة", lat: 14.7979, lon: 42.9545 },
          { name: "حضرموت", lat: 14.5425, lon: 49.1242 },
          { name: "ذمار", lat: 14.5458, lon: 44.4042 },
        ]
        
        let nearest = cities[0]
        let minDistance = Infinity
        for (const city of cities) {
          const dist = Math.hypot(city.lat - latitude, city.lon - longitude)
          if (dist < minDistance) {
            minDistance = dist
            nearest = city
          }
        }

        update("nearMe", true)
        update("governorate", nearest.name)
        setLocationMessage(`تم تحديد موقعك بنجاح! تم اختيار محافظة ${nearest.name} بالقرب من موقعك الجغرافي 📍`)
      },
      () => {
        update("nearMe", false)
        setLocationMessage("تعذر الوصول التلقائي، تم رفض إذن الموقع الجغرافي أو حدث خطأ")
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const residential =
    context === "residential" ||
    ["شقة", "منازل مستقلة", "فلل"].includes(filters.propertyType)

  const propertyTypes =
    context === "residential"
      ? ["شقة", "منازل مستقلة", "فلل"]
      : context === "commercial"
        ? ["محلات"]
        : context === "land"
          ? ["أرض"]
          : context === "hotel"
            ? ["فندق"]
            : context === "chalet"
              ? ["شاليه"]
              : ["شقة", "منازل مستقلة", "فلل", "أرض", "محلات", "فندق", "شاليه"]

  const priceRange =
    filters.currency === "ريال يمني"
      ? { max: 100000000, step: 500000, unit: "ر.ي" }
      : filters.currency === "ريال سعودي"
        ? { max: 20000, step: 100, unit: "ر.س" }
        : { max: 20000, step: 100, unit: filters.currency ? "$" : "" }

  return (
    <section className="screen flex h-full min-h-0 flex-col !bg-[var(--surface-soft)] !text-[var(--text)] select-none pb-24">
      {/* رأس شاشة التصفية الفاخر */}
      <header className="grid shrink-0 grid-cols-3 items-center border-b border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3 z-20 shadow-xs" dir="rtl">
        <button
          className="grid size-10 shrink-0 justify-self-start place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] active:scale-95 transition-all shadow-xs"
          onClick={() => go(-1)}
          aria-label="رجوع"
        >
          <Icon name="arrow" />
        </button>
        
        <h1 className="text-center text-sm font-black truncate text-[var(--text)]">
          {context === "residential"
            ? "تصفية المنازل والشقق"
            : context === "commercial"
              ? "تصفية المحلات التجارية"
              : context === "land"
                ? "تصفية الأراضي"
                : context === "hotel"
                  ? "تصفية الفنادق"
                  : context === "chalet"
                    ? "تصفية الشاليهات"
                    : "تصفية نتائج البحث"}
        </h1>

        <button
          className="justify-self-end text-xs font-bold text-rose-500 hover:underline active:scale-95 transition"
          onClick={resetFilters}
        >
          إعادة ضبط
        </button>
      </header>

      <main
        className="w-full min-w-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 [scrollbar-width:none] dir-rtl"
        dir="rtl"
      >
        {/* قسم الموقع الفاخر مع الربط المباشر الديناميكي بين المحافظة والمديرية والحي */}
        <FilterSection title="الموقع والجغرافيا">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <ComboLocationInput
                label="1. المحافظة"
                placeholder="اكتب أو اختر المحافظة..."
                value={filters.governorate}
                onChange={(val) =>
                  setFilters((current) => ({
                    ...current,
                    governorate: val,
                    district: "",
                    neighborhood: "",
                  }))
                }
                options={allGovernorates}
              />

              <ComboLocationInput
                label="2. المديرية"
                placeholder="اكتب أو اختر المديرية..."
                value={filters.district}
                onChange={(val) =>
                  setFilters((current) => ({
                    ...current,
                    district: val,
                    neighborhood: "",
                  }))
                }
                options={availableDistricts}
              />

              <ComboLocationInput
                label="3. الحي / الشارع"
                placeholder="اكتب أو اختر الحي..."
                value={filters.neighborhood}
                onChange={(val) => update("neighborhood", val)}
                options={availableNeighborhoods}
              />
            </div>

            {/* إظهار تأكيد الفلترة الجغرافية الحالية */}
            {(filters.governorate || filters.district || filters.neighborhood) && (
              <div className="flex items-center justify-between rounded-xl bg-blue-500/10 px-3 py-2 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                <span>
                  📍 الموقع المحدد: {[filters.governorate, filters.district, filters.neighborhood].filter(Boolean).join(" ← ")}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((c) => ({
                      ...c,
                      governorate: "",
                      district: "",
                      neighborhood: "",
                    }))
                  }
                  className="text-rose-500 hover:underline text-[10px]"
                >
                  إلغاء موقع المحدد
                </button>
              </div>
            )}

            {/* زر تحديد موقعي بالقرب مني */}
            <button
              className={`mt-1 flex w-full items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all active:scale-98 ${
                filters.nearMe
                  ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "border-[var(--line)] bg-[var(--surface-raised)] text-[var(--primary-text)] hover:bg-[var(--surface-soft)]"
              }`}
              onClick={requestLocation}
              type="button"
            >
              <Icon name="pin" />
              <span>{filters.nearMe ? "✓ تم تحديد موقعك الحالي بنجاح" : "📍 البحث بالقرب من موقعي الجغرافي الحالي"}</span>
            </button>

            {locationMessage && (
              <p
                className="text-[10px] font-medium leading-5 text-[var(--text-muted)] text-center"
                role="status"
              >
                {locationMessage}
              </p>
            )}
          </div>
        </FilterSection>

        {/* قسم عملة العرض المتطور */}
        <FilterSection title="عملة العرض">
          <ChoiceGroup
            options={["ريال يمني", "ريال سعودي", "دولار أمريكي"]}
            value={filters.currency}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                currency: value,
                minPrice: "",
                maxPrice: "",
              }))
            }
          />
          <p className="mt-2 text-[10px] leading-5 text-[var(--text-muted)]">
            تظهر النتائج بعملتها الأصلية الدقيقة دون خلط أو تقريب للقيم.
          </p>
        </FilterSection>

        {/* قسم نطاق السعر */}
        <FilterSection
          title={`نطاق السعر — ${filters.currency || "العملة الأصلية"}`}
        >
          {filters.currency ? (
            <DualRangeSlider
              minValue={filters.minPrice}
              maxValue={filters.maxPrice}
              min={0}
              max={priceRange.max}
              step={priceRange.step}
              unit={priceRange.unit}
              onChange={(minValue, maxValue) =>
                setFilters((current) => ({
                  ...current,
                  minPrice: minValue,
                  maxPrice: maxValue,
                }))
              }
            />
          ) : (
            <p className="rounded-xl bg-[var(--surface-soft)] p-3 text-[10px] font-bold text-[var(--text-muted)]">
              اختر عملة العرض أولاً لتحديد نطاق السعر المناسب.
            </p>
          )}
        </FilterSection>

        {/* قسم نوع العقار الفاخر */}
        <section className="space-y-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 shadow-xs">
          <h2 className="text-xs font-black text-[var(--text)]">نوع العقار</h2>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
            {propertyTypes.map((type) => (
              <button
                className={`shrink-0 rounded-xl border px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                  filters.propertyType === type
                    ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
                key={type}
                onClick={() =>
                  update(
                    "propertyType",
                    context === "commercial" ||
                    context === "land" ||
                    context === "hotel" ||
                    context === "chalet"
                      ? type
                      : filters.propertyType === type
                        ? ""
                        : type,
                  )
                }
                aria-pressed={filters.propertyType === type}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {residential && (
          <>
            <FilterSection title="الغرض من العقار">
              <ChoiceGroup
                options={["للبيع", "للإيجار"]}
                value={filters.purpose}
                onChange={(value) => update("purpose", value)}
              />
            </FilterSection>
            <FilterSection title="طريقة الدفع">
              <ChoiceGroup
                options={["كاش", "تقسيط"]}
                value={filters.payment}
                onChange={(value) => update("payment", value)}
              />
            </FilterSection>
            <FilterSection title="حالة التأثيث">
              <ChoiceGroup
                options={["مفروش", "غير مفروش"]}
                value={filters.furnishing}
                onChange={(value) => update("furnishing", value)}
              />
            </FilterSection>
            <FilterSection title="المساحات الداخلية والغرف (الحد الأدنى)">
              <div className="space-y-2.5">
                <FilterCounter
                  label="غرف النوم"
                  value={filters.bedrooms}
                  onChange={(value) => update("bedrooms", value)}
                />
                <FilterCounter
                  label="الحمامات"
                  value={filters.bathrooms}
                  onChange={(value) => update("bathrooms", value)}
                />
                <FilterCounter
                  label="الصالات"
                  value={filters.halls}
                  onChange={(value) => update("halls", value)}
                />
                <FilterCounter
                  label="المطابخ"
                  value={filters.kitchens}
                  onChange={(value) => update("kitchens", value)}
                />
              </div>
            </FilterSection>
            <FilterSection title="عمر العقار السكني">
              <ChoiceGroup
                options={["جديد", "أقل من 5 سنوات", "بناء قديم"]}
                value={filters.propertyAge}
                onChange={(value) => update("propertyAge", value)}
              />
            </FilterSection>
            <FilterSection title="خدمات البنية التحتية">
              <CheckGroup
                options={[
                  "طاقة شمسية",
                  "خزان أرضي مستقل",
                  "مياه حكومية / شبكة (متوفرة بانتظام)",
                  "كهرباء حكومية",
                  "صرف صحي",
                  "إنترنت أرضي / ألياف ضوئية (Fiber)",
                ]}
                values={filters.infrastructure}
                onChange={(value) => update("infrastructure", value)}
              />
            </FilterSection>
            <FilterSection title="المرافق والخدمات الإضافية">
              <CheckGroup
                options={[
                  "مدخل مستقل",
                  "حوش / موقف سيارات",
                  "مصعد",
                  "خزان علوي مستقل",
                  "تكييف مركزي أو تأسيس سبلت",
                  "حراسة / أمان كاميرات مراقبة للعمارة",
                ]}
                values={filters.amenities}
                onChange={(value) => update("amenities", value)}
              />
            </FilterSection>
          </>
        )}

        {(context === "land" || filters.propertyType === "أرض") && (
          <>
            <FilterSection title="الغرض من الأرض">
              <ChoiceGroup
                options={["للبيع", "للإيجار", "استثمار"]}
                value={filters.purpose}
                onChange={(value) => update("purpose", value)}
              />
            </FilterSection>
            <FilterSection title="طريقة الدفع">
              <ChoiceGroup
                options={["كاش", "تقسيط"]}
                value={filters.payment}
                onChange={(value) => update("payment", value)}
              />
            </FilterSection>
            <FilterSection title="نوع الأرض">
              <ChoiceGroup
                options={["سكنية", "تجارية", "زراعية", "صناعية"]}
                value={filters.landType}
                onChange={(value) => update("landType", value)}
              />
            </FilterSection>
            <FilterSection title="المساحة الإجمالية م²">
              <DualRangeSlider
                minValue={filters.areaMin}
                maxValue={filters.areaMax}
                min={0}
                max={5000}
                step={50}
                unit="م²"
                onChange={(areaMin, areaMax) =>
                  setFilters((current) => ({
                    ...current,
                    areaMin,
                    areaMax,
                  }))
                }
              />
            </FilterSection>
            <FilterSection title="واجهة الأرض">
              <CheckGroup
                options={["شمالية", "جنوبية", "شرقية", "غربية", "زاوية/شارعين"]}
                values={filters.frontage}
                onChange={(value) => update("frontage", value)}
              />
            </FilterSection>
            <FilterSection title="عرض الشارع الرئيسي">
              <ChoiceGroup
                options={["10م", "12م", "20م+"]}
                value={filters.streetWidth}
                onChange={(value) => update("streetWidth", value)}
              />
            </FilterSection>
            <FilterSection title="توفر الخدمات الأرضية">
              <CheckGroup
                options={["إسفلت", "كهرباء", "مياه", "صرف صحي"]}
                values={filters.amenities}
                onChange={(value) => update("amenities", value)}
              />
            </FilterSection>
            <FilterSection title="الوثائق والمستندات القانونية">
              <button
                type="button"
                className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-right text-xs font-bold transition-all active:scale-98 ${
                  filters.courtDeed
                    ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shadow-sm"
                    : "border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text)] hover:border-blue-400"
                }`}
                onClick={() => update("courtDeed", !filters.courtDeed)}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`grid size-5 place-items-center rounded-md border text-xs font-black transition ${
                      filters.courtDeed
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-[var(--line-strong)] bg-[var(--surface)] text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span className="text-xs font-extrabold text-[var(--text)]">
                    بصيرة من المحكمة
                  </span>
                </div>
                <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {filters.courtDeed ? "محدد ✓" : "انقر للتحديد"}
                </span>
              </button>
            </FilterSection>
          </>
        )}

        {(context === "commercial" || filters.propertyType === "محلات") && (
          <>
            <FilterSection title="الغرض">
              <ChoiceGroup
                options={["للبيع", "للإيجار"]}
                value={filters.purpose}
                onChange={(value) => update("purpose", value)}
              />
            </FilterSection>
            <FilterSection title="طريقة الدفع">
              <ChoiceGroup
                options={["كاش", "تقسيط"]}
                value={filters.payment}
                onChange={(value) => update("payment", value)}
              />
            </FilterSection>
            <FilterSection title="نوع المحل التجاري">
              <ChoiceGroup
                options={[
                  "مكتب تجاري",
                  "معرض",
                  "مطعم/مقهى",
                  "صيدلية",
                  "مستودع",
                  "محل عام",
                ]}
                value={filters.commercialType}
                onChange={(value) => update("commercialType", value)}
              />
            </FilterSection>
            <FilterSection title="موقع المحل">
              <ChoiceGroup
                options={[
                  "داخل مول",
                  "داخل سوق تجاري",
                  "على الشارع العام",
                  "في حي سكني",
                ]}
                value={filters.shopLocation}
                onChange={(value) => update("shopLocation", value)}
              />
            </FilterSection>
            <FilterSection title="المساحة م²">
              <DualRangeSlider
                minValue={filters.areaMin}
                maxValue={filters.areaMax}
                min={0}
                max={5000}
                step={25}
                unit="م²"
                onChange={(areaMin, areaMax) =>
                  setFilters((current) => ({
                    ...current,
                    areaMin,
                    areaMax,
                  }))
                }
              />
            </FilterSection>
            <FilterSection title="حالة التشطيب">
              <ChoiceGroup
                options={["عظم", "تشطيب كامل", "يحتاج ديكور"]}
                value={filters.finishing}
                onChange={(value) => update("finishing", value)}
              />
            </FilterSection>
            <FilterSection title="المميزات والمرافق">
              <CheckGroup
                options={[
                  "واجهة زجاجية",
                  "عداد كهرباء مستقل",
                  "دورة مياه",
                  "مواقف للعملاء",
                  "كاميرات مراقبة",
                ]}
                values={filters.amenities}
                onChange={(value) => update("amenities", value)}
              />
            </FilterSection>
          </>
        )}

        {(context === "hotel" || filters.propertyType === "فندق") && (
          <>
            <FilterSection title="الغرض">
              <p className="rounded-xl bg-blue-500/10 p-3 text-xs font-bold text-blue-600 dark:text-blue-400">
                حجز يومي / إقامات قصيرة
              </p>
            </FilterSection>
            <FilterSection title="التصنيف الفندقي">
              <ChoiceGroup
                options={["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]}
                value={
                  filters.starRating ? "⭐".repeat(filters.starRating) : ""
                }
                onChange={(value) => update("starRating", value.length)}
              />
            </FilterSection>
            <FilterSection title="فئة الغرفة / الجناح">
              <ChoiceGroup
                options={[
                  "غرفة مفردة",
                  "غرفة مزدوجة",
                  "جناح عائلي",
                  "استراحة عامة",
                  "طيرمانة",
                  "صالة مؤتمرات",
                ]}
                value={filters.roomCategory}
                onChange={(value) => update("roomCategory", value)}
              />
            </FilterSection>
            <FilterSection title="عدد السراير في الغرفة">
              <FilterCounter
                label="عدد السراير"
                value={filters.bedCount}
                onChange={(value) => update("bedCount", value)}
              />
            </FilterSection>
            <FilterSection title="نوع السرير">
              <ChoiceGroup
                options={["عائلي مزدوج", "فردي"]}
                value={filters.bedType}
                onChange={(value) => update("bedType", value)}
              />
            </FilterSection>
            <FilterSection title="الخدمات الفندقية">
              <CheckGroup
                options={[
                  "إفطار مجاني",
                  "خدمة الغرف 24 ساعة",
                  "مسبح مشترك",
                  "نادي صحي",
                  "مواقف",
                  "استقبال 24 ساعة",
                  "واي فاي",
                  "مطعم",
                  "قاعة اجتماعات",
                ]}
                values={filters.amenities}
                onChange={(value) => update("amenities", value)}
              />
            </FilterSection>
          </>
        )}

        {(context === "chalet" || filters.propertyType === "شاليه") && (
          <>
            <FilterSection title="الغرض">
              <p className="rounded-xl bg-blue-500/10 p-3 text-xs font-bold text-blue-600 dark:text-blue-400">
                حجز يومي / ترفيهي واستجمام
              </p>
            </FilterSection>
            <FilterSection title="السعة الاستيعابية للضيوف">
              <FilterCounter
                label="العدد التقريبي للضيوف"
                value={filters.capacity}
                onChange={(value) => update("capacity", value)}
              />
            </FilterSection>
            <FilterSection title="المميزات الترفيهية">
              <CheckGroup
                options={[
                  "مسبح خاص",
                  "مسبح أطفال",
                  "مسطحات خضراء",
                  "جلسات خارجية",
                  "ألعاب إلكترونية",
                  "مكان للشواء",
                  "جاكوزي",
                ]}
                values={filters.amenities}
                onChange={(value) => update("amenities", value)}
              />
            </FilterSection>
            <FilterSection title="فترة الحجز / الاستئجار">
              <CheckGroup
                options={[
                  "فترة صباحية",
                  "فترة مسائية",
                  "يوم كامل (24 ساعة)",
                  "نص يوم ( 12 ساعة )",
                  "عطلة نهاية الأسبوع (خميس وجمعة)",
                ]}
                values={filters.rentalPeriods ?? []}
                onChange={(value) => update("rentalPeriods", value)}
              />
            </FilterSection>
            <FilterSection title="الخصوصية">
              <ChoiceGroup
                options={["سور مستقل مرتفع", "إطلالة بانورامية"]}
                value={filters.privacy}
                onChange={(value) => update("privacy", value)}
              />
            </FilterSection>
          </>
        )}
      </main>

      {/* الشريط السفلي لتطبيق نتائج التصفية */}
      <footer className="fixed bottom-0 inset-x-0 z-50 shrink-0 border-t border-[var(--line)] bg-[var(--surface-raised)]/95 backdrop-blur-md p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl">
        <button
          className="h-12 w-full rounded-2xl bg-blue-600 font-black text-white text-xs shadow-md shadow-blue-500/20 active:scale-98 transition hover:bg-blue-700"
          onClick={onApply}
        >
          عرض نتائج التصفية 🎯
        </button>
      </footer>
    </section>
  )
}
