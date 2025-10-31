import React, { useState } from "react";

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

  // 🗾 国土地理院API（第一優先）
  const searchGSI = async (query: string): Promise<LocationResult[]> => {
    console.log("🗾 国土地理院API検索:", query);
    const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("GSI request failed");

    const data = await res.json();
    return data.map((item: any) => ({
      display_name: item.properties.title,
      lat: item.geometry.coordinates[1].toString(),
      lon: item.geometry.coordinates[0].toString(),
    }));
  };

  // 🌏 Nominatim（フォールバック）
  const searchNominatim = async (query: string): Promise<LocationResult[]> => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!input.trim()) return;

    setLoading(true);
    let query = input.trim();

    try {
      // ✅ 入力補助：「中央区」などがなければ補う
      if (!query.includes("中央区") && !query.includes("福岡市")) {
        query = "福岡市中央区 " + query;
      }

      // ✅ 国土地理院 → Nominatim の順で試す
      let data: LocationResult[] = await searchGSI(query);

      if (!data || data.length === 0) {
        console.log("🔄 GSIで見つからず → Nominatimへフォールバック");
        data = await searchNominatim(query);
      }

      if (data && data.length > 0) {
        const first = data[0];
        console.log("✅ 検索成功:", first.display_name);
        onSearch(parseFloat(first.lat), parseFloat(first.lon));
      } else {
        setError("地域を特定できませんでした。");
      }
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
