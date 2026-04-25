import React, { createContext, useContext, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Store } from '../types/store';
import { Map as LeafletMap } from 'leaflet';

// ✅ OGPデータ型を定義
export interface OGPData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface MapContextType {
  stores: Store[];
  focusStore: (store: Store) => void;
  mapRef: React.RefObject<HTMLDivElement | null>; // ✅ HTMLDivElement だけでOK（nullを許可するRefObject自体がそういう設計）
  mapInstanceRef: React.MutableRefObject<LeafletMap | null>;
  isMapInitialized: boolean;
  setIsMapInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  mapInstance: LeafletMap | null;
  setMapInstance: (map: LeafletMap | null) => void;
  setStores: React.Dispatch<React.SetStateAction<any[]>>;
  // selectedStore: Store | null;
  // setSelectedStore: React.Dispatch<React.SetStateAction<Store | null>>;
  selectedStore: any;
  setSelectedStore: (store: any) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  cache: Map<string, any>;
  setCache: React.Dispatch<React.SetStateAction<Map<string, any>>>;
  cacheOn: boolean;
  setCacheOn: React.Dispatch<React.SetStateAction<boolean>>;
  storeWeb: Map<string, any>;
  setStoreWeb: React.Dispatch<React.SetStateAction<Map<string, any>>>;
  ogpData: OGPData | null;
  setOgpData: React.Dispatch<React.SetStateAction<OGPData | null>>;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stores, setStores] = useState<Store[]>([]);

  // 🔧 修正: useRef<HTMLDivElement>(null) → useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<Map<string, any>>(new Map());
  const [cacheOn, setCacheOn] = useState<boolean>(false);
  const [storeWeb, setStoreWeb] = useState<Map<string, any>>(new Map());
  const [ogpData, setOgpData] = useState<OGPData | null>(null);
  const focusStore = (store: Store) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([store.latitude, store.longitude], 14);
    }
  };

  return (
    <MapContext.Provider
      value={{
        stores,
        focusStore,
        mapRef, // 🔧 修正により型が一致
        mapInstanceRef,
        isMapInitialized,
        setIsMapInitialized,
        mapInstance,
        setMapInstance,
        setStores,
        selectedStore,
        setSelectedStore,
        loading,
        setLoading,
        cache,
        setCache,
        cacheOn,
        setCacheOn,
        storeWeb,
        setStoreWeb,
        ogpData,
        setOgpData,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapStore = (): MapContextType => {
  const context = useContext(MapContext);
  if (!context)
    throw new Error('useMapStore must be used within a MapProvider');
  return context;
};
