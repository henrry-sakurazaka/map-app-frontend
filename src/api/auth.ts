import type { User } from "../types/types";
import type { OAuthProvider } from "../types/OAuthProvider";

// 認証レスポンスの型は維持
export interface LoginResponse {
  user: User;
  token: string;
  name: string;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || window.location.origin;

// ----------------------
// ログイン
// ----------------------
// 🚨 修正1: 戻り値の型を User から LoginResponse に変更//////////
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json: Partial<LoginResponse> & { error?: string; errors?: string[] } = await res.json();

  if (res.ok && json.user && json.token) {
    // 🚨 修正2: localStorage への保存を削除
    // localStorage.setItem("authToken", json.token);
    // localStorage.setItem("authUser", JSON.stringify(json.user));
    
    // 🚨 修正3: { user, token } オブジェクト全体を返却
    return { user: json.user, token: json.token , name: json.user.name}; 
  } else {
    throw new Error(json.error || json.errors?.join(", ") || "Login failed");
  }
}

// ----------------------
// お試しログイン
// ----------------------
// 🚨 修正1: 戻り値の型を User から LoginResponse に変更

export async function loginGuest(): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/guest`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
    },
  });

  const json: Partial<LoginResponse> & { error?: string; errors?: string[] } = await res.json();

  if (res.ok && json.user && json.token) {
    localStorage.setItem("authToken", json.token);
    localStorage.setItem("authUser", JSON.stringify(json.user));

    return { user: json.user, token: json.token, name: json.user.name };
  } else {
    throw new Error(json.error || json.errors?.join(", ") || "Guest login failed");
  }
}

// export async function loginGuest(): Promise<LoginResponse> {
//   const token = localStorage.getItem("authToken");
//   const res = await fetch(`${API_BASE}/api/v1/auth/guest`, {
//     method: "POST",
//     headers: { 
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const json: Partial<LoginResponse> & { error?: string; errors?: string[] } = await res.json();

//   if (res.ok && json.user && json.token) {

//     // ✔ トークン保存必須
//     localStorage.setItem("authToken", json.token);
//     localStorage.setItem("authUser", JSON.stringify(json.user));

//     return { user: json.user, token: json.token , name: json.user.name};
//   } else {
//     throw new Error(json.error || json.errors?.join(", ") || "Guest login failed");
//   }
// }

// ----------------------
// サインアップ
// ----------------------
// 🚨 修正1: 戻り値の型を User から LoginResponse に変更
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<LoginResponse> { // Promise<LoginResponse> に変更
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: { name, email, password, password_confirmation: password },
    }),
  });

  const json: Partial<LoginResponse> & { error?: string; errors?: string[] } = await res.json();

  if (res.ok && json.user) {
    if (json.token) {
      // 🚨 修正2: localStorage への保存を削除
      // localStorage.setItem("authToken", json.token);
      // localStorage.setItem("authUser", JSON.stringify(json.user));
      
      // 🚨 修正3: { user, token } オブジェクト全体を返却 (tokenがない場合は空文字列などを考慮)
      return { user: json.user, token: json.token, name: json.user.name || '' }; 
    }
    // トークンがない場合はエラーとして処理するか、サインアップ後のフローによる
    throw new Error("Sign up successful but token missing"); 
  } else {
    throw new Error(json.error || json.errors?.join(", ") || "Sign up failed");
  }
}

// ----------------------
// OAuthログイン
// ----------------------
// 🚨 修正1: 戻り値の型を User から LoginResponse に変更
export async function loginOAuth(provider: OAuthProvider, code: string): Promise<LoginResponse> {
  // 注意: この関数は旧式のフロー（codeを使ってフロントからAPIを叩く）であるため、
  // 以前議論した新しいフロー（Railsがリダイレクトでトークンを渡す）に移行することが強く推奨されます。
  
  const res = await fetch(`${API_BASE}/api/v1/auth/${provider}/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  const json: Partial<LoginResponse> & { error?: string; errors?: string[] } = await res.json();

  if (res.ok && json.user && json.token) {
    // 🚨 修正2: localStorage への保存を削除
    // localStorage.setItem("authToken", json.token);
    // localStorage.setItem("authUser", JSON.stringify(json.user));
    
    // 🚨 修正3: { user, token } オブジェクト全体を返却
    return { user: json.user, token: json.token, name: json.user.name};
  } else {
    throw new Error(json.error || json.errors?.join(", ") || "OAuth login failed");
  }
}

