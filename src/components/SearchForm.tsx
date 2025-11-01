import React, { useState } from "react";
import { useMapStore } from "../context/StateContext";
import type { Store } from "../types/store";

interface SearchFormProps {
  onSearch: (lat: number, lon: number) => void;
}

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setStores } = useMapStore();

  // 🗾 国土地理院API
  const searchGSI = async (query: string): Promise<LocationResult[]> => {
    try {
      console.log("🗾 国土地理院API検索:", query);
      const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("GSI request failed");
      const data = await res.json();
      return data.map((item: any) => ({
        display_name: item.properties.title,
        lat: item.geometry.coordinates[1].toString(),
        lon: item.geometry.coordinates[0].toString(),
      }));
    } catch (err) {
      console.error("GSI検索エラー:", err);
      return [];
    }
  };

  // 🌍 Nominatim（フォールバック）
  const searchNominatim = async (query: string): Promise<LocationResult[]> => {
    try {
      console.log("🌍 Nominatim検索:", query);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=jp&addressdetails=1&limit=5&accept-language=ja`;
      const res = await fetch(url, { headers: { "Accept-Language": "ja" } });
      if (!res.ok) throw new Error("Nominatim request failed");
      const data = await res.json();
      return data.map((item: any) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch (err) {
      console.error("Nominatim検索エラー:", err);
      return [];
    }
  };

  // 🏠 Reverse Geocode API (Rails経由)
  const fetchAddress = async (lat: number, lon: number): Promise<string> => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
      console.warn("⚠️ VITE_API_BASE_URL が設定されていません");
      return "住所不明";
    }

    const url = `${baseUrl}/api/reverse-geocode?lat=${lat}&lon=${lon}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Reverse geocode failed (${res.status})`);
      const data = await res.json();
      const addr = data.address;
      if (addr) {
        const parts = [
          addr.state,
          addr.city,
          addr.town || addr.village,
          addr.suburb || addr.neighbourhood,
          addr.road,
          addr.house_number,
        ].filter(Boolean);
        return parts.join(" ");
      }
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
    }
    return "住所不明";
  };

  // 🛰️ Overpass API
  const fetchOverpassPOIs = async (lat: number, lon: number, radius = 500) => {
    const query = `
      [out:json][timeout:25];
      (
        node["shop"](around:${radius},${lat},${lon});
        node["amenity"~"cafe|restaurant|bar|fast_food"](around:${radius},${lat},${lon});
      );
      out center;
    `;
    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });
      if (!res.ok) throw new Error("Overpass API request failed");

      const json = await res.json();
      return (
        json.elements
          ?.map((el: any) => ({
            ...el,
            lat: el.lat || el.center?.lat,
            lon: el.lon || el.center?.lon,
            tags: el.tags || {},
          }))
          .filter((el: any) => el.lat && el.lon) || []
      );
    } catch (err) {
      console.error("Overpass取得エラー:", err);
      return [];
    }
  };

  // 🔍 検索処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!input.trim()) return;
    setLoading(true);

    try {
      let query = input.trim();
      if (!query.includes("中央区") && !query.includes("福岡市")) {
        query = "福岡市中央区 " + query;
      }

      let data = await searchGSI(query);
      if (data.length === 0) data = await searchNominatim(query);

      if (data.length === 0) {
        setError("地域を特定できませんでした。");
        return;
      }

      const first = data[0];
      const lat = parseFloat(first.lat);
      const lon = parseFloat(first.lon);

      if (isNaN(lat) || isNaN(lon)) {
        console.error("❌ 緯度経度が不正:", first);
        setError("座標の取得に失敗しました。");
        return;
      }

      console.log("✅ 検索成功:", first.display_name, lat, lon);
      onSearch(lat, lon);

      const pois = await fetchOverpassPOIs(lat, lon);
      console.log("🟢 Overpass POIs:", pois.length);

      const stores: Store[] = await Promise.all(
        pois.slice(0, 20).map(async (poi: any, idx: number) => {
          const name = poi.tags.name || poi.tags.brand || "名称不明";
          const address =
            poi.tags["addr:full"] ||
            poi.tags["addr:street"] ||
            (await fetchAddress(poi.lat, poi.lon));

          return {
            id: idx + 1,
            name,
            latitude: poi.lat,
            longitude: poi.lon,
            address,
          };
        })
      );

      setStores(stores);
    } catch (err) {
      console.error("❌ handleSubmit Error:", err);
      setError("検索中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mt-6 mb-8">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="地域名を入力（例: 東京都千代田区丸の内）"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-[480px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white px-4 py-2 rounded-lg transition`}
        >
          {loading ? "検索中…" : "検索"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SearchForm;
