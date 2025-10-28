// src/hooks/useGeocode.ts
export type GeocodeResult = {
  lat: number;
  lon: number;
  // Leaflet の fitBounds に渡せる形にしておく ([southWest, northEast])
  // [[south, west], [north, east]]
  bbox?: [[number, number], [number, number]];
  displayName: string;
};

export async function fetchCoordinates(rawQuery: string): Promise<GeocodeResult | null> {
  const query = normalizeJapaneseQuery(rawQuery);
  if (!query) return null;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2"); // jsonv2 のほうが扱いやすい
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "jp"); // 日本に限定

  const res = await fetch(url.toString(), {
    headers: {
      "Accept": "application/json",
      // Nominatim 利用時は User-Agent を入れるのがマナー
      "User-Agent": "map-app/1.0 (your-email@example.com)"
    }
  });

  if (!res.ok) return null;
  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    // フォールバック: クエリに国名を追加して再検索（番地のみ入力時に有効）
    if (!/, ?(日本|Japan)$/i.test(query)) {
      return await fetchCoordinates(query + ", 日本");
    }
    return null;
  }

  const item = data[0];
  const lat = parseFloat(item.lat);
  const lon = parseFloat(item.lon);

  // Nominatim の boundingbox は文字列配列: [south, north, west, east]
  let bbox: GeocodeResult["bbox"] | undefined = undefined;
  if (Array.isArray(item.boundingbox) && item.boundingbox.length >= 4) {
    // parseFloat して [[south, west], [north, east]] の形にする
    const south = parseFloat(item.boundingbox[0]);
    const north = parseFloat(item.boundingbox[1]);
    const west  = parseFloat(item.boundingbox[2]);
    const east  = parseFloat(item.boundingbox[3]);
    if (!Number.isNaN(south) && !Number.isNaN(north) && !Number.isNaN(west) && !Number.isNaN(east)) {
      bbox = [[south, west], [north, east]];
    }
  }

  return {
    lat,
    lon,
    bbox,
    displayName: item.display_name ?? ""
  };
}

/** normalizeJapaneseQuery:
 * - 全角数字→半角
 * - 番地だけっぽければ ", 日本" を追加して精度を上げる
 */
function normalizeJapaneseQuery(q: string): string {
  const t = q.trim();
  if (!t) return "";

  // 全角数字→半角
  const half = t.replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xFEE0));

  // 番地っぽい (e.g. "2-24-3" や "2丁目") かつ市区町村等が含まれない場合は国名を補完
  const looksLikeBanchi = /(\d+[-丁目]\d+)|\d+\s*-\s*\d+/.test(half);
  const hasPlaceWord = /(都|道|府|県|市|区|町|村|丁目)/.test(half);

  if (looksLikeBanchi && !hasPlaceWord && !/(日本|Japan)/i.test(half)) {
    return `${half}, 日本`;
  }
  return half;
}
