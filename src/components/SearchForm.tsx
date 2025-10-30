import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (lat: number, lon: number) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [input, setInput] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Nominatim APIで住所→緯度経度に変換
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&countrycodes=jp`
    );
    const data = await res.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      onSearch(parseFloat(lat), parseFloat(lon));
    } else {
      alert('地域を特定できませんでした。');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-6 mb-8">
      <input
        type="text"
        placeholder="地域名を入力（例: 東京都千代田区丸の内1丁目）"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-[480px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        検索
      </button>
    </form>
  );
};

export default SearchForm;
