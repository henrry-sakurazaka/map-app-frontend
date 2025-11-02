import React from "react";
import { useMapStore } from "../context/StateContext";
import type { Store } from "../types/store";

const StoreList: React.FC = () => {
  const { stores, selectedStore, setSelectedStore, loading } = useMapStore();

  const fetchWebsiteFromDuckDuckGo = async (storeName: string): Promise<string | null> => {
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(storeName)}&format=json`);
    const data = await res.json();
    if (data?.AbstractURL) return data.AbstractURL;
    if (data?.RelatedTopics?.[0]?.FirstURL) return data.RelatedTopics[0].FirstURL;
    return null;
  } catch (err) {
    console.error("DuckDuckGo検索失敗:", err);
    return null;
  }
};

  const handleClick = async (store: Store) => {
      if (store) {
        setSelectedStore(store);
      }  
      if (!store.website) {
        const site = await fetchWebsiteFromDuckDuckGo(store.name);
      if (site) {
        setSelectedStore({ ...store, website: site });
      }
    }
  };

  const handleBack = () => {
    setSelectedStore(null);
  };

  return (
    <div className="lg:w-1/3 bg-gray-100 p-4 rounded-xl shadow-lg h-[60vh] lg:h-[70vh] overflow-y-auto">
      {/* --- 詳細ビュー --- */}
      {selectedStore ? (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            店舗詳細
          </h2>
          <div className="p-3 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg text-blue-600 mb-2">
              {selectedStore.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {selectedStore.address}
            </p>
            {selectedStore.website ? (
              <a
                href={selectedStore.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                公式サイトを開く
              </a>
            ) : (
              <p className="text-gray-400 text-sm">サイト情報なし</p>
            )}
          </div>

          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            一覧に戻る
          </button>
        </div>
      ) : (
        /* --- 一覧ビュー --- */
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2 text-center">
            店舗一覧
          </h2>
          {stores.length === 0 ? (
            <p className="text-blue-400 italic text-center">
              {loading ? "店舗データを読み込み中…" : "店舗データがありません"}
            </p>
          ) : (
            stores.map((store) => (
              <div
                key={store.id}
                className="p-3 mb-2 border border-gray-100 bg-white rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer"
                onClick={() => handleClick(store)}
              >
                <h3 className="font-bold text-lg text-blue-600">{store.name}</h3>
                <p className="text-sm text-gray-500">{store.address}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StoreList;
