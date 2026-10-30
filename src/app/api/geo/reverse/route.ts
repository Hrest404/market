import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  try {
    const reverseUrl = new URL("https://nominatim.openstreetmap.org/reverse");
    reverseUrl.searchParams.set("lat", lat);
    reverseUrl.searchParams.set("lon", lon);
    reverseUrl.searchParams.set("format", "json");
    reverseUrl.searchParams.set("addressdetails", "1");
    reverseUrl.searchParams.set("accept-language", "ru,uz");

    const res = await fetch(reverseUrl.toString(), {
      headers: {
        "User-Agent": "ApexTechStoreDelivery/1.0 (contact: info@apextech.uz)",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Reverse geocoding error: ${res.status}`);
    }

    const item = await res.json();
    const addr = item.address || {};
    const street = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || "";
    const house = addr.house_number ? `д. ${addr.house_number}` : "";
    const district = addr.city_district || addr.suburb || "";

    const title = [street, house].filter(Boolean).join(", ") || item.name || item.display_name.split(",")[0];
    const formattedAddress = [title, district, "г. Ташкент"].filter(Boolean).join(", ") || item.display_name;

    return NextResponse.json({
      title,
      display_name: item.display_name,
      formattedAddress,
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return NextResponse.json({
      title: "Выбранная точка на карте",
      formattedAddress: `г. Ташкент (${parseFloat(lat).toFixed(4)}, ${parseFloat(lon).toFixed(4)})`,
    });
  }
}
