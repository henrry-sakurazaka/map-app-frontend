import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import { useMapStore } from '../context/StateContext';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// delete (L.Icon.Default.prototype as any)._getIconUrl;
const proto = L.Icon.Default.prototype as unknown as Record<string, unknown>;

delete proto._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapCanvasProps {
  center?: LatLngExpression;
}

const MapCanvas: React.FC<MapCanvasProps> = ({ center }) => {
  const {
    mapRef,
    setMapInstance,
    mapInstanceRef,
    setIsMapInitialized,
    isMapInitialized,
    selectedStore,
    stores
  } = useMapStore();
  const markersRef = useRef<L.LayerGroup | null>(null);

  // --- ✅ 初期化 ---
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    window.addEventListener('resize', () =>
      mapInstanceRef.current?.invalidateSize(),
    );

    const timer = setTimeout(() => {
      if (!mapRef.current) return;

      const map = L.map(mapRef.current).setView([36.2048, 138.2529], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

    L.marker(center).addTo(map).bindPopup('中心点');

    
    map.setView(center, 16);
  }, [center]);

  // --- ✅ selectedStore（店舗選択）が更新されたとき ---
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapInitialized) return;

    if (!markersRef.current) {
      markersRef.current = L.layerGroup().addTo(map);
    }

    const markers = markersRef.current;
    markers.clearLayers();

   
      stores.forEach((store) => {
      if (
        store.latitude !== undefined &&
        store.longitude !== undefined
      ) {
        console.log(
          '📍 Adding store marker:',
          store.name,
          store.latitude,
          store.longitude
        );

        const marker = L.marker([
          store.latitude,
          store.longitude,
        ]).bindPopup(`<b>${store.name}</b>`);

        markers.addLayer(marker);
      }
    });
  }, [stores, isMapInitialized]);

  

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedStore) return;

    const { latitude, longitude, name } = selectedStore;

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return;
    }

    console.log('📍 Selected store:', name, latitude, longitude);

    map.setView([latitude, longitude], 17);

    L.popup()
      .setLatLng([latitude, longitude])
      .setContent(`<b>${name}</b>`)
      .openOn(map);
  }, [selectedStore]);


  return (
    <div className="w-full lg:w-2/3 rounded-xl shadow-lg overflow-hidden">
      <div id="share-target">
        <div
          ref={mapRef}
          id="map"
          className="leaflet-container bg-gray-100"
          style={{ height: '70vh', width: '100%', borderRadius: '12px' }}
        ></div>
      </div>
    </div>
  );
};

export default MapCanvas;
