// SampleLoginButton.tsx
import React from "react";
import { loginUser } from "../api/auth";

const SampleLoginButton: React.FC = () => {
  const handleClick = async () => {
    try {
      const user = await loginUser("akira@example.com", "password123");
      console.log("お試しログイン成功:", user);
      alert(`ようこそ、${user.name}さん`);
      // 必要に応じて state に保存したり、リダイレクトする
    } catch (err: any) {
      console.error(err.message);
      alert("ログインに失敗しました");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      お試しログイン
    </button>
  );
};

export default SampleLoginButton;
