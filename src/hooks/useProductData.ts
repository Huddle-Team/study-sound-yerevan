import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface RentalItem {
  id: number;
  names: Record<string, string>;
  descriptions: Record<string, string>;
  prices: Record<string, string>;
  image?: string;
  features: Record<string, string[]>;
  icon: string;
  category: string;
  gpsTracking?: boolean;
}

export interface SaleItem {
  id: number;
  names: Record<string, string>;
  descriptions: Record<string, string>;
  prices: Record<string, string>;
  image?: string;
  badge: Record<string, string>;
  badgeColor: string;
  icon: string;
  category: string;
  warranty?: Record<string, string>;
}

// Define data directly in the hook to avoid import issues
const rentalsData = {
  "audioRentals": [
    {
      "id": 1,
      "names": {
        "en": "Micro Earpieces Basic",
        "ru": "Микронаушник Basic",
        "hy": "Միկրոականջակալ Basic"
      },
      "descriptions": {
        "en": "Perfect for students in exams. Connect wirelessly via Bluetooth in seconds.",
        "ru": "Идеально для студентов на экзаменах и не только. Мгновенное беспроводное подключение через Bluetooth.",
        "hy": "Իդեալական է քննությունների համար և ոչ միայն։ Անլար միացում՝ Bluetooth-ի միջոցով՝ հաշված վայրկյաններում:"
      },
      "prices": {
        "en": "From 3,000 AMD/day",
        "ru": "От 3,000 драм/день",
        "hy": "Սկսած 3,000 դրամ/օր"
      },
      "image": "/noise-cancelling.jpg",
      "features": {
        "en": ["High-quality sound", "Sensitive microphone", "4+ hour battery"],
        "ru": ["Высокое качество звука", "Чувствительный микрофон", "Батарея 4+ часа"],
        "hy": ["Բարձր ձայն", "Նուրբ միկրոֆոն", "4+ ժամ մարտկոց"]
      },
      "icon": "Headphones",
      "category": "audio",
      "gpsTracking": true
    },
    {
      "id": 2,
      "names": {
        "en": "Micro Earpieces Croco",
        "ru": "Микронаушник Croco",
        "hy": "Միկրոականջակալ Croco"
      },
      "descriptions": {
        "en": "Perfect for students in exams. Connect wirelessly via Bluetooth in seconds.",
        "ru": "Идеально для студентов на экзаменах и не только. Мгновенное беспроводное подключение через Bluetooth.",
        "hy": "Իդեալական է քննությունների համար և ոչ միայն։ Անլար միացում՝ Bluetooth-ի միջոցով՝ հաշված վայրկյաններում:"
      },
      "prices": {
        "en": "From 4,000 AMD/day",
        "ru": "От 4,000 драм/день",
        "hy": "Սկսած 4,000 դրամ/օր"
      },
      "image": "/studio-headphones.jpg",
      "features": {
        "en": ["High-quality sound", "Sensitive microphone", "4+ hour battery"],
        "ru": ["Высокое качество звука", "Чувствительный микрофон", "Батарея 4+ часа"],
        "hy": ["Բարձր ձայն", "Նուրբ միկրոֆոն", "4+ ժամ մարտկոց"]
      },
      "icon": "Volume2",
      "category": "audio",
      "gpsTracking": true
    },
    {
      "id": 3,
      "names": {
        "en": "Micro Earpieces Light",
        "ru": "Микронаушник Light",
        "hy": "Միկրոականջակալ Light"
      },
      "descriptions": {
        "en": "Perfect for students in exams. Connect wirelessly via Bluetooth in seconds.",
        "ru": "Идеально для студентов на экзаменах и не только. Мгновенное беспроводное подключение через Bluetooth.",
        "hy": "Իդեալական է քննությունների համար և ոչ միայն։ Անլար միացում՝ Bluetooth-ի միջոցով՝ հաշված վայրկյաններում:"
      },
      "prices": {
        "en": "From 30,000 AMD/day",
        "ru": "От 30,000 драм/день",
        "hy": "Սկսած 30,000 դրամ/օր"
      },
      "image": "/usb-headset.jpg",
      "features": {
        "en": ["High-quality sound", "Sensitive microphone", "6+ hour battery"],
        "ru": ["Высокое качество звука", "Чувствительный микрофон", "Батарея 6+ часа"],
        "hy": ["Բարձր ձայն", "Նուրբ միկրոֆոն", "6+ ժամ մարտկոց"]
      },
      "icon": "Mic",
      "category": "audio",
      "gpsTracking": true
    },
    {
      "id": 4,
      "names": {
        "en": "Micro Earpieces Pro",
        "ru": "Микронаушник Pro",
        "hy": "Միկրոականջակալ Pro"
      },
      "descriptions": {
        "en": "Perfect for interviews and challenging exams. Connect wirelessly via Bluetooth in seconds.",
        "ru": "Идеально для собеседований и сложных экзаменов. Мгновенное беспроводное подключение через Bluetooth.",
        "hy": "Իդեալական է հարցազրույցների և բարդ քննությունների համար։ Անլար միացում՝ Bluetooth-ի միջոցով՝ հաշված վայրկյաններում:"
      },
      "prices": {
        "en": "From 6,000 AMD/day",
        "ru": "От 6,000 драм/день",
        "hy": "Սկսած 6,000 դրամ/օր"
      },
      "image": "/earbuds.jpg",
      "features": {
        "en": ["High-quality sound", "Very Sensitive microphone", "8+ hour battery"],
        "ru": ["Высокое качество звука", "Очень чувствительный микрофон", "Батарея 8+ часа"],
        "hy": ["Բարձր ձայն", "Շատ Նուրբ միկրոֆոն", "8+ ժամ մարտկոց"]
      },
      "icon": "Headphones",
      "category": "audio",
      "gpsTracking": true
    }
  ],
  "cameraRentals": [
    {
      "id": 5,
      "names": {
        "en": "Spy Micro Camera Basic",
        "ru": "Скрытая микро-камера Basic",
        "hy": "Անտեսանալի միկրո կամերա Basic"
      },
      "descriptions": {
        "en": "Professional photography for projects and assignments.",
        "ru": "Профессиональная фотография для проектов и заданий.",
        "hy": "Պրոֆեսիոնալ ֆոտոգրաֆիա նախագծերի և առաջադրանքների համար:"
      },
      "prices": {
        "en": "From 4,500 AMD/day",
        "ru": "От 4,500 драм/день",
        "hy": "Սկսած 4,500 դրամ/օր"
      },
      "image": "/spy-camera.jpg",
      "features": {
        "en": ["24MP sensor", "Full HD video", "Interchangeable lenses"],
        "ru": ["24MP сенсор", "Full HD видео", "Сменные объективы"],
        "hy": ["24MP սենսոր", "Full HD տեսանյութ", "Փոխարինվող ոսպնյակներ"]
      },
      "icon": "Camera",
      "category": "camera",
      "gpsTracking": true
    },
    {
      "id": 6,
      "names": {
        "en": "Action Camera",
        "ru": "Экшн-камера",
        "hy": "Գործողության ֆոտոապարատ"
      },
      "descriptions": {
        "en": "Compact recording for field work and presentations.",
        "ru": "Компактная запись для полевых работ и презентаций.",
        "hy": "Կոմպակտ գրանցում դաշտային աշխատանքների և ներկայացումների համար:"
      },
      "prices": {
        "en": "From 2,800 AMD/day",
        "ru": "От 2,800 драм/день",
        "hy": "Սկսած 2,800 դրամ/օր"
      },
      "features": {
        "en": ["4K video recording", "Waterproof case", "Stabilization"],
        "ru": ["4K видеозапись", "Водонепроницаемый чехол", "Стабилизация"],
        "hy": ["4K տեսագրություն", "Ջրակայուն պարկ", "Կայունացում"]
      },
      "icon": "Video",
      "category": "camera",
      "gpsTracking": true
    },
    {
      "id": 7,
      "names": {
        "en": "Webcam HD",
        "ru": "HD веб-камера",
        "hy": "HD վեբ կամերա"
      },
      "descriptions": {
        "en": "High-quality streaming for online classes and meetings.",
        "ru": "Высококачественная трансляция для онлайн-уроков и встреч.",
        "hy": "Բարձրորակ հոսանք օնլայն դասերի և հանդիպումների համար:"
      },
      "prices": {
        "en": "From 1,200 AMD/day",
        "ru": "От 1,200 драм/день",
        "hy": "Սկսած 1,200 դրամ/օր"
      },
      "features": {
        "en": ["1080p resolution", "Auto-focus", "Built-in microphone"],
        "ru": ["1080p разрешение", "Автофокус", "Встроенный микрофон"],
        "hy": ["1080p թույլտվություն", "Ինքնակենտրոնացում", "Ներկառուցված բարձրախոս"]
      },
      "icon": "Camera",
      "category": "camera",
      "gpsTracking": true
    },
    {
      "id": 10,
      "names": {
        "en": "Spy Micro Camera Basic",
        "ru": "Скрытая микро-камера Basic",
        "hy": "Անտեսանալի միկրո կամերա Basic"
      },
      "descriptions": {
        "en": "Micro camera for real-time recording with wireless Wi-Fi connection. Includes: micro camera, USB charger.",
        "ru": "Микрокамера для записи в реальном времени с беспроводным подключением по Wi-Fi. В комплекте: микрокамера, зарядное устройство USB.",
        "hy": "Միկրո կամերա՝ իրական ժամանակում online հետևելու համար՝ անլար Wi-Fi կապով: Ներառում է՝ միկրոկամեռա, usb լիցքավորիչ։"
      },
      "prices": {
        "en": "From 7,000 AMD/day",
        "ru": "От 7,000 драм/день",
        "hy": "Սկսած 7,000 դրամ/օր"
      },
      "image": "/spy-camera.jpg",
      "features": {
        "en": ["Ultra-compact design", "HD video recording", "Long battery life", "Memory card included"],
        "ru": ["Ультракомпактный дизайн", "HD видеозапись", "Долгое время автономной работы", "Карта памяти включена"],
        "hy": ["Ուլտրակոմպակտ դիզայն", "HD տեսագրություն", "Երկար մարտկոցի կյանք", "Հիշողության քարտ ներառված"]
      },
      "icon": "Camera",
      "category": "camera",
      "gpsTracking": true
    }
  ],
  "gpsRentals": [
    {
      "id": 8,
      "names": {
        "en": "Handheld GPS",
        "ru": "Портативный GPS",
        "hy": "Կրման GPS"
      },
      "descriptions": {
        "en": "Precision navigation for fieldwork and research.",
        "ru": "Точная навигация для полевых работ и исследований.",
        "hy": "Ճշգրիտ նավիգացիա դաշտային աշխատանքների և հետազոտությունների համար:"
      },
      "prices": {
        "en": "From 3,200 AMD/day",
        "ru": "От 3,200 драм/день",
        "hy": "Սկսած 3,200 դրամ/օր"
      },
      "features": {
        "en": ["High accuracy", "Preloaded maps", "Long battery life"],
        "ru": ["Высокая точность", "Предзагруженные карты", "Долгий срок службы батареи"],
        "hy": ["Բարձր ճշգրտություն", "Նախապես բեռնված քարտեզներ", "Երկար մարտկոցի տևողություն"]
      },
      "icon": "MapPin",
      "category": "gps",
      "gpsTracking": true
    },
    {
      "id": 9,
      "names": {
        "en": "Car GPS Navigator",
        "ru": "Автомобильный GPS навигатор",
        "hy": "Ավտոմեքենայի GPS նավիգատոր"
      },
      "descriptions": {
        "en": "Vehicle navigation for field trips and surveys.",
        "ru": "Навигация транспортных средств для экскурсий и опросов.",
        "hy": "Տրանսպորտային միջոցների նավիգացիա էքսկուրսիաների և հարցումների համար:"
      },
      "prices": {
        "en": "From 2,000 AMD/day",
        "ru": "От 2,000 драм/день",
        "hy": "Սկսած 2,000 դրամ/օր"
      },
      "features": {
        "en": ["Traffic updates", "Voice guidance", "Large display"],
        "ru": ["Обновления трафика", "Голосовое управление", "Большой дисплей"],
        "hy": ["Երթևեկության թարմացումներ", "Ձայնային ուղղորդում", "Մեծ էկրան"]
      },
      "icon": "Navigation",
      "category": "gps",
      "gpsTracking": true
    },
    {
      "id": 11,
      "names": {
        "en": "GPS Watch",
        "ru": "GPS часы",
        "hy": "GPS ժամացույց"
      },
      "descriptions": {
        "en": "Wearable tracking for outdoor activities and research.",
        "ru": "Носимое отслеживание для активного отдыха и исследований.",
        "hy": "Կրվող հետևություն բացօթյա գործունեության և հետազոտությունների համար:"
      },
      "prices": {
        "en": "From 2,500 AMD/day",
        "ru": "От 2,500 драм/день",
        "hy": "Սկսած 2,500 դրամ/օր"
      },
      "features": {
        "en": ["Heart rate monitor", "Activity tracking", "Water resistant"],
        "ru": ["Монитор сердечного ритма", "Отслеживание активности", "Водостойкий"],
        "hy": ["Սրտի հարվածների մոնիտոր", "Գործունեության հետևություն", "Ջրակայուն"]
      },
      "icon": "Compass",
      "category": "gps",
      "gpsTracking": true
    }
  ]
};

