import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

async function main() {
  console.log("==================================================================");
  console.log("   APEX TECH — ПРОВЕРКА ПОДКЛЮЧЕННЫХ СЕРВИСОВ NEON (END-TO-END)   ");
  console.log("==================================================================\n");

  let allPassed = true;

  // 1. Тестирование Postgres (Lakebase Postgres)
  console.log("1. Тестирование Lakebase Postgres...");
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ DATABASE_URL отсутствует в .env.local");
    allPassed = false;
  } else {
    try {
      const sql = neon(dbUrl);
      const versionResult = await sql`SELECT version(), current_database(), current_user`;
      const categoriesResult = await sql`SELECT count(*)::int as count FROM categories`;
      const productsResult = await sql`SELECT count(*)::int as count FROM products`;

      console.log("   ✅ Соединение с Neon PostgreSQL установлено успешно!");
      console.log(`   Версия: ${versionResult[0]?.version?.slice(0, 35)}...`);
      console.log(`   Категорий в базе: ${categoriesResult[0]?.count}`);
      console.log(`   Товаров в базе: ${productsResult[0]?.count}`);
    } catch (err) {
      console.error("   ❌ Ошибка запроса к Neon Postgres:", err);
      allPassed = false;
    }
  }

  console.log("\n------------------------------------------------------------------");

  // 2. Тестирование Neon Auth (Managed Better Auth)
  console.log("2. Тестирование Neon Auth (Managed Better Auth)...");
  const authBaseUrl = process.env.NEON_AUTH_BASE_URL;
  const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
  if (!authBaseUrl || !jwksUrl) {
    console.error("❌ Переменные NEON_AUTH_* отсутствуют в .env.local");
    allPassed = false;
  } else {
    try {
      const res = await fetch(jwksUrl);
      if (res.ok) {
        const jwks = await res.json();
        console.log("   ✅ Сервис Neon Auth доступен и отвечает!");
        console.log(`   Base URL: ${authBaseUrl}`);
        console.log(`   JWKS endpoint: ${jwksUrl} (ключей: ${jwks?.keys?.length || 0})`);
      } else {
        console.error(`   ❌ Neon Auth вернул статус ${res.status}: ${res.statusText}`);
        allPassed = false;
      }
    } catch (err) {
      console.error("   ❌ Ошибка соединения с Neon Auth:", err);
      allPassed = false;
    }
  }

  console.log("\n------------------------------------------------------------------");

  // 3. Тестирование Neon Object Storage (S3 Bucket 'assets')
  console.log("3. Тестирование Neon Object Storage (Bucket: assets)...");
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "eu-central-1";

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    console.error("❌ Переменные AWS_* для Object Storage отсутствуют в .env.local");
    allPassed = false;
  } else {
    try {
      const s3 = new S3Client({
        region,
        endpoint,
        credentials: { accessKeyId, secretAccessKey },
        forcePathStyle: true,
      });

      const testKey = `test-health-${Date.now()}.txt`;
      const testContent = "Apex Tech - Neon Object Storage Verified at " + new Date().toISOString();

      // Запись файла
      await s3.send(
        new PutObjectCommand({
          Bucket: "assets",
          Key: testKey,
          Body: Buffer.from(testContent, "utf-8"),
          ContentType: "text/plain",
        })
      );
      console.log(`   ✅ Запись в бакет 'assets' успешна (Key: ${testKey})`);

      // Чтение файла
      const getRes = await s3.send(
        new GetObjectCommand({
          Bucket: "assets",
          Key: testKey,
        })
      );
      const readContent = await getRes.Body?.transformToString();
      console.log(`   ✅ Чтение из бакета 'assets' успешно: "${readContent}"`);

      // Список файлов
      const listRes = await s3.send(
        new ListObjectsV2Command({
          Bucket: "assets",
        })
      );
      console.log(`   ✅ Список объектов получен. Всего объектов в бакете: ${listRes.Contents?.length || 0}`);
    } catch (err) {
      console.error("   ❌ Ошибка работы с Neon Object Storage:", err);
      allPassed = false;
    }
  }

  console.log("\n==================================================================");
  if (allPassed) {
    console.log("🎉 ВСЕ СЕРВИСЫ NEON (POSTGRES, AUTH, OBJECT STORAGE) РАБОТАЮТ!");
  } else {
    console.log("⚠️ ОБНАРУЖЕНЫ ОШИБКИ В ОДНОМ ИЛИ НЕСКОЛЬКИХ СЕРВИСАХ NEON");
  }
  console.log("==================================================================\n");
}

main();
