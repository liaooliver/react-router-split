import React from "react";

const LoadingSpinner: React.FC<{ text?: string }> = ({ text }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#00C4CC] mb-4"></div>
    <div className="text-lg text-[#263238] font-medium">
      {text || "載入中..."}
    </div>
  </div>
);

export default LoadingSpinner;