const productsData = {
  "audioSaleItems": [
    {
      "id": 11,
      "names": {
        "en": "Micro Earpieces Croco",
        "ru": "Микронаушник Croco",
        "hy": "Միկրոականջակալ Croco"
      },
      "descriptions": {
        "en": "Perfect for students in exams. Connect wirelessly via Bluetooth in seconds.",
        "ru": "Идеально для студентов на экзаменах и не только. Мгновенное беспроводное подключение через Bluetooth.",
        "hy": "Իդեալական է քննությունների համար և ոչ միայն։ Անլար միացում՝ Bluetooth-ի միջոցով՝ հաշված վայրկյաններում:"
      },
      "prices": {
        "en": "From 23,000 AMD",
        "ru": "От 23,000 драм",
        "hy": "Սկսած 23,000 դրամ"
      },
      "image": "/earbuds.jpg",
      "badge": {
        "en": "New",
        "ru": "Новый",
        "hy": "Նոր"
      },
      "badgeColor": "bg-success text-success-foreground",
      "icon": "Headphones",
      "category": "audio"
    },
    {
      "id": 12,
      "names": {
        "en": "Micro Earpieces PRO ",
        "ru": "Микронаушники PRO",
        "hy": "Միկրոականջակալ PRO"
      },
      "descriptions": {
        "en": "Perfect for students in exams. Connect wirelessly via Bluetooth in seconds.",
        "ru": "Идеально для студентов на экзаменах и не только. Мгновенное беспроводное подключение через Bluetooth.",
        "hy": "Իդեալական է քննությունների համար և ոչ միայն։ Անլար միացում՝ Bluetooth-ի միջոցով՝ հաշված վայրկյաններում:"
      },
      "prices": {
        "en": "From 30,000 AMD",
        "ru": "От 30,000 драм",
        "hy": "Սկսած 30,000 դրամ"
      },
      "image": "/studio-headphones.jpg",
      "badge": {
        "en": "New",
        "ru": "Новый",
        "hy": "Նոր"
      },
      "badgeColor": "bg-accent text-accent-foreground",
      "icon": "Wrench",
      "category": "audio"
    },
    {
      "id": 13,
      "names": {
        "en": "Micro Earpieces Light",
        "ru": "Микронаушники Light",
        "hy": "Միկրոականջակալ Light"
      },
      "descriptions": {
        "en": "Perfect for students in exams. Connect wirelessly via Bluetooth in seconds.",
        "ru": "Идеально для студентов на экзаменах и не только. Мгновенное беспроводное подключение через Bluetooth.",
        "hy": "Իդեալական է քննությունների համար և ոչ միայն։ Անլար միացում՝ Bluetooth-ի միջոցով՝ հաշված վայրկյաններում:"
      },
      "prices": {
        "en": "From 30,000 AMD",
        "ru": "От 30,000 драм",
        "hy": "Սկսած 30,000 դրամ"
      },
      "image": "/usb-headset.jpg",
      "badge": {
        "en": "Accessories",
        "ru": "Аксессуары",
        "hy": "Պարագաներ"
      },
      "badgeColor": "bg-muted text-muted-foreground",
      "icon": "Package",
      "category": "audio"
    }
  ],
  "cameraSaleItems": [
    {
      "id": 4,
      "names": {
        "en": "Mirrorless Camera (Used)",
        "ru": "Беззеркальная камера (б/у)",
        "hy": "Անանգեսային ֆոտոապարատ (օգտագործված)"
      },
      "descriptions": {
        "en": "Excellent condition with original packaging and accessories.",
        "ru": "Отличное состояние с оригинальной упаковкой и аксессуарами.",
        "hy": "Գերազանց վիճակ բնօրինակ փաթեթավորմամբ և պարագաներով:"
      },
      "prices": {
        "en": "From 85,000 AMD",
        "ru": "От 85,000 драм",
        "hy": "Սկսած 85,000 դրամ"
      },
      "image": null,
      "badge": {
        "en": "Used",
        "ru": "Б/у",
        "hy": "Օգտագործված"
      },
      "badgeColor": "bg-accent text-accent-foreground",
      "icon": "Camera",
      "warranty": {
        "en": "6 month warranty",
        "ru": "6 месяцев гарантии",
        "hy": "6 ամիս երաշխիք"
      },
      "category": "camera"
    },
    {
      "id": 5,
      "names": {
        "en": "Action Camera (New)",
        "ru": "Экшн-камера (новая)",
        "hy": "Գործողության ֆոտոապարատ (նոր)"
      },
      "descriptions": {
        "en": "Latest model with 4K recording capability and accessories.",
        "ru": "Последняя модель с возможностью записи 4K и аксессуарами.",
        "hy": "Վերջին մոդել 4K գրանցման հնարավորությամբ և պարագաներով:"
      },
      "prices": {
        "en": "From 45,000 AMD",
        "ru": "От 45,000 драм",
        "hy": "Սկսած 45,000 դրամ"
      },
      "image": null,
      "badge": {
        "en": "New",
        "ru": "Новый",
        "hy": "Նոր"
      },
      "badgeColor": "bg-success text-success-foreground",
      "icon": "Video",
      "warranty": {
        "en": "1 year warranty",
        "ru": "1 год гарантии",
        "hy": "1 տարի երաշխիք"
      },
      "category": "camera"
    },
    {
      "id": 6,
      "names": {
        "en": "Camera Accessories",
        "ru": "Аксессуары для камеры",
        "hy": "Ֆոտոապարատի պարագաներ"
      },
      "descriptions": {
        "en": "Tripods, memory cards, lens filters, cases and more.",
        "ru": "Штативы, карты памяти, фильтры для объективов, чехлы и многое другое.",
        "hy": "Եռոտանիներ, հիշողության քարտեր, ոսպնյակների ֆիլտրեր, պարկեր և ավելին:"
      },
      "prices": {
        "en": "From 2,500 AMD",
        "ru": "От 2,500 драм",
        "hy": "Սկսած 2,500 դրամ"
      },
      "image": null,
      "badge": {
        "en": "Accessories",
        "ru": "Аксессуары",
        "hy": "Պարագաներ"
      },
      "badgeColor": "bg-muted text-muted-foreground",
      "icon": "Package",
      "category": "camera"
    }
  ],
  "gpsSaleItems": [
    {
      "id": 7,
      "names": {
        "en": "Professional GPS (Refurb)",
        "ru": "Профессиональный GPS (восст.)",
        "hy": "Պրոֆեսիոնալ GPS (վերանոր.)"
      },
      "descriptions": {
        "en": "High-precision navigation unit, tested and cleaned.",
        "ru": "Высокоточный навигационный блок, протестированный и очищенный.",
        "hy": "Բարձրճշգրիտ նավիգացիոն միավոր, փորձարկված և մաքրված:"
      },
      "prices": {
        "en": "From 65,000 AMD",
        "ru": "От 65,000 драм",
        "hy": "Սկսած 65,000 դրամ"
      },
      "image": null,
      "badge": {
        "en": "Refurbished",
        "ru": "Восстановленный",
        "hy": "Վերանորոգված"
      },
      "badgeColor": "bg-accent text-accent-foreground",
      "icon": "MapPin",
      "warranty": {
        "en": "3 month warranty",
        "ru": "3 месяца гарантии",
        "hy": "3 ամիս երաշխիք"
      },
      "category": "gps"
    },
    {
      "id": 8,
      "names": {
        "en": "Car Navigator (New)",
        "ru": "Автомобильный навигатор (новый)",
        "hy": "Ավտոմեքենայի նավիգատոր (նոր)"
      },
      "descriptions": {
        "en": "Latest maps and traffic updates included in the package.",
        "ru": "Последние карты и обновления трафика включены в пакет.",
        "hy": "Վերջին քարտեզներն ու երթևեկության թարմացումները ներառված են փաթեթում:"
      },
      "prices": {
        "en": "From 28,000 AMD",
        "ru": "От 28,000 драм",
        "hy": "Սկսած 28,000 դրամ"
      },
      "image": null,
      "badge": {
        "en": "New",
        "ru": "Новый",
        "hy": "Նոր"
      },
      "badgeColor": "bg-success text-success-foreground",
      "icon": "Navigation",
      "warranty": {
        "en": "2 year warranty",
        "ru": "2 года гарантии",
        "hy": "2 տարի երաշխիք"
      },
      "category": "gps"
    },
    {
      "id": 9,
      "names": {
        "en": "GPS Accessories",
        "ru": "GPS аксессуары",
        "hy": "GPS պարագաներ"
      },
      "descriptions": {
        "en": "Mounts, cases, chargers, memory cards and more.",
        "ru": "Крепления, чехлы, зарядные устройства, карты памяти и многое другое.",
        "hy": "Ամրակներ, պարկեր, լիցքավորիչներ, հիշողության քարտեր և ավելին:"
      },
      "prices": {
        "en": "From 1,800 AMD",
        "ru": "От 1,800 драм",
        "hy": "Սկսած 1,800 դրամ"
      },
      "image": null,
      "badge": {
        "en": "Accessories",
        "ru": "Аксессуары",
        "hy": "Պարագաներ"
      },
      "badgeColor": "bg-muted text-muted-foreground",
      "icon": "Package",
      "category": "gps"
    }
  ]
};

