// OAuthCallback.tsx

// OAuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // AuthContextをインポート

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  // 認証コンテキストからログイン処理関数を取得
  // 認証トークンとユーザー情報を保存するために必要です a   qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq  q   qq  q qq                                                                                  
  const { login } = useAuth(); 

  useEffect(() => {
    // 1. URLパラメータからトークンとユーザー情報を取得
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("user_id");

    if (token && userId) {
      // 2. トークンがある場合、ユーザー情報を取得
      //    (user_id しかないので、ここで現在のユーザー情報をAPIから取得する必要があります)

      // Railsの /api/v1/auth/current_user エンドポイントへリクエスト
      fetch(`http://localhost:3001/api/v1/auth/current_user`, {
        method: "GET",
        headers: {
          // 認証トークンをAuthorizationヘッダーにセット
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      })
      .then(res => {
          if (!res.ok) {
              throw new Error("ユーザー情報の取得に失敗しました");
          }
          return res.json();
      })
      .then(userResponse => {
          // 3. 認証コンテキストにトークンとユーザー情報を保存
          //    AuthContextのlogin関数は (user, token) を受け取る想定
          login(userResponse, token); 
          console.log("OAuth認証成功。ログイン情報を保存しました。");
          
          // 4. 目的のページにリダイレクト
          navigate("/App2");
      })
      .catch(err => {
          console.error("ユーザー情報取得またはログイン処理中にエラー:", err);
          // エラーページ、またはホームにリダイレクト
          navigate("/", { replace: true }); 
      });

    } else {
      // トークンがURLパラメータに存在しない場合（認証失敗やエラー）
      console.error("OAuth認証失敗: URLからトークンを取得できませんでした。");
      navigate("/", { replace: true });
    }

  // 依存配列に login と navigate を含める
  }, [login, navigate]); 

  return <p>OAuth 認証とログイン処理中…</p>;
};


// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const OAuthCallback: React.FC = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // URL パラメータから provider/code/state を取得する必要なし
//     // Rails がリダイレクトで SPA に戻す想定
//     navigate("/App2");
//   }, [navigate]);

//   return <p>OAuth 認証中…</p>;
// };



// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// export const OAuthCallback: React.FC = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth(); // ← AuthContext の login を使用

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const code = params.get("code");
//     const state = params.get("state");
//     const provider = params.get("provider") || "google"; // 必要なら

//     const savedState = localStorage.getItem("oauth_state");
//     if (!code || !state || state !== savedState) {
//       console.error("OAuth state mismatch または code がない");
//       navigate("/");
//       return;
//     }

//     fetch(`http://localhost:3001/api/v1/oauth/${provider}/callback?code=${code}`, {
//       method: "GET",
//       credentials: "include",
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.user && data.token) {
//           login(data.user, data.token); // ここで SPA 側に保存
//           navigate("/App2");
//           console.log("yes")
//         } else {
//           console.error("Rails が token を返さない", data);
//           navigate("/");
//         }
//       })
//       .catch(err => {
//         console.error(err);
//         navigate("/");
//       });
//   }, [login, navigate]);

//   return <p>OAuth 認証中…</p>;
// };


