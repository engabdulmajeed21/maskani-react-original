import { Icon } from "./Icon"
import type { IconName } from "./Icon"
import type { Property } from "../types"

export function PropertySpecs({ property }: { property: Property }) {
  const allSpecs =
    property.category === "commercial"
      ? [
          property.area ? { label: "المساحة", value: `${property.area} م²`, icon: "land" as IconName } : null,
          property.commercialType ? { label: "نوع المحل", value: property.commercialType, icon: "shop" as IconName } : null,
          property.shopLocation ? { label: "الموقع", value: property.shopLocation, icon: "pin" as IconName } : null,
          property.finishing ? { label: "التشطيب", value: property.finishing, icon: "building" as IconName } : null,
        ]
      : property.category === "land"
        ? [
            property.area ? { label: "المساحة", value: `${property.area} م²`, icon: "land" as IconName } : null,
            property.landType ? { label: "نوع الأرض", value: property.landType, icon: "land" as IconName } : null,
            property.frontage && property.frontage.length > 0 ? { label: "الواجهة", value: property.frontage.join("، "), icon: "pin" as IconName } : null,
            property.streetWidth ? { label: "عرض الشارع", value: property.streetWidth, icon: "building" as IconName } : null,
          ]
        : property.category === "hotel"
          ? [
              property.starRating ? { label: "التصنيف", value: "⭐".repeat(property.starRating), icon: "hotel" as IconName } : null,
              property.roomCategory ? { label: "نوع الغرفة", value: property.roomCategory, icon: "bed" as IconName } : null,
              property.bedCount ? { label: "عدد السراير", value: property.bedCount, icon: "bed" as IconName } : null,
              property.bedType ? { label: "نوع السرير", value: property.bedType, icon: "sofa" as IconName } : null,
            ]
          : property.category === "chalet"
            ? [
                property.capacity ? { label: "السعة", value: `${property.capacity} ضيوف`, icon: "user" as IconName } : null,
                property.privacy ? { label: "الخصوصية", value: property.privacy, icon: "shield" as IconName } : null,
                property.chaletAmenities?.length ? { label: "المميزات", value: property.chaletAmenities[0], icon: "droplet" as IconName } : null,
              ]
        : [
            property.bathrooms ? { label: "حمامات", value: property.bathrooms, icon: "bath" as IconName } : null,
            property.kitchens ? { label: "مطابخ", value: property.kitchens, icon: "kitchen" as IconName } : null,
            property.halls ? { label: "صالات", value: property.halls, icon: "sofa" as IconName } : null,
            property.bedrooms ? { label: "غرف", value: property.bedrooms, icon: "bed" as IconName } : null,
          ]

  const specs = allSpecs.filter((s): s is NonNullable<typeof s> => Boolean(s))

  return (
    <div className={`grid grid-cols-${Math.max(1, specs.length)} divide-x divide-x-reverse divide-[var(--line)] rounded-xl bg-[var(--surface-soft)] py-2`}>
      {specs.map((spec) => (
        <div
          className="flex min-w-0 flex-col items-center gap-0.5 text-center px-1"
          key={spec.label}
        >
          <Icon name={spec.icon} />
          <b
            className={`w-full px-0.5 text-center text-[var(--text)] ${
              property.category !== "residential"
                ? "line-clamp-2 text-[8px] leading-4"
                : "text-[11px]"
            }`}
          >
            {spec.value}
          </b>
          <span className="truncate text-[8px] text-[var(--text-muted)]">
            {spec.label}
          </span>
        </div>
      ))}
    </div>
  )
}
