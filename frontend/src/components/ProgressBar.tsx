// frontend/src/components/ProgressBar.tsx
// 데이터 비주얼라이제이션용 프로그레스바

import React from "react";
import { EncarRadius } from "../styles/encar-theme";

interface Props {
  value: number; // 0-100
  color: string;
  height?: number;
  showValue?: boolean;
  animated?: boolean;
}

export default function ProgressBar({ value, color, height = 8, showValue = false, animated = true }: Props) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const clampedValue = Math.max(0, Math.min(100, value));

  React.useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(clampedValue);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(clampedValue);
    }
  }, [clampedValue, animated]);

  return (
    <div>
      <div style={{
        width: "100%",
        height,
        background: "#f0f0f0",
        borderRadius: EncarRadius.full,
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{
          width: `${displayValue}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: EncarRadius.full,
          transition: animated ? "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* 반짝이는 효과 */}
          {animated && (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              animation: "shimmer 2s infinite",
            }} />
          )}
        </div>
      </div>
      {showValue && (
        <div style={{
          fontSize: "12px",
          color: "#999",
          marginTop: 4,
          textAlign: "right",
        }}>
          {displayValue.toFixed(0)}%
        </div>
      )}
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}


