// frontend/src/components/EncarServices.tsx
  // 엔카 실제 상품 자연스럽게

import React from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarShadows, EncarSpacing } from "../styles/encar-theme";
import { VehicleDashboard } from "../types/vehicle";

interface Props {
  dashboard: VehicleDashboard;
}

export default function EncarServices({ dashboard }: Props) {
  const { vehicle, lifecycle, timing } = dashboard;
  
  // 생애주기별 맞춤 상품
  const getRecommendedServices = () => {
    const services = [];
    const stage = lifecycle.stage;
    
    // 1. 내차팔기 (Care/Next 단계)
    if (stage === "Care" || stage === "Next") {
      services.push({
        type: "sell",
        title: "내차팔기",
        subtitle: "비교견적 & 직거래",
        description: `예상 ${Math.round(timing.nowValue / 10000)}만원`,
        icon: "💰",
        badge: "HOT",
        color: EncarColors.primary,
        action: "견적 받기",
        url: "https://www.encar.com",
        size: "large",
      });
    }
    
    // 2. 믿고 서비스 (모든 단계 - 위치만 다르게)
    if (stage === "Care" || stage === "Next") {
      // 판매 시점 → 믿고 판매
      services.push({
        type: "midgo-sell",
        title: "엔카믿고",
        subtitle: "안심 직거래",
        description: "엔카가 직접 사드려요",
        icon: "🤝",
        badge: "안심",
        color: "#13c2c2",
        action: "믿고 판매",
        url: "https://www.encar.com",
        size: "medium",
      });
    } else {
      // 보유 시점 → 믿고 구매
      services.push({
        type: "midgo-buy",
        title: "엔카믿고 배송",
        subtitle: "홈서비스 차량",
        description: "집에서 받는 중고차",
        icon: "🚚",
        color: "#1890ff",
        action: "차량 보기",
        url: "https://www.encar.com",
        size: "medium",
      });
      
      services.push({
        type: "midgo-visit",
        title: "엔카믿고 방문",
        subtitle: "안심거래존",
        description: "직접 보고 안전하게",
        icon: "🏢",
        color: "#722ed1",
        action: "매물 보기",
        url: "https://www.encar.com",
        size: "medium",
      });
    }
    
    // 3. 차량 찾아보기 (Next 단계 또는 관심 있을 때)
    if (stage === "Next" || stage === "Care") {
      services.push({
        type: "search",
        title: "다음 차 찾기",
        subtitle: "AI 맞춤 추천",
        description: "취향 기반 추천",
        icon: "🔍",
        badge: "NEW",
        color: "#52c41a",
        action: "차량 둘러보기",
        url: "https://www.encar.com",
        size: "medium",
      });
    }
    
    // 4. 보험 (모든 단계)
    services.push({
      type: "insurance",
      title: "자동차보험",
      subtitle: "보험료 절약",
      description: "최대 30% 할인",
      icon: "🛡️",
      color: "#fa8c16",
      action: "보험 비교",
      url: "https://www.encar.com",
      size: "small",
    });
    
    return services;
  };

  const services = getRecommendedServices();
  
  // 메인 CTA (가장 큰 것)
  const mainCTA = services.find(s => s.size === "large");
  const otherServices = services.filter(s => s.size !== "large");

  return (
    <div style={{ marginBottom: EncarSpacing.lg }}>
      <div style={{
        fontSize: EncarFonts.size.medium,
        fontWeight: EncarFonts.weight.bold,
        color: EncarColors.dark,
        marginBottom: EncarSpacing.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span>💡 엔카 서비스</span>
        <span style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray, fontWeight: EncarFonts.weight.regular }}>
          맞춤 추천
        </span>
      </div>

      {/* 서비스 그리드 (유동적) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: EncarSpacing.sm,
      }}>
        {services.map((service, idx) => (
          <a
            key={idx}
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              background: `linear-gradient(135deg, ${service.color}08 0%, ${service.color}03 100%)`,
              padding: EncarSpacing.md,
              borderRadius: EncarRadius.lg,
              border: `2px solid ${service.color}20`,
              textDecoration: "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              gridColumn: service.size === "large" ? "span 2" : service.size === "medium" ? "span 1" : "span 1",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = service.color;
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.background = `linear-gradient(135deg, ${service.color}15 0%, ${service.color}08 100%)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${service.color}20`;
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.background = `linear-gradient(135deg, ${service.color}08 0%, ${service.color}03 100%)`;
            }}
          >
            {/* 배지 */}
            {service.badge && (
              <div style={{
                position: "absolute",
                top: 8,
                right: 8,
                padding: "2px 8px",
                background: service.color,
                color: "white",
                borderRadius: EncarRadius.full,
                fontSize: "10px",
                fontWeight: EncarFonts.weight.bold,
              }}>
                {service.badge}
              </div>
            )}
            
            <div style={{ fontSize: "32px", marginBottom: EncarSpacing.xs }}>
              {service.icon}
            </div>
            <div style={{
              fontSize: EncarFonts.size.body,
              fontWeight: EncarFonts.weight.bold,
              color: EncarColors.dark,
              marginBottom: 2,
            }}>
              {service.title}
            </div>
            <div style={{
              fontSize: EncarFonts.size.tiny,
              color: EncarColors.darkGray,
              marginBottom: EncarSpacing.xs,
            }}>
              {service.subtitle}
            </div>
            <div style={{
              fontSize: EncarFonts.size.tiny,
              color: EncarColors.lightGray,
              marginBottom: EncarSpacing.sm,
            }}>
              {service.description}
            </div>
            <div style={{
              fontSize: EncarFonts.size.small,
              fontWeight: EncarFonts.weight.semibold,
              color: service.color,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              <span>{service.action}</span>
              <span style={{ transition: "transform 0.2s" }}>→</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

