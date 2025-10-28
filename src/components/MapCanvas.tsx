import React, { useEffect } from "react";
import L from "leaflet";
import type { Map as LeafletMap } from "leaflet";
import { useMapStore } from "../context/StateContext";

const MapCanvas: React.FC = () => {
  const { mapRef, setMapInstance, isMapInitialized, setIsMapInitialized } = useMapStore();

  useEffect(() => {
    if (!mapRef.current || isMapInitialized) return;

    // 初期表示は日本全体
    const map: LeafletMap = L.map(mapRef.current).setView([30.5902, 140.4017], 5);
    // 6〜8くらいなら日本だけ表示されやすい

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    setMapInstance(map);
    setIsMapInitialized(true);

    return () => {
      map.remove();
      setMapInstance(null);
      setIsMapInitialized(false);
    };
  }, []);

  return (
    <div className="lg:w-2/3 rounded-xl shadow-lg overflow-hidden">
      <div
        ref={mapRef}
        className="leaflet-container bg-gray-200"
        style={{ height: "70vh", width: "100%", borderRadius: "12px" }}
      >
        {!isMapInitialized && (
          <div className="flex items-center justify-center h-full text-gray-500">
            地図を読み込み中...
          </div>
        )}
      </div>
    </div>
  );
};

export default MapCanvas;
