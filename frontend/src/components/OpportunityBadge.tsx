// frontend/src/components/OpportunityBadge.tsx
// 긍정적인 기회 알림 배지

import React from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarSpacing } from "../styles/encar-theme";

interface Props {
  stage: "Trust" | "Keep" | "Care" | "Next";
  currentValue: number;
  vehicleType: string;
}

export default function OpportunityBadge({ stage, currentValue, vehicleType }: Props) {
  // 단계별로 다른 기회 메시지 (긍정적)
  const getOpportunityMessage = () => {
    const currentMonth = new Date().getMonth() + 1;
    const isSummerDemand = currentMonth >= 5 && currentMonth <= 8;
    const isWinterDemand = currentMonth >= 11 || currentMonth <= 2;
    const isSUV = vehicleType === "suv";
    
    // Keep 단계 (3-5년차) - 펠리세이드 등
    if (stage === "Keep") {
      return {
        show: true,
        emoji: "💎",
        title: "프리미엄 시기",
        message: isSUV && isSummerDemand
          ? "SUV 성수기! 레저 수요 증가로 지금이 좋은 판매 타이밍이에요"
          : isSUV
          ? "대형 SUV는 꾸준한 수요가 있어요. 필요하시면 좋은 조건으로 거래 가능해요"
          : "적정 연식으로 가치가 안정적이에요. 지금이나 조금 더 타셔도 괜찮아요",
        socialProof: "오늘 67명이 시세 확인",
        color: "#1677ff",
        bgColor: "#e6f4ff",
        borderColor: "#91caff"
      };
    }
    
    // Care 단계 (5-8년차)
    if (stage === "Care") {
      return {
        show: true,
        emoji: "✨",
        title: "좋은 판매 타이밍",
        message: isSUV && isSummerDemand 
          ? "SUV 여름 수요 증가 중! 평균보다 좋은 조건으로 판매 가능해요"
          : "적정 보유 기간이라 합리적인 가격에 거래할 수 있어요",
        socialProof: "오늘 83명이 비교견적 신청",
        color: "#52c41a",
        bgColor: "#f6ffed",
        borderColor: "#b7eb8f"
      };
    }
    
    // Next 단계 (8년 이상)
    if (stage === "Next") {
      return {
        show: true,
        emoji: "🎯",
        title: "거래 적기",
        message: "충분히 타셨어요! 지금 팔고 다음 차로 갈아타기 좋은 시점이에요",
        socialProof: "이번 주 127건 거래 완료",
        color: "#fa8c16",
        bgColor: "#fff7e6",
        borderColor: "#ffd591"
      };
    }
    
    // Trust 단계는 표시 안 함
    return { show: false };
  };

  const opportunity = getOpportunityMessage();
  
  if (!opportunity.show) return null;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${opportunity.bgColor} 0%, white 100%)`,
      padding: EncarSpacing.md,
      borderRadius: EncarRadius.md,
      border: `2px solid ${opportunity.borderColor}`,
      marginBottom: EncarSpacing.md,
    }}>
      {/* 헤더 */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: EncarSpacing.xs,
        marginBottom: EncarSpacing.xs,
      }}>
        <span style={{ fontSize: "20px" }}>{opportunity.emoji}</span>
        <span style={{
          fontSize: EncarFonts.size.small,
          fontWeight: EncarFonts.weight.bold,
          color: opportunity.color,
        }}>
          {opportunity.title}
        </span>
      </div>
      
      {/* 메인 메시지 */}
      <div style={{
        fontSize: EncarFonts.size.small,
        color: EncarColors.dark,
        marginBottom: EncarSpacing.sm,
        lineHeight: 1.5,
      }}>
        {opportunity.message}
      </div>
      
      {/* 소셜 프루프 (자연스럽게) */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: EncarSpacing.md,
        fontSize: EncarFonts.size.tiny,
        color: EncarColors.darkGray,
      }}>
        <span>👥 {opportunity.socialProof}</span>
        <span>•</span>
        <span>⭐ 평균 만족도 4.8/5.0</span>
      </div>
    </div>
  );
}

