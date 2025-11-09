import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // JWTを保存するだけ。ユーザー情報は後で /me API で取得してもOK。
      const user = { id: 0, name: "OAuthUser", email: "" };
      login(user, token);
      navigate("/App2"); // トップページなどへ遷移
    } else {
      console.error("トークンが見つかりません");
      navigate("/LoginForm");
    }
  }, [searchParams, login, navigate]);

  return <p>ログイン処理中です...</p>;
};
