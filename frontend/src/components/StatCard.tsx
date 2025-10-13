// frontend/src/components/StatCard.tsx
// 숫자 데이터 표시용 카드

import React from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarSpacing } from "../styles/encar-theme";

interface Props {
  icon: string;
  label: string;
  value: string;
  subtext?: string;
  color?: string;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({ icon, label, value, subtext, color = EncarColors.primary, trend }: Props) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  
  const trendIcon = trend === "up" ? "↗" : trend === "down" ? "↘" : "";
  const trendColor = trend === "up" ? "#52c41a" : trend === "down" ? "#ff4d4f" : EncarColors.lightGray;

  return (
    <div 
      style={{
        padding: EncarSpacing.md,
        background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
        border: `1px solid ${color}20`,
        borderRadius: EncarRadius.lg,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        transform: isPressed ? "scale(0.98)" : (isHovered ? "translateY(-2px)" : "translateY(0)"),
        boxShadow: isHovered ? "0 8px 24px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: EncarSpacing.sm,
        marginBottom: EncarSpacing.xs,
      }}>
        <span style={{ fontSize: "20px" }}>{icon}</span>
        <span style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray }}>{label}</span>
      </div>
      
      <div style={{
        fontSize: EncarFonts.size.large,
        fontWeight: EncarFonts.weight.extrabold,
        color: EncarColors.dark,
        marginBottom: subtext ? EncarSpacing.xs : 0,
      }}>
        {value}
        {trend && (
          <span style={{ fontSize: EncarFonts.size.small, color: trendColor, marginLeft: EncarSpacing.xs }}>
            {trendIcon}
          </span>
        )}
      </div>
      
      {subtext && (
        <div style={{
          fontSize: EncarFonts.size.tiny,
          color: EncarColors.lightGray,
        }}>
          {subtext}
        </div>
      )}
    </div>
  );
}


