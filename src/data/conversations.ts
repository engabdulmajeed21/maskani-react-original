import { owners } from "./owners"
import type { Conversation } from "../types"

export const initialConversations: Conversation[] = [
  {
    id: "hotel-sanaa",
    ownerId: owners.hotelSanaa.id,
    name: "فندق سماء صنعاء",
    type: "فنادق",
    initials: "فس",
    message: "يسعدنا تأكيد حجزك، هل تحتاج إلى خدمة النقل؟",
    time: "10:42 ص",
    unread: 2,
    online: true,
    updatedAt: 4,
    messages: [
      {
        id: "m-hs-1",
        text: "مرحباً بك في فندق سماء صنعاء، كيف يمكننا مساعدتك في حجزك؟",
        sentAt: "10:30 ص",
      },
      {
        id: "m-hs-2",
        text: "أهلاً بك، أود الاستفسار عن توفر جناح عائلي لعطلة نهاية الأسبوع.",
        sentAt: "10:35 ص",
      },
      {
        id: "m-hs-3",
        text: "يسعدنا تأكيد حجزك، هل تحتاج إلى خدمة النقل؟",
        sentAt: "10:42 ص",
      },
    ],
  },
  {
    id: "owner-ahmed",
    ownerId: owners.ahmed.id,
    name: "أحمد القاسمي",
    type: "ملاك",
    initials: "أق",
    message: "الشقة متاحة للمعاينة غداً بعد الساعة الرابعة.",
    time: "أمس",
    unread: 0,
    online: true,
    updatedAt: 3,
    messages: [
      {
        id: "m-oa-1",
        text: "السلام عليكم، هل أنت مهتم بمعاينة الشقة في حدة؟",
        sentAt: "أمس 2:15 م",
      },
      {
        id: "m-oa-2",
        text: "وعليكم السلام، نعم مهتم جداً. هل السعر قابل للتفاوض؟",
        sentAt: "أمس 2:20 م",
      },
      {
        id: "m-oa-3",
        text: "الشقة متاحة للمعاينة غداً بعد الساعة الرابعة.",
        sentAt: "أمس 2:25 م",
      },
    ],
  },
  {
    id: "office-ofuq",
    ownerId: owners.ofuq.id,
    name: "مكتب أفق العقاري",
    type: "ملاك",
    initials: "مأ",
    message: "أرسلنا لك التفاصيل الكاملة والموقع على الخريطة.",
    time: "الأحد",
    unread: 1,
    online: false,
    updatedAt: 2,
    messages: [
      {
        id: "m-oo-1",
        text: "أهلاً بك معنا في مكتب أفق العقاري. هل تبحث عن أرض أو منزل مستقل؟",
        sentAt: "الأحد 9:00 ص",
      },
      {
        id: "m-oo-2",
        text: "أبحث عن منزل مستقل بحديقة في الروضة أو بني الحارث.",
        sentAt: "الأحد 9:10 ص",
      },
      {
        id: "m-oo-3",
        text: "أرسلنا لك التفاصيل الكاملة والموقع على الخريطة.",
        sentAt: "الأحد 9:30 ص",
      },
    ],
  },
  {
    id: "chalets-oasis",
    ownerId: owners.oasis.id,
    name: "شاليهات الواحة",
    type: "فنادق",
    initials: "شا",
    message: "شكراً لاختيارك لنا، نتمنى لك إقامة سعيدة.",
    time: "12 أكتوبر",
    unread: 0,
    online: false,
    updatedAt: 1,
    messages: [
      {
        id: "m-co-1",
        text: "مرحباً بك في شاليهات الواحة. الحجوزات متاحة للفترات الصباحية والمسائية.",
        sentAt: "12 أكتوبر",
      },
      {
        id: "m-co-2",
        text: "أرغب بحجز شاليه نسيم الساحل ليوم كامل.",
        sentAt: "12 أكتوبر",
      },
      {
        id: "m-co-3",
        text: "شكراً لاختيارك لنا، نتمنى لك إقامة سعيدة.",
        sentAt: "12 أكتوبر",
      },
    ],
  },
]
