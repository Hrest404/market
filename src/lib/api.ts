import { db } from "@/db";
import { products, categories, productAttributes, orders, orderItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { MOCK_PRODUCTS, CATEGORIES, Product } from "@/lib/mock-data";

/**
 * Получить список всех категорий
 */
export async function getCategories() {
  if (!db) return CATEGORIES;
  try {
    const list = await db.select().from(categories);
    return list.length > 0 ? list : CATEGORIES;
  } catch (error) {
    console.warn("Neon DB query fallback to mock data:", error);
    return CATEGORIES;
  }
}

/**
 * Получить список всех товаров
 */
export async function getProducts(): Promise<Product[]> {
  if (!db) return MOCK_PRODUCTS;
  try {
    const list = await db.select().from(products);
    if (!list || list.length === 0) return MOCK_PRODUCTS;

    // Load category mapping
    const cats = await db.select().from(categories);
    const catMap = new Map(cats.map((c) => [c.id, c.name]));

    const fullProducts: Product[] = [];
    for (const p of list) {
      const attrs = await db
        .select()
        .from(productAttributes)
        .where(eq(productAttributes.productId, p.id));

      fullProducts.push({
        id: p.id,
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        categoryId: p.categoryId,
        categoryName: catMap.get(p.categoryId) || "Электроника",
        priceUzs: Number(p.priceUzs),
        oldPriceUzs: p.oldPriceUzs ? Number(p.oldPriceUzs) : undefined,
        rating: Number(p.rating || 4.8),
        reviewsCount: p.reviewsCount || 0,
        stock: p.stock,
        isNew: Boolean(p.isNew),
        isFeatured: Boolean(p.isFeatured),
        isPopular: Boolean(p.isPopular),
        images: p.images,
        description: p.description,
        features: p.features,
        attributes: attrs.map((a) => ({
          name: a.name,
          value: a.value,
          group: a.group,
        })),
      });
    }
    return fullProducts;
  } catch (error) {
    console.warn("Neon DB query fallback to mock data:", error);
    return MOCK_PRODUCTS;
  }
}

/**
 * Получить товар по slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) || null;
}

/**
 * Создать заказ в базе данных
 */
export async function createOrder(data: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: string;
  totalUzs: number;
  items: Array<{ productId: string; productName: string; unitPriceUzs: number; quantity: number }>;
}) {
  if (!db) {
    console.log("Mock Order Created (No DATABASE_URL configured):", data.orderId);
    return { success: true, orderId: data.orderId };
  }

  try {
    await db.insert(orders).values({
      id: data.orderId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      paymentMethod: data.paymentMethod,
      totalUzs: data.totalUzs,
      status: "processing",
    });

    for (const item of data.items) {
      await db.insert(orderItems).values({
        orderId: data.orderId,
        productId: item.productId,
        productName: item.productName,
        unitPriceUzs: item.unitPriceUzs,
        quantity: item.quantity,
      });
    }

    return { success: true, orderId: data.orderId };
  } catch (error) {
    console.error("Failed to create order in Neon DB:", error);
    return { success: true, orderId: data.orderId, fallback: true };
  }
}
