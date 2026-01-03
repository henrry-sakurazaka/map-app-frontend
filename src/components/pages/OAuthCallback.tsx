// OAuthCallback.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// API ベース URL は環境変数に依存させる
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || window.location.origin;

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const executedRef = useRef(false); // 二重実行防止用

  useEffect(() => {
    if (executedRef.current) return; //　既に実行済みなら何もしない
    executedRef.current = true;
    // token は search (?token=) または hash (#token=) のどちらに入るか分からないため両方チェック
    const getTokenFromLocation = () => {
      const searchParams = new URLSearchParams(window.location.search || "");
      const hashParams = new URLSearchParams((window.location.hash || "").replace("#", "?"));
      return (
        searchParams.get("token") ||
        searchParams.get("access_token") ||
        hashParams.get("token") ||
        hashParams.get("access_token") ||
        undefined
      );
    };

    const token = getTokenFromLocation(); // string | undefined

    // // デバッグ出力
    // console.info("=== OAuthCallback: location.href ===", window.location.href);
    // console.info("=== OAuthCallback: search ===", window.location.search);
    // console.info("=== OAuthCallback: hash ===", window.location.hash);
    // console.info("=== OAuthCallback: extracted token ===", token);

    // Headers を Record<string,string> で型を固定
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const fetchUser = async () => {
      try {
        console.info("=== OAuthCallback: fetch URL ===", `${API_BASE}/api/v1/auth/current_user`);
        console.info("=== OAuthCallback: fetch headers ===", headers);

        const res = await fetch(
          `${API_BASE}/api/v1/auth/current_user`,
          {
            method: "GET",
            headers,
            credentials: "include", // OAuth セッション用
          }
        );

        if (!res.ok) throw new Error("未ログイン or セッション無効");

        const data = await res.json();
        // const { user } = data;
        const user = data.user ?? data;
        // A ?? B
        // A が null または undefined のときだけ B を使う


        if (!user) throw new Error("user が返ってこない");

        // login の第二引数は token があれば渡す、なければ undefined
        login(user, token?? "");
        navigate("/App2", { replace: true });
      } catch (err) {
        console.error("OAuthログイン失敗:", err);
        navigate("/", { replace: true });
      }
    };

    fetchUser(); // fetchUser を呼び出す
  }, [login, navigate]);

  return <p>OAuth 認証とログイン処理中…</p>;
};

