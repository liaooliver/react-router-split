import { Outlet } from "react-router";
import { appDesignTokens } from "~/assets/style/tokens";
import Navbar from "./navbar";

const GradientBackground = () => (
  <div className="absolute top-0 left-0 w-full h-full z-0">
    <div className="w-full h-full bg-gradient-custom" />
    <svg
      className="absolute top-0 left-0 w-full h-full opacity-20"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* 中心主要元素 */}
      <circle cx="50" cy="50" r="2.5" fill={appDesignTokens.primary} />

      {/* 左側元素群組 */}
      <circle cx="30" cy="50" r="1.5" fill={appDesignTokens.accent} />
      <circle cx="10" cy="50" r="1" fill={appDesignTokens.secondary} />
      <circle cx="20" cy="30" r="1.2" fill={appDesignTokens.primary} />
      <circle cx="15" cy="70" r="0.8" fill={appDesignTokens.accent} />

      {/* 右側元素群組 */}
      <circle cx="70" cy="50" r="1.5" fill={appDesignTokens.accent} />
      <circle cx="90" cy="50" r="1" fill={appDesignTokens.secondary} />
      <circle cx="80" cy="30" r="1.2" fill={appDesignTokens.primary} />
      <circle cx="85" cy="70" r="0.8" fill={appDesignTokens.accent} />

      {/* 上方元素群組 */}
      <circle cx="50" cy="20" r="1.8" fill={appDesignTokens.accent} />
      <circle cx="30" cy="25" r="1.2" fill={appDesignTokens.secondary} />
      <circle cx="70" cy="25" r="1.2" fill={appDesignTokens.primary} />
      <circle cx="40" cy="15" r="0.9" fill={appDesignTokens.secondary} />
      <circle cx="60" cy="15" r="0.9" fill={appDesignTokens.accent} />

      {/* 下方元素群組 */}
      <circle cx="50" cy="80" r="1.8" fill={appDesignTokens.secondary} />
      <circle cx="30" cy="75" r="1.2" fill={appDesignTokens.primary} />
      <circle cx="70" cy="75" r="1.2" fill={appDesignTokens.accent} />
      <circle cx="40" cy="85" r="0.9" fill={appDesignTokens.primary} />
      <circle cx="60" cy="85" r="0.9" fill={appDesignTokens.secondary} />

      {/* 裝飾線條 */}
      <path
        d="M20,50 Q35,50 40,50"
        stroke={appDesignTokens.secondary}
        strokeWidth="0.2"
        fill="none"
      />
      <path
        d="M60,50 Q75,50 80,50"
        stroke={appDesignTokens.accent}
        strokeWidth="0.2"
        fill="none"
      />
      <path
        d="M50,30 Q50,40 50,45"
        stroke={appDesignTokens.primary}
        strokeWidth="0.2"
        fill="none"
      />
      <path
        d="M50,55 Q50,65 50,70"
        stroke={appDesignTokens.accent}
        strokeWidth="0.2"
        fill="none"
      />

      {/* 散布的小點 */}
      <circle cx="25" cy="35" r="0.4" fill={appDesignTokens.primary} />
      <circle cx="75" cy="35" r="0.4" fill={appDesignTokens.secondary} />
      <circle cx="25" cy="65" r="0.4" fill={appDesignTokens.accent} />
      <circle cx="75" cy="65" r="0.4" fill={appDesignTokens.primary} />
      <circle cx="45" cy="25" r="0.4" fill={appDesignTokens.accent} />
      <circle cx="55" cy="75" r="0.4" fill={appDesignTokens.secondary} />
    </svg>
  </div>
);

const Layout = () => (
  <div className="min-h-screen font-sans relative overflow-hidden">
    <GradientBackground />
    <Navbar iconType="coin" />
    <main className="w-full max-w-mobile md:max-w-tablet lg:max-w-desktop mx-auto p-4 z-10 relative">
      <Outlet />
    </main>
  </div>
);

export default Layout;
