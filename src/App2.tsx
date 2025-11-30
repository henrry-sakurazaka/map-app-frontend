// src/App2.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Dashboad from "./Dashboad";

const App2: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, login, logout } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [authValid, setAuthValid] = useState(false);

  // ① localStorage から復元
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      login(JSON.parse(storedUser), storedToken);
    }
  }, [login]);

  useEffect(() => {
    // Contextにuserがいればゲストも含めてチェック不要
    if (user) {
      setAuthValid(true);
      setLoading(false);
      return;
    }

    // ゲストログイン用 API
    const loginGuest = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/v1/auth/guest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Guest login failed");

        const data = await res.json();
        login(data.user, data.token);  // context に保存
        setAuthValid(true);
      } catch (error) {
        console.error("ゲストログインエラー:", error);
        logout();
        setAuthValid(false);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    // トークンがあれば current_user をチェック、それ以外はゲストログイン
    if (token) {
      const checkCurrentUser = async () => {
        try {
          const res = await fetch("http://localhost:3001/api/v1/auth/current_user", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (res.ok) {
            const data = await res.json();
            login(data, token);
            setAuthValid(true);
          } else {
            console.warn("Current user 無効。ゲストログインに切替");
            await loginGuest();
          }
        } catch (error) {
          console.error("認証チェック中にエラー:", error);
          await loginGuest();
        } finally {
          setLoading(false);
        }
      };
      checkCurrentUser();
    } else {
      loginGuest();
    }
  }, [token, navigate, login, logout, user]);

  if (loading) return <p>認証チェック中...</p>;

  return authValid && user ? <Dashboad /> : <p>ログイン情報が無効です</p>;
};

export default App2;
