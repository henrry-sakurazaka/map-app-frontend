// src/utils/oauth.ts

// src/utils/oauth.ts
export function getOAuthUrl(provider: 'google_oauth2' | 'line' | 'apple') {
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  if (!apiBase) {
    throw new Error('VITE_API_BASE_URL is not defined');
  }

  // 🚨 絶対に /auth にしない
  return `${apiBase}/auth/${provider}`;
}

export function getGoogleOAuthUrl() {
  return getOAuthUrl('google_oauth2');
}
export function getLineOAuthUrl() {
  return getOAuthUrl('line');
}
export function getAppleOAuthUrl() {
  return getOAuthUrl('apple');
}
