// frontend/src/components/DashboardOnboarding.tsx
// 대시보드 첫 방문 온보딩

import React, { useState, useEffect } from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarSpacing } from "../styles/encar-theme";

interface Props {
  vehicleId: string;
  vehicleName: string;
  onComplete: () => void;
}

export default function DashboardOnboarding({ vehicleId, vehicleName, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // localStorage에서 온보딩 완료 여부 확인
    const completed = localStorage.getItem(`onboarding_completed_${vehicleId}`);
    if (!completed) {
      // 0.5초 후에 표시 (페이지 로드 완료 후)
      setTimeout(() => setShow(true), 500);
    }
  }, [vehicleId]);

  const handleComplete = () => {
    localStorage.setItem(`onboarding_completed_${vehicleId}`, 'true');
    setShow(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem(`onboarding_completed_${vehicleId}`, 'true');
    setShow(false);
  };

  if (!show) return null;

  const steps = [
    {
      title: `${vehicleName}의 완벽한 분석이 준비됐어요! 🎉`,
      description: "AI가 분석한 핵심 정보 3가지를 확인해보세요",
      visual: "🚗",
      action: "시작하기",
    },
    {
      title: "1. 오토 라이프 단계",
      description: "지금 어느 단계인지, 미래는 어떨지 클릭해서 확인해보세요",
      visual: "🛣️",
      highlight: "#section-lifecycle",
      action: "다음",
    },
    {
      title: "2. AI 판매 타이밍 분석",
      description: "지금 팔면 얼마인지, 언제가 최적 타이밍인지 AI가 알려드려요",
      visual: "💰",
      highlight: "#section-timing",
      action: "다음",
    },
    {
      title: "3. 플로팅 네비게이터",
      description: "오른쪽 메뉴로 원하는 정보에 바로 이동할 수 있어요",
      visual: "🧭",
      highlight: ".floating-navigator",
      action: "시작하기",
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <>
      {/* 오버레이 (반투명) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.7)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={step === 0 ? undefined : () => setStep(step + 1)}
      />

      {/* 하이라이트 영역 (step > 0일 때만) */}
      {step > 0 && currentStep.highlight && (() => {
        const element = document.querySelector(currentStep.highlight);
        if (!element) return null;
        
        const rect = element.getBoundingClientRect();
        return (
          <div
            style={{
              position: "fixed",
              top: rect.top - 8,
              left: rect.left - 8,
              width: rect.width + 16,
              height: rect.height + 16,
              border: "4px solid " + EncarColors.primary,
              borderRadius: EncarRadius.lg,
              zIndex: 10001,
              pointerEvents: "none",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)",
              animation: "pulse 2s infinite",
            }}
          />
        );
      })()}

      {/* 온보딩 카드 */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          borderRadius: EncarRadius.xl,
          padding: EncarSpacing.xxl,
          maxWidth: "480px",
          width: "90%",
          zIndex: 10002,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Skip 버튼 */}
        <button
          onClick={handleSkip}
          style={{
            position: "absolute",
            top: EncarSpacing.md,
            right: EncarSpacing.md,
            background: "none",
            border: "none",
            color: EncarColors.lightGray,
            fontSize: EncarFonts.size.small,
            cursor: "pointer",
            padding: EncarSpacing.xs,
          }}
        >
          건너뛰기
        </button>

        {/* 비주얼 */}
        <div
          style={{
            fontSize: "64px",
            textAlign: "center",
            marginBottom: EncarSpacing.lg,
          }}
        >
          {currentStep.visual}
        </div>

        {/* 제목 */}
        <h2
          style={{
            fontSize: EncarFonts.size.xlarge,
            fontWeight: EncarFonts.weight.extrabold,
            color: EncarColors.dark,
            textAlign: "center",
            marginBottom: EncarSpacing.md,
            lineHeight: 1.3,
          }}
        >
          {currentStep.title}
        </h2>

        {/* 설명 */}
        <p
          style={{
            fontSize: EncarFonts.size.body,
            color: EncarColors.darkGray,
            textAlign: "center",
            marginBottom: EncarSpacing.xl,
            lineHeight: 1.6,
          }}
        >
          {currentStep.description}
        </p>

        {/* 진행 표시 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: EncarSpacing.xs,
            marginBottom: EncarSpacing.lg,
          }}
        >
          {steps.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: idx === step ? "24px" : "8px",
                height: "8px",
                borderRadius: EncarRadius.full,
                background: idx === step ? EncarColors.primary : EncarColors.borderLight,
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* 액션 버튼 */}
        <button
          onClick={() => {
            if (isLastStep) {
              handleComplete();
            } else {
              setStep(step + 1);
            }
          }}
          style={{
            width: "100%",
            padding: `${EncarSpacing.md} ${EncarSpacing.lg}`,
            background: `linear-gradient(135deg, ${EncarColors.primary} 0%, #ff8533 100%)`,
            border: "none",
            borderRadius: EncarRadius.lg,
            color: "white",
            fontSize: EncarFonts.size.body,
            fontWeight: EncarFonts.weight.bold,
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 4px 12px rgba(255, 108, 0, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 108, 0, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 108, 0, 0.3)";
          }}
        >
          {currentStep.action}
        </button>

        {/* 힌트 (첫 단계가 아닐 때) */}
        {step > 0 && (
          <div
            style={{
              marginTop: EncarSpacing.md,
              textAlign: "center",
              fontSize: EncarFonts.size.tiny,
              color: EncarColors.lightGray,
            }}
          >
            💡 화면을 클릭해도 다음으로 넘어가요
          </div>
        )}
      </div>

      {/* 애니메이션 CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </>
  );
}




