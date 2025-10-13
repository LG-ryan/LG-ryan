// frontend/src/components/VehicleDashboard/FloatingNav.tsx
import React from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarSpacing } from "../../styles/encar-theme";

interface Props {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
  hasMaintenanceSchedule: boolean;
}

export default function FloatingNav({ activeSection, scrollToSection, hasMaintenanceSchedule }: Props) {
  // 네비게이션 메뉴
  const navigationItems = [
    { id: "garage", icon: "🚗", label: "내 차고" },
    { id: "lifecycle", icon: "🛣️", label: "오토 라이프" },
    { id: "ai", icon: "📊", label: "빅데이터" },
    { id: "timing", icon: "💰", label: "판매 타이밍" },
    { id: "maintenance", icon: "🔧", label: "정비 일정" },
    { id: "tco", icon: "💵", label: "누적 비용" },
    { id: "memory", icon: "📸", label: "추억" },
  ];

  // 엔카 서비스 (3색 통일)
  const encarServices = [
    { 
      id: "delivery",
      name: "믿고배송", 
      subtext: "맞춤 추천",
      icon: "🚚", 
      url: "https://www.encar.com",
      color: EncarColors.info, // 파랑
      highlight: activeSection === "lifecycle",
    },
    { 
      id: "visit",
      name: "믿고방문", 
      subtext: "차량 둘러보기",
      icon: "🏢", 
      url: "https://www.encar.com",
      color: EncarColors.success, // 초록
      highlight: activeSection === "garage",
    },
    { 
      id: "comparison",
      name: "비교견적", 
      subtext: "최고가 받기",
      icon: "💰", 
      url: "https://www.encar.com",
      color: EncarColors.primary, // 주황
      highlight: activeSection === "timing",
    },
  ];

  return (
    <div style={{
      position: "fixed",
      right: "max(20px, calc((100vw - 1200px) / 2 - 120px))",
      top: "50%",
      transform: "translateY(-50%)",
      background: "white",
      borderRadius: EncarRadius.lg,
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      padding: EncarSpacing.sm,
      zIndex: 1000,
      maxHeight: "90vh",
      overflowY: "auto",
    }}>
      {/* 네비게이터 박스 */}
      <div style={{
        background: "#fafafa",
        borderRadius: EncarRadius.lg,
        padding: EncarSpacing.sm,
        border: `1px solid ${EncarColors.borderLight}`,
      }}>
        {/* 헤더 */}
        <div style={{
          fontSize: "10px",
          fontWeight: EncarFonts.weight.extrabold,
          color: EncarColors.darkGray,
          textAlign: "center",
          marginBottom: EncarSpacing.sm,
          letterSpacing: "0.5px",
          background: "white",
          padding: `${EncarSpacing.xs} 0`,
          borderRadius: EncarRadius.md,
        }}>
          🧭 네비게이터
        </div>

        {/* 네비게이션 아이템 */}
        {navigationItems.map((item) => {
          // 정비 일정이 없으면 해당 항목 숨기기
          if (item.id === "maintenance" && !hasMaintenanceSchedule) {
            return null;
          }
          
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "60px",
                background: isActive ? EncarColors.primary : "white",
                border: `2px solid ${isActive ? EncarColors.primary : EncarColors.borderLight}`,
                borderRadius: EncarRadius.md,
                cursor: "pointer",
                transition: "all 0.2s",
                marginBottom: EncarSpacing.xs,
                padding: EncarSpacing.xs,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#f5f5f5";
                  e.currentTarget.style.borderColor = EncarColors.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.borderColor = EncarColors.borderLight;
                }
              }}
              title={item.label}
            >
              <span style={{ 
                fontSize: "20px",
                marginBottom: "2px",
              }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: isActive ? EncarFonts.weight.bold : EncarFonts.weight.medium,
                color: isActive ? "white" : EncarColors.darkGray,
                lineHeight: 1.2,
                textAlign: "center",
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 구분선 */}
      <div style={{
        height: "1px",
        background: EncarColors.borderLight,
        margin: `${EncarSpacing.lg} 0`,
      }} />

      {/* 엔카 서비스 박스 (강조) */}
      <div style={{
        background: `linear-gradient(135deg, ${EncarColors.primary}15 0%, ${EncarColors.primary}05 100%)`,
        borderRadius: EncarRadius.lg,
        padding: EncarSpacing.sm,
        margin: `0 ${EncarSpacing.xs}`,
        border: `2px solid ${EncarColors.primary}40`,
        boxShadow: `0 0 20px ${EncarColors.primary}20`,
        animation: "pulse-glow 3s infinite",
      }}>
        {/* 헤더 */}
        <div style={{
          fontSize: "10px",
          fontWeight: EncarFonts.weight.extrabold,
          color: EncarColors.primary,
          textAlign: "center",
          marginBottom: EncarSpacing.sm,
          letterSpacing: "0.5px",
          background: "white",
          padding: `${EncarSpacing.xs} 0`,
          borderRadius: EncarRadius.md,
        }}>
          💡 엔카 서비스
        </div>

        {/* 서비스 버튼들 */}
        {encarServices.map((service, idx) => (
          <a
            key={idx}
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            data-service={service.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "70px",
              borderRadius: EncarRadius.md,
              textDecoration: "none",
              transition: "all 0.3s",
              marginBottom: idx < encarServices.length - 1 ? EncarSpacing.xs : 0,
              background: service.highlight ? service.color : "white",
              border: service.highlight ? `3px solid ${service.color}` : `2px solid ${service.color}30`,
              position: "relative",
              transform: service.highlight ? "scale(1.05)" : "scale(1)",
              boxShadow: service.highlight ? `0 4px 16px ${service.color}40` : "none",
              animation: service.highlight ? "bounce-highlight 1s infinite" : "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = service.color;
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              const icon = e.currentTarget.querySelector('.service-icon') as HTMLElement;
              const text = e.currentTarget.querySelector('.service-text') as HTMLElement;
              const subtext = e.currentTarget.querySelector('.service-subtext') as HTMLElement;
              if (icon) icon.style.transform = "scale(1.2)";
              if (text) text.style.color = "white";
              if (subtext) subtext.style.color = "white";
            }}
            onMouseLeave={(e) => {
              if (!service.highlight) {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              } else {
                e.currentTarget.style.background = service.color;
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `0 4px 16px ${service.color}40`;
              }
              const icon = e.currentTarget.querySelector('.service-icon') as HTMLElement;
              const text = e.currentTarget.querySelector('.service-text') as HTMLElement;
              const subtext = e.currentTarget.querySelector('.service-subtext') as HTMLElement;
              if (icon) icon.style.transform = "scale(1)";
              if (text) text.style.color = service.highlight ? "white" : service.color;
              if (subtext) subtext.style.color = service.highlight ? "white" : EncarColors.darkGray;
            }}
          >
            {/* 하이라이트 배지 */}
            {service.highlight && (
              <div style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "#ff4d4f",
                color: "white",
                fontSize: "9px",
                fontWeight: EncarFonts.weight.bold,
                padding: "2px 6px",
                borderRadius: EncarRadius.full,
                boxShadow: "0 2px 8px rgba(255, 77, 79, 0.4)",
                animation: "pulse-badge 1.5s infinite",
              }}>
                NOW
              </div>
            )}

            <span 
              className="service-icon"
              style={{ 
                fontSize: "24px",
                marginBottom: "2px",
                transition: "all 0.2s",
              }}
            >
              {service.icon}
            </span>
            <span 
              className="service-text"
              style={{
                fontSize: "11px",
                fontWeight: EncarFonts.weight.bold,
                color: service.highlight ? "white" : service.color,
                lineHeight: 1.2,
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              {service.name}
            </span>
            <span 
              className="service-subtext"
              style={{
                fontSize: "9px",
                fontWeight: EncarFonts.weight.medium,
                color: service.highlight ? "white" : EncarColors.darkGray,
                lineHeight: 1.2,
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              {service.subtext}
            </span>
          </a>
        ))}
      </div>

      {/* 애니메이션 CSS */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px ${EncarColors.primary}20;
          }
          50% {
            box-shadow: 0 0 30px ${EncarColors.primary}40;
          }
        }
        
        @keyframes bounce-highlight {
          0%, 100% {
            transform: scale(1.05) translateY(0);
          }
          50% {
            transform: scale(1.05) translateY(-4px);
          }
        }
        
        @keyframes pulse-badge {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

