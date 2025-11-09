import React, { useState } from 'react';
import "leaflet/dist/leaflet.css";
import { MapProvider } from './context/StateContext';
import SearchForm from './components/SearchForm';
import StoreList from './components/StoreList';
import MapCanvas from './components/MapCanvas';


const Dashboad: React.FC = () => {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const searchCenter = center ? center : undefined
  const handleSearch = (lat: number, lon: number) => {
    setCenter([lat, lon]);
  };

  return (    
      <div className="flex flex-col bg-gray-700 h-[100vh]" >
        <MapProvider>
           <div className="flex flex-col items-center p-6 text-xl ">
              <SearchForm onSearch={handleSearch} />
            </div>
            <div className="flex flex-row items-center p-6">
              <StoreList />
              <MapCanvas center={searchCenter}/>
            </div>      
          </MapProvider>   
      </div>  
  );
};

export default Dashboad;
