import React, { useState } from "react";
// 🚨 修正1: loginGuest をインポートに追加
import { loginUser, loginGuest } from "../api/auth"; 
import { useNavigate } from "react-router-dom";
import { getGoogleOAuthUrl, getLineOAuthUrl, getAppleOAuthUrl } from "../utils/oauth";
import { useAuth } from "../context/AuthContext";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // useAuth から login 関数を取得
  const { login } = useAuth(); 

  // --- プロバイダーログイン ---
  const handleProviderLogin = (provider: "google" | "apple" | "line") => {
    let url = "";
    if (provider === "google") url = getGoogleOAuthUrl();
    if (provider === "apple") url = getAppleOAuthUrl();
    if (provider === "line") url = getLineOAuthUrl();
    // Rails 側にリダイレクトしてセッション作成
    window.location.href = url;
  };

  // --- 通常ログイン ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      
      // 🚨 修正2: 通常ログイン時も Context に認証情報を保存する必要がある
      login(response.user, response.token); 
      
      alert(`ようこそ ${response.user.name} さん`);
      navigate("/App2");
    } catch (err: any) {
      setError(err.message);
      alert(`ログインに失敗しました: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- お試しログイン ---
  const handleGuestLogin = async () => {
    try {
      // 🚨 修正3: loginUser ではなく loginGuest を使用
      const response = await loginGuest();
      
      // 2. 認証情報を Context に保存 (これが App2 にトークンを認識させる鍵)
      login(response.user, response.token);
      
      // 3. レスポンスから取得したユーザー名を表示
      alert(`ようこそ ${response.user.name} さん`); 
      
      // 4. リダイレクト
      navigate("/App2");
    } catch (err: any) {
      setError(err.message);
      // ログイン失敗時は alert でユーザーに通知することが望ましい
      alert(`お試しログインに失敗しました: ${err.message}`); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      {/* サインアップ・お試しログインナビ */}
      <div className="flex flex-col items-center justify-center mb-6">
        <button
          onClick={() => navigate("/SignUp")}
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

        {/* --- OAuth プロバイダボタン --- */}
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
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="current-password" // ここを追加
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

// import React, { useState } from "react";
// import { loginUser } from "../api/auth";
// import { useNavigate } from "react-router-dom";
// import { getGoogleOAuthUrl, getLineOAuthUrl, getAppleOAuthUrl } from "../utils/oauth";
// import { useAuth } from "../context/AuthContext";

// export const LoginForm: React.FC = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const { login} = useAuth();

//   // --- プロバイダーログイン ---
//   const handleProviderLogin = (provider: "google" | "apple" | "line") => {
//     let url = "";
//     if (provider === "google") url = getGoogleOAuthUrl();
//     if (provider === "apple") url = getAppleOAuthUrl();
//     if (provider === "line") url = getLineOAuthUrl();
//     // Rails 側にリダイレクトしてセッション作成
//     window.location.href = url;
//   };

//   // --- 通常ログイン ---
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       const response = await loginUser(email, password);
//       alert(`ようこそ ${response.user.name} さん`);
//       navigate("/App2");
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // // --- お試しログイン ---
//   // const handleGuestLogin = async () => {
//   //   try {
//   //     const response = await loginUser("guest@example.com", "guest123");
//   //     login(response.user, response.token);
//   //     alert(`ようこそ ${user.name} さん`);
//   //     navigate("/App2");
//   //   } catch (err: any) {
//   //     setError(err.message);
//   //   }
//   // };

//   // --- お試しログイン ---
//   const handleGuestLogin = async () => {
//     try {
//       // 1. APIを呼び出し、ユーザー情報とトークンを取得
//       // 🚨 注意: loginUser ではなく loginGuest を呼ぶべきですが、
//       // ユーザー名の取得と login 呼び出しは以下の修正で対応します。
//       const response = await loginUser("guest@example.com", "guest123");
      
//       // 2. 認証情報を Context に保存 (これが App2 にトークンを認識させる鍵)
//       login(response.user, response.token);
      
//       // 3. 🚨 修正: Contextではなく、レスポンスから取得したユーザー名を表示
//       alert(`ようこそ ${response.user.name} さん`); 
      
//       // 4. リダイレクト
//       navigate("/App2");
//     } catch (err: any) {
//       setError(err.message);
//       // ログイン失敗時は alert でユーザーに通知することが望ましい
//       alert(`お試しログインに失敗しました: ${err.message}`); 
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
//       {/* サインアップ・お試しログインナビ */}
//       <div className="flex flex-col items-center justify-center mb-6">
//         <button
//           onClick={() => navigate("/SignUp")}
//           className="text-2xl font-semibold text-blue-600 hover:underline"
//         >
//           サインアップ
//         </button>
//         <h2 className="text-gray-400 my-2">OR</h2>
//         <button
//           onClick={handleGuestLogin}
//           className="text-2xl font-semibold text-blue-600 hover:underline"
//         >
//           お試しログイン
//         </button>
//       </div>

//       {/* ログインフォーム */}
//       <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
//         <h1 className="text-2xl font-semibold text-center mb-6">ログイン</h1>

//         {/* --- OAuth プロバイダボタン --- */}
//         <div className="flex flex-col gap-3 mb-6">
//           <button
//             onClick={() => handleProviderLogin("google")}
//             className="w-full py-2 rounded-md bg-white border flex items-center justify-center hover:bg-gray-100 transition"
//           >
//             <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
//             Googleでログイン
//           </button>
//           <button
//             onClick={() => handleProviderLogin("apple")}
//             className="w-full py-2 rounded-md bg-black text-white flex items-center justify-center hover:opacity-80 transition"
//           >
//             <img src="/apple.svg" alt="Apple" className="w-5 h-5 mr-2 invert" />
//             Appleでログイン
//           </button>
//           <button
//             onClick={() => handleProviderLogin("line")}
//             className="w-full py-2 rounded-md bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition"
//           >
//             <img src="/line.svg" alt="LINE" className="w-5 h-5 mr-2" />
//             LINEでログイン
//           </button>
//         </div>

//         <div className="text-center text-gray-400 my-4">または</div>

//         {/* --- 通常ログインフォーム --- */}
//         <form onSubmit={handleLogin} className="flex flex-col gap-4">
//           <input
//             type="email"
//             placeholder="メールアドレス"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//             autoComplete="username"
//           />
//           <input
//             type="password"
//             placeholder="パスワード"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//             autoComplete="current-password" // ここを追加
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition disabled:opacity-60"
//           >
//             {loading ? "ログイン中..." : "ログイン"}
//           </button>
//         </form>

//         {error && <p className="text-red-500 text-center mt-3">{error}</p>}
//       </div>
//     </div>
//   );
// };
