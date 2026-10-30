import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const cleanQuery = q.trim();

  try {
    // 1. Поиск через быстрый Photon Geocoder с фокусом на Ташкент и Узбекистан
    const photonUrl = new URL("https://photon.komoot.io/api/");
    photonUrl.searchParams.set("q", cleanQuery);
    // Bbox Ташкента
    photonUrl.searchParams.set("bbox", "69.10,41.15,69.50,41.45");
    photonUrl.searchParams.set("lat", "41.3111");
    photonUrl.searchParams.set("lon", "69.2797");
    photonUrl.searchParams.set("limit", "8");

    const photonRes = await fetch(photonUrl.toString(), {
      headers: {
        "User-Agent": "ApexTechDelivery/1.0",
      },
    });

    if (photonRes.ok) {
      const photonData = await photonRes.json();
      if (photonData.features && photonData.features.length > 0) {
        const results = photonData.features.map((f: any, idx: number) => {
          const p = f.properties || {};
          const coords = f.geometry?.coordinates || [69.2797, 41.3111];
          
          const street = p.street || "";
          const housenumber = p.housenumber ? `д. ${p.housenumber}` : "";
          const district = (p.district && !p.district.includes("?")) ? p.district : (p.locality || "");
          const title = p.name || [street, housenumber].filter(Boolean).join(", ") || cleanQuery;
          const subtitle = [district, "Ташкент"].filter(Boolean).join(", ");
          const formattedAddress = [title, district, "г. Ташкент"].filter(Boolean).join(", ");

          return {
            id: `ph_${p.osm_id || idx}`,
            lat: coords[1],
            lon: coords[0],
            title,
            subtitle: subtitle || "г. Ташкент",
            formattedAddress,
          };
        });

        return NextResponse.json({ results });
      }
    }
  } catch (err) {
    console.warn("Photon search fallback:", err);
  }

  // 2. Резервный поиск через Nominatim
  try {
    const nominatimUrl = new URL("https://nominatim.openstreetmap.org/search");
    nominatimUrl.searchParams.set("q", `${cleanQuery}, Ташкент`);
    nominatimUrl.searchParams.set("format", "json");
    nominatimUrl.searchParams.set("addressdetails", "1");
    nominatimUrl.searchParams.set("countrycodes", "uz");
    nominatimUrl.searchParams.set("limit", "6");
    nominatimUrl.searchParams.set("accept-language", "ru,uz");

    const res = await fetch(nominatimUrl.toString(), {
      headers: {
        "User-Agent": "ApexTechStoreDelivery/1.0 (info@apextech.uz)",
      },
    });

    if (res.ok) {
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
    }
  } catch (err) {
    console.error("Nominatim search error:", err);
  }

  return NextResponse.json({ results: [] });
}
