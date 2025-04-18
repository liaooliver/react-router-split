import React from "react";

const dountColor = [
  "#0066CC",
  "#FFC107",
  "#2196F3",
  "#FF9800",
  "#4caf50",
  "#e91e63",
];

import type { CategoryDistributionInterface } from "~/types/eventDashboard";

interface DonutChartProps {
  data: CategoryDistributionInterface[];
  totalAmount: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, totalAmount }) => {
  let startAngle = 0;
  const pathData = data.map((item, index) => {
    const percentage = (item.amount / totalAmount) * 100;
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = 40 + 30 * Math.cos(startRad);
    const y1 = 40 + 30 * Math.sin(startRad);
    const x2 = 40 + 30 * Math.cos(endRad);
    const y2 = 40 + 30 * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathString = `M 40 40 L ${x1} ${y1} A 30 30 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    startAngle = endAngle;

    return (
      <path
        key={index}
        d={pathString}
        fill={dountColor[index]}
        stroke="#fff"
        strokeWidth="1"
        className="transition-all duration-300 hover:opacity-80"
      />
    );
  });

  return (
    <div className="relative">
      <svg viewBox="0 0 80 80" width="120" height="120" className="mx-auto">
        {pathData}
        <circle cx="40" cy="40" r="15" fill="#fff" />
        <text
          x="40"
          y="44"
          textAnchor="middle"
          fontSize="8"
          fontWeight="bold"
          fill="#263238"
        >
          ${totalAmount}
        </text>
      </svg>
      {/* 右上角手繪風格錢幣圖示 */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xs">$</span>
      </div>
    </div>
  );
};

export default DonutChart;
