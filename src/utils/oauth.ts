// src/utils/oauth.ts

// src/utils/oauth.ts
export function getOAuthUrl(provider: "google_oauth2" | "line" | "apple") {
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  if (!apiBase) {
    throw new Error("VITE_API_BASE_URL is not defined");
  }

  // 🚨 絶対に /auth にしない
  return `${apiBase}/api/v1/oauth/${provider}`;
}

export function getGoogleOAuthUrl() {
  return getOAuthUrl("google_oauth2");
}
export function getLineOAuthUrl() {
  return getOAuthUrl("line");
}
export function getAppleOAuthUrl() {
  return getOAuthUrl("apple");
}

// type OAuthProvider = "google" | "line" | "apple";

// export function getOAuthUrl(provider: OAuthProvider) {
//   const apiBase = import.meta.env.VITE_API_BASE_URL;

//   if (!apiBase) {
//     throw new Error("VITE_API_BASE_URL が定義されていません");
//   }

//   // state は CSRF 対策用（Rails 側で検証）
//   const state = crypto.randomUUID();
//   localStorage.setItem("oauth_state", state);

//   // ✅ OmniAuth に処理を完全委譲する
//   // ❌ Google / LINE / Apple の URL はフロントでは一切作らない
//   return `${apiBase}/api/v1/oauth/${provider}?state=${state}`;
// }

// // 既存関数名は維持（あなたの指定どおり）
// export function getGoogleOAuthUrl() {
//   return getOAuthUrl("google");
// }

// export function getLineOAuthUrl() {
//   return getOAuthUrl("line");
// }

// export function getAppleOAuthUrl() {
//   return getOAuthUrl("apple");
// }

// export function getOAuthUrl(provider: "google" | "line" | "apple") {
//   const state = crypto.randomUUID();
//   localStorage.setItem("oauth_state", state);

//   let clientId: string = "";
//   let redirectUri = "http://localhost:3000/oauth-callback"; // React Router ルートに統一
//   let scope = "";
//   let baseUrl = "";

//   switch (provider) {
//     case "google":
//         clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
//         scope = "email profile";
//         baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
//         break;
//     case "line":
//         clientId = import.meta.env.VITE_LINE_CLIENT_ID ?? "";
//         scope = "profile openid email";
//         baseUrl = "https://access.line.me/oauth2/v2.1/authorize";
//         break;
//     case "apple":
//         clientId = import.meta.env.VITE_APPLE_CLIENT_ID ?? "";
//         scope = "email name";
//         baseUrl = "https://appleid.apple.com/auth/authorize";
//         break;
//  }
  
//   // まずはバックエンド経由で OAuth を開始できるか確認（推奨: サーバーでコード交換する）
//   const apiBase = import.meta.env.VITE_API_BASE_URL;
//   if (apiBase) {
//     // サーバー側の OmniAuth エンドポイントに state を渡してプロバイダ認証を開始
//     return `${apiBase}/api/v1/oauth/${provider}?state=${state}`;
//   }

//   // provider パラメータを URL に追加して、OAuthCallback で共通処理できるようにする
//   return `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
//     redirectUri
//   )}&scope=${encodeURIComponent(scope)}&state=${state}&provider=${provider}`;
// }

// // 既存の関数も残しておきたい場合はラップして呼べる
// export function getGoogleOAuthUrl() {
//   return getOAuthUrl("google");
// }
// export function getLineOAuthUrl() {
//   return getOAuthUrl("line");
// }
// export function getAppleOAuthUrl() {
//   return getOAuthUrl("apple");
// }


// // src/utils/oauth.ts
// export function getGoogleOAuthUrl() {
//   const state = crypto.randomUUID();
//   localStorage.setItem("oauth_state", state);

//   const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
//   const redirectUri = "http://localhost:3000/oauth-callback"; // React Router ルートに統一
//   const scope = "email profile";

//   return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
//     redirectUri
//   )}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
// }

// export function getLineOAuthUrl() {
//   const state = crypto.randomUUID();
//   localStorage.setItem("oauth_state", state);

//   const clientId = import.meta.env.VITE_LINE_CLIENT_ID;
//   const redirectUri = "http://localhost:3000/oauth-callback"; // ポートを 3000 に統一
//   const scope = "profile openid email";

//   return `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
//     redirectUri
//   )}&scope=${encodeURIComponent(scope)}&state=${state}`;
// }

// export function getAppleOAuthUrl() {
//   const state = crypto.randomUUID();
//   localStorage.setItem("oauth_state", state);

//   const clientId = import.meta.env.VITE_APPLE_CLIENT_ID;
//   const redirectUri = "http://localhost:3000/oauth-callback"; // ポートを 3000 に統一
//   const scope = "email name";

//   return `https://appleid.apple.com/auth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
//     redirectUri
//   )}&scope=${encodeURIComponent(scope)}&state=${state}`;
// }
