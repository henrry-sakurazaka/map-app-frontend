import React, { useEffect } from "react";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapStore } from "../context/StateContext";
import "leaflet/dist/leaflet.css";

interface MapCanvasProps {
  center?: LatLngExpression;
}

const MapCanvas: React.FC<MapCanvasProps> = ({ center }) => {
  const { mapRef, setMapInstance, mapInstanceRef, setIsMapInitialized } = useMapStore();

  useEffect(() => {
    // ✅ すでにマップが存在する場合は再初期化しない
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([36.2048, 138.2529], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapInstance(map);
    setIsMapInitialized(true);

    setTimeout(() => map.invalidateSize(), 200);
  }, []);

  // centerが来たときだけ移動＆マーカー再設置
  useEffect(() => {
    if (center && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
      });
      L.marker(center).addTo(map);
      map.setView(center, 16);
    }
  }, [center]);

  return (
    <div className="lg:w-2/3 rounded-xl shadow-lg overflow-hidden">
      <div
        ref={mapRef}
        id="map"
        className="leaflet-container bg-gray-100"
        style={{ height: "70vh", width: "100%", borderRadius: "12px" }}
      ></div>
    </div>
  );
};

export default MapCanvas;

