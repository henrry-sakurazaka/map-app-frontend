import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import { useMapStore } from "../context/StateContext";

const MapController = () => {
  const { selectedStore } = useMapStore();
  const map = useMap();

  useEffect(() => {
    if (selectedStore && selectedStore.latitude && selectedStore.longitude) {
      const { latitude, longitude } = selectedStore;
      console.log("Moving to:", latitude, longitude);
      map.setView([latitude, longitude], 17, { animate: true });
    } else {
        console.warn("Invalid store data", selectedStore);
    }
  }, [selectedStore, map]);

  return null;
};

const MapWrapper = () => {
  const mapRef = useRef<LeafletMap | null>(null); // ✅ 型をLeafletMapに変更

  return (
    <div className="lg:w-2/3 rounded-xl shadow-lg overflow-hidden">
      <MapContainer
        ref={mapRef}
        id="map"
        className="leaflet-container bg-gray-100"
        center={[35.681236, 139.767125]}
        zoom={13}
        style={{ height: "70vh", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapController />
      </MapContainer>
    </div>
  );
};

export default MapWrapper;