export const useProductData = () => {
  const { language } = useLanguage();
  const [rentals, setRentals] = useState<{
    audio: RentalItem[];
    camera: RentalItem[];
    gps: RentalItem[];
  }>({ audio: [], camera: [], gps: [] });
  
  const [products, setProducts] = useState<{
    audio: SaleItem[];
    camera: SaleItem[];
    gps: SaleItem[];
  }>({ audio: [], camera: [], gps: [] });

  useEffect(() => {
    // Load and categorize rentals
    const categorizedRentals = {
      audio: rentalsData.audioRentals,
      camera: rentalsData.cameraRentals,
      gps: rentalsData.gpsRentals,
    };
    setRentals(categorizedRentals);

    // Load and categorize products
    const categorizedProducts = {
      audio: productsData.audioSaleItems,
      camera: productsData.cameraSaleItems,
      gps: productsData.gpsSaleItems,
    };
    setProducts(categorizedProducts);
  }, []);

  const getLocalizedRental = (rental: RentalItem) => ({
    ...rental,
    name: rental.names[language] || rental.names.en,
    description: rental.descriptions[language] || rental.descriptions.en,
    price: rental.prices[language] || rental.prices.en,
    features: rental.features[language] || rental.features.en,
  });

  const getLocalizedProduct = (product: SaleItem) => ({
    ...product,
    name: product.names[language] || product.names.en,
    description: product.descriptions[language] || product.descriptions.en,
    price: product.prices[language] || product.prices.en,
    badge: product.badge[language] || product.badge.en,
    warranty: product.warranty ? (product.warranty[language] || product.warranty.en) : undefined,
  });

  return {
    rentals: {
      audio: rentals.audio ? rentals.audio.map(getLocalizedRental) : [],
      camera: rentals.camera ? rentals.camera.map(getLocalizedRental) : [],
      gps: rentals.gps ? rentals.gps.map(getLocalizedRental) : [],
    },
    products: {
      audio: products.audio ? products.audio.map(getLocalizedProduct) : [],
      camera: products.camera ? products.camera.map(getLocalizedProduct) : [],
      gps: products.gps ? products.gps.map(getLocalizedProduct) : [],
    },
    allRentals: [
      ...(rentals.audio ? rentals.audio.map(getLocalizedRental) : []),
      ...(rentals.camera ? rentals.camera.map(getLocalizedRental) : []),
      ...(rentals.gps ? rentals.gps.map(getLocalizedRental) : []),
    ],
    allProducts: [
      ...(products.audio ? products.audio.map(getLocalizedProduct) : []),
      ...(products.camera ? products.camera.map(getLocalizedProduct) : []),
      ...(products.gps ? products.gps.map(getLocalizedProduct) : []),
    ],
  };
};
