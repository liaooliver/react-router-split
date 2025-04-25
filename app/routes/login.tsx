import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/Button";
import { GoogleIcon } from "~/assets/icons/google-icon";
import { useNavigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import { fetchProtectedData } from "~/services/fetchProtectedData";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App - Login Page" },
    { name: "description", content: "Login Page" },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const { signInWithGoogle, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 如果用戶已登入，重定向到首頁
    if (currentUser) {
      navigate("/");
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      fetchProtectedData();
      navigate("/");
    } catch (error) {
      console.error("登入失敗:", error);
      setError("Google 登入失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black relative overflow-hidden">
      {/* SVG Decorative elements */}
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lines */}
        <path
          d="M100,100 L300,150 L500,50 L700,200"
          stroke="#FF5733"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
          fill="none"
        />
        <path
          d="M800,900 L600,800 L400,950 L200,700"
          stroke="#00C4CC"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.4"
          fill="none"
        />
        <path
          d="M900,300 L750,350 L800,500 L650,400"
          stroke="#FFC107"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.5"
          fill="none"
        />

        {/* Circles */}
        <circle cx="150" cy="250" r="40" fill="#FF5733" opacity="0.6" />
        <circle cx="850" cy="150" r="60" fill="#00C4CC" opacity="0.3" />
        <circle cx="750" cy="750" r="30" fill="#FFC107" opacity="0.7" />
        <circle cx="250" cy="650" r="50" fill="#FF5733" opacity="0.5" />

        {/* Triangles */}
        <polygon
          points="600,300 650,380 550,380"
          fill="#00C4CC"
          opacity="0.5"
        />
        <polygon
          points="350,500 400,600 300,600"
          fill="#FFC107"
          opacity="0.6"
        />
        <polygon
          points="800,600 880,650 850,550"
          fill="#FF5733"
          opacity="0.4"
        />

        {/* More complex shapes */}
        <path
          d="M100,400 Q200,350 150,450 T250,500 Q300,550 200,600 Z"
          fill="#00C4CC"
          opacity="0.3"
        />
        <path
          d="M700,350 C750,300 800,400 850,350 S900,450 850,500 Q800,550 750,500 Z"
          fill="#FFC107"
          opacity="0.4"
        />
      </svg>

      {/* Slogan */}
      <h1 className="text-white text-2xl font-semibold z-10 px-6 text-center absolute top-[10%]">
        輕鬆記錄每一次，分帳從此不煩惱
      </h1>

      {/* Main Content Area - Floating centered white card */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto z-10 p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <Button
          variant="outline"
          className="w-full py-6 flex items-center justify-center gap-2 rounded-lg border-gray-300"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <GoogleIcon />
          <span>{loading ? "登入中..." : "使用 Google 帳號登入"}</span>
        </Button>

        {/* Register link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            還沒有帳號？{" "}
            <span className="text-[#FF5733] font-semibold hover:underline cursor-pointer">
              註冊
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
