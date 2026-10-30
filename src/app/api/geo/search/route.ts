import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // 1. Поиск по Nominatim с фокусом на Узбекистан и Ташкент
    const nominatimUrl = new URL("https://nominatim.openstreetmap.org/search");
    nominatimUrl.searchParams.set("q", `${q}, Ташкент`);
    nominatimUrl.searchParams.set("format", "json");
    nominatimUrl.searchParams.set("addressdetails", "1");
    nominatimUrl.searchParams.set("countrycodes", "uz");
    nominatimUrl.searchParams.set("limit", "6");
    nominatimUrl.searchParams.set("accept-language", "ru,uz");

    const res = await fetch(nominatimUrl.toString(), {
      headers: {
        "User-Agent": "ApexTechStoreDelivery/1.0 (contact: info@apextech.uz)",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Nominatim error: ${res.status}`);
    }

    const data = await res.json();

    const results = data.map((item: any) => {
      const addr = item.address || {};
      const street = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || "";
      const house = addr.house_number ? `д. ${addr.house_number}` : "";
      const district = addr.city_district || addr.suburb || "";
      
      const title = item.name || [street, house].filter(Boolean).join(", ") || item.display_name.split(",")[0];
      const subtitle = [district, "Ташкент"].filter(Boolean).join(", ") || item.display_name;

      return {
        id: item.place_id,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        title,
        subtitle: item.display_name,
        formattedAddress: [title, district, "г. Ташкент"].filter(Boolean).join(", "),
      };
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Geocoding search error:", error);
    return NextResponse.json({ results: [] });
  }
}
