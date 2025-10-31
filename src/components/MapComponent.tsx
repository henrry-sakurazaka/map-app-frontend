import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useMapStore } from "../context/StateContext";

const MapController = () => {
  const map = useMap();
  const { selectedStore, mapRef } = useMapStore();

  useEffect(() => {
    if (selectedStore && selectedStore.latitude && selectedStore.longitude) {
      const { latitude, longitude } = selectedStore;
      map.setView([latitude, longitude], 17, { animate: true }); // 17はズームレベル
    }
  }, [selectedStore, map]);

  return (
         <div className="lg:w-2/3 rounded-xl shadow-lg overflow-hidden">
            <div
              ref={mapRef}
              id="map"
              className="leaflet-container bg-gray-100"
              style={{ height: "70vh", width: "100%", borderRadius: "12px" }}
            ></div>
          </div>   
 )
};



export default MapController;
