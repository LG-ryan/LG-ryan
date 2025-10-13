// frontend/src/components/VehicleAvatar.tsx
// 간단한 차량 아바타 (SVG 기반)

import React, { useState } from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarSpacing } from "../styles/encar-theme";

interface Props {
  vehicleType: "sedan" | "suv" | "hatchback" | "coupe" | "van" | "pickup" | "truck";
  condition: number; // 0-100
  customColor?: string;
}

export default function VehicleAvatar({ vehicleType, condition, customColor = EncarColors.primary }: Props) {
  const [selectedColor, setSelectedColor] = useState(customColor);

  // 차량 타입별 귀여운 SVG (더 디테일하게)
  const getVehicleIllustration = () => {
    switch (vehicleType) {
      case "suv":
        // SUV - 팰리세이드처럼 크고 각진 느낌
        return {
          body: "M15 40 L15 30 Q15 25 20 25 L30 25 L35 15 L65 15 L70 25 L80 25 Q85 25 85 30 L85 40 Q85 45 80 45 L20 45 Q15 45 15 40 Z",
          window: "M38 20 L40 25 L60 25 L62 20 Z",
          frontWindow: "M32 20 L35 25 L40 25 L38 20 Z",
          rearWindow: "M62 20 L65 25 L68 25 L65 20 Z",
          wheel1: "M22 45 A6 6 0 1 1 22 44.9",
          wheel2: "M72 45 A6 6 0 1 1 72 44.9",
          grill: "M20 42 L30 42 M22 40 L28 40",
          icon: "🚙",
        };
      case "sedan":
        // 세단 - 날렵하고 낮은 실루엣
        return {
          body: "M15 38 L15 32 Q15 28 20 28 L30 28 L35 22 L50 22 L55 26 L65 28 L75 28 Q80 28 80 32 L80 38 Q80 42 75 42 L20 42 Q15 42 15 38 Z",
          window: "M38 26 L40 28 L55 28 L57 26 Z",
          frontWindow: "M32 26 L35 28 L40 28 L38 26 Z",
          rearWindow: "M57 26 L60 28 L63 28 L60 26 Z",
          wheel1: "M23 42 A5 5 0 1 1 23 41.9",
          wheel2: "M72 42 A5 5 0 1 1 72 41.9",
          grill: "M20 40 L28 40 M22 38 L26 38",
          icon: "🚗",
        };
      case "hatchback":
        // 해치백 - 짧고 귀여운 뒷부분
        return {
          body: "M18 38 L18 32 Q18 28 22 28 L32 28 L37 22 L57 22 L62 28 L72 28 Q76 28 76 32 L76 38 Q76 42 72 42 L22 42 Q18 42 18 38 Z",
          window: "M40 26 L42 28 L55 28 L57 26 L52 22 L45 22 Z",
          frontWindow: "M35 26 L37 28 L42 28 L40 26 Z",
          rearWindow: "M55 26 L57 28 L58 28 L57 22 L55 26 Z",
          wheel1: "M25 42 A5 5 0 1 1 25 41.9",
          wheel2: "M69 42 A5 5 0 1 1 69 41.9",
          grill: "M22 40 L30 40",
          icon: "🚕",
        };
      case "coupe":
        // 쿠페 - 매우 낮고 날렵
        return {
          body: "M15 36 L15 32 Q15 28 20 28 L32 28 L38 18 L58 18 L64 28 L76 28 Q80 28 80 32 L80 36 Q80 40 76 40 L20 40 Q15 40 15 36 Z",
          window: "M40 22 L42 28 L54 28 L56 22 Z",
          frontWindow: "M36 22 L38 28 L42 28 L40 22 Z",
          rearWindow: "M56 22 L58 28 L60 28 L58 22 Z",
          wheel1: "M24 40 A4 4 0 1 1 24 39.9",
          wheel2: "M72 40 A4 4 0 1 1 72 39.9",
          grill: "M20 38 L28 38 M22 36 L26 36",
          spoiler: "M60 18 L68 18 L68 20 L60 20 Z",
          icon: "🏎️",
        };
      case "van":
        // 밴/MPV - 크고 높은 박스형
        return {
          body: "M15 42 L15 28 Q15 24 20 24 L28 24 L32 16 L68 16 L72 24 L80 24 Q85 24 85 28 L85 42 Q85 46 80 46 L20 46 Q15 46 15 42 Z",
          window: "M35 20 L38 24 L62 24 L65 20 Z",
          frontWindow: "M30 20 L33 24 L38 24 L35 20 Z",
          rearWindow: "M65 20 L68 24 L70 24 L68 20 Z",
          wheel1: "M22 46 A6 6 0 1 1 22 45.9",
          wheel2: "M73 46 A6 6 0 1 1 73 45.9",
          grill: "M20 44 L30 44",
          icon: "🚐",
        };
      case "pickup":
        // 픽업트럭 - 뒤가 열린 화물칸
        return {
          body: "M15 40 L15 30 Q15 26 20 26 L30 26 L35 18 L55 18 L58 26 L65 26 L65 40 Q65 44 62 44 L20 44 Q15 44 15 40 Z M65 26 L85 26 L85 40 L65 40",
          window: "M38 22 L40 26 L52 26 L54 22 Z",
          frontWindow: "M33 22 L35 26 L40 26 L38 22 Z",
          wheel1: "M22 44 A6 6 0 1 1 22 43.9",
          wheel2: "M75 44 A6 6 0 1 1 75 43.9",
          grill: "M20 42 L28 42",
          icon: "🛻",
        };
      case "truck":
        // 트럭 - 캐빈과 화물칸 분리
        return {
          body: "M15 38 L15 28 Q15 24 20 24 L28 24 L32 16 L48 16 L50 24 L55 24 L55 38 Q55 42 52 42 L20 42 Q15 42 15 38 Z M58 24 L85 24 L85 40 L58 40 L58 24",
          window: "M35 20 L38 24 L45 24 L47 20 Z",
          wheel1: "M22 42 A5 5 0 1 1 22 41.9",
          wheel2: "M75 42 A6 6 0 1 1 75 41.9",
          grill: "M20 40 L26 40",
          icon: "🚚",
        };
      default:
        return {
          body: "M15 38 L15 32 Q15 28 20 28 L30 28 L35 22 L65 22 L70 28 L80 28 Q85 28 85 32 L85 38 Q85 42 80 42 L20 42 Q15 42 15 38 Z",
          window: "M38 26 L40 28 L60 28 L62 26 Z",
          wheel1: "M23 42 A5 5 0 1 1 23 41.9",
          wheel2: "M72 42 A5 5 0 1 1 72 41.9",
          grill: "M20 40 L28 40",
          icon: "🚗",
        };
    }
  };

  const vehicle = getVehicleIllustration();

  // 컨디션에 따른 광택 효과
  const getShineEffect = () => {
    if (condition >= 80) return "url(#shine)";
    return "none";
  };

  // 색상 옵션
  const colorOptions = [
    { name: "엔카 블루", color: EncarColors.primary },
    { name: "블랙", color: "#2c2c2c" },
    { name: "화이트", color: "#f5f5f5" },
    { name: "레드", color: "#ff4d4f" },
    { name: "그레이", color: "#8c8c8c" },
    { name: "실버", color: "#bfbfbf" },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      {/* SVG 차량 (더 예쁘게) */}
      <svg
        width="140"
        height="100"
        viewBox="0 0 100 60"
        style={{
          filter: condition >= 80 ? "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" : "drop-shadow(0 2px 6px rgba(0,0,0,0.1)) grayscale(5%)",
          transition: "all 0.3s",
        }}
      >
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={selectedColor} stopOpacity="1" />
            <stop offset="100%" stopColor={selectedColor} stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="50%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id="carShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/>
          </filter>
        </defs>
        
        {/* 차량 바디 */}
        <path
          d={vehicle.body}
          fill="url(#bodyGradient)"
          stroke="#2c2c2c"
          strokeWidth="1.2"
          strokeLinejoin="round"
          filter="url(#carShadow)"
        />
        
        {/* 윈도우 (메인) */}
        <path
          d={vehicle.window}
          fill="#87CEEB"
          opacity="0.7"
          stroke="#2c2c2c"
          strokeWidth="0.5"
        />
        
        {/* 윈도우 (앞) */}
        {vehicle.frontWindow && (
          <path
            d={vehicle.frontWindow}
            fill="#87CEEB"
            opacity="0.6"
            stroke="#2c2c2c"
            strokeWidth="0.5"
          />
        )}
        
        {/* 윈도우 (뒤) */}
        {vehicle.rearWindow && (
          <path
            d={vehicle.rearWindow}
            fill="#87CEEB"
            opacity="0.6"
            stroke="#2c2c2c"
            strokeWidth="0.5"
          />
        )}
        
        {/* 바퀴 */}
        <circle cx="25" cy="45" r="5" fill="#2c2c2c" stroke="#666" strokeWidth="1" />
        <circle cx="25" cy="45" r="3" fill="#999" />
        <circle cx="72" cy="45" r="5" fill="#2c2c2c" stroke="#666" strokeWidth="1" />
        <circle cx="72" cy="45" r="3" fill="#999" />
        
        {/* 그릴 */}
        <path
          d={vehicle.grill}
          stroke="#666"
          strokeWidth="1"
        />
        
        {/* 광택 효과 (고컨디션) */}
        {condition >= 80 && (
          <>
            <ellipse
              cx="48"
              cy="28"
              rx="15"
              ry="6"
              fill="url(#shineGradient)"
            />
            <circle cx="42" cy="26" r="2" fill="white" opacity="0.8" />
          </>
        )}
        
        {/* 라이트 효과 */}
        <circle cx="20" cy="42" r="1.5" fill="#fff9e6" opacity="0.9" />
        <circle cx="78" cy="42" r="1.5" fill="#ffe6e6" opacity="0.8" />
        
        {/* 스포일러 (스포츠카) */}
        {vehicle.spoiler && (
          <path
            d={vehicle.spoiler}
            fill={selectedColor}
            stroke="#2c2c2c"
            strokeWidth="0.5"
          />
        )}
      </svg>

      {/* 색상 선택 */}
      <div style={{ marginTop: EncarSpacing.md }}>
        <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
          {colorOptions.map((opt) => (
            <button
              key={opt.color}
              onClick={() => setSelectedColor(opt.color)}
              style={{
                width: 20,
                height: 20,
                borderRadius: EncarRadius.full,
                background: opt.color,
                border: selectedColor === opt.color ? `3px solid ${EncarColors.primary}` : "2px solid #d9d9d9",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: selectedColor === opt.color ? "0 0 0 2px white, 0 2px 6px rgba(0,0,0,0.15)" : "0 1px 2px rgba(0,0,0,0.1)",
              }}
              title={opt.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

