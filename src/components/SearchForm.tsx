import React, { useState } from 'react';
import { useMapStore } from '../context/StateContext';
import type { Store } from '../types/store';
import type { GSIResponseItem } from '../types/types';
import type { NominatimResponseItem } from '../types/types';

interface SearchFormProps {
  onSearch: (lat: number, lon: number) => void;
}

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const {
    stores,
    setStores,
    loading,
    setLoading,
    cache,
    setCache,
    setCacheOn,
  } = useMapStore();

  // =========================================================
  // 🗾 国土地理院API
  // =========================================================
  const searchGSI = async (query: string): Promise<LocationResult[]> => {
    try {
      const url =
        `https://msearch.gsi.go.jp/address-search/AddressSearch?q=` +
        encodeURIComponent(query);

      const res = await fetch(url);

      if (!res.ok) {
        return [];
      }

      const data: GSIResponseItem[] = await res.json();

      return data.map((item) => ({
        display_name: item.properties.title,
        lat: item.geometry.coordinates[1].toString(),
        lon: item.geometry.coordinates[0].toString(),
      }));
    } catch {
      return [];
    }
  };

  // =========================================================
  // 🌍 Nominatim
  // =========================================================
  const searchNominatim = async (query: string): Promise<LocationResult[]> => {
    try {
      const url =
        `https://nominatim.openstreetmap.org/search?format=json` +
        `&q=${encodeURIComponent(query)}` +
        `&countrycodes=jp` +
        `&addressdetails=1` +
        `&limit=5` +
        `&accept-language=ja`;

      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'ja',
        },
      });

      if (!res.ok) {
        return [];
      }

      const data: NominatimResponseItem[] = await res.json();

      return data.map((item) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch {
      return [];
    }
  };

  // =========================================================
  // 🛰️ Overpass API
  //
  // Reverse Geocodeは使用しない。
  // これにより /api/v1/reverse-geocode の404を発生させない。
  // =========================================================
  const fetchOverpassPOIs = async (lat: number, lon: number, radius = 500) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    if (!baseUrl) {
      console.error('VITE_API_BASE_URL が設定されていません');
      return [];
    }

    const url =
      `${baseUrl}/api/v1/overpass` + `?lat=${lat}&lon=${lon}&radius=${radius}`;

    try {
      const res = await fetch(url);

      if (!res.ok) {
        console.warn(`Overpass proxy failed: ${res.status}`);
        return [];
      }

      const json = await res.json();

      return (
        json.elements
          ?.map((el: any) => ({
            ...el,
            lat: el.lat || el.center?.lat,
            lon: el.lon || el.center?.lon,
            tags: el.tags || {},
          }))
          .filter((el: any) => el.lat !== undefined && el.lon !== undefined) ||
        []
      );
    } catch (err) {
      console.warn('Overpass API取得失敗:', err);
      return [];
    }
  };

  // =========================================================
  // 🔎 検索
  // =========================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    const key = input.trim();

    if (!key) {
      return;
    }

    setLoading(true);

    // =======================================================
    // 検索履歴
    // =======================================================
    setHistory((prev) => {
      const newHistory = [key, ...prev.filter((h) => h !== key)];

      return newHistory.slice(0, 5);
    });

    try {
      // =====================================================
      // キャッシュ
      // =====================================================
      if (cache.has(key)) {
        console.log('✅ キャッシュヒット:', key);

        const cachedStores = cache.get(key);

        if (cachedStores) {
          setStores(cachedStores);
        }

        setCacheOn(true);

        return;
      }

      // =====================================================
      // ① GSI
      // =====================================================
      let locations = await searchGSI(key);

      // =====================================================
      // ② GSIで見つからなければNominatim
      // =====================================================
      if (!locations.length) {
        locations = await searchNominatim(key);
      }

      if (!locations.length) {
        setError('地域を特定できませんでした。');
        return;
      }

      // =====================================================
      // ③ 座標取得
      // =====================================================
      const latitude = parseFloat(locations[0].lat);

      const longitude = parseFloat(locations[0].lon);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        setError('座標を取得できませんでした。');
        return;
      }

      console.log('📍 検索地点:', latitude, longitude);

      // 地図を検索地点へ移動
      onSearch(latitude, longitude);

      // =====================================================
      // ④ Overpass
      // =====================================================
      const pois = await fetchOverpassPOIs(latitude, longitude);

      console.log('🏪 取得したPOI:', pois.length);

      // =====================================================
      // ⑤ 店舗データ作成
      //
      // Reverse Geocodeは使用しない。
      // Overpassに住所情報があれば利用。
      // なければ「住所不明」。
      // =====================================================
      const storeList: Store[] = pois
        .slice(0, 20)
        .map((poi: any, index: number) => {
          const tags = poi.tags ?? {};

          const name = tags.name || tags.brand || '名称不明';

          const address =
            tags['addr:full'] ||
            tags['addr:street'] ||
            tags['addr:city'] ||
            '住所不明';

          const website =
            tags.website || tags.url || tags['contact:website'] || null;

          return {
            id: index + 1,
            name,
            latitude: poi.lat,
            longitude: poi.lon,
            address,
            website,
          };
        });

      console.log('🏪 店舗データ:', storeList.length);

      // =====================================================
      // ⑥ 店舗データをStateへ
      // =====================================================
      setStores(storeList);

      // =====================================================
      // ⑦ キャッシュ保存
      // =====================================================
      const newCache = new Map(cache);

      newCache.set(key, storeList);

      setCache(newCache);
      setCacheOn(true);
    } catch (err) {
      console.error('❌ 検索処理エラー:', err);

      setError('検索中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 📜 検索履歴クリック
  // =========================================================
  const handleHistoryClick = (query: string) => {
    setInput(query);

    setTimeout(() => {
      const fakeEvent = {
        preventDefault: () => {},
      } as React.FormEvent;

      handleSubmit(fakeEvent);
    }, 0);
  };

  // =========================================================
  // 🗑️ 店舗表示をクリア
  // =========================================================
  const cacheDisplay = () => {
    if (stores.length > 0) {
      setStores([]);
    }
  };

  // =========================================================
  // JSX
  // =========================================================
  return (
    <div className="relative mt-6 mb-8">
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto flex flex-col sm:flex-row gap-3 max-w-[430px] md:max-w-[700px] lg:max-w-[800px] z-[100]"
      >
        <input
          type="text"
          placeholder="地域名を入力（例: 東京都千代田区丸の内）"
          value={input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border border-gray-300 sm:flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          onClick={cacheDisplay}
          className={`${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white w-full sm:w-auto px-4 py-2 rounded-lg transition`}
        >
          {loading ? '検索中…' : '検索'}
        </button>

        {!input && isFocused && history.length > 0 && (
          <ul className="absolute bg-white border w-full mt-16 rounded shadow z-[1500]">
            {history.map((query, index) => (
              <li
                key={index}
                onMouseDown={() => handleHistoryClick(query)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {query}
              </li>
            ))}
          </ul>
        )}
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SearchForm;

