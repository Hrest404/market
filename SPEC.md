# SPEC — Техническая спецификация

## 1. Предлагаемый стек
- Next.js + TypeScript.
- Tailwind CSS и shadcn/ui для базовых доступных компонентов; внешний вид существенно кастомизировать.
- Neon PostgreSQL как база данных.
- Drizzle ORM для схемы и миграций (Prisma допустима как альтернатива, но выбрать один ORM).
- Auth.js или другой совместимый проверенный слой авторизации для email/password и Google. До начала разработки проверить актуальную конфигурацию и поддержку выбранных провайдеров.
- Zod для проверки данных на сервере.
- YooMoney — только тестовый сценарий, доступный выбранному типу интеграции.
- Vitest для логики и Playwright для основных пользовательских сценариев.

## 2. Страницы и маршруты
- `/` — главная, промо-блок и подборки.
- `/catalog` — каталог, поиск, фильтры и сортировка.
- `/category/[slug]` — категория.
- `/product/[slug]` — динамическая страница товара.
- `/compare` — сравнение.
- `/favorites` — избранное.
- `/cart` — корзина.
- `/checkout` — контактные данные и подтверждение заказа.
- `/checkout/result` — результат тестовой оплаты.
- `/login`, `/register` — авторизация.
- `/account` — профиль и список заказов (минимальная версия).
- `/admin` — только если реализована защищённая роль администратора; иначе управление через seed-данные на старте.

## 3. Модель данных
### `users`
- `id` UUID primary key
- `name` nullable text
- `email` unique text
- `created_at` timestamp

### `accounts` / `sessions`
Использовать структуру, требуемую выбранным провайдером авторизации; не изобретать собственный формат OAuth.

### `categories`
- `id` UUID
- `name` text
- `slug` unique text
- `parent_id` nullable UUID
- `sort_order` integer

### `products`
- `id` UUID
- `category_id` UUID
- `name` text
- `slug` unique text
- `brand` text
- `description` text
- `price_uzs` bigint/integer
- `old_price_uzs` nullable bigint/integer
- `stock_quantity` integer
- `is_active` boolean
- `is_featured` boolean
- `created_at`, `updated_at` timestamps

### `product_images`
- `id` UUID
- `product_id` UUID
- `url` text
- `alt` text
- `sort_order` integer

### `product_attributes`
- `id` UUID
- `product_id` UUID
- `name` text
- `value` text
- `group_name` text
- `sort_order` integer

### `favorites`
- `user_id` UUID
- `product_id` UUID
- `created_at` timestamp
- unique (`user_id`, `product_id`)

### `orders`
- `id` UUID
- `user_id` nullable UUID (если разрешён гостевой заказ)
- `order_number` unique text
- `status` enum/text: `pending_payment`, `paid`, `payment_failed`, `cancelled`
- `currency` text default `UZS`
- `subtotal_uzs` bigint/integer
- `delivery_fee_uzs` bigint/integer default 0
- `total_uzs` bigint/integer
- `customer_name`, `customer_phone`, `delivery_address` text
- `created_at`, `updated_at` timestamps

### `order_items`
- `id` UUID
- `order_id` UUID
- `product_id` UUID
- `product_name_snapshot` text
- `unit_price_uzs` bigint/integer
- `quantity` integer
- `line_total_uzs` bigint/integer

### `payments`
- `id` UUID
- `order_id` UUID
- `provider` text
- `provider_payment_id` nullable text
- `status` text: `pending`, `succeeded`, `cancelled`, `failed`
- `amount_uzs` bigint/integer
- `created_at`, `updated_at` timestamps

### Корзина и сравнение
Для MVP корзина и сравнение могут храниться на клиенте в localStorage для гостей; сервер всё равно перепроверяет товар, цену и остатки при оформлении. Если понадобится синхронизация между устройствами, добавить таблицы `carts` и `cart_items`. Избранное вошедшего пользователя хранить в Neon.

