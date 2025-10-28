import React, { useState } from "react";
import L from "leaflet";
import { MapProvider, useMapStore } from "./context/StateContext";
import StoreList from "./components/StoreList";
import MapCanvas from "./components/MapCanvas";
import { fetchCoordinates } from "./hooks/useGeocode";
import "./index.css";

const AppInner: React.FC = () => {
  const [region, setRegion] = useState<string>("");
  const { mapInstance } = useMapStore();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = region.trim();
    if (!q) return;

    try {
      const normalizedQuery = normalizeQuery(q);
      const result = await fetchCoordinates(normalizedQuery);

      if (!result) {
        alert("地域を特定できませんでした。");
        return;
      }

      if (!mapInstance) {
        alert("地図の初期化が完了していません。");
        return;
      }

      const lat = Number(result.lat);
      const lon = Number(result.lon);

      if (isNaN(lat) || isNaN(lon)) {
        alert("位置情報の取得に失敗しました。");
        return;
      }

      // 既存のマーカーを削除
      mapInstance.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) mapInstance.removeLayer(layer);
      });

      // 新しいマーカーを追加
      L.marker([lat, lon]).addTo(mapInstance);

      // 地図を検索地点に移動
      const zoomLevel = 18;
      mapInstance.setView([lat, lon], zoomLevel);
    } catch (err) {
      console.error("検索エラー:", err);
      alert("検索中にエラーが発生しました。時間をおいて再度お試しください。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-inter">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-800">
          店舗検索マップ
        </h1>
      </header>

      {/* 検索フォーム */}
      <div className="flex flex-col items-center mt-4 space-y-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 w-full max-w-xl mx-auto"
    >
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="住所または地域名（例：渋谷区神南2-2-1）を入力"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            検索
          </button>
        </form>
      </div>

      {/* メイン */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        <StoreList />
        <MapCanvas />
      </div>
    </div>
  );
};

// normalizeQuery は東京都を勝手に追加しない
function normalizeQuery(q: string): string {
  const hasPrefecture = /(都|道|府|県)/.test(q);
  const hasCountry = /(日本|Japan)/i.test(q);

  if (!hasPrefecture && !hasCountry) {
    // 東京を自動付加せず入力文字列のまま検索
    return q;
  }
  return q;
}

const App: React.FC = () => (
  <MapProvider>
    <AppInner />
  </MapProvider>
);

export default App;
