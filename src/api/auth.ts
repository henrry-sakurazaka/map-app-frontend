import type { User } from "../types/types";

export interface LoginResponse {
  user: User;
  token: string;
}

// 通常ログイン / お試しログイン両方で使える
export async function loginUser(email: string, password: string): Promise<User> {
  const res = await fetch("http://localhost:3001/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json: Partial<LoginResponse> & { error?: string; errors?: string[] } = await res.json();

  if (res.ok && json.user && json.token) {
    // トークンとユーザー情報を localStorage に保存
    localStorage.setItem("authToken", json.token);
    localStorage.setItem("authUser", JSON.stringify(json.user));
    return json.user;
  } else {
    throw new Error(json.error || json.errors?.join(", ") || "Login failed");
  }
}

// お試しログイン専用ヘルパー
export async function loginGuest(): Promise<User> {
  const guestEmail = "guest@example.com";
  const guestPassword = "guest123";
  return loginUser(guestEmail, guestPassword);
}
