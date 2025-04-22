import { Outlet, useNavigate } from "react-router";
import { appDesignTokens } from "~/assets/style/tokens";
import Navbar from "./navbar";
import { useAuth } from "~/contexts/AuthContext";
import { useEffect } from "react";

const GradientBackground = () => (
  <div className="absolute top-0 left-0 w-full h-full z-0">
    <div className="w-full h-full bg-gradient-custom" />
    <svg
      className="absolute top-0 left-0 w-full h-full opacity-30"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* 銀河中心星雲暈染 */}
      <radialGradient id="galaxy-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={appDesignTokens.primary} stopOpacity="0.5" />
        <stop offset="60%" stopColor={appDesignTokens.accent} stopOpacity="0.2" />
        <stop offset="100%" stopColor={appDesignTokens.secondary} stopOpacity="0" />
      </radialGradient>
      <ellipse cx="50" cy="50" rx="18" ry="10" fill="url(#galaxy-core)" />
      {/* 中心黑洞 */}
      <circle cx="50" cy="50" r="2.5" fill={appDesignTokens.primary} />

      {/* 螺旋臂（以多條半透明曲線表現） */}
      <g opacity="0.5">
        <path d="M50,50 Q70,40 90,60" stroke={appDesignTokens.accent} strokeWidth="1.2" fill="none" />
        <path d="M50,50 Q30,60 10,40" stroke={appDesignTokens.secondary} strokeWidth="1.2" fill="none" />
        <path d="M50,50 Q80,20 95,35" stroke={appDesignTokens.primary} strokeWidth="0.7" fill="none" />
        <path d="M50,50 Q20,20 5,65" stroke={appDesignTokens.accent} strokeWidth="0.7" fill="none" />
        <path d="M50,50 Q80,80 95,65" stroke={appDesignTokens.secondary} strokeWidth="0.6" fill="none" />
        <path d="M50,50 Q20,80 5,35" stroke={appDesignTokens.primary} strokeWidth="0.6" fill="none" />
      </g>

      {/* 星點（隨機分布，大小、顏色不一，模擬銀河星海） */}
      <g>
        <circle cx="20" cy="30" r="0.7" fill={appDesignTokens.primary} />
        <circle cx="80" cy="20" r="0.5" fill={appDesignTokens.secondary} />
        <circle cx="15" cy="80" r="0.3" fill={appDesignTokens.accent} />
        <circle cx="60" cy="10" r="0.6" fill={appDesignTokens.primary} />
        <circle cx="85" cy="85" r="0.4" fill={appDesignTokens.secondary} />
        <circle cx="40" cy="65" r="0.5" fill={appDesignTokens.accent} />
        <circle cx="70" cy="70" r="0.8" fill={appDesignTokens.primary} />
        <circle cx="55" cy="80" r="0.3" fill={appDesignTokens.secondary} />
        <circle cx="25" cy="55" r="0.4" fill={appDesignTokens.accent} />
        <circle cx="75" cy="45" r="0.5" fill={appDesignTokens.primary} />
        <circle cx="30" cy="20" r="0.3" fill={appDesignTokens.secondary} />
        <circle cx="68" cy="35" r="0.4" fill={appDesignTokens.accent} />
        <circle cx="45" cy="25" r="0.2" fill={appDesignTokens.primary} />
        <circle cx="60" cy="75" r="0.3" fill={appDesignTokens.secondary} />
        <circle cx="90" cy="55" r="0.4" fill={appDesignTokens.accent} />
        <circle cx="10" cy="45" r="0.2" fill={appDesignTokens.primary} />
        <circle cx="50" cy="15" r="0.3" fill={appDesignTokens.accent} />
      </g>
      {/* 星雲暈染（淡色橢圓） */}
      <ellipse cx="70" cy="30" rx="6" ry="2.5" fill={appDesignTokens.accent} opacity="0.09" />
      <ellipse cx="30" cy="70" rx="7" ry="3" fill={appDesignTokens.secondary} opacity="0.07" />
      <ellipse cx="80" cy="80" rx="10" ry="4" fill={appDesignTokens.primary} opacity="0.05" />
    </svg>
  </div>
);

const Layout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen font-sans relative overflow-hidden">
      <GradientBackground />
      <Navbar iconType="coin" />
      <main className="w-full max-w-mobile md:max-w-tablet lg:max-w-desktop mx-auto p-4 z-10 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
