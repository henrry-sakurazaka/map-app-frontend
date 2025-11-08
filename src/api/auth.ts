import type { User } from "../types/types";

export interface LoginResponse {
    user: User;
    token: string;
}

export async function loginUser(email: string, password: string): Promise<User> {
    const res = await fetch("http://localhost:3001/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password}),
    });
    const json: Partial<LoginResponse> & { error?: string; errors?: string[] } = await res.json();

    if (res.ok && json.user && json.token) {
        localStorage.setItem("authToken", json.token);
        return json.user;
    } else {
        throw new Error(json.error || json.errors?.join(", ") || "Login failed");
    }
}
