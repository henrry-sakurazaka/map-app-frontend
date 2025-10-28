import React, { createContext, useContext, useState, useRef } from "react";
import type { ReactNode } from "react";
import type { Store } from "../types/store";
import { Map as LeafletMap } from "leaflet";

interface MapContextType {
  stores: Store[];
  focusStore: (store: Store) => void;
  mapRef: React.RefObject<HTMLDivElement | null>;
  mapInstanceRef: React.MutableRefObject<LeafletMap | null>;
  isMapInitialized: boolean;
  setIsMapInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  mapInstance: LeafletMap | null;
  setMapInstance: (map: LeafletMap | null) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stores] = useState<Store[]>([
    {
      id: 1,
      name: "レトロ喫茶 モカ",
      latitude: 35.6938,
      longitude: 139.7034,
      address: "東京都千代田区",
    },
    {
      id: 2,
      name: "地中海バル オリーブ",
      latitude: 35.6828,
      longitude: 139.7670,
      address: "東京都千代田区丸の内",
    },
  ]);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);

  const focusStore = (store: Store) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([store.latitude, store.longitude], 14);
    }
  };

  return (
    <MapContext.Provider
      value={{ 
        stores, focusStore,
        mapRef, mapInstanceRef, 
        isMapInitialized, setIsMapInitialized,
        mapInstance, setMapInstance }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapStore = (): MapContextType => {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMapStore must be used within a MapProvider");
  return context;
};
