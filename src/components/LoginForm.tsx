import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom"; // ← React Router v6 以上

const API_BASE = "http://localhost:3001/api/v1/auth"; // ← oauth に変更
// const API_OAUTH = "http://localhost:3001/api/v1/oauth"; // Google/LINE/Apple
// // プロバイダログイン

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // プロバイダーログイン
  const handleProviderLogin = (provider: "google" | "apple" | "line") => {
    window.location.href = `${API_BASE}/${provider}`;
  };

  // 通常ログイン
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await loginUser(email, password);
      alert(`ようこそ ${user.name} さん`);
      console.log("ログイン成功:", user);
      // ログイン後ページ遷移例
      navigate("/App3");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // お試しログイン（既に設定済み想定）
  const handleGuestLogin = async () => {
    try {
      const user = await loginUser("guest@example.com", "guest123");
      alert(`ようこそ ${user.name} さん`);
      navigate("/App2");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      
      {/* サインアップ・お試しログインナビ */}
      <div className="flex flex-col items-center justify-center mb-6">
        <button
          onClick={() => navigate("/signup")}
          className="text-2xl font-semibold text-blue-600 hover:underline"
        >
          サインアップ
        </button>
        <h2 className="text-gray-400 my-2">OR</h2>
        <button
          onClick={handleGuestLogin}
          className="text-2xl font-semibold text-blue-600 hover:underline"
        >
          お試しログイン
        </button>
      </div>

      {/* ログインフォーム */}
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">ログイン</h1>

        {/* --- 認証プロバイダボタン --- */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => handleProviderLogin("google")}
            className="w-full py-2 rounded-md bg-white border flex items-center justify-center hover:bg-gray-100 transition"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Googleでログイン
          </button>
          <button
            onClick={() => handleProviderLogin("apple")}
            className="w-full py-2 rounded-md bg-black text-white flex items-center justify-center hover:opacity-80 transition"
          >
            <img src="/apple.svg" alt="Apple" className="w-5 h-5 mr-2 invert" />
            Appleでログイン
          </button>
          <button
            onClick={() => handleProviderLogin("line")}
            className="w-full py-2 rounded-md bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition"
          >
            <img src="/line.svg" alt="LINE" className="w-5 h-5 mr-2" />
            LINEでログイン
          </button>
        </div>

        <div className="text-center text-gray-400 my-4">または</div>

        {/* --- 通常ログインフォーム --- */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition disabled:opacity-60"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
      </div>
    </div>
  );
};
