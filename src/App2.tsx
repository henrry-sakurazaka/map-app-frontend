// src/App2.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Dashboad from "./Dashboad";

const App2: React.FC = () => {
  const navigate = useNavigate();
  // token も useAuth から取得する
  const { user, token, login, logout } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [authValid, setAuthValid] = useState(false);

  useEffect(() => {
    // 既に Context に user と authValid があれば、チェック不要（リロード時を除く）
    if (user && authValid) {
      setLoading(false);
      return;
    }
    
    // 1. トークンがない場合、即座に未認証と判断
    if (!token) {
      console.error("未ログイン: トークンなし");
      logout();
      setAuthValid(false);
      setLoading(false);
      navigate("/");
      return;
    }

    // 2. トークンがある場合、APIを叩いて有効性を確認する
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/v1/auth/current_user", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          // APIから返されたユーザー情報と、既存のトークンでログイン状態を更新
          // AuthProviderのloginはlocalStorageに保存する処理も含む
          login(data, token); 
          setAuthValid(true);
        } else if (response.status === 401) {
          // トークンが無効/期限切れの場合
          console.error("認証失敗: トークン無効/期限切れ");
          logout();
          setAuthValid(false);
          navigate("/");
        } else {
          // その他のAPIエラー
          throw new Error(`APIエラー: ${response.status}`);
        }
      } catch (error) {
        console.error("認証チェック中にエラーが発生:", error);
        logout();
        setAuthValid(false);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [token, navigate, login, logout]); 
  
  // ゲスト判定ロジックを定義
  // ユーザーオブジェクトが確定した後に実行されます。
  const isGuest = user?.email === "no_email_guest@example.com"; 

  if (loading) return <p>認証チェック中...</p>;

  // ★ 最終的なレンダーロジックを修正 ★
  // authValidがtrue (本登録ユーザー) または isGuestがtrue (ゲストユーザー) の場合に
  // ダッシュボードを表示する
  return (authValid || isGuest) && user ? <Dashboad /> : <p>ログイン情報が無効です</p>;
};

export default App2;