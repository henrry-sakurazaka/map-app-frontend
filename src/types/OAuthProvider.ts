// OAuthProvider.ts
export type OAuthProvider = "google" | "apple" | "line";

// もし定数として扱いたい場合
export const OAuthProviders = {
  GOOGLE: "google" as OAuthProvider,
  APPLE: "apple" as OAuthProvider,
  LINE: "line" as OAuthProvider,
};
