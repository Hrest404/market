export interface ProductAttribute {
  name: string;
  value: string;
  group: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  priceUzs: number;
  oldPriceUzs?: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  images: string[];
  description: string;
  features: string[];
  attributes: ProductAttribute[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCount: number;
}

export const CATEGORIES: Category[] = [
  { id: "smartphones", name: "Смартфоны", slug: "smartphones", icon: "DeviceMobile", itemCount: 28 },
  { id: "laptops", name: "Ноутбуки", slug: "laptops", icon: "Laptop", itemCount: 19 },
  { id: "tablets", name: "Планшеты", slug: "tablets", icon: "DeviceTablet", itemCount: 12 },
  { id: "headphones", name: "Аудио & Наушники", slug: "headphones", icon: "Headphones", itemCount: 24 },
  { id: "smart-watches", name: "Смарт-часы", slug: "smart-watches", icon: "Watch", itemCount: 15 },
  { id: "accessories", name: "Аксессуары", slug: "accessories", icon: "PlugCharging", itemCount: 42 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Apple iPhone 16 Pro Max 256GB Natural Titanium",
    slug: "apple-iphone-16-pro-max-256gb-natural-titanium",
    brand: "Apple",
    categoryId: "smartphones",
    categoryName: "Смартфоны",
    priceUzs: 16950000,
    oldPriceUzs: 18200000,
    rating: 4.9,
    reviewsCount: 38,
    stock: 7,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Флагманский смартфон Apple с чипом A18 Pro, титановым корпусом 5-го класса, кнопкой Camera Control и выдающейся системой камер Fusion 48 Мп.",
    features: ["Экран 6.9\" Super Retina XDR ProMotion", "Чип A18 Pro 3нм", "Камера 48 Мп с 5x оптическим зумом", "Корпус из титана"],
    attributes: [
      { name: "Диагональ экрана", value: "6.9 дюйма", group: "Экран" },
      { name: "Тип матрицы", value: "OLED Super Retina XDR 120 Гц", group: "Экран" },
      { name: "Процессор", value: "Apple A18 Pro", group: "Производительность" },
      { name: "Встроенная память", value: "256 ГБ", group: "Память" },
      { name: "Оперативная память", value: "8 ГБ", group: "Память" },
      { name: "Основная камера", value: "48 + 48 + 12 Мп (5x зум)", group: "Камера" },
      { name: "Ёмкость аккумулятора", value: "4685 мАч", group: "Питание" },
      { name: "Вес", value: "227 г", group: "Габариты" }
    ]
  },
  {
    id: "prod-2",
    name: "Samsung Galaxy S24 Ultra 12/512GB Titanium Gray",
    slug: "samsung-galaxy-s24-ultra-512gb-titanium-gray",
    brand: "Samsung",
    categoryId: "smartphones",
    categoryName: "Смартфоны",
    priceUzs: 15400000,
    oldPriceUzs: 16800000,
    rating: 4.8,
    reviewsCount: 29,
    stock: 5,
    isPopular: true,
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ультрасовременный Android-флагман с интегрированным искусственным интеллектом Galaxy AI, титановой рамкой, плоским дисплеем и пером S Pen.",
    features: ["Экран Dynamic AMOLED 2X 6.8\" 120Hz", "Snapdragon 8 Gen 3 for Galaxy", "Камера 200 Мп", "Встроенный S Pen"],
    attributes: [
      { name: "Диагональ экрана", value: "6.8 дюйма", group: "Экран" },
      { name: "Процессор", value: "Snapdragon 8 Gen 3", group: "Производительность" },
      { name: "Встроенная память", value: "512 ГБ", group: "Память" },
      { name: "Оперативная память", value: "12 ГБ", group: "Память" },
      { name: "Камера", value: "200 + 50 + 12 + 10 Мп", group: "Камера" },
      { name: "Аккумулятор", value: "5000 мАч", group: "Питание" }
    ]
  },
  {
    id: "prod-3",
    name: "Apple MacBook Pro 16\" M3 Max 36GB / 1TB Space Black",
    slug: "apple-macbook-pro-16-m3-max-space-black",
    brand: "Apple",
    categoryId: "laptops",
    categoryName: "Ноутбуки",
    priceUzs: 38900000,
    oldPriceUzs: 41500000,
    rating: 5.0,
    reviewsCount: 14,
    stock: 3,
    isFeatured: true,
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Непревзойденная портативная рабочая станция для разработчиков, дизайнеров и 3D-специалистов с невероятной автономностью до 22 часов.",
    features: ["Чип M3 Max 14-core CPU / 30-core GPU", "Дисплей Liquid Retina XDR 120 Гц", "1 ТБ сверхбыстрый SSD", "До 22 часов работы"],
    attributes: [
      { name: "Диагональ", value: "16.2 дюйма", group: "Экран" },
      { name: "Процессор", value: "Apple M3 Max (14 ядер)", group: "Производительность" },
      { name: "Оперативная память", value: "36 ГБ Unified Memory", group: "Память" },
      { name: "Накопитель", value: "1 ТБ SSD", group: "Память" },
      { name: "Автономность", value: "До 22 часов", group: "Питание" }
    ]
  },
  {
    id: "prod-4",
    name: "ASUS ROG Zephyrus G16 OLED Core Ultra 9 / RTX 4080",
    slug: "asus-rog-zephyrus-g16-oled-rtx4080",
    brand: "ASUS",
    categoryId: "laptops",
    categoryName: "Ноутбуки",
    priceUzs: 32500000,
    oldPriceUzs: 34900000,
    rating: 4.7,
    reviewsCount: 19,
    stock: 4,
    isPopular: true,
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Тонкий премиальный игровой ноутбук с потрясающим 2.5K 240Hz ROG Nebula OLED экраном и алюминиевым корпусом Slash Lighting.",
    features: ["Intel Core Ultra 9 185H", "NVIDIA GeForce RTX 4080 12GB", "Экран OLED 240Hz 0.2ms", "Толщина всего 1.49 см"],
    attributes: [
      { name: "Диагональ", value: "16.0 дюймов OLED 240Hz", group: "Экран" },
      { name: "Процессор", value: "Intel Core Ultra 9 185H", group: "Производительность" },
      { name: "Видеокарта", value: "NVIDIA RTX 4080 12 ГБ", group: "Производительность" },
      { name: "Оперативная память", value: "32 ГБ LPDDR5X", group: "Память" },
      { name: "Накопитель", value: "1 ТБ NVMe PCIe 4.0", group: "Память" }
    ]
  },
  {
    id: "prod-5",
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    slug: "sony-wh-1000xm5-black",
    brand: "Sony",
    categoryId: "headphones",
    categoryName: "Аудио & Наушники",
    priceUzs: 4200000,
    oldPriceUzs: 4600000,
    rating: 4.9,
    reviewsCount: 52,
    stock: 12,
    isPopular: true,
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Лучшее в индустрии активное шумоподавление с двумя процессорами и 8 микрофонами. Безупречный звук высокого разрешения LDAC.",
    features: ["Шумоподавление Auto NC Optimizer", "До 30 часов автономной работы", "Поддержка LDAC Hi-Res Audio", "Удобная мягкая посадка"],
    attributes: [
      { name: "Тип конструкции", value: "Полноразмерные беспроводные", group: "Общие" },
      { name: "Шумоподавление", value: "Активное (ANC)", group: "Аудио" },
      { name: "Время работы", value: "До 30 ч (ANC вкл) / До 40 ч (выкл)", group: "Питание" },
      { name: "Разъем", value: "USB Type-C + 3.5mm jack", group: "Подключение" }
    ]
  },
  {
    id: "prod-6",
    name: "Apple AirPods Pro 2 с кейсом MagSafe (USB-C)",
    slug: "apple-airpods-pro-2-usb-c",
    brand: "Apple",
    categoryId: "headphones",
    categoryName: "Аудио & Наушники",
    priceUzs: 3100000,
    oldPriceUzs: 3450000,
    rating: 4.9,
    reviewsCount: 78,
    stock: 20,
    isPopular: true,
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Чип H2, адаптивное аудио, активное шумоподавление в 2 раза эффективнее и защита от пыли и воды по стандарту IP54.",
    features: ["Чип H2", "Режим прозрачности и адаптивное аудио", "Пространственное аудио с отслеживанием головы", "Зарядка через USB-C"],
    attributes: [
      { name: "Тип", value: "Внутриканальные TWS", group: "Общие" },
      { name: "Автономность", value: "До 6 часов (до 30 с кейсом)", group: "Питание" },
      { name: "Защита", value: "IP54", group: "Корпус" }
    ]
  },
  {
    id: "prod-7",
    name: "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium",
    slug: "apple-watch-ultra-2-titanium",
    brand: "Apple",
    categoryId: "smart-watches",
    categoryName: "Смарт-часы",
    priceUzs: 10400000,
    oldPriceUzs: 11200000,
    rating: 4.9,
    reviewsCount: 22,
    stock: 6,
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Экстремально прочные смарт-часы в титановом корпусе 49 мм с самым ярким дисплеем в истории Apple (3000 нит) и двухчастотным GPS.",
    features: ["Дисплей 3000 нит", "До 72 часов в режиме энергосбережения", "Глубиномер до 40 м", "Титановый корпус"],
    attributes: [
      { name: "Размер корпуса", value: "49 мм", group: "Корпус" },
      { name: "Материал", value: "Титан", group: "Корпус" },
      { name: "Связь", value: "GPS + Cellular", group: "Связь" },
      { name: "Автономность", value: "До 36 часов (до 72 в энергосбережении)", group: "Питание" }
    ]
  },
  {
    id: "prod-8",
    name: "Apple iPad Pro 13\" M4 256GB Wi-Fi Space Black",
    slug: "apple-ipad-pro-13-m4-space-black",
    brand: "Apple",
    categoryId: "tablets",
    categoryName: "Планшеты",
    priceUzs: 17200000,
    oldPriceUzs: 18500000,
    rating: 4.8,
    reviewsCount: 16,
    stock: 5,
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Невероятно тонкий 5.1 мм планшет с прорывным чипом Apple M4 и революционным двухслойным дисплеем Ultra Retina XDR Tandem OLED.",
    features: ["Чип Apple M4", "Дисплей Tandem OLED 13\"", "Толщина всего 5.1 мм", "Поддержка Apple Pencil Pro"],
    attributes: [
      { name: "Экран", value: "13 дюймов Ultra Retina XDR OLED", group: "Экран" },
      { name: "Процессор", value: "Apple M4", group: "Производительность" },
      { name: "Память", value: "256 ГБ", group: "Память" },
      { name: "Толщина", value: "5.1 мм", group: "Габариты" }
    ]
  }
];

export const BRANDS = ["Apple", "Samsung", "ASUS", "Sony", "Xiaomi", "Lenovo"];
