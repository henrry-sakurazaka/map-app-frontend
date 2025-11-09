import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/App3"); // 認証後の遷移先
    } else {
      navigate("/"); // 失敗した場合
    }
  }, [navigate]);

  return <div>ログイン中...</div>;
};
