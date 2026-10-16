import type { Property, SearchFilterState, InfrastructureKey, InfrastructureService } from "../types"

export const currencyMatches = (
  propertyCurrency: string,
  selectedCurrency: string,
) => {
  if (selectedCurrency === "ريال يمني") {
    return propertyCurrency === "ر.ي" || propertyCurrency === "ريال يمني"
  }
  return propertyCurrency === selectedCurrency
}

export const filterProperties = (source: Property[], filters: SearchFilterState) => {
  const residentialType: Record<string, Property["type"]> = {
    شقة: "شقة",
    "منازل مستقلة": "منزل مستقل",
    فلل: "فيلا",
  }
  const selectedType = residentialType[filters.propertyType]
  const commercialSelected = filters.propertyType === "محلات"
  const landSelected = filters.propertyType === "أرض"
  const hotelSelected = filters.propertyType === "فندق"
  const chaletSelected = filters.propertyType === "شاليه"
  const hasUnsupportedCategory =
    Boolean(filters.propertyType) &&
    !selectedType &&
    !commercialSelected &&
    !landSelected &&
    !hotelSelected &&
    !chaletSelected
  const minPrice = filters.minPrice ? Number(filters.minPrice) : undefined
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : undefined
  const minArea = filters.areaMin ? Number(filters.areaMin) : undefined
  const maxArea = filters.areaMax ? Number(filters.areaMax) : undefined
  const manualLocation = filters.manualLocation.trim().toLocaleLowerCase("ar")

  const infrastructureTerms: Record<string, {
    key: InfrastructureKey
    terms: string[]
  }> = {
    "طاقة شمسية": {
      key: "electricity",
      terms: ["طاقة شمسية", "شمسية", "منظومة شمسية", "ألواح شمسية"],
    },
    "خزان أرضي مستقل": {
      key: "water",
      terms: ["خزان أرضي", "خزان مستقل", "خزان أرضي مستقل", "خزان مياه", "خزان"],
    },
    "مياه حكومية / شبكة (متوفرة بانتظام)": {
      key: "water",
      terms: ["شبكة حكومية", "حكومي", "متوفر بانتظام", "شبكة", "مياه حكومية", "بئر ارتوازي"],
    },
    "كهرباء حكومية": {
      key: "electricity",
      terms: ["حكومي", "خط عام", "كهرباء حكومية", "كهرباء عامة"],
    },
    "صرف صحي": {
      key: "sewage",
      terms: ["شبكة حكومية", "صرف صحي", "شبكة", "بيارة"],
    },
    "إنترنت أرضي / ألياف ضوئية (Fiber)": {
      key: "telecommunications",
      terms: ["ألياف ضوئية", "Fiber", "إنترنت", "ألياف", "فايبر", "أرضي", "إنترنت لاسلكي"],
    },
  }

  const matchesAmenity = (propertyAmenities: string[], filterAmenity: string) => {
    if (propertyAmenities.includes(filterAmenity)) return true
    if (filterAmenity === "حوش / موقف سيارات") {
      return propertyAmenities.some((a) =>
        a.includes("موقف") || a.includes("حوش") || a.includes("سيارات") || a.includes("كراج"),
      )
    }
    if (filterAmenity === "حراسة / أمان كاميرات مراقبة للعمارة") {
      return propertyAmenities.some((a) =>
        a.includes("أمان") || a.includes("كاميرات") || a.includes("حراسة") || a.includes("أمن"),
      )
    }
    if (filterAmenity === "تكييف مركزي أو تأسيس سبلت") {
      return propertyAmenities.some((a) =>
        a.includes("تكييف") || a.includes("سبلت") || a.includes("مكيف"),
      )
    }
    if (filterAmenity === "خزان علوي مستقل") {
      return propertyAmenities.some((a) =>
        a.includes("خزان علوي") || a.includes("خزان مستقل") || a.includes("خزان"),
      )
    }
    if (filterAmenity === "خزان أرضي مستقل") {
      return propertyAmenities.some((a) =>
        a.includes("خزان أرضي") || a.includes("خزان"),
      )
    }
    if (filterAmenity === "مدخل مستقل") {
      return propertyAmenities.some((a) =>
        a.includes("مدخل مستقل") || a.includes("مدخل"),
      )
    }
    if (filterAmenity === "مصعد") {
      return propertyAmenities.some((a) => a.includes("مصعد"))
    }
    return propertyAmenities.some(
      (a) => a.includes(filterAmenity) || filterAmenity.includes(a),
    )
  }

  return source.filter((property) => {
    if (hasUnsupportedCategory) return false
    if (commercialSelected && property.category !== "commercial") return false
    if (landSelected && property.category !== "land") return false
    if (hotelSelected && property.category !== "hotel") return false
    if (chaletSelected && property.category !== "chalet") return false
    if (selectedType && property.type !== selectedType) return false
    if (filters.nearMe) {
      const userGov = filters.governorate || "صنعاء"
      if (!property.location.governorate.includes(userGov)) return false
    }
    if (
      filters.governorate &&
      property.location.governorate !== filters.governorate
    )
      return false
    if (filters.district && property.location.district !== filters.district)
      return false
    if (
      filters.neighborhood &&
      property.location.neighborhood !== filters.neighborhood
    )
      return false
    if (manualLocation) {
      const searchableText = [
        property.title,
        property.subtitle,
        property.type,
        property.commercialType,
        property.shopLocation,
        property.landType,
        property.frontage?.join(" "),
        property.streetWidth,
        property.roomCategory,
        property.starRating ? "⭐".repeat(property.starRating) : "",
        property.privacy,
        property.chaletAmenities?.join(" "),
        propertyAddress(property),
      ]
        .join(" ")
        .toLocaleLowerCase("ar")
      if (!searchableText.includes(manualLocation)) return false
    }
    if (
      filters.currency &&
      !currencyMatches(property.currency, filters.currency)
    )
      return false
    if (minPrice !== undefined && property.price < minPrice) return false
    if (maxPrice !== undefined && property.price > maxPrice) return false
    if (filters.purpose && property.purpose !== filters.purpose) return false
    if (filters.payment && property.paymentMethod !== filters.payment)
      return false
    if (
      property.category === "residential" &&
      filters.furnishing &&
      property.furnishing !== filters.furnishing
    )
      return false
    if (
      property.category === "residential" &&
      (property.bedrooms < filters.bedrooms ||
        property.bathrooms < filters.bathrooms ||
        property.halls < filters.halls ||
        property.kitchens < filters.kitchens)
    )
      return false

    if (property.category === "commercial") {
      if (
        filters.commercialType &&
        property.commercialType !== filters.commercialType
      )
        return false
      if (filters.shopLocation && property.shopLocation !== filters.shopLocation)
        return false
      if (filters.finishing && property.finishing !== filters.finishing)
        return false
      if (minArea !== undefined && (property.area ?? 0) < minArea) return false
      if (maxArea !== undefined && (property.area ?? 0) > maxArea) return false
    }

    if (property.category === "land") {
      if (filters.landType && property.landType !== filters.landType)
        return false
      if (filters.streetWidth && property.streetWidth !== filters.streetWidth)
        return false
      if (
        !filters.frontage.every((frontage) =>
          property.frontage?.includes(
            frontage as NonNullable<Property["frontage"]>[number],
          ),
        )
      )
        return false
      if (minArea !== undefined && (property.area ?? 0) < minArea) return false
      if (maxArea !== undefined && (property.area ?? 0) > maxArea) return false
      if (
        filters.courtDeed &&
        !property.courtDeed &&
        !property.amenities.includes("بصيرة من المحكمة") &&
        !property.description.includes("بصيرة")
      ) {
        return false
      }
    }

    if (property.category === "hotel") {
      if (filters.starRating && property.starRating !== filters.starRating)
        return false
      if (
        filters.roomCategory &&
        property.roomCategory !== filters.roomCategory
      )
        return false
      if (filters.bedCount && (property.bedCount ?? 0) < filters.bedCount)
        return false
      if (filters.bedType && property.bedType !== filters.bedType) return false
    }

    if (property.category === "chalet") {
      if (filters.capacity && (property.capacity ?? 0) < filters.capacity)
        return false
      if (filters.privacy && property.privacy !== filters.privacy) return false
      if (
        !filters.amenities.every((amenity) =>
          property.chaletAmenities?.includes(amenity),
        )
      )
        return false
      if (
        filters.rentalPeriods &&
        filters.rentalPeriods.length > 0 &&
        !filters.rentalPeriods.every((period) =>
          property.rentalPeriods?.includes(period) ||
          property.description.includes(period),
        )
      ) {
        return false
      }
    }

    if (property.category === "residential" && filters.propertyAge) {
      const age = Math.max(
        0,
        new Date().getFullYear() - new Date(property.createdAt).getFullYear(),
      )
      if (filters.propertyAge === "جديد" && age > 1) return false
      if (filters.propertyAge === "أقل من 5 سنوات" && age > 5) return false
      if (filters.propertyAge === "بناء قديم" && age <= 5) return false
    }

    if (property.category === "residential") {
      const matchesInfrastructure = filters.infrastructure.every(
        (selection) => {
          const requirement = infrastructureTerms[selection]
          if (!requirement) return false
          const service = property.infrastructure[requirement.key]
          if (!service) return false
          const value = service.value.toLocaleLowerCase("ar")
          return requirement.terms.some((term) =>
            value.includes(term.toLocaleLowerCase("ar")),
          )
        },
      )
      if (!matchesInfrastructure) return false
    }
    if (
      property.category !== "chalet" &&
      !filters.amenities.every((amenity) =>
        matchesAmenity(property.amenities, amenity),
      )
    )
      return false

    return true
  })
}

export const propertyAddress = (property: Property) =>
  [
    property.location.neighborhood,
    property.location.district,
    property.location.governorate,
  ]
    .filter(Boolean)
    .join("، ")

export const propertyPrice = (property: Property) =>
  `${property.price.toLocaleString("en-US")} ${property.currency}${
    property.pricePeriod ? ` / ${property.pricePeriod}` : ""
  }`

export const infrastructureItems = (property: Property) =>
  Object.values(property.infrastructure).filter(
    (service): service is InfrastructureService => Boolean(service),
  )
