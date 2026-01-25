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