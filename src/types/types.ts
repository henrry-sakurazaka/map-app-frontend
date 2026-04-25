export interface User {
  id: number;
  name: string;
  email: string;
  provider?: string;
  uid?: string;
  image_url?: string;
}

// 認証APIのレスポンス構造を定義
export interface AuthResponse {
  user: User;
  token: string;
}

export interface GSIResponseItem {
  properties: {
    title: string;
  };
  geometry: {
    coordinates: [number, number]; // [lon, lat]
  };
}

export interface NominatimResponseItem {
  display_name: string;
  lat: string;
  lon: string;
}

export interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
}
