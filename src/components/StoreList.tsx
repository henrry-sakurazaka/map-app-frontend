import React from "react";
import { useMapStore } from "../context/StateContext";
import html2canvas from "html2canvas";
import type { Store } from "../types/store";


type OGPData = {
  title: string;
  description: string;
  image: string;
  url: string;
  ogp?: OGPData;
};

const sampleStores: Store[] = [
  {
    id: 1001,
    name: "サンプルカフェ",
    address: "東京都千代田区丸の内1-1-1",
    latitude: 35.681236,   // 緯度
    longitude: 139.767125, // 経度
    website: "https://example.com/cafe",
    ogp: {
      title: "サンプルカフェ - おしゃれなカフェ",
      description: "丸の内の人気カフェ。コーヒーとスイーツが美味しい！",
      image: "https://placehold.jp/150x150.png",
      url: "https://example.com/cafe"
    }
  },
  {
    id: 1002,
    name: "サンプルレストラン",
    address: "東京都中央区銀座1-1-1",
    latitude: 35.672343,
    longitude: 139.765300,
    website: "https://example.com/restaurant",
    ogp: {
      title: "サンプルレストラン - 美味しいランチ",
      description: "銀座でランチならここ。シェフおすすめのメニューが豊富。",
      image: "https://placehold.jp/150x150.png",
      url: "https://example.com/restaurant"
    }
  }
];


const StoreList: React.FC = () => {
  const { stores, selectedStore, setSelectedStore, loading, ogpData, setOgpData } = useMapStore();
  const allStores = [...sampleStores, ...stores];

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

  const fetchOgp = async (url: string) => {
    const res = await fetch(`/api/ogp_preview?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    setOgpData(data);
  }

  const handleCopyMapImage = async () => {
    const target = document.getElementById("share-target");
    if (!target) {
      alert("コピー対象が見つかりません。");
      return;
    }

    try {
      const canvas = await html2canvas(target, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        scale: 2,
      });

      // --- Clipboard API 対応チェック ---
      if (navigator.clipboard && window.ClipboardItem) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;

          try {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            alert("地図+OGP画像をクリップボードにコピーしました!");
          } catch (err) {
            fallbackDownload(canvas);
          }
        });
      } else {
        // Clipboard API が使えない場合はダウンロードにフォールバック
        fallbackDownload(canvas);
      }

    } catch (err) {
      console.error("html2canvas で失敗:", err);
      alert("コピーに失敗しました");
    }
  };

// --- ダウンロードにフォールバック ---
  const fallbackDownload = (canvas: HTMLCanvasElement) => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "map_ogp.png";
    link.click();
    alert("Clipboard API非対応のため、画像をダウンロードしました。");
  };

  const handleClick = async (store: Store) => {
    // 店舗を選択状態にする
    setSelectedStore(store);

    // ✅ もしクリックされた店舗が sampleStores 内に存在するなら
    const isSampleStore = sampleStores.some(s => s.id === store.id);

    if (isSampleStore && store.ogp) {
      // サンプルデータは即 OGP 表示（fetch不要）
      setOgpData(store.ogp as OGPData);
      return; // ここで終了（余計なAPI呼び出しを防ぐ）
    }

    // ✅ OGPを持っていればセット
    if (store.ogp) {
      setOgpData(store.ogp as OGPData);
    } 
    // ✅ ウェブサイトがない場合のみDuckDuckGoとOGP取得
    else if (!store.website) {
      const site = await fetchWebsiteFromDuckDuckGo(store.name);
      if (site) {
        fetchOgp(site);
        setSelectedStore({ ...store, website: site });
      } else {
        setOgpData(null);
      }
    } else {
      // それ以外はOGPなし
      setOgpData(null);
    }
  };

  
  const handleBack = () => {
    setSelectedStore(null);
  };

 
  return (
    <div className="lg:w-1/3 bg-gray-100 p-4 rounded-xl shadow-lg h-[60vh] lg:h-[70vh] overflow-y-auto">
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
                 {/* --- ✅ シェアボタン --- */}
                <div className="flex justify-end mt-4 px-2">
                  <button
                    onClick={handleCopyMapImage}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                  >
                    地図+OGPをコピー
                  </button>
                </div>
              </div>
              {ogpData ? (
                  <div className="mt-4 border rounded-lg p-3 bg-white shadow">
                    {ogpData.image && (
                      <img src={ogpData.image} alt={ogpData.title} className="rounded mb-2" />
                    )}
                    <h3 className="font-semibold">{ogpData.title}</h3>
                    <p className="text-sm text-gray-600">{ogpData.description}</p>
                    <a
                      href={ogpData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline text-sm"
                    >
                      サイトを開く →
                    </a>
                  </div>
                ):(
                    <p className="text-gray-400 text-sm mt-4">OGPデータなし</p>       
                )  
              }     
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
                  allStores.map((store) => (
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
