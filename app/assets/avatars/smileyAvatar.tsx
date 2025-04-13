// src/components/avatars/SmileyAvatar.js
const SmileyAvatar = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* <!-- 背景圓 --> */}
    <circle cx="20" cy="20" r="20" fill="#FFFFFF" />
    {/* <!-- 臉 --> */}
    <circle
      cx="20"
      cy="20"
      r="15"
      fill="#FFFFFF"
      stroke="#000000"
      stroke-width="1"
    />
    {/* <!-- 頭髮 --> */}
    <path d="M15 12C15 10 20 10 20 10C20 10 25 10 25 12" fill="#000000" />
    {/* <!-- 眼睛 --> */}
    <circle cx="16" cy="18" r="1.5" fill="#000000" />
    <circle cx="24" cy="18" r="1.5" fill="#000000" />
    {/* <!-- 嘴 --> */}
    <path d="M16 24C16 26 20 26 24 24" stroke="#000000" stroke-width="1" />
  </svg>
);

export default SmileyAvatar;
