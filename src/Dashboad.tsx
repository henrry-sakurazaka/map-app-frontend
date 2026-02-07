import React, { useState } from 'react';
import "leaflet/dist/leaflet.css";
import { MapProvider } from './context/StateContext';
import { useAuth } from './context/AuthContext';
import { useNavigate } from "react-router-dom";
import SearchForm from './components/SearchForm';
import StoreList from './components/StoreList';
import MapCanvas from './components/MapCanvas';


const Dashboad: React.FC = () => {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const searchCenter = center ? center : undefined
  const handleSearch = (lat: number, lon: number) => {
    setCenter([lat, lon]);
  };
  const handleLogout = () => {
    logout();
    navigate("/")
  }

  return (   
     <div className="relative flex flex-col bg-gray-700 h-screen">
      
      {/* ② 右上ログアウトボタン */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        ログアウト
      </button>

      <MapProvider>
        <div className="flex flex-col items-center p-6 text-xl">
          <SearchForm onSearch={handleSearch} />
        </div>
        <div className="flex flex-row items-center p-6">
          <StoreList />
          <MapCanvas center={searchCenter} />
        </div>
      </MapProvider>
    </div> 
      // <div className="flex flex-col bg-gray-700 h-[100vh]" >
      //   <MapProvider>
      //      <div className="flex flex-col items-center p-6 text-xl ">
      //         <SearchForm onSearch={handleSearch} />
      //       </div>
      //       <div className="flex flex-row items-center p-6">
      //         <StoreList />
      //         <MapCanvas center={searchCenter}/>
      //       </div>      
      //     </MapProvider>   
      // </div>  
  );
};

export default Dashboad;
