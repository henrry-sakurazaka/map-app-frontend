import React, { useEffect } from "react";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapStore } from "../context/StateContext";
import "leaflet/dist/leaflet.css";
import MapWrapper from "./MapComponent";

interface MapCanvasProps {
  center?: LatLngExpression;
}

const MapCanvas: React.FC<MapCanvasProps> = ({ center }) => {
  const { mapRef, setMapInstance, mapInstanceRef, setIsMapInitialized, selectedStore } = useMapStore();
  const markersRef = React.useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    // ✅ すでにマップが存在する場合は再初期化しない
    if (!mapRef.current || mapInstanceRef.current) return;

    const timer = setTimeout(() => {
       if (!mapRef.current) return;
       const map = L.map(mapRef.current).setView([36.2048, 138.2529], 6);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        mapInstanceRef.current = map;
        setMapInstance(map);
        setIsMapInitialized(true);

        setTimeout(() => map.invalidateSize(), 200);
     }, 100)
     return () => clearTimeout(timer);
  }, []);


   
   
  // centerが来たときだけ移動＆マーカー再設置
  useEffect(() => {
    if (center && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
      });
      L.marker(center).addTo(map).bindPopup("中心点");

      const [lat, lon] = center as [number, number];

      //Overpass API クエリ
      const query = `
      [out:json];
      node["shop"](around:1000,${lat},${lon});
      out;
      `
      fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      })
       .then((res) => res.json()
       .then((data) => {
        data.elements.forEach((el: any) => {
          if(el.type === "node") {
            const { lat, lon, tags } = el;
            const name = tags.name || tags.shop || "店舗";
            L.marker([lat, lon]) 
             .addTo(map)
             .bindPopup(`<b>${name}</b><br>${tags.shop || ""}`);
          }
        });
       })
      )
      .catch((err) => console.error("Overpass API Error:", err));
      map.setView(center, 16);
    }
  }, [center]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // LayerGroup 初期化
    if (!markersRef.current) {
      markersRef.current = L.layerGroup().addTo(map);
    }
    const markers = markersRef.current;
    markers.clearLayers(); // 既存マーカー削除

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
  }, [selectedStore, mapInstanceRef.current]);

  useEffect(() => {
    console.log("selectedStore", selectedStore);
  }, [selectedStore])


//   useEffect(() => {
//   if (selectedStore && mapInstanceRef.current) {
//     const { lat, lon, name } = selectedStore;
//     const map = mapInstanceRef.current;

//     if (lat !== undefined && lon !== undefined) {
//       // マーカー用 LayerGroup を使うと削除が簡単
//       if (!markersRef.current) {
//         markersRef.current = L.layerGroup().addTo(map);
//       }
//       const markers = markersRef.current;
//       markers.clearLayers(); // 以前のマーカーを削除

//       // 新しいマーカーを追加
//       L.marker([lat, lon])
//         .addTo(markers)
//         .bindPopup(`<b>${name}</b>`)
//         .openPopup();

//       map.setView([lat, lon], 17); // マップを移動
//     }
//   }
// }, [selectedStore, mapInstanceRef.current]);


  // useEffect(() => {
  //   if (selectedStore && mapInstanceRef.current) {
  //     const { lat, lon } = selectedStore;
  //     const map = mapInstanceRef.current;

  //     if (lat !== undefined && lon !== undefined) {
  //       L.marker([lat, lon])
  //       .addTo(map)
  //       .bindPopup(`<b>${selectedStore.name}</b>`)
  //       .openPopup();

  //       map.setView([lat, lon], 17);
  //     }
     
  //   }
  // }, [selectedStore]);

  return (
    <>
        {selectedStore ? (
          <MapWrapper/>
        ):
        (
          <div className="lg:w-2/3 rounded-xl shadow-lg overflow-hidden">
          <div
            ref={mapRef}
            id="map"
            className="leaflet-container bg-gray-100"
            style={{ height: "70vh", width: "100%", borderRadius: "12px" }}
          ></div>
        </div>
        )
      }
    </>
      
  );
};

export default MapCanvas;

