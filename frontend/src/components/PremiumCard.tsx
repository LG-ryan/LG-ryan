// frontend/src/components/PremiumCard.tsx
// 엔카 프리미엄 카드 컴포넌트

import React, { useState } from "react";
import { EncarColors, EncarRadius, EncarShadows } from "../styles/encar-theme";

interface Props {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  style?: React.CSSProperties;
}

export default function PremiumCard({ children, hover = true, glow = false, gradient = false, style = {} }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    background: gradient 
      ? `linear-gradient(135deg, ${EncarColors.white} 0%, #fafafa 100%)`
      : EncarColors.white,
    borderRadius: EncarRadius.lg,
    boxShadow: isHovered && hover ? EncarShadows.cardHover : EncarShadows.card,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isHovered && hover ? "translateY(-4px)" : "translateY(0)",
    border: glow && isHovered ? `2px solid ${EncarColors.primary}40` : "1px solid #f0f0f0",
    position: "relative",
    overflow: "hidden",
    ...style,
  };

  return (
    <div
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 글로우 효과 */}
      {glow && isHovered && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${EncarColors.primary}, ${EncarColors.primaryLight})`,
        }} />
      )}
      {children}
    </div>
  );
}