## 4. Основные правила
- Все цены хранить целыми числами в сумах, не использовать float для денег.
- Итог заказа вычисляет сервер на основе актуальных цен из базы.
- Ввод пользователя проверять на сервере схемами Zod.
- Запросы к базе выполнять через серверный слой; секреты не отправлять в браузер.
- Для списка товаров предусмотреть пагинацию.
- Сортировка должна использовать белый список допустимых полей, а не произвольный SQL из URL.
- Slug уникален; товар открывается по slug.
- Неактивные товары не отображать в публичном каталоге.
- Остаток проверять атомарно при оформлении заказа, чтобы избежать заказа последней единицы дважды.
- Все изменения статуса оплаты должны происходить на сервере после подтверждения провайдера.
- Повторные уведомления об оплате не должны создавать повторный заказ или повторно списывать товар (идемпотентность).

## 5. Структура проекта (ориентир)
```text
app/
  page.tsx
  catalog/page.tsx
  category/[slug]/page.tsx
  product/[slug]/page.tsx
  compare/page.tsx
  favorites/page.tsx
  cart/page.tsx
  checkout/page.tsx
  checkout/result/page.tsx
  login/page.tsx
  register/page.tsx
  account/page.tsx
  api/
components/
  layout/
  product/
  catalog/
  cart/
  compare/
  favorites/
  ui/
lib/
  auth/
  db/
  payments/
  validations/
  format/
drizzle/
  schema.ts
  migrations/
scripts/
  seed.ts
tests/
```

## 6. Серверные действия / API
- Получить каталог с фильтрами, сортировкой и страницами.
- Получить товар по slug.
- Добавить/удалить избранное (только для вошедшего пользователя).
- Создать заказ после проверки данных, цены и остатков.
- Создать платёж для заказа через серверный модуль.
- Обработать callback/webhook, если это поддерживает выбранная схема YooMoney.
- Получить статус заказа и платежа с проверкой доступа.
- Не принимать с клиента итоговую цену как доверенное значение.

## 7. UX и дизайн-система
- Базовая сетка: 12 колонок на широком экране, 6 на планшете, 2–4 на телефоне в зависимости от ширины.
- Bento Grid: одна большая выделенная карточка в промо-секции и обычная равномерная сетка в основном каталоге. Не менять размеры случайно на каждой строке.
- Карточка: фото с единым контейнером, название, ключевая характеристика, цена, доступность и кнопки.
- Изображения техники показывать на чистом фоне; сохранить одинаковые пропорции и поля вокруг товара.
- Фильтры на десктопе — боковая панель или компактная верхняя строка; на телефоне — выдвижная панель.
- Состояния: загрузка, нет результатов, ошибка, товар закончился, добавлено в избранное, добавлено в корзину.
- Использовать один набор иконок и одну систему размеров.
- Анимации короткие и функциональные; уважать `prefers-reduced-motion`.
- Не делать все элементы фиолетовыми: акцент применять точечно.

## 8. Безопасность
- Секреты: `DATABASE_URL`, секрет авторизации, Google OAuth secret и секреты платёжной интеграции — только в локальном `.env.local` и в секретах хостинга.
- Добавить `.env.example` только с названиями переменных и фиктивными значениями.
- `.env.local` добавить в `.gitignore`.
- Защитить страницы аккаунта и административные действия на сервере.
- Ограничить частоту запросов входа/регистрации и обработки платежей при необходимости.
- Не хранить данные банковских карт. Использовать платёжную страницу/механизм провайдера.
- Не считать query-параметр `success=true` доказательством оплаты.

## 9. Тестирование
- Проверить сортировку по возрастанию и убыванию цены.
- Проверить фильтрацию и поиск без результатов.
- Проверить страницу несуществующего slug (404).
- Проверить добавление/удаление из сравнения и избранного.
- Проверить изменение количества и правильность суммы корзины.
- Проверить отказ при недостаточном остатке.
- Проверить недоступность приватных страниц без входа.
- Проверить тестовые статусы платежа и повторный callback.
- Проверить мобильную ширину и навигацию с клавиатуры.
