// frontend/src/components/LifecycleRoadmap.tsx
// 내 차의 여정 (생애주기 로드맵)

import React, { useState } from "react";
import { VehicleDashboard } from "../types/vehicle";
import { EncarColors, EncarFonts, EncarRadius, EncarSpacing } from "../styles/encar-theme";

interface Props {
  dashboard: VehicleDashboard;
  nickname?: string;
}

const nf = new Intl.NumberFormat("ko-KR");

export default function LifecycleRoadmap({ dashboard, nickname }: Props) {
  const { vehicle, lifecycle, timing } = dashboard;
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  
  const displayName = nickname || `우리 ${vehicle.model}`;
  
  // 각 단계별 시뮬레이션 데이터
  const getStageSimulation = (stageKey: string) => {
    const stageInfo = lifecycle.stageTimeline.find(s => s.stage === stageKey);
    if (!stageInfo) return null;
    
    // 해당 단계의 중간값으로 시뮬레이션
    const avgYears = (stageInfo.yearsMin + (stageInfo.yearsMax || stageInfo.yearsMin + 3)) / 2;
    const avgKm = (stageInfo.kmMin + (stageInfo.kmMax || stageInfo.kmMin + 50000)) / 2;
    
    // 예상 가치 (간단 계산)
    const estimatedValue = Math.round(vehicle.purchasePrice * Math.pow(0.85, avgYears));
    
    return {
      years: Math.round(avgYears * 10) / 10,
      km: Math.round(avgKm),
      estimatedValue,
      mainPoints: getStageMainPoints(stageKey, avgYears, avgKm),
    };
  };
  
  const getStageMainPoints = (stageKey: string, years: number, km: number) => {
    switch (stageKey) {
      case "Trust":
        return [
          "✓ 감가율이 가장 낮은 시기 (월 0.8%)",
          "✓ 유지비 최소 (예방 정비만)",
          "✓ 재판매 시세 최상",
        ];
      case "Keep":
        return [
          "✓ 감가율 안정적 (월 1.0-1.2%)",
          "✓ 보증 만료 전후 점검 중요",
          "✓ 정기 정비로 가치 유지 가능",
        ];
      case "Care":
        return [
          "△ 감가율 상승 시작 (월 1.5-1.8%)",
          "△ 주요 부품 교체 시기",
          "△ 판매 vs 보유 고민 시점",
        ];
      case "Next":
        return [
          "◎ 감가율 안정화 (월 2.0-2.5%)",
          "◎ 정비비 vs 차량가치 역전 가능",
          "◎ 판매하면 다음 차 준비, 보유하면 장기 운행",
        ];
      default:
        return [];
    }
  };
  
  // 단계별 엔카 서비스 추천
  const getStageEncarServices = (stageKey: string) => {
    const currentValue = timing.nowValue;
    const avgPrice = Math.round(currentValue / 10000);
    
    switch (stageKey) {
      case "Trust":
        return [
          {
            name: "엔카 제휴 정비소",
            desc: "정기 점검으로 신차감 유지",
            action: "정비소 찾기",
            color: "#1677ff",
            badge: "엔카 검증",
            url: "https://www.encar.com",
          },
          {
            name: "엔카 보험 비교",
            desc: "신차 특가 보험 확인",
            action: "보험 비교",
            color: "#1890ff",
            badge: "제휴",
            url: "https://www.encar.com",
          },
        ];
      case "Keep":
        return [
          {
            name: "엔카 인증 정비소",
            desc: "보증 만료 전 종합 점검",
            action: "점검 예약",
            color: "#73d13d",
            badge: "엔카 검증",
            url: "https://www.encar.com",
          },
          {
            name: "엔카 소모품샵",
            desc: "엔진오일·필터 교체",
            action: "예약하기",
            color: "#52c41a",
            badge: "제휴",
            url: "https://www.encar.com",
          },
        ];
      case "Care":
        return [
          {
            name: "셀프진단",
            desc: `예상 ${avgPrice}만원`,
            action: "시세 확인",
            color: "#faad14",
            badge: "추천",
            url: "https://www.encar.com",
          },
          {
            name: "엔카 비교견적",
            desc: "최고가 받기",
            action: "견적 신청",
            color: "#FF6C00",
            badge: "인기",
            url: "https://www.encar.com",
          },
        ];
      case "Next":
        return [
          {
            name: "엔카 비교견적",
            desc: `예상 ${avgPrice}만원`,
            action: "비교견적 신청",
            color: "#FF6C00",
            badge: "추천",
            url: "https://www.encar.com",
          },
          {
            name: "다음 차 찾기",
            desc: "AI 맞춤 추천",
            action: "차량 둘러보기",
            color: "#52c41a",
            badge: "NEW",
            url: "https://www.encar.com",
          },
        ];
      default:
        return [];
    }
  };
  
  const simulation = selectedStage ? getStageSimulation(selectedStage) : null;

  return (
    <div style={{
      background: "white",
      padding: EncarSpacing.lg,
      borderRadius: EncarRadius.lg,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      marginBottom: EncarSpacing.lg,
    }}>
      <h2 style={{
        fontSize: EncarFonts.size.large,
        fontWeight: EncarFonts.weight.bold,
        color: EncarColors.dark,
        marginBottom: EncarSpacing.md,
        display: "flex",
        alignItems: "center",
        gap: EncarSpacing.sm,
      }}>
        <span>🛣️</span>
        <span>{displayName}의 오토 라이프</span>
        <span style={{ fontSize: EncarFonts.size.tiny, fontWeight: EncarFonts.weight.regular, color: EncarColors.lightGray, marginLeft: "auto" }}>
          클릭하면 미래를 볼 수 있어요
        </span>
      </h2>

      {/* 타임라인 로드맵 (클릭 가능) */}
      <div style={{ marginBottom: EncarSpacing.xl, marginTop: EncarSpacing.lg }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${lifecycle.stageTimeline?.length || 4}, 1fr)`,
          gap: EncarSpacing.sm,
          marginBottom: EncarSpacing.lg,
        }}>
          {lifecycle.stageTimeline && lifecycle.stageTimeline.map((stage, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              {/* 지금 여기 표시 (박스 밖 위쪽) */}
              {stage.isCurrent && (
                <div style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "12px",
                  fontWeight: EncarFonts.weight.extrabold,
                  color: "#ff4d4f",
                  background: "white",
                  padding: "4px 12px",
                  borderRadius: EncarRadius.md,
                  boxShadow: "0 2px 8px rgba(255, 77, 79, 0.2)",
                  border: "2px solid #ff4d4f",
                  zIndex: 10,
                }}>
                  ✓ 지금 여기
                </div>
              )}
              
              <div
                onClick={() => setSelectedStage(selectedStage === stage.stage ? null : stage.stage)}
                style={{
                  padding: EncarSpacing.xl,
                  background: stage.isCurrent ? stage.color : `${stage.color}20`,
                  border: selectedStage === stage.stage ? `3px solid ${stage.color}` : `2px solid ${stage.color}40`,
                  borderRadius: EncarRadius.lg,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  if (!stage.isCurrent) {
                    e.currentTarget.style.background = `${stage.color}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!stage.isCurrent) {
                    e.currentTarget.style.background = `${stage.color}20`;
                  }
                }}
              >
                <div style={{
                  fontSize: EncarFonts.size.xlarge,
                  fontWeight: stage.isCurrent ? EncarFonts.weight.extrabold : EncarFonts.weight.bold,
                  color: stage.isCurrent ? "white" : stage.color,
                  marginBottom: EncarSpacing.sm,
                }}>
                  {stage.label}
                </div>
                <div style={{
                  fontSize: EncarFonts.size.medium,
                  color: stage.isCurrent ? "white" : EncarColors.darkGray,
                  fontWeight: EncarFonts.weight.semibold,
                }}>
                  {stage.yearsMin}-{stage.yearsMax ?? "∞"}년
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{
          fontSize: EncarFonts.size.tiny,
          color: EncarColors.lightGray,
          textAlign: "center",
        }}>
          💡 단계를 클릭하면 미래 시뮬레이션을 볼 수 있어요
        </div>
      </div>

      {/* 선택한 단계 시뮬레이션 */}
      {simulation && selectedStage && (() => {
        const stageInfo = lifecycle.stageTimeline.find(s => s.stage === selectedStage);
        const services = getStageEncarServices(selectedStage);
        
        return (
          <div style={{
            padding: EncarSpacing.xl,
            background: "#f0f5ff",
            borderRadius: EncarRadius.lg,
            border: "2px solid #91caff",
          }}>
            <div style={{ fontSize: EncarFonts.size.body, fontWeight: EncarFonts.weight.bold, color: EncarColors.dark, marginBottom: EncarSpacing.md }}>
              🔮 미래 시뮬레이션: {stageInfo?.label}
            </div>
            
            {/* 2열 레이아웃: 왼쪽(정보) + 오른쪽(엔카 서비스) */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: EncarSpacing.xl }}>
              {/* 왼쪽: 예상 정보 + 주요 포인트 */}
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: EncarSpacing.md, marginBottom: EncarSpacing.lg }}>
                  <div>
                    <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray }}>예상 시점</div>
                    <div style={{ fontSize: EncarFonts.size.large, fontWeight: EncarFonts.weight.bold, color: EncarColors.primary }}>
                      {simulation.years}년 차
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray }}>예상 주행거리</div>
                    <div style={{ fontSize: EncarFonts.size.large, fontWeight: EncarFonts.weight.bold, color: EncarColors.primary }}>
                      {nf.format(simulation.km)}km
                    </div>
                  </div>
            <div>
              <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray }}>예상 시세</div>
              <div style={{ fontSize: EncarFonts.size.large, fontWeight: EncarFonts.weight.bold, color: EncarColors.primary }}>
                {nf.format(Math.round(simulation.estimatedValue / 10000))}만원
              </div>
            </div>
                </div>
                
                <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray }}>
                  <div style={{ fontWeight: EncarFonts.weight.bold, marginBottom: EncarSpacing.sm }}>이 시기 주요 포인트:</div>
                  {simulation.mainPoints.map((point, idx) => (
                    <div key={idx} style={{ marginBottom: EncarSpacing.xs }}>• {point}</div>
                  ))}
                </div>
              </div>
              
              {/* 오른쪽 하단: 엔카 서비스 추천 */}
              <div style={{ display: "flex", flexDirection: "column", gap: EncarSpacing.sm }}>
                <div style={{ fontSize: EncarFonts.size.tiny, fontWeight: EncarFonts.weight.bold, color: EncarColors.darkGray, marginBottom: EncarSpacing.xs }}>
                  이 시기 추천 서비스
                </div>
                {services.map((service, idx) => (
                  <div key={idx} style={{
                    padding: EncarSpacing.md,
                    background: "white",
                    borderRadius: EncarRadius.md,
                    border: `2px solid ${service.color}40`,
                    position: "relative",
                  }}>
                    {/* 배지 */}
                    {service.badge && (
                      <div style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        padding: "2px 6px",
                        background: service.color,
                        color: "white",
                        borderRadius: EncarRadius.sm,
                        fontSize: "9px",
                        fontWeight: EncarFonts.weight.bold,
                      }}>
                        {service.badge}
                      </div>
                    )}
                    
                    <div style={{ fontSize: EncarFonts.size.small, fontWeight: EncarFonts.weight.bold, color: EncarColors.dark, marginBottom: EncarSpacing.xs }}>
                      {service.name}
                    </div>
                    <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.darkGray, marginBottom: EncarSpacing.sm }}>
                      {service.desc}
                    </div>
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        padding: `${EncarSpacing.xs} ${EncarSpacing.md}`,
                        background: service.color,
                        color: "white",
                        textAlign: "center",
                        borderRadius: EncarRadius.sm,
                        textDecoration: "none",
                        fontSize: EncarFonts.size.tiny,
                        fontWeight: EncarFonts.weight.bold,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    >
                      {service.action}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
      
      {/* 프로그레스 바 */}
      <div style={{
        marginTop: EncarSpacing.xl,
        padding: EncarSpacing.lg,
        background: "#fafafa",
        borderRadius: EncarRadius.lg,
      }}>
        <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray, marginBottom: EncarSpacing.md }}>
          현재 위치: {lifecycle.yearsOwned}년 · {nf.format(vehicle.currentMileage)}km
        </div>
        <div style={{
          position: "relative",
          height: 8,
          background: "#e8e8e8",
          borderRadius: EncarRadius.full,
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${Math.min(100, (lifecycle.yearsOwned / 12) * 100)}%`,
            background: `linear-gradient(90deg, ${EncarColors.primary} 0%, ${lifecycle.color} 100%)`,
            borderRadius: EncarRadius.full,
            transition: "all 0.3s",
          }} />
        </div>
      </div>
    </div>
  );
}
