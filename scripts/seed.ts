import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { CATEGORIES, MOCK_PRODUCTS } from "../src/lib/mock-data";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ Ошибка: Переменная DATABASE_URL не найдена в .env.local!");
    console.log("👉 Добавьте DATABASE_URL=postgresql://... в файл .env.local для наполнения базы Neon.");
    process.exit(1);
  }

  console.log("🚀 Подключение к Neon PostgreSQL...");
  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  console.log("📦 Наполнение категорий...");
  for (const cat of CATEGORIES) {
    await db
      .insert(schema.categories)
      .values({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        itemCount: cat.itemCount,
      })
      .onConflictDoNothing();
  }

  console.log("📱 Наполнение товаров и характеристик...");
  for (const p of MOCK_PRODUCTS) {
    await db
      .insert(schema.products)
      .values({
        id: p.id,
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        categoryId: p.categoryId,
        priceUzs: p.priceUzs,
        oldPriceUzs: p.oldPriceUzs,
        rating: p.rating.toString(),
        reviewsCount: p.reviewsCount,
        stock: p.stock,
        isNew: p.isNew,
        isFeatured: p.isFeatured,
        isPopular: p.isPopular,
        images: p.images,
        description: p.description,
        features: p.features,
      })
      .onConflictDoNothing();

    for (const attr of p.attributes) {
      await db.insert(schema.productAttributes).values({
        productId: p.id,
        name: attr.name,
        value: attr.value,
        group: attr.group,
      });
    }
  }

  console.log("✅ База данных Neon успешно наполнена всеми тестовыми товарами и категориями!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Ошибка при выполнении seed-скрипта:", err);
  process.exit(1);
});
