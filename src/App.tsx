import { useState, useEffect, useRef } from "react"
import { FlowNavigationSidebar } from "./navigation/FlowNavigationSidebar"
import { ScreenRouter } from "./navigation/ScreenRouter"
import { owners } from "./data/owners"
import { properties } from "./data/properties"
import { specialRequests } from "./data/requests"
import { initialConversations } from "./data/conversations"
import { createDefaultFilters } from "./utils/filters"
import { filterProperties } from "./utils/property"
import { GuestLoginModal } from "./components/GuestLoginModal"
import type {
  Owner,
  Property,
  PropertyReview,
  Conversation,
  SearchFilterState,
  SearchFilterContext,
  SpecialRequest,
} from "./types"

export default function App() {
  const [screen, setScreen] = useState(() => {
    const stored = window.history.state?.maskaniScreen
    return typeof stored === "number" ? stored : 0
  })
  const [isGuest, setIsGuest] = useState(false)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property>(
    properties[0],
  )
  const [filters, setFilters] =
    useState<SearchFilterState>(createDefaultFilters)
  const [filterContext, setFilterContext] =
    useState<SearchFilterContext>("all")
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set())
  const [chatItems, setChatItems] =
    useState<Conversation[]>(initialConversations)
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>()
  const [selectedOwner, setSelectedOwner] = useState<Owner>(owners.ahmed)
  const [followedOwnerIds, setFollowedOwnerIds] = useState<Set<string>>(
    () => new Set([owners.ofuq.id]),
  )
  const [blockedOwnerIds, setBlockedOwnerIds] = useState<Set<string>>(
    () => new Set(),
  )
  const [reportedOwnerIds, setReportedOwnerIds] = useState<Set<string>>(
    () => new Set(),
  )
  const [reportedPropertyIds, setReportedPropertyIds] = useState<Set<string>>(
    () => new Set(),
  )
  const [reviews, setReviews] = useState<PropertyReview[]>([])
  const [userSpecialRequests, setUserSpecialRequests] =
    useState<SpecialRequest[]>(specialRequests)
  const simulatedMessageIndex = useRef(0)

  const filterSource =
    filterContext === "residential"
      ? properties.filter((property) => property.category === "residential")
      : filterContext === "commercial"
        ? properties.filter((property) => property.category === "commercial")
        : filterContext === "land"
          ? properties.filter((property) => property.category === "land")
          : filterContext === "hotel"
            ? properties.filter((property) => property.category === "hotel")
            : filterContext === "chalet"
              ? properties.filter((property) => property.category === "chalet")
              : properties

  const filteredProperties = filterProperties(filterSource, filters)

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("maskani-theme")
    if (storedTheme === "dark" || storedTheme === "light") {
      document.documentElement.dataset.theme = storedTheme
    }
  }, [])

  useEffect(() => {
    if (typeof window.history.state?.maskaniScreen !== "number") {
      window.history.replaceState({ maskaniScreen: screen }, "")
    }

    const handlePopState = (event: PopStateEvent) => {
      setScreen(
        typeof event.state?.maskaniScreen === "number"
          ? event.state.maskaniScreen
          : 0,
      )
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    const simulatedMessages = [
      "هل ما زلت مهتماً بالعقار؟ يمكننا ترتيب موعد مناسب.",
      "تم تحديث تفاصيل العرض، ويمكنك مراجعتها الآن.",
      "مرحباً، يسعدنا الإجابة عن أي استفسار لديك.",
    ]

    const timer = window.setInterval(() => {
      setChatItems((current) => {
        const candidates = current.filter(
          (item) => screen !== 36 || item.id !== selectedConversation?.id,
        )
        if (!candidates.length) return current

        const target =
          candidates[simulatedMessageIndex.current % candidates.length]
        const nextMessage =
          simulatedMessages[
            simulatedMessageIndex.current % simulatedMessages.length
          ]
        simulatedMessageIndex.current += 1

        return current.map((item) =>
          item.id === target.id
            ? {
                ...item,
                message: nextMessage,
                time: "الآن",
                unread: item.unread + 1,
                updatedAt: Date.now(),
              }
            : item,
        )
      })
    }, 20000)

    return () => window.clearInterval(timer)
  }, [screen, selectedConversation?.id])

  const [screenStack, setScreenStack] = useState<number[]>([0])

  const navigate = (nextScreen: number) => {
    // حظر زائر المنصة من فتح الشاشات التفاعلية كالمساعد الذكي والمحادثات والطلبات والمفضلة والإشعارات والشركاء وتعديل الحساب
    const guestRestrictedScreens = [15, 17, 20, 21, 23, 24, 25, 26, 27, 28, 29, 34, 35, 36, 37]
    if (isGuest && guestRestrictedScreens.includes(nextScreen)) {
      setShowGuestModal(true)
      return
    }
    if (nextScreen === -1) {
      if (screenStack.length > 1) {
        const nextStack = [...screenStack]
        nextStack.pop()
        const prevScreen = nextStack[nextStack.length - 1]
        setScreenStack(nextStack)
        setScreen(prevScreen)
      } else {
        setScreen(0)
      }
      return
    }
    if (nextScreen === screen) return
    setScreenStack((current) => [...current, nextScreen])
    setScreen(nextScreen)

    // التمرير السلس إلى أعلى الصفحة عند التنقل بين الشاشات
    window.scrollTo({ top: 0, behavior: "smooth" })
    document.querySelectorAll(".scrollable, .screen, main").forEach((el) => {
      el.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  const openFilters = (context: SearchFilterContext) => {
    setFilterContext(context)
    if (context === "commercial") {
      setFilters({
        ...createDefaultFilters(),
        propertyType: "محلات",
      })
    } else if (context === "land") {
      setFilters({
        ...createDefaultFilters(),
        propertyType: "أرض",
      })
    } else if (context === "hotel") {
      setFilters({
        ...createDefaultFilters(),
        propertyType: "فندق",
      })
    } else if (context === "chalet") {
      setFilters({
        ...createDefaultFilters(),
        propertyType: "شاليه",
      })
    } else if (context === "residential") {
      setFilters((current) => ({
        ...current,
        propertyType: ["شقة", "منازل مستقلة", "فلل"].includes(
          current.propertyType,
        )
          ? current.propertyType
          : "",
      }))
    }
    navigate(16)
  }

  const openProperty = (property: Property) => {
    setSelectedProperty(property)
    navigate(38)
  }

  const openOwner = (owner: Owner) => {
    setSelectedOwner(owner)
    navigate(40)
  }

  const toggleFavorite = (propertyId: string) => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    setFavoriteIds((current) => {
      const next = new Set(current)
      if (next.has(propertyId)) next.delete(propertyId)
      else next.add(propertyId)
      return next
    })
  }

  const openConversation = (conversation: Conversation) => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    const openedConversation = { ...conversation, unread: 0 }
    setChatItems((current) =>
      current.map((item) =>
        item.id === conversation.id ? openedConversation : item,
      ),
    )
    setSelectedConversation(openedConversation)
    navigate(36)
  }

  const contactOwner = (owner: Owner) => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    if (blockedOwnerIds.has(owner.id)) return

    const existingConversation = chatItems.find(
      (conversation) => conversation.ownerId === owner.id,
    )

    if (existingConversation) {
      openConversation(existingConversation)
      return
    }

    const conversation: Conversation = {
      id: `owner-${owner.id}`,
      ownerId: owner.id,
      name: owner.name,
      type: owner.type.includes("فندق") ? "فنادق" : "ملاك",
      initials: owner.initials,
      message: "ابدأ محادثتك الآن",
      time: "الآن",
      unread: 0,
      online: owner.online,
      updatedAt: Date.now(),
      messages: [],
    }

    setChatItems((current) => [conversation, ...current])
    setSelectedConversation(conversation)
    navigate(36)
  }

  const toggleFollowOwner = (ownerId: string) => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    setFollowedOwnerIds((current) => {
      const next = new Set(current)
      if (next.has(ownerId)) next.delete(ownerId)
      else next.add(ownerId)
      return next
    })
  }

  const blockOwner = (ownerId: string) => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    const isBlocked = blockedOwnerIds.has(ownerId)
    setBlockedOwnerIds((current) => {
      const next = new Set(current)
      if (next.has(ownerId)) next.delete(ownerId)
      else next.add(ownerId)
      return next
    })

    if (isBlocked) return

    setFollowedOwnerIds((current) => {
      const next = new Set(current)
      next.delete(ownerId)
      return next
    })
  }

  const reportOwner = (ownerId: string) => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    setReportedOwnerIds((current) => {
      const next = new Set(current)
      if (next.has(ownerId)) next.delete(ownerId)
      else next.add(ownerId)
      return next
    })
  }

  const reportProperty = (propertyId: string) => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    setReportedPropertyIds((current) => {
      const next = new Set(current)
      if (next.has(propertyId)) next.delete(propertyId)
      else next.add(propertyId)
      return next
    })
  }

  const addReview = (propertyId: string, rating: number, text: string) => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    const id = `review-${Date.now()}`
    const review: PropertyReview = {
      id,
      propertyId,
      userId: "current-user",
      userName: "محمد أحمد",
      userInitials: "مح",
      rating,
      text,
      dateLabel: "الآن",
      createdAt: Date.now(),
      isOwn: true,
      isNew: true,
    }

    setReviews((current) => [review, ...current])
    window.setTimeout(() => {
      setReviews((current) =>
        current.map((item) =>
          item.id === id ? { ...item, isNew: false } : item,
        ),
      )
    }, 3500)
  }

  const deleteReview = (reviewId: string) => {
    setReviews((current) => current.filter((review) => review.id !== reviewId))
  }

  const deleteConversation = (id?: string) => {
    if (id) setChatItems((current) => current.filter((item) => item.id !== id))
    setSelectedConversation(undefined)
    navigate(35)
  }

  const pinConversation = (id: string) => {
    setChatItems((current) =>
      current
        .map((item) => (item.id === id ? { ...item, pinned: true } : item))
        .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))),
    )
  }

  const unpinConversation = (id: string) => {
    setChatItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, pinned: false } : item,
      ),
    )
  }

  const updateConversationFromSentMessage = (
    id: string | undefined,
    message: string,
  ) => {
    if (!id) return
    const update = (item: Conversation): Conversation =>
      item.id === id
        ? {
            ...item,
            message: `أنت: ${message}`,
            time: "الآن",
            unread: 0,
            updatedAt: Date.now(),
            messages: [
              ...item.messages,
              {
                id: `message-${Date.now()}`,
                text: message,
                sentAt: "الآن",
              },
            ],
          }
        : item

    setChatItems((current) => current.map(update))
    setSelectedConversation((current) => (current ? update(current) : current))
  }

  const toggleConversationMute = (id?: string) => {
    if (!id) return
    setChatItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, muted: !item.muted } : item,
      ),
    )
    setSelectedConversation((current) =>
      current?.id === id ? { ...current, muted: !current.muted } : current,
    )
  }

  const addSpecialRequest = (request: SpecialRequest) => {
    setUserSpecialRequests((current) => [request, ...current])
  }

  return (
    <div className="app-shell" dir="rtl">
      <FlowNavigationSidebar
        currentScreen={screen}
        onNavigate={navigate}
      />

      <main className="device-stage">
        <div className="device">
          <div className="device-island" />
          <ScreenRouter
            screen={screen}
            navigate={navigate}
            selectedProperty={selectedProperty}
            openProperty={openProperty}
            filters={filters}
            setFilters={setFilters}
            filterContext={filterContext}
            openFilters={openFilters}
            filteredProperties={filteredProperties}
            setFilterContext={setFilterContext}
            favoriteIds={favoriteIds}
            toggleFavorite={toggleFavorite}
            reportedPropertyIds={reportedPropertyIds}
            reportProperty={reportProperty}
            selectedOwner={selectedOwner}
            openOwner={openOwner}
            followedOwnerIds={followedOwnerIds}
            toggleFollowOwner={toggleFollowOwner}
            blockedOwnerIds={blockedOwnerIds}
            blockOwner={blockOwner}
            reportedOwnerIds={reportedOwnerIds}
            reportOwner={reportOwner}
            reviews={reviews}
            addReview={addReview}
            deleteReview={deleteReview}
            chatItems={chatItems}
            setChatItems={setChatItems}
            selectedConversation={selectedConversation}
            openConversation={openConversation}
            contactOwner={contactOwner}
            deleteConversation={deleteConversation}
            pinConversation={pinConversation}
            unpinConversation={unpinConversation}
            toggleConversationMute={toggleConversationMute}
            updateConversationFromSentMessage={updateConversationFromSentMessage}
            userSpecialRequests={userSpecialRequests}
            addSpecialRequest={addSpecialRequest}
            allProperties={properties}
            isGuest={isGuest}
            onPromptGuestLogin={() => setShowGuestModal(true)}
            onGuestLogin={() => {
              setIsGuest(true)
            }}
          />
        </div>

        {showGuestModal && (
          <GuestLoginModal
            onClose={() => setShowGuestModal(false)}
            onLogin={() => {
              setShowGuestModal(false)
              setIsGuest(false)
              navigate(4) // الانتقال لشاشة تسجيل الدخول
            }}
          />
        )}

        <p className="stage-caption">
          واجهة واحدة، تجربة سلسة من الاكتشاف إلى التفعيل
        </p>
      </main>
    </div>
  )
}
