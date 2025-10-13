// frontend/src/components/AIAnalysis.tsx
// AI 종합 분석 + 오너 비교 + 예측 근거

import React from "react";
import { VehicleDashboard } from "../types/vehicle";
import { EncarColors, EncarFonts, EncarRadius, EncarShadows, EncarSpacing } from "../styles/encar-theme";
import ProgressBar from "./ProgressBar";

interface Props {
  dashboard: VehicleDashboard;
}

const nf = new Intl.NumberFormat("ko-KR");

export default function AIAnalysis({ dashboard }: Props) {
  const { vehicle, lifecycle, timing } = dashboard;
  const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set());
  
  const toggleCard = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };
  
  // AI 분석 점수 계산 (더 구체적인 기준)
  const calculateScores = () => {
    let conditionScore = 100;
    let maintenanceScore = 100;
    
    // 1. 사고 이력 (-10 ~ -30점)
    if (vehicle.accident === "major") conditionScore -= 30;
    else if (vehicle.accident === "minor") conditionScore -= 10;
    
    // 2. 주행거리 (연평균 15,000km 기준, -5 ~ +5점)
    const avgKmPerYear = vehicle.currentMileage / lifecycle.yearsOwned;
    if (avgKmPerYear > 25000) conditionScore -= 15;
    else if (avgKmPerYear > 20000) conditionScore -= 10;
    else if (avgKmPerYear > 18000) conditionScore -= 5;
    else if (avgKmPerYear < 10000) conditionScore += 5;
    else if (avgKmPerYear < 8000) conditionScore += 8;
    
    // 3. 외관 상태 (-3 ~ -9점)
    if (vehicle.exterior) {
      if (vehicle.exterior.front === "major") conditionScore -= 5;
      else if (vehicle.exterior.front === "minor") conditionScore -= 2;
      
      if (vehicle.exterior.side === "major") conditionScore -= 5;
      else if (vehicle.exterior.side === "minor") conditionScore -= 2;
      
      if (vehicle.exterior.rear === "major") conditionScore -= 5;
      else if (vehicle.exterior.rear === "minor") conditionScore -= 2;
    }
    
    // 4. 타이어 상태 (-2 ~ -8점)
    if (vehicle.tires) {
      const tireArray = [vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight];
      const replaceTires = tireArray.filter(t => t === "replace").length;
      conditionScore -= replaceTires * 2;
    }
    
    // 5. 생애주기 단계 (-10 ~ +10점)
    if (lifecycle.stage === "Trust") conditionScore += 10;
    else if (lifecycle.stage === "Keep") conditionScore += 5;
    else if (lifecycle.stage === "Care") conditionScore -= 5;
    else if (lifecycle.stage === "Next") conditionScore -= 10;
    
    // 6. 키 보유 상태 (-5점)
    if (vehicle.keys === "one") conditionScore -= 5;
    
    // 7. 리스/할부 (-3점)
    if (vehicle.lease === "active") conditionScore -= 3;
    
    // === 관리 상태 점수 (별도) ===
    // 기본 100점에서 감점
    
    // 1. 사고 이력
    if (vehicle.accident === "major") maintenanceScore -= 40;
    else if (vehicle.accident === "minor") maintenanceScore -= 20;
    
    // 2. 외관 관리
    if (vehicle.exterior) {
      const exteriorIssues = [vehicle.exterior.front, vehicle.exterior.side, vehicle.exterior.rear]
        .filter(e => e === "major" || e === "minor").length;
      maintenanceScore -= exteriorIssues * 5;
    }
    
    // 3. 타이어 관리
    if (vehicle.tires) {
      const tireArray = [vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight];
      const replaceTires = tireArray.filter(t => t === "replace").length;
      maintenanceScore -= replaceTires * 8;
    }
    
    // 4. 주행거리 관리 (과도한 주행은 관리 부담)
    if (avgKmPerYear > 25000) maintenanceScore -= 15;
    else if (avgKmPerYear > 20000) maintenanceScore -= 10;
    else if (avgKmPerYear < 12000) maintenanceScore += 5; // 적정 주행은 가점
    
    const valueRetention = (timing.nowValue / vehicle.purchasePrice) * 100;
    
    // 관리 상태 레이블
    let maintenanceLabel = "우수";
    if (maintenanceScore >= 90) maintenanceLabel = "최우수";
    else if (maintenanceScore >= 80) maintenanceLabel = "우수";
    else if (maintenanceScore >= 70) maintenanceLabel = "양호";
    else if (maintenanceScore >= 60) maintenanceLabel = "보통";
    else maintenanceLabel = "개선필요";
    
    return {
      condition: Math.max(0, Math.min(100, conditionScore)),
      maintenance: Math.max(0, Math.min(100, maintenanceScore)),
      maintenanceLabel,
      valueRetention: Math.round(valueRetention),
      ranking: conditionScore >= 85 ? "상위 15%" : conditionScore >= 70 ? "상위 30%" : "상위 50%",
      avgKmPerYear: Math.round(avgKmPerYear),
    };
  };
  
  const scores = calculateScores();
  
  // 같은 모델 오너 데이터 (목업)
  const ownerStats = {
    totalOwners: 1234,
    avgHoldYears: 3.2,
    sellRatio: {
      year3: 68,
      year5: 85,
      year8: 95,
    },
    avgSellPrice: Math.round(timing.nowValue * 1.05),
    encarBonus: 5, // 엔카로 판매 시 프리미엄
  };
  
  // 예측 근거 (더 구체적으로)
  const getPredictionReason = () => {
    const reasons = [];
    
    // 1. 감가율 분석 (실제 차량 데이터 기반)
    const currentMonthlyRate = lifecycle.stage === "Trust" ? 0.8 :
                                lifecycle.stage === "Keep" ? 1.0 :
                                lifecycle.stage === "Care" ? 1.5 : 2.0; // 단계별 차등
    const futureMonthlyRate = lifecycle.stage === "Trust" ? 0.8 :
                               lifecycle.stage === "Keep" ? 1.2 :
                               lifecycle.stage === "Care" ? 1.8 : 2.5;
    
    const currentValue = timing.nowValue;
    const lossIn3Months = Math.round(currentValue * futureMonthlyRate * 3 / 100);
    const lossIn6Months = Math.round(currentValue * futureMonthlyRate * 6 / 100);
    
    reasons.push({
      title: "감가율 분석",
      icon: "📉",
      details: [
        `현재 ${vehicle.year}년식 ${vehicle.model}: 월 ${currentMonthlyRate}% 감가 중`,
        `${lifecycle.stage === "Next" ? "8년차 이후" : lifecycle.stage === "Care" ? "5년차 이후" : "신차감 기간"} → 월 ${futureMonthlyRate}% 예상`,
        `→ 6개월 더 보유 시 약 ${nf.format(Math.round(lossIn6Months / 10000))}만원 감가`,
        `→ 현재 시세 ${nf.format(Math.round(currentValue / 10000))}만원 → ${nf.format(Math.round((currentValue - lossIn6Months) / 10000))}만원`,
      ],
    });
    
    // 2. 시장 수요 분석 (더 구체적)
    const currentMonth = new Date().getMonth() + 1;
    const isSummerOrWinter = currentMonth >= 11 || currentMonth <= 2 || (currentMonth >= 5 && currentMonth <= 8);
    
    // 차종별 수요 분석
    let demandAnalysis = "";
    if (vehicle.vehicleType === "suv") {
      demandAnalysis = isSummerOrWinter ? "SUV는 겨울/여름 레저 수요 증가" : "SUV는 사계절 수요 안정적";
    } else if (vehicle.vehicleType === "sedan") {
      demandAnalysis = "세단은 연중 안정적 수요";
    } else {
      demandAnalysis = isSummerOrWinter ? "성수기 진입" : "평균 수요";
    }
    
    reasons.push({
      title: "시장 수요 분석",
      icon: "📊",
      details: [
        `${vehicle.model} (${vehicle.vehicleType.toUpperCase()}): ${demandAnalysis}`,
        `현재(${currentMonth}월): ${isSummerOrWinter ? "수요 ↑ 시기" : "평균 수요 시기"}`,
        `같은 모델 최근 1개월 거래량: 1,234건 (전월 대비 ${isSummerOrWinter ? "+12%" : "-3%"})`,
        `→ ${isSummerOrWinter ? "지금이 높은 가격 받을 시기예요" : "다음 성수기(11월~2월) 대기도 전략"}`,
      ],
    });
    
    // 3. 유사 차량 판매 데이터 (더 구체적)
    const similarVehicles = 567; // 목업
    const avgPrice = Math.round(timing.nowValue / 10000);
    const priceRange = { min: Math.round(avgPrice * 0.9), max: Math.round(avgPrice * 1.15) };
    
    reasons.push({
      title: "유사 차량 판매 데이터",
      icon: "🔍",
      details: [
        `${vehicle.year}년식 ${vehicle.model} ${vehicle.trim} 거래 ${similarVehicles}건 분석`,
        `평균 판매가: ${nf.format(avgPrice)}만원 (범위: ${nf.format(priceRange.min)}~${nf.format(priceRange.max)}만원)`,
        `엔카 비교견적 평균: ${nf.format(Math.round(avgPrice * 1.05))}만원 (+${ownerStats.encarBonus}%)`,
        `일반 딜러 평균: ${nf.format(Math.round(avgPrice * 0.97))}만원 (-3%)`,
      ],
    });
    
    // 4. 차량 컨디션 평가 (신규)
    const conditionImpact = [];
    if (vehicle.accident && vehicle.accident !== "none") {
      conditionImpact.push(`사고이력 ${vehicle.accident === "major" ? "대" : "소"}: -${vehicle.accident === "major" ? 15 : 5}%`);
    }
    if (scores.avgKmPerYear > 20000) {
      conditionImpact.push(`과다 주행(연 ${nf.format(scores.avgKmPerYear)}km): -3%`);
    } else if (scores.avgKmPerYear < 12000) {
      conditionImpact.push(`저주행(연 ${nf.format(scores.avgKmPerYear)}km): +2%`);
    }
    if (vehicle.keys === "one") {
      conditionImpact.push("키 1개: -2%");
    }
    if (vehicle.lease === "active") {
      conditionImpact.push("리스/할부 잔금: -3%");
    }
    
    if (conditionImpact.length > 0) {
      reasons.push({
        title: "차량 컨디션 평가",
        icon: "🔧",
        details: [
          `기본 시세 ${nf.format(avgPrice)}만원 기준`,
          ...conditionImpact,
          `→ 조정 후 예상 시세: ${nf.format(Math.round(timing.nowValue / 10000))}만원`,
        ],
      });
    }
    
    return reasons;
  };
  
  const predictionReasons = getPredictionReason();
  
  // 상세 인사이트 생성
  const getDetailedInsights = () => {
    // 차량 특화 가이드 생성
    const getVehicleSpecificGuide = () => {
      const age = new Date().getFullYear() - vehicle.year;
      const model = vehicle.model;
      
      if (model.includes("펠리세이드") || model.includes("팰리세이드")) {
        if (age <= 3) {
          return "2021-2023년식 펠리세이드는 타이어 수명이 핵심이에요. SUV 특성상 타이어가 빨리 닳으니 4만km마다 체크하세요.";
        } else if (age <= 5) {
          return "5년차 펠리세이드는 배터리와 브레이크 패드를 주의하세요. 무게가 무거워 소모가 빠릅니다.";
        } else {
          return "6년 이상 펠리세이드는 엔진 마운트와 서스펜션을 체크하세요. 정비 이력이 시세에 큰 영향을 줍니다.";
        }
      } else if (vehicle.vehicleType === "suv") {
        return `SUV는 타이어와 브레이크 관리가 시세에 큰 영향을 줍니다. ${age}년차 기준 ${age <= 3 ? "예방 정비" : age <= 5 ? "주요 부품 교체" : "전문 점검"}가 필요해요.`;
      } else if (vehicle.vehicleType === "sedan") {
        return `세단은 외관과 내부 관리가 중요합니다. ${age}년차 기준 ${age <= 3 ? "정기 세차/코팅" : age <= 5 ? "실내 관리" : "전체 리프레시"}를 추천드려요.`;
      } else {
        return `${age}년차 차량은 ${age <= 3 ? "예방 정비 위주로" : age <= 5 ? "소모품 교체 시기이니" : "전문가 점검을 통해"} 관리하시면 가치를 유지할 수 있어요.`;
      }
    };
    
    return {
      condition: {
        summary: `물리적 상태를 7가지 기준으로 평가했어요`,
        categories: [
          {
            name: "사고 이력",
            score: vehicle.accident === "none" ? 100 : vehicle.accident === "minor" ? 90 : 70,
            impact: vehicle.accident === "none" ? 0 : vehicle.accident === "minor" ? -10 : -30,
            status: vehicle.accident === "none" ? "완벽" : vehicle.accident === "minor" ? "양호" : "주의",
            detail: vehicle.accident === "none" ? "무사고 차량으로 최상급입니다" : 
                    vehicle.accident === "minor" ? "소손 이력이 있으나 큰 문제 없어요" : 
                    "대손 이력이 시세에 영향을 줄 수 있어요",
            howToImprove: vehicle.accident === "none" ? "현재 상태 유지 (무사고 증명서 준비)" : 
                          vehicle.accident === "minor" ? "정비 이력서로 투명하게 공개하면 신뢰도 ↑" : 
                          "엔카진단으로 정확한 상태 확인 후 판매",
            improvable: false,
          },
          {
            name: "주행거리",
            score: scores.avgKmPerYear <= 12000 ? 100 : scores.avgKmPerYear <= 18000 ? 90 : scores.avgKmPerYear <= 25000 ? 80 : 70,
            impact: scores.avgKmPerYear > 25000 ? -15 : scores.avgKmPerYear > 20000 ? -10 : scores.avgKmPerYear < 10000 ? +5 : 0,
            status: scores.avgKmPerYear <= 12000 ? "우수" : scores.avgKmPerYear <= 18000 ? "양호" : scores.avgKmPerYear <= 25000 ? "보통" : "과다",
            detail: `연평균 ${nf.format(scores.avgKmPerYear)}km (적정 12,000-15,000km)`,
            howToImprove: scores.avgKmPerYear > 20000 ? "주행거리는 줄일 수 없지만, 정기 정비 이력으로 신뢰도를 높이세요" : 
                          scores.avgKmPerYear < 10000 ? "저주행 차량은 큰 장점! 판매 시 적극 어필하세요" : 
                          "적정 주행거리입니다. 현재 관리 수준 유지하세요",
            improvable: false,
          },
          {
            name: "외관 컨디션",
            score: (() => {
              if (!vehicle.exterior) return 100;
              const issues = [vehicle.exterior.front, vehicle.exterior.side, vehicle.exterior.rear]
                .filter(e => e === "major").length;
              const minorIssues = [vehicle.exterior.front, vehicle.exterior.side, vehicle.exterior.rear]
                .filter(e => e === "minor").length;
              if (issues >= 2) return 70;
              if (issues === 1 || minorIssues >= 2) return 85;
              if (minorIssues === 1) return 95;
              return 100;
            })(),
            impact: (() => {
              if (!vehicle.exterior) return 0;
              let total = 0;
              if (vehicle.exterior.front === "major") total -= 5;
              else if (vehicle.exterior.front === "minor") total -= 2;
              if (vehicle.exterior.side === "major") total -= 5;
              else if (vehicle.exterior.side === "minor") total -= 2;
              if (vehicle.exterior.rear === "major") total -= 5;
              else if (vehicle.exterior.rear === "minor") total -= 2;
              return total;
            })(),
            status: !vehicle.exterior ? "정보없음" :
                    [vehicle.exterior.front, vehicle.exterior.side, vehicle.exterior.rear].every(e => e === "good") ? "완벽" :
                    [vehicle.exterior.front, vehicle.exterior.side, vehicle.exterior.rear].some(e => e === "major") ? "주의" : "양호",
            detail: vehicle.exterior ? 
              `앞면 ${vehicle.exterior.front === "good" ? "✓" : vehicle.exterior.front === "minor" ? "△" : "✗"} · 옆면 ${vehicle.exterior.side === "good" ? "✓" : vehicle.exterior.side === "minor" ? "△" : "✗"} · 뒷면 ${vehicle.exterior.rear === "good" ? "✓" : vehicle.exterior.rear === "minor" ? "△" : "✗"}` 
              : "등록 정보 없음",
            howToImprove: vehicle.exterior && [vehicle.exterior.front, vehicle.exterior.side, vehicle.exterior.rear].some(e => e !== "good") ?
              "엔카 제휴 판금/도색 업체에서 수리하면 5-10점 향상 가능 (비용 30-80만원)" :
              "현재 완벽한 상태! 주기적 세차와 왁스 코팅으로 유지하세요",
            improvable: vehicle.exterior ? [vehicle.exterior.front, vehicle.exterior.side, vehicle.exterior.rear].some(e => e !== "good") : false,
          },
          {
            name: "타이어 상태",
            score: (() => {
              if (!vehicle.tires) return 100;
              const replaceCount = [vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight]
                .filter(t => t === "replace").length;
              if (replaceCount >= 3) return 70;
              if (replaceCount === 2) return 85;
              if (replaceCount === 1) return 95;
              return 100;
            })(),
            impact: vehicle.tires ? -[vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight].filter(t => t === "replace").length * 2 : 0,
            status: !vehicle.tires ? "정보없음" :
                    [vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight].every(t => t === "good") ? "완벽" :
                    [vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight].filter(t => t === "replace").length >= 3 ? "교체필요" : "양호",
            detail: vehicle.tires ? 
              `교체 필요 ${[vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight].filter(t => t === "replace").length}/4개` 
              : "등록 정보 없음",
            howToImprove: vehicle.tires && [vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight].some(t => t === "replace") ?
              `엔카 검증 타이어샵에서 교체하면 2-8점 향상 (타이어 1개당 15-25만원, 4개 교체 시 50-80만원)` :
              "현재 양호한 상태! 1만km마다 공기압 체크하세요",
            improvable: vehicle.tires ? [vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight].some(t => t === "replace") : false,
          },
          {
            name: "생애주기 단계",
            score: lifecycle.stage === "Trust" ? 100 : lifecycle.stage === "Keep" ? 95 : lifecycle.stage === "Care" ? 85 : 75,
            impact: lifecycle.stage === "Trust" ? +10 : lifecycle.stage === "Keep" ? +5 : lifecycle.stage === "Care" ? -5 : -10,
            status: lifecycle.stage === "Trust" ? "신차감" : lifecycle.stage === "Keep" ? "안정기" : lifecycle.stage === "Care" ? "관리기" : "전환기",
            detail: `${lifecycle.label} (${Math.round(lifecycle.yearsOwned)}년차, ${nf.format(vehicle.currentMileage)}km)`,
            howToImprove: "생애주기는 변경 불가하지만, 정기 정비로 다음 단계를 늦출 수 있어요",
            improvable: false,
          },
        ],
        vehicleSpecificTip: getVehicleSpecificGuide(),
        totalImprovable: (() => {
          let canImprove = 0;
          if (vehicle.exterior && [vehicle.exterior.front, vehicle.exterior.side, vehicle.exterior.rear].some(e => e !== "good")) {
            canImprove += (() => {
              let total = 0;
              if (vehicle.exterior.front !== "good") total += vehicle.exterior.front === "major" ? 5 : 2;
              if (vehicle.exterior.side !== "good") total += vehicle.exterior.side === "major" ? 5 : 2;
              if (vehicle.exterior.rear !== "good") total += vehicle.exterior.rear === "major" ? 5 : 2;
              return total;
            })();
          }
          if (vehicle.tires && [vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight].some(t => t === "replace")) {
            canImprove += [vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight].filter(t => t === "replace").length * 2;
          }
          return canImprove;
        })(),
      },
      valueRetention: {
        summary: `구매 후 ${Math.round(lifecycle.yearsOwned)}년간 가치 변화예요`,
        breakdown: [
          { label: "구매가", value: vehicle.purchasePrice, detail: `${vehicle.year}년 ${vehicle.trim} 구매` },
          { label: "현재 시세", value: timing.nowValue, detail: `${nf.format(ownerStats.totalOwners)}대 데이터 기준` },
          { label: "감가액", value: vehicle.purchasePrice - timing.nowValue, detail: `연 ${((1 - Math.pow(timing.nowValue / vehicle.purchasePrice, 1/lifecycle.yearsOwned)) * 100).toFixed(1)}% 감가` },
        ],
        comparison: `같은 ${vehicle.model} 오너 ${nf.format(ownerStats.totalOwners)}명 중 상위 ${scores.ranking.replace("상위 ", "")}이에요`,
        improvement: scores.valueRetention >= 80 ? "이미 최상위권이에요!" :
                      scores.valueRetention >= 65 ? "정기 정비로 가치를 더 유지할 수 있어요" :
                      "엔카 셀프진단으로 정확한 시세 확인해보세요",
      },
      marketCompetitiveness: {
        summary: `같은 조건 차량 ${nf.format(ownerStats.totalOwners)}대와 비교했어요`,
        score: (() => {
          let competitiveScore = 70; // 기본점수
          // 사고 이력으로 가점/감점
          if (vehicle.accident === "none") competitiveScore += 15;
          else if (vehicle.accident === "major") competitiveScore -= 10;
          
          // 주행거리로 가점/감점
          if (scores.avgKmPerYear < 12000) competitiveScore += 10;
          else if (scores.avgKmPerYear > 20000) competitiveScore -= 10;
          
          // 컨디션으로 가점/감점
          if (scores.condition >= 90) competitiveScore += 5;
          else if (scores.condition < 70) competitiveScore -= 5;
          
          return Math.max(60, Math.min(100, competitiveScore));
        })(),
        ranking: scores.ranking,
        advantages: [
          ...(vehicle.accident === "none" ? ["✓ 무사고 (구매자 선호 1순위)"] : []),
          ...(scores.avgKmPerYear < 15000 ? [`✓ 저주행 (연 ${nf.format(scores.avgKmPerYear)}km)`] : []),
          ...(scores.condition >= 85 ? ["✓ 최상급 컨디션"] : []),
          ...(lifecycle.stage === "Trust" || lifecycle.stage === "Keep" ? ["✓ 신차감 시기"] : []),
        ],
        improvements: [
          ...(vehicle.accident && vehicle.accident !== "none" ? [`△ 사고 이력 (투명하게 공개 권장)`] : []),
          ...(scores.avgKmPerYear > 20000 ? [`△ 과다 주행 (정비 이력으로 보완)`] : []),
          ...(vehicle.exterior && [vehicle.exterior.front, vehicle.exterior.side, vehicle.exterior.rear].some(e => e !== "good") ? [`△ 외관 수리 필요 (30-80만원)`] : []),
          ...(vehicle.tires && [vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight].some(t => t === "replace") ? [`△ 타이어 교체 필요 (50-80만원)`] : []),
        ],
        vsAverage: {
          price: `평균보다 ${scores.valueRetention >= 70 ? "+5-8%" : "-3-5%"}`,
          sellTime: `평균보다 ${scores.condition >= 80 ? "2-3주 빠름" : "비슷함"}`,
          inquiries: `평균보다 ${(vehicle.accident === "none" && scores.avgKmPerYear < 15000) ? "30-50% 많음" : "10-20% 많음"}`,
        },
        tip: (() => {
          if (vehicle.accident === "none" && scores.avgKmPerYear < 15000 && scores.condition >= 85) {
            return "프리미엄급 차량이에요! 엔카 비교견적으로 최고가를 받을 수 있어요";
          } else if (vehicle.accident === "none" && scores.condition >= 80) {
            return "무사고 차량은 시장에서 큰 경쟁력이 있어요. 자신있게 판매하세요";
          } else if (scores.condition >= 70) {
            return "평균 이상이에요. 엔카 셀프진단으로 정확한 시세를 확인하세요";
          } else {
            return "개선 포인트를 보완하면 경쟁력이 크게 올라가요";
          }
        })(),
      },
    };
  };
  
  const insights = getDetailedInsights();

  const styles = {
    card: {
      background: "white",
      padding: EncarSpacing.xl,
      borderRadius: EncarRadius.lg,
      boxShadow: EncarShadows.card,
      marginBottom: EncarSpacing.lg,
    },
    scoreCard: {
      padding: EncarSpacing.md,
      borderRadius: EncarRadius.lg,
      textAlign: "center" as const,
    },
  };

  return (
    <>
      {/* 엔카 빅데이터 진단 (통합) */}
      <div style={styles.card}>
        <h2 style={{
          fontSize: EncarFonts.size.large,
          fontWeight: EncarFonts.weight.bold,
          color: EncarColors.dark,
          marginBottom: EncarSpacing.lg,
          display: "flex",
          alignItems: "center",
          gap: EncarSpacing.sm,
        }}>
          <span>🔍</span>
          <span>엔카 빅데이터 진단</span>
          <span style={{
            fontSize: EncarFonts.size.tiny,
            fontWeight: EncarFonts.weight.regular,
            color: EncarColors.lightGray,
            marginLeft: "auto",
          }}>
            {vehicle.year}년식 {vehicle.model} {nf.format(ownerStats.totalOwners)}대 분석
          </span>
        </h2>
        
        {/* 의사결정 3단계 (MECE) - 간결하게 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: EncarSpacing.lg, marginBottom: EncarSpacing.lg, alignItems: "stretch" }}>
          {/* 1️⃣ 내 차 상태 */}
          <div 
            onClick={() => toggleCard("condition")}
            style={{ 
              padding: EncarSpacing.xl,
              background: "white",
              borderRadius: EncarRadius.lg,
              border: `1px solid ${EncarColors.borderLight}`,
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = EncarColors.primary;
              e.currentTarget.style.boxShadow = `0 8px 24px ${EncarColors.primary}20`;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = EncarColors.borderLight;
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray, marginBottom: EncarSpacing.xs }}>
              내 차 상태
            </div>
            <div style={{ fontSize: "48px", fontWeight: EncarFonts.weight.extrabold, color: EncarColors.primary, lineHeight: 1, marginBottom: EncarSpacing.xs }}>
              {scores.condition}
            </div>
            <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray, fontWeight: EncarFonts.weight.semibold, marginBottom: EncarSpacing.sm }}>
              {scores.ranking}
            </div>
            <div style={{ 
              fontSize: EncarFonts.size.tiny, 
              color: EncarColors.primary, 
              fontWeight: EncarFonts.weight.semibold,
              textDecoration: "underline",
              paddingTop: EncarSpacing.xs,
              borderTop: `1px solid ${EncarColors.borderLight}`,
              marginBottom: EncarSpacing.sm,
            }}>
              {expandedCards.has("condition") ? "△ 접기" : "▽ 상세보기"}
            </div>
            
            {/* 상세 정보 */}
            {expandedCards.has("condition") && (
              <div style={{ marginTop: EncarSpacing.md, paddingTop: EncarSpacing.md, borderTop: "1px solid #b7eb8f" }}>
                <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.darkGray, marginBottom: EncarSpacing.sm, fontWeight: EncarFonts.weight.semibold }}>
                  {insights.condition.summary}
                </div>
                
                {/* 각 카테고리별 상세 평가 */}
                {insights.condition.categories.map((cat, idx) => (
                  <div key={idx} style={{ 
                    marginBottom: EncarSpacing.sm, 
                    padding: EncarSpacing.xs, 
                    background: cat.improvable ? "#fffbe6" : "#fafafa",
                    borderRadius: EncarRadius.sm,
                    border: cat.improvable ? "1px solid #ffd591" : "1px solid #f0f0f0",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                      <span style={{ fontSize: "10px", fontWeight: EncarFonts.weight.bold, color: EncarColors.dark }}>
                        {cat.improvable && "⚡"} {cat.name}
                      </span>
                      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        <span style={{ fontSize: "9px", padding: "1px 4px", background: cat.status === "완벽" ? "#f6ffed" : cat.status === "우수" || cat.status === "양호" ? "#e6f4ff" : "#fff1f0", color: cat.status === "완벽" ? "#52c41a" : cat.status === "우수" || cat.status === "양호" ? "#1677ff" : "#ff4d4f", borderRadius: "2px" }}>
                          {cat.status}
                        </span>
                        <span style={{ fontSize: "10px", color: cat.impact >= 0 ? "#52c41a" : "#ff4d4f", fontWeight: EncarFonts.weight.semibold }}>
                          {cat.impact > 0 ? "+" : ""}{cat.impact}점
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: "9px", color: EncarColors.lightGray, marginBottom: "2px" }}>
                      {cat.detail}
                    </div>
                    <div style={{ fontSize: "9px", color: cat.improvable ? EncarColors.primary : "#52c41a", fontWeight: EncarFonts.weight.medium }}>
                      {cat.improvable ? "📍 " : "✓ "}{cat.howToImprove}
                    </div>
                  </div>
                ))}
                
                {/* 개선 가능 점수 */}
                {insights.condition.totalImprovable > 0 && (
                  <div style={{ marginTop: EncarSpacing.sm, padding: EncarSpacing.xs, background: "#fff7e6", borderRadius: EncarRadius.sm, border: `2px solid ${EncarColors.primary}` }}>
                    <div style={{ fontSize: "10px", fontWeight: EncarFonts.weight.bold, color: EncarColors.primary, marginBottom: "2px" }}>
                      🎯 개선 가능: 최대 +{insights.condition.totalImprovable}점
                    </div>
                    <div style={{ fontSize: "9px", color: EncarColors.dark }}>
                      외관/타이어를 정비하면 {scores.condition + insights.condition.totalImprovable}점까지 올릴 수 있어요
                    </div>
                  </div>
                )}
                
                {/* 차량 특화 팁 */}
                <div style={{ marginTop: EncarSpacing.sm, padding: EncarSpacing.xs, background: "#e6f4ff", borderRadius: EncarRadius.sm }}>
                  <div style={{ fontSize: "9px", color: "#1677ff", lineHeight: 1.5 }}>
                    💡 <strong>{vehicle.year}년식 {vehicle.model} 관리 팁:</strong><br/>
                    {insights.condition.vehicleSpecificTip}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 2️⃣ 예상 판매가 */}
          <div 
            onClick={() => toggleCard("value")}
            style={{ 
              padding: EncarSpacing.xl,
              background: "white",
              borderRadius: EncarRadius.lg,
              border: `1px solid ${EncarColors.borderLight}`,
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = EncarColors.primary;
              e.currentTarget.style.boxShadow = `0 8px 24px ${EncarColors.primary}20`;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = EncarColors.borderLight;
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray, marginBottom: EncarSpacing.xs }}>
              예상 판매가
            </div>
            <div style={{ fontSize: "40px", fontWeight: EncarFonts.weight.extrabold, color: EncarColors.primary, lineHeight: 1, marginBottom: "2px" }}>
              {nf.format(Math.round(timing.nowValue / 10000))}
            </div>
            <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray, marginBottom: EncarSpacing.sm }}>
              평균 +{Math.round((timing.nowValue - timing.nowValue * 0.95) / 10000)}만원
            </div>
            <div style={{ 
              fontSize: EncarFonts.size.tiny, 
              color: EncarColors.primary, 
              fontWeight: EncarFonts.weight.semibold,
              textDecoration: "underline",
              paddingTop: EncarSpacing.xs,
              borderTop: `1px solid ${EncarColors.borderLight}`,
              marginBottom: EncarSpacing.sm,
            }}>
              {expandedCards.has("value") ? "△ 접기" : "▽ 상세보기"}
            </div>
            
            {/* 상세 정보 */}
            {expandedCards.has("value") && (
              <div style={{ marginTop: EncarSpacing.md, paddingTop: EncarSpacing.md, borderTop: `2px solid ${EncarColors.primary}30` }}>
                <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.darkGray, marginBottom: EncarSpacing.sm, fontWeight: EncarFonts.weight.semibold }}>
                  {insights.valueRetention.summary}
                </div>
                {insights.valueRetention.breakdown.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: EncarSpacing.xs }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                      <span style={{ color: EncarColors.darkGray }}>{item.label}</span>
                      <span style={{ color: EncarColors.dark, fontWeight: EncarFonts.weight.bold }}>
                        {nf.format(Math.round(item.value / 10000))}만원
                      </span>
                    </div>
                    <div style={{ fontSize: "9px", color: EncarColors.lightGray }}>{item.detail}</div>
                  </div>
                ))}
                <div style={{ marginTop: EncarSpacing.sm, fontSize: "10px", color: EncarColors.primary }}>
                  📊 {insights.valueRetention.comparison}
                </div>
                <div style={{ marginTop: EncarSpacing.xs, padding: EncarSpacing.xs, background: `${EncarColors.primary}10`, borderRadius: EncarRadius.sm, fontSize: "10px", color: EncarColors.primary }}>
                  💡 {insights.valueRetention.improvement}
                </div>
              </div>
            )}
          </div>
          
          {/* 3️⃣ 판매 타이밍 */}
          <div 
            onClick={() => toggleCard("market")}
            style={{ 
              padding: EncarSpacing.xl,
              background: "white",
              borderRadius: EncarRadius.lg,
              border: `1px solid ${EncarColors.borderLight}`,
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = EncarColors.primary;
              e.currentTarget.style.boxShadow = `0 8px 24px ${EncarColors.primary}20`;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = EncarColors.borderLight;
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray, marginBottom: EncarSpacing.xs }}>
              판매 타이밍
            </div>
            <div style={{ 
              fontSize: "48px", 
              fontWeight: EncarFonts.weight.extrabold, 
              color: lifecycle.stage === "Next" ? "#ff4d4f" : lifecycle.stage === "Care" ? EncarColors.primary : lifecycle.stage === "Keep" ? EncarColors.success : EncarColors.info,
              lineHeight: 1,
              marginBottom: "2px",
            }}>
              {lifecycle.stage === "Next" ? "적기" : lifecycle.stage === "Care" ? "좋음" : lifecycle.stage === "Keep" ? "양호" : "최상"}
            </div>
            <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray, marginBottom: EncarSpacing.sm }}>
              {Math.round(lifecycle.yearsOwned)}년차 · {lifecycle.stage === "Next" ? "교체 권장" : lifecycle.stage === "Care" ? "판매 검토" : lifecycle.stage === "Keep" ? "안정 유지" : "프리미엄"}
            </div>
            <div style={{ 
              fontSize: EncarFonts.size.tiny, 
              color: EncarColors.primary, 
              fontWeight: EncarFonts.weight.semibold,
              textDecoration: "underline",
              paddingTop: EncarSpacing.xs,
              borderTop: `1px solid ${EncarColors.borderLight}`,
              marginBottom: EncarSpacing.sm,
            }}>
              {expandedCards.has("market") ? "△ 접기" : "▽ 상세보기"}
            </div>
            
            {/* 상세 정보 */}
            {expandedCards.has("market") && (
              <div style={{ marginTop: EncarSpacing.md, paddingTop: EncarSpacing.md, borderTop: `2px solid ${EncarColors.primary}30` }}>
                <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.darkGray, marginBottom: EncarSpacing.sm, fontWeight: EncarFonts.weight.semibold }}>
                  {insights.marketCompetitiveness.summary}
                </div>
                
                {/* 경쟁 우위 */}
                {insights.marketCompetitiveness.advantages.length > 0 && (
                  <div style={{ marginBottom: EncarSpacing.sm, padding: EncarSpacing.xs, background: "#f6ffed", borderRadius: EncarRadius.sm }}>
                    <div style={{ fontSize: "10px", fontWeight: EncarFonts.weight.bold, color: "#52c41a", marginBottom: "4px" }}>
                      강점
                    </div>
                    {insights.marketCompetitiveness.advantages.map((adv, idx) => (
                      <div key={idx} style={{ fontSize: "9px", color: "#52c41a", marginBottom: "2px" }}>
                        {adv}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 개선점 */}
                {insights.marketCompetitiveness.improvements.length > 0 && (
                  <div style={{ marginBottom: EncarSpacing.sm, padding: EncarSpacing.xs, background: "#fffbe6", borderRadius: EncarRadius.sm }}>
                    <div style={{ fontSize: "10px", fontWeight: EncarFonts.weight.bold, color: "#faad14", marginBottom: "4px" }}>
                      개선 가능
                    </div>
                    {insights.marketCompetitiveness.improvements.map((imp, idx) => (
                      <div key={idx} style={{ fontSize: "9px", color: EncarColors.dark, marginBottom: "2px" }}>
                        {imp}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 평균 대비 */}
                <div style={{ marginBottom: EncarSpacing.sm, padding: EncarSpacing.xs, background: "#e6f4ff", borderRadius: EncarRadius.sm }}>
                  <div style={{ fontSize: "10px", fontWeight: EncarFonts.weight.bold, color: "#1677ff", marginBottom: "4px" }}>
                    평균 대비
                  </div>
                  <div style={{ fontSize: "9px", color: "#1677ff", display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div>💰 판매가: {insights.marketCompetitiveness.vsAverage.price}</div>
                    <div>⏱️ 판매 속도: {insights.marketCompetitiveness.vsAverage.sellTime}</div>
                    <div>👀 문의: {insights.marketCompetitiveness.vsAverage.inquiries}</div>
                  </div>
                </div>
                
                {/* 팁 */}
                <div style={{ padding: EncarSpacing.xs, background: "#fff7e6", borderRadius: EncarRadius.sm, border: `2px solid ${EncarColors.primary}` }}>
                  <div style={{ fontSize: "10px", color: EncarColors.primary, lineHeight: 1.5 }}>
                    💡 {insights.marketCompetitiveness.tip}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 엔카봇 의견 (통합) */}
        <div style={{
          padding: EncarSpacing.xl,
          background: "white",
          borderRadius: EncarRadius.lg,
          border: `1px solid ${EncarColors.borderLight}`,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          minHeight: "200px",
        }}>
          <div style={{ 
            fontSize: EncarFonts.size.small, 
            fontWeight: EncarFonts.weight.bold, 
            color: EncarColors.dark,
            marginBottom: EncarSpacing.sm,
            display: "flex",
            alignItems: "center",
            gap: EncarSpacing.xs,
          }}>
            <span style={{ fontSize: "24px" }}>🤖</span>
            <span>엔카봇 의견</span>
          </div>
          <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray, lineHeight: 1.7, marginBottom: EncarSpacing.lg, flex: 1 }}>
            {(() => {
              const currentMonthlyRate = lifecycle.stage === "Trust" ? 0.8 :
                                          lifecycle.stage === "Keep" ? 1.0 :
                                          lifecycle.stage === "Care" ? 1.5 : 2.0;
              const futureMonthlyRate = lifecycle.stage === "Trust" ? 0.8 :
                                         lifecycle.stage === "Keep" ? 1.2 :
                                         lifecycle.stage === "Care" ? 1.8 : 2.5;
              
              const currentMonth = new Date().getMonth() + 1;
              const isSummerOrWinter = currentMonth >= 11 || currentMonth <= 2 || (currentMonth >= 5 && currentMonth <= 8);
              
              const avgPrice = Math.round(timing.nowValue / 10000);
              const encarBonus = 5;
              
              // 종합 의견 생성 (양심적이되 넛지 포함)
              if (lifecycle.stage === "Next") {
                return `${vehicle.year}년식 ${vehicle.model}는 현재 월 ${currentMonthlyRate}%씩 감가 중이며, ${futureMonthlyRate}%로 가속될 시기입니다. ${isSummerOrWinter ? "시장 수요도 높은 시점이고" : "비수기지만"}, 유사 차량 ${ownerStats.totalOwners}대 분석 결과 평균 ${nf.format(avgPrice)}만원에 거래되고 있습니다. 컨디션(${scores.condition}점)과 시장 상황을 종합하면, ${Math.round(lifecycle.yearsOwned)}년간 충분히 타셨고 다음 단계를 고민하실 시점입니다. 엔카 비교견적으로 평균 +${encarBonus}% 높은 가격을 받으실 수 있고, 다음 차량도 함께 둘러보시면 좋을 것 같아요.`;
              } else if (lifecycle.stage === "Care") {
                return `${vehicle.year}년식 ${vehicle.model}는 현재 월 ${currentMonthlyRate}%씩 감가 중이며, 향후 ${futureMonthlyRate}%로 상승할 가능성이 있습니다. ${isSummerOrWinter ? "현재 시장 수요가 높아" : "시장 수요는 평균 수준이지만"} 유사 차량은 평균 ${nf.format(avgPrice)}만원에 거래 중입니다. 컨디션(${scores.condition}점)이 양호하므로 관리하며 조금 더 타셔도 괜찮지만, 새 차가 궁금하시다면 지금도 나쁘지 않은 타이밍이에요. 엔카 셀프진단으로 정확한 시세 확인해보세요.`;
              } else if (lifecycle.stage === "Keep") {
                return `${vehicle.year}년식 ${vehicle.model}는 월 ${currentMonthlyRate}%씩 완만하게 감가 중이며, 향후에도 ${futureMonthlyRate}% 수준을 유지할 전망입니다. ${isSummerOrWinter ? "시장 수요도 안정적이고" : "비수기지만 가격 방어가 잘 되는 시기이며"}, 현재 컨디션(${scores.condition}점)도 우수합니다. 정기 점검만 잘 하시면 가치를 오래 유지할 수 있어요. 다만 ${Math.round(lifecycle.yearsOwned)}년 타셨으니 라이프스타일이 바뀌셨거나 새 차가 필요하시다면, ${isSummerOrWinter ? "지금도" : "다음 성수기에"} 고려해보셔도 좋아요.`;
              } else {
                return `${vehicle.year}년식 ${vehicle.model}는 월 ${currentMonthlyRate}%의 낮은 감가율을 보이는 신차감 시기입니다. ${isSummerOrWinter ? "시장 수요도 활발하고" : "비수기지만"}, 현재 컨디션(${scores.condition}점)이 최상급이므로 당분간 안심하고 타셔도 됩니다. 다만 가족 구성이 바뀌셨거나 더 큰/작은 차가 필요하시다면, 지금 높은 가격에 팔고 바꾸시는 것도 좋은 선택이에요. 엔카에서 다음 차량도 함께 찾아보세요.`;
              }
            })()}
          </div>
          
          {/* 엔카 프리미엄 정보 + 비교견적 버튼 - 컴팩트 레이아웃 */}
          <div style={{ 
            display: "flex", 
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${EncarSpacing.sm} ${EncarSpacing.md}`,
            background: `linear-gradient(135deg, ${EncarColors.primary}08 0%, ${EncarColors.primary}03 100%)`,
            borderRadius: EncarRadius.md,
            border: `1px solid ${EncarColors.primary}20`,
            marginTop: EncarSpacing.md,
            gap: EncarSpacing.sm,
          }}>
            <div style={{ 
              fontSize: EncarFonts.size.medium, 
              color: EncarColors.darkGray,
              display: "flex",
              alignItems: "center",
              gap: EncarSpacing.xs,
              flex: 1,
            }}>
              💡 엔카로 팔면 <span style={{ color: EncarColors.primary, fontWeight: EncarFonts.weight.bold }}>+{Math.round((timing.nowValue * 0.08) / 10000)}만원 더 받을 수 있어요!</span> <span style={{ fontSize: EncarFonts.size.small, color: EncarColors.gray }}>(1,234명이 이미 확인했어요)</span>
            </div>
            <button
              id="encar-premium-box"
              onClick={() => {
                const floatingComparison = document.querySelector('[data-service="comparison"]');
                if (floatingComparison) {
                  (floatingComparison as HTMLElement).style.animation = 'bounce-highlight 0.5s 3';
                  setTimeout(() => {
                    (floatingComparison as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 100);
                }
              }}
              style={{
                padding: `${EncarSpacing.xs} ${EncarSpacing.md}`,
                background: `linear-gradient(135deg, ${EncarColors.primary} 0%, ${EncarColors.primary}dd 100%)`,
                color: "white",
                border: "none",
                borderRadius: EncarRadius.md,
                fontSize: EncarFonts.size.small,
                fontWeight: EncarFonts.weight.extrabold,
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: `0 2px 8px ${EncarColors.primary}30`,
                animation: "pulse-glow-btn 2s infinite",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `0 4px 16px ${EncarColors.primary}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = `0 2px 8px ${EncarColors.primary}30`;
              }}
            >
              엔카 비교견적으로 지금 바로 최고가 받기
            </button>
          </div>
          
          <style>{`
            @keyframes pulse-glow-btn {
              0%, 100% {
                box-shadow: 0 2px 8px ${EncarColors.primary}30;
              }
              50% {
                box-shadow: 0 4px 20px ${EncarColors.primary}60, 0 0 30px ${EncarColors.primary}40;
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}

