import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapProvider } from './context/StateContext';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import StoreList from './components/StoreList';
import MapCanvas from './components/MapCanvas';

const Dashboad: React.FC = () => {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const { logout } = useAuth();
  const searchCenter = center ? center : undefined;
  const handleSearch = (lat: number, lon: number) => {
    setCenter([lat, lon]);
  };
  const navigateTo = useNavigate();
  const handleLogout = () => {
    logout();
    navigateTo('/');
  };

  return (
    <div className="relative flex flex-col items-center bg-gray-700 min-h-screen">
      {/* 背景のリピート文字 */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute -inset-20 flex flex-wrap gap-x-8 gap-y-100 rotate-[-30deg] text-gray-400  text-2xl leading-none">
          {Array.from({ length: 80 }).map((_, index) => (
            <span key={index} className="whitespace-nowrap">
              Shop Map App
            </span>
          ))}
        </div>
      </div>
      {/* 背景のリピート文字 */}

      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        ログアウト
      </button>

      <MapProvider>
        {/* スマホ幅制御はここだけ */}
        <div className="w-full mx-auto mt-4 lg:px-6 max-w-[430px] md:max-w-[700px] lg:max-w-[1200px]">
          <div className="flex flex-col items-stretch p-6 gap-6 text-xl w-full">
            <SearchForm onSearch={handleSearch} />
          </div>
          <div className="flex flex-col lg:flex-row items-start p-6 gap-6 w-full">
            <StoreList />
            <MapCanvas center={searchCenter} />
          </div>
        </div>
      </MapProvider>
    </div>
  );
};

export default Dashboad;
