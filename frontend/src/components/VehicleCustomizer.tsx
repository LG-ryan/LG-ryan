// frontend/src/components/VehicleCustomizer.tsx
// 차량 커스터마이징 (최소 기능)

import React, { useState } from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarSpacing } from "../styles/encar-theme";

interface Props {
  vehicleId: string;
  vehicleType: string;
  onSave: (customization: VehicleCustomization) => void;
}

export interface VehicleCustomization {
  bodyColor: string;
  rotation: number;
}

export default function VehicleCustomizer({ vehicleId, vehicleType, onSave }: Props) {
  // localStorage에서 저장된 커스터마이징 불러오기
  const loadCustomization = (): VehicleCustomization => {
    const saved = localStorage.getItem(`vehicle_custom_${vehicleId}`);
    return saved ? JSON.parse(saved) : { bodyColor: "#FF6C00", rotation: 0 };
  };

  const [customization, setCustomization] = useState<VehicleCustomization>(loadCustomization());
  const [showModal, setShowModal] = useState(false);

  // 색상 팔레트 (10가지, 무료)
  const colors = [
    { name: "엔카 오렌지", hex: "#FF6C00" },
    { name: "퓨어 화이트", hex: "#FFFFFF" },
    { name: "미드나잇 블랙", hex: "#1a1a1a" },
    { name: "스틸 그레이", hex: "#8C8C8C" },
    { name: "실버 메탈릭", hex: "#C0C0C0" },
    { name: "로얄 블루", hex: "#1677ff" },
    { name: "레이싱 레드", hex: "#ff4d4f" },
    { name: "포레스트 그린", hex: "#52c41a" },
    { name: "골든 옐로우", hex: "#faad14" },
    { name: "딥 퍼플", hex: "#722ed1" },
  ];

  // 360도 회전 (8방향)
  const rotations = [
    { angle: 0, label: "정면" },
    { angle: 45, label: "우측 앞" },
    { angle: 90, label: "우측" },
    { angle: 135, label: "우측 뒤" },
    { angle: 180, label: "뒷면" },
    { angle: 225, label: "좌측 뒤" },
    { angle: 270, label: "좌측" },
    { angle: 315, label: "좌측 앞" },
  ];

  const handleColorChange = (hex: string) => {
    const newCustomization = { ...customization, bodyColor: hex };
    setCustomization(newCustomization);
    localStorage.setItem(`vehicle_custom_${vehicleId}`, JSON.stringify(newCustomization));
    onSave(newCustomization);
  };

  const handleRotationChange = (angle: number) => {
    const newCustomization = { ...customization, rotation: angle };
    setCustomization(newCustomization);
    localStorage.setItem(`vehicle_custom_${vehicleId}`, JSON.stringify(newCustomization));
    onSave(newCustomization);
  };

  return (
    <>
      {/* 꾸미기 버튼 */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: "absolute",
          top: EncarSpacing.sm,
          right: EncarSpacing.sm,
          padding: `${EncarSpacing.xs} ${EncarSpacing.md}`,
          background: "white",
          border: `2px solid ${EncarColors.primary}`,
          borderRadius: EncarRadius.md,
          color: EncarColors.primary,
          fontSize: EncarFonts.size.tiny,
          fontWeight: EncarFonts.weight.semibold,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: EncarSpacing.xs,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = EncarColors.primary;
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.color = EncarColors.primary;
        }}
      >
        <span>🎨</span>
        <span>차량 꾸미기</span>
      </button>

      {/* 커스터마이징 모달 */}
      {showModal && (
        <>
          {/* 오버레이 */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 9998,
            }}
            onClick={() => setShowModal(false)}
          />

          {/* 모달 */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              borderRadius: EncarRadius.xl,
              padding: EncarSpacing.xl,
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              zIndex: 9999,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* 헤더 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: EncarSpacing.lg,
              }}
            >
              <h3
                style={{
                  fontSize: EncarFonts.size.large,
                  fontWeight: EncarFonts.weight.bold,
                  color: EncarColors.dark,
                }}
              >
                🎨 차량 꾸미기
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  color: EncarColors.lightGray,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* 프리뷰 영역 */}
            <div
              style={{
                background: "#f5f5f5",
                borderRadius: EncarRadius.lg,
                padding: EncarSpacing.xl,
                marginBottom: EncarSpacing.lg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
              }}
            >
              {/* 간단한 차량 아이콘 (SVG 대신 이모지 + 색상) */}
              <div
                style={{
                  fontSize: "120px",
                  filter: `hue-rotate(${customization.rotation}deg) brightness(1.2)`,
                  transform: `rotate(${customization.rotation}deg)`,
                  transition: "all 0.5s",
                  color: customization.bodyColor,
                }}
              >
                {vehicleType === "sedan" ? "🚙" : 
                 vehicleType === "suv" ? "🚙" :
                 vehicleType === "hatchback" ? "🚗" :
                 vehicleType === "coupe" ? "🏎️" :
                 vehicleType === "van" ? "🚐" :
                 vehicleType === "pickup" ? "🛻" :
                 vehicleType === "truck" ? "🚚" : "🚗"}
              </div>

              {/* 현재 각도 표시 */}
              <div
                style={{
                  marginTop: EncarSpacing.md,
                  fontSize: EncarFonts.size.tiny,
                  color: EncarColors.darkGray,
                }}
              >
                {rotations.find((r) => r.angle === customization.rotation)?.label || "정면"}
              </div>
            </div>

            {/* 색상 선택 */}
            <div style={{ marginBottom: EncarSpacing.xl }}>
              <h4
                style={{
                  fontSize: EncarFonts.size.small,
                  fontWeight: EncarFonts.weight.semibold,
                  color: EncarColors.dark,
                  marginBottom: EncarSpacing.sm,
                }}
              >
                바디 컬러
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: EncarSpacing.sm,
                }}
              >
                {colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => handleColorChange(color.hex)}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      background: color.hex,
                      border:
                        customization.bodyColor === color.hex
                          ? `3px solid ${EncarColors.primary}`
                          : color.hex === "#FFFFFF"
                          ? "2px solid #e8e8e8"
                          : "2px solid transparent",
                      borderRadius: EncarRadius.md,
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    title={color.name}
                  >
                    {customization.bodyColor === color.hex && (
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: "20px",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 회전 조절 */}
            <div style={{ marginBottom: EncarSpacing.lg }}>
              <h4
                style={{
                  fontSize: EncarFonts.size.small,
                  fontWeight: EncarFonts.weight.semibold,
                  color: EncarColors.dark,
                  marginBottom: EncarSpacing.sm,
                }}
              >
                360도 회전
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: EncarSpacing.xs,
                }}
              >
                {rotations.map((rotation) => (
                  <button
                    key={rotation.angle}
                    onClick={() => handleRotationChange(rotation.angle)}
                    style={{
                      padding: EncarSpacing.sm,
                      background:
                        customization.rotation === rotation.angle
                          ? EncarColors.primary
                          : "white",
                      border: `2px solid ${
                        customization.rotation === rotation.angle
                          ? EncarColors.primary
                          : EncarColors.borderLight
                      }`,
                      borderRadius: EncarRadius.md,
                      color:
                        customization.rotation === rotation.angle
                          ? "white"
                          : EncarColors.dark,
                      fontSize: EncarFonts.size.tiny,
                      fontWeight: EncarFonts.weight.medium,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {rotation.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 안내 메시지 */}
            <div
              style={{
                padding: EncarSpacing.md,
                background: "#f0f5ff",
                borderRadius: EncarRadius.md,
                fontSize: EncarFonts.size.tiny,
                color: EncarColors.darkGray,
                lineHeight: 1.6,
              }}
            >
              💡 <strong>자동 저장:</strong> 변경사항이 자동으로 저장돼요
            </div>
          </div>
        </>
      )}
    </>
  );
}

