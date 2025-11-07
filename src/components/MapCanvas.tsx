import React, { useEffect, useRef } from "react";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapStore } from "../context/StateContext";
import "leaflet/dist/leaflet.css";

interface MapCanvasProps {
  center?: LatLngExpression;
}

const MapCanvas: React.FC<MapCanvasProps> = ({ center }) => {
  const { mapRef, setMapInstance, mapInstanceRef,
     setIsMapInitialized, selectedStore,
     ogpData,
     } = useMapStore();
  const markersRef = useRef<L.LayerGroup | null>(null);

  // --- ✅ 初期化 ---
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    
    window.addEventListener("resize", () => mapInstanceRef.current?.invalidateSize());

    const timer = setTimeout(() => {
      if (!mapRef.current) return;

      const map = L.map(mapRef.current).setView([36.2048, 138.2529], 6);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      setMapInstance(map);
      setIsMapInitialized(true);

      // ✅ Leaflet表示のズレ対策
      setTimeout(() => map.invalidateSize(), 200);
    }, 100);

    return () => clearTimeout(timer);
  }, [mapRef, mapInstanceRef]);

  // --- ✅ center（中心座標）が更新されたとき ---
  useEffect(() => {
    if (!center || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // 既存マーカー削除
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    L.marker(center).addTo(map).bindPopup("中心点");

    const [lat, lon] = center as [number, number];

    // Overpass API クエリ
    const query = `
      [out:json];
      node["shop"](around:1000,${lat},${lon});
      out;
    `;

    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    })
      .then((res) => res.json())
      .then((data) => {
        data.elements.forEach((el: any) => {
          if (el.type === "node") {
            const { lat, lon, tags } = el;
            const name = tags.name || tags.shop || "店舗";
            L.marker([lat, lon])
              .addTo(map)
              .bindPopup(`<b>${name}</b><br>${tags.shop || ""}`);
          }
        });
      })
      .catch((err) => console.error("Overpass API Error:", err));

    map.setView(center, 16);
  }, [center]);

  // --- ✅ selectedStore（店舗選択）が更新されたとき ---
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!markersRef.current) {
      markersRef.current = L.layerGroup().addTo(map);
    }

    const markers = markersRef.current;
    markers.clearLayers();

    if (selectedStore) {
      const { latitude, longitude, name } = selectedStore;
      if (latitude !== undefined && longitude !== undefined) {
        console.log("Adding marker at:", latitude, longitude);
        const marker = L.marker([latitude, longitude]).bindPopup(`<b>${name}</b>`);
        marker.addTo(markers);
        marker.openPopup();
        map.setView([latitude, longitude], 17);
      }
    }
  }, [selectedStore]); 


  return (
    <div className="lg:w-2/3 rounded-xl shadow-lg overflow-hidden">
      <div id="share-target">
        <div
          ref={mapRef}
          id="map"
          className="leaflet-container bg-gray-100"
          style={{ height: "70vh", width: "100%", borderRadius: "12px" }}
        ></div>
      </div>    
    </div>
  );
};

export default MapCanvas;
