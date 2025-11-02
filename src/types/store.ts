// 店舗データの型定義
export interface Store {
  /** 店舗ID（ユニーク識別子） */
  id: number;

  /** 店舗名 */
  name: string;

  /** 緯度（マップ上のY座標） */
  latitude: number;

  /** 経度（マップ上のX座標） */
  longitude: number;

  /** 店舗住所 */
  address: string;

  website?: string | null;
}
