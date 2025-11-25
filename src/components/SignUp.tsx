import React, { useState } from "react";
import { registerUser } from "../api/auth"; // サーバーの登録APIに合わせて作成
import { useNavigate } from "react-router-dom";

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await registerUser(name, email, password);
      alert(`登録成功！ようこそ ${user.name} さん`);
      navigate("/App2");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">サインアップ</h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="ユーザー名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
            className="bg-green-500 text-white rounded-md py-2 hover:bg-green-600 transition disabled:opacity-60"
          >
            {loading ? "登録中..." : "登録する"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        <p
          onClick={() => navigate("/login")}
          className="text-blue-500 text-center mt-4 hover:underline cursor-pointer"
        >
          すでにアカウントをお持ちの方はこちら
        </p>
      </div>
    </div>
  );
};
