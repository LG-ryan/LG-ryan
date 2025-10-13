// frontend/src/components/VehicleGarage.tsx
// "내 차고" - 차량과의 추억 공간

import React, { useState } from "react";
import { Vehicle } from "../types/vehicle";
import { EncarColors, EncarFonts, EncarRadius, EncarShadows, EncarSpacing } from "../styles/encar-theme";
import StatCard from "./StatCard";
import VehicleAvatar from "./VehicleAvatar";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";
import VehicleCustomizer, { VehicleCustomization } from "./VehicleCustomizer";

interface Props {
  vehicle: Vehicle;
  yearsOwned: number;
}

const nf = new Intl.NumberFormat("ko-KR");

export default function VehicleGarage({ vehicle, yearsOwned }: Props) {
  const [nickname, setNickname] = useState<string>(() => {
    const saved = localStorage.getItem(`vehicle_${vehicle.id}_nickname`);
    return saved || `우리 ${vehicle.model}`;
  });
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showExpDetails, setShowExpDetails] = useState(false);
  const [customization, setCustomization] = useState<VehicleCustomization>({
    bodyColor: "#FF6C00",
    rotation: 0,
  });
  
  // 닉네임 변경 시 localStorage에 저장
  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname);
    localStorage.setItem(`vehicle_${vehicle.id}_nickname`, newNickname);
  };

  // 커스터마이징 저장
  const handleCustomizationSave = (newCustomization: VehicleCustomization) => {
    setCustomization(newCustomization);
  };

  // 통계 계산
  const stats = {
    totalDays: Math.round(yearsOwned * 365),
    totalKm: vehicle.currentMileage,
    journeyCount: Math.floor(vehicle.currentMileage / 300), // 300km당 여행 1회 가정
    maintenanceCount: Math.floor(vehicle.currentMileage / 10000), // 1만km당 정비 1회
    encarPoints: 1250, // 임시
  };

  // 차량 건강도 계산 (0-100)
  const calculateHealthScore = () => {
    let score = 100;
    
    // 사고 이력
    if (vehicle.accident === "major") score -= 30;
    else if (vehicle.accident === "minor") score -= 10;
    
    // 주행거리 (연평균 15,000km 기준)
    const avgKmPerYear = vehicle.currentMileage / yearsOwned;
    if (avgKmPerYear > 20000) score -= 15;
    else if (avgKmPerYear < 10000) score += 5;
    
    // 연식
    const currentYear = new Date().getFullYear();
    const carAge = currentYear - vehicle.year;
    if (carAge > 10) score -= 20;
    else if (carAge > 5) score -= 10;
    
    // 외관 상태
    if (vehicle.exterior) {
      if (vehicle.exterior.front === "major" || vehicle.exterior.side === "major" || vehicle.exterior.rear === "major") {
        score -= 10;
      } else if (vehicle.exterior.front === "minor" || vehicle.exterior.side === "minor" || vehicle.exterior.rear === "minor") {
        score -= 5;
      }
    }
    
    // 타이어 상태
    if (vehicle.tires) {
      const replaceTires = Object.values(vehicle.tires).filter(t => t === "replace").length;
      score -= replaceTires * 3;
    }
    
    return Math.max(0, Math.min(100, score));
  };

  const healthScore = calculateHealthScore();
  
  // 경험치 시스템 (F1 여정)
  const calculateExpAndLevel = () => {
    let totalExp = 0;
    
    // 1. 주행거리 (1,000km당 30 EXP) - 기본 자동 누적
    totalExp += Math.floor(vehicle.currentMileage / 1000) * 30;
    
    // 2. 보유 기간 (1개월당 50 EXP) - 기본 자동 누적
    totalExp += Math.floor(yearsOwned * 12) * 50;
    
    // 3. 정비 기록 (1회당 300 EXP) - 능동적 참여
    totalExp += stats.maintenanceCount * 300;
    
    // 4. 커뮤니티 활동 (예시 - 실제로는 백엔드 데이터)
    const communityExp = {
      reviews: 5, // 리뷰 5개
      comments: 15, // 댓글 15개
      posts: 3, // 게시글 3개
      likes: 30, // 좋아요 30개
    };
    totalExp += communityExp.reviews * 300; // 리뷰 1개당 300 EXP
    totalExp += communityExp.comments * 50; // 댓글 1개당 50 EXP (절반 감소)
    totalExp += communityExp.posts * 200; // 게시글 1개당 200 EXP (절반 이하)
    totalExp += communityExp.likes * 5; // 좋아요 1개당 5 EXP (절반)
    
    // 5. 엔카 서비스 이용 (대폭 강화!)
    const serviceExp = {
      comparison: 1, // 비교견적 1회
      selfDiagnosis: 0, // 셀프진단 0회
      sell: 0, // 판매 완료 0회
      buy: 0, // 구매 완료 0회
      midgo: 0, // 믿고 거래 0회
    };
    totalExp += serviceExp.comparison * 5000; // 비교견적 1회당 5,000 EXP
    totalExp += serviceExp.selfDiagnosis * 3000; // 셀프진단 1회당 3,000 EXP
    totalExp += serviceExp.sell * 50000; // 판매 완료 1회당 50,000 EXP
    totalExp += serviceExp.buy * 30000; // 구매 완료 1회당 30,000 EXP
    totalExp += serviceExp.midgo * 80000; // 믿고 거래 1회당 80,000 EXP
    
    // 레벨별 필요 경험치 (1-50, 지수 증가)
    const levelRequirements = [
      0,      // Lv 0 시작
      1000,   // Lv 1
      2000,   // Lv 2
      3000,   // Lv 3
      4000,   // Lv 4
      5000,   // Lv 5
      7000,   // Lv 6
      9000,   // Lv 7
      11000,  // Lv 8
      13000,  // Lv 9
      15000,  // Lv 10
      18000,  // Lv 11
      21000,  // Lv 12
      24000,  // Lv 13
      27000,  // Lv 14
      30000,  // Lv 15
      35000,  // Lv 16
      40000,  // Lv 17
      45000,  // Lv 18
      50000,  // Lv 19
      55000,  // Lv 20
      65000,  // Lv 21 (F2 시작 - 5년+)
      75000,  // Lv 22
      85000,  // Lv 23
      95000,  // Lv 24
      105000, // Lv 25
      120000, // Lv 26 (F1 시작!)
      135000, // Lv 27
      150000, // Lv 28
      165000, // Lv 29
      180000, // Lv 30
      200000, // Lv 31
      220000, // Lv 32
      240000, // Lv 33
      260000, // Lv 34
      280000, // Lv 35
      305000, // Lv 36
      330000, // Lv 37
      355000, // Lv 38
      380000, // Lv 39
      405000, // Lv 40
      435000, // Lv 41
      465000, // Lv 42
      495000, // Lv 43
      525000, // Lv 44
      555000, // Lv 45
      590000, // Lv 46
      625000, // Lv 47
      660000, // Lv 48
      695000, // Lv 49
      1000000, // Lv 50 (명예의 전당)
    ];
    
    let currentLevel = 0;
    for (let i = 0; i < levelRequirements.length - 1; i++) {
      if (totalExp >= levelRequirements[i + 1]) {
        currentLevel = i + 1;
      } else {
        break;
      }
    }
    
    const currentLevelExp = levelRequirements[currentLevel];
    const nextLevelExp = levelRequirements[currentLevel + 1] || levelRequirements[levelRequirements.length - 1];
    const expInCurrentLevel = totalExp - currentLevelExp;
    const expNeededForNextLevel = nextLevelExp - currentLevelExp;
    const progress = (expInCurrentLevel / expNeededForNextLevel) * 100;
    
    return {
      totalExp,
      currentLevel: Math.min(currentLevel, 10),
      currentLevelExp,
      nextLevelExp,
      expInCurrentLevel,
      expNeededForNextLevel,
      progress: Math.min(progress, 100),
      communityExp,
      serviceExp,
    };
  };

  const expData = calculateExpAndLevel();
  const level = expData.currentLevel;

  // 달성한 마일스톤 (20개, 다양한 분류)
  const milestones = [
    // 🎯 주행 거리 마일스톤
    { badge: "🎯", title: "첫 만 킬로", category: "주행", achieved: vehicle.currentMileage >= 10000 },
    { badge: "🚗", title: "3만 킬로", category: "주행", achieved: vehicle.currentMileage >= 30000 },
    { badge: "🌟", title: "오만 킬로", category: "주행", achieved: vehicle.currentMileage >= 50000 },
    { badge: "🏅", title: "7만 킬로", category: "주행", achieved: vehicle.currentMileage >= 70000 },
    { badge: "💎", title: "십만 킬로 클럽", category: "주행", achieved: vehicle.currentMileage >= 100000 },
    
    // 🎂 시간 마일스톤
    { badge: "🌱", title: "첫 3개월", category: "시간", achieved: yearsOwned >= 0.25 },
    { badge: "🎈", title: "6개월", category: "시간", achieved: yearsOwned >= 0.5 },
    { badge: "🎂", title: "1주년", category: "시간", achieved: yearsOwned >= 1 },
    { badge: "🎊", title: "2주년", category: "시간", achieved: yearsOwned >= 2 },
    { badge: "🏆", title: "3년 동행", category: "시간", achieved: yearsOwned >= 3 },
    { badge: "💝", title: "5년 인연", category: "시간", achieved: yearsOwned >= 5 },
    
    // 🔧 관리 마일스톤
    { badge: "🔧", title: "첫 정비", category: "관리", achieved: stats.maintenanceCount >= 1 },
    { badge: "🛠️", title: "정비 마스터", category: "관리", achieved: stats.maintenanceCount >= 5 },
    { badge: "⚙️", title: "관리 달인", category: "관리", achieved: stats.maintenanceCount >= 10 },
    
    // 🌍 여행 마일스톤
    { badge: "🗺️", title: "첫 여행", category: "여행", achieved: stats.journeyCount >= 1 },
    { badge: "🏖️", title: "여행 러버", category: "여행", achieved: stats.journeyCount >= 10 },
    { badge: "✈️", title: "방랑 드라이버", category: "여행", achieved: stats.journeyCount >= 30 },
    
    // 🏅 특별 업적
    { badge: "💯", title: "완벽 컨디션", category: "특별", achieved: healthScore >= 95 },
    { badge: "🌟", title: "무사고 운전", category: "특별", achieved: vehicle.accident === "none" },
    { badge: "👑", title: "엔카 마스터", category: "특별", achieved: expData.currentLevel >= 20 },
  ];

  const achievedMilestones = milestones.filter(m => m.achieved);
  const nextMilestone = milestones.find(m => !m.achieved);

  const styles = {
    container: {
      background: EncarColors.white,
      padding: EncarSpacing.xl,
      borderRadius: EncarRadius.lg,
      marginBottom: EncarSpacing.lg,
      border: `1px solid ${EncarColors.borderLight}`,
      boxShadow: EncarShadows.card,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "start",
      marginBottom: EncarSpacing.xl,
    },
    nicknameSection: {
      display: "flex",
      alignItems: "center",
      gap: EncarSpacing.md,
    },
    nickname: {
      fontSize: EncarFonts.size.xxlarge,
      fontWeight: EncarFonts.weight.extrabold,
      color: EncarColors.dark,
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: EncarSpacing.lg,
      marginBottom: EncarSpacing.xl,
    },
    statCard: {
      background: EncarColors.white,
      padding: EncarSpacing.lg,
      borderRadius: EncarRadius.md,
      textAlign: "center" as const,
      boxShadow: EncarShadows.card,
    },
    statValue: {
      fontSize: EncarFonts.size.xxlarge,
      fontWeight: EncarFonts.weight.extrabold,
      color: EncarColors.primary,
      marginBottom: EncarSpacing.xs,
    },
    statLabel: {
      fontSize: EncarFonts.size.small,
      color: EncarColors.darkGray,
    },
    badgeGrid: {
      display: "flex",
      gap: EncarSpacing.sm,
      flexWrap: "wrap" as const,
      marginBottom: EncarSpacing.lg,
    },
    badge: (achieved: boolean) => ({
      padding: `${EncarSpacing.sm} ${EncarSpacing.md}`,
      background: achieved ? EncarColors.white : "#f0f0f0",
      border: achieved ? `2px solid ${EncarColors.primary}` : "1px solid #d9d9d9",
      borderRadius: EncarRadius.md,
      fontSize: EncarFonts.size.small,
      fontWeight: achieved ? EncarFonts.weight.semibold : EncarFonts.weight.regular,
      color: achieved ? EncarColors.primary : EncarColors.lightGray,
      opacity: achieved ? 1 : 0.5,
      display: "flex",
      alignItems: "center",
      gap: EncarSpacing.xs,
    }),
  };

  return (
    <div style={styles.container}>
      {/* 헤더: 차량 별명 & 포인트 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: EncarSpacing.lg }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: EncarSpacing.sm, marginBottom: 4 }}>
            {isEditingNickname ? (
              <input
                type="text"
                value={nickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                onBlur={() => setIsEditingNickname(false)}
                autoFocus
                style={{
                  fontSize: EncarFonts.size.xxlarge,
                  fontWeight: EncarFonts.weight.extrabold,
                  border: `2px solid ${EncarColors.primary}`,
                  borderRadius: EncarRadius.md,
                  padding: EncarSpacing.sm,
                  background: EncarColors.white,
                }}
              />
            ) : (
              <>
                <div style={{ fontSize: EncarFonts.size.xxlarge, fontWeight: EncarFonts.weight.extrabold, color: EncarColors.dark }}>{nickname}</div>
                <button
                  onClick={() => setIsEditingNickname(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: EncarColors.lightGray,
                    cursor: "pointer",
                    fontSize: EncarFonts.size.body,
                  }}
                  title="별명 수정"
                >
                  ✏️
                </button>
              </>
            )}
          </div>
          <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.lightGray }}>
            {vehicle.year}년식 {vehicle.model} · {
              vehicle.vehicleType === "sedan" ? "세단" :
              vehicle.vehicleType === "suv" ? "SUV" :
              vehicle.vehicleType === "hatchback" ? "해치백" :
              vehicle.vehicleType === "coupe" ? "쿠페" :
              vehicle.vehicleType === "van" ? "밴/MPV" :
              vehicle.vehicleType === "pickup" ? "픽업트럭" :
              vehicle.vehicleType === "truck" ? "트럭" : "차량"
            }
          </div>
        </div>
        
        <div style={{
          background: EncarColors.white,
          padding: `${EncarSpacing.sm} ${EncarSpacing.lg}`,
          borderRadius: EncarRadius.full,
          boxShadow: EncarShadows.card,
          display: "flex",
          alignItems: "center",
          gap: EncarSpacing.sm,
          border: `1px solid ${EncarColors.borderLight}`,
        }}>
          <span style={{ fontSize: "18px" }}>🪙</span>
          <span style={{ fontSize: EncarFonts.size.large, fontWeight: EncarFonts.weight.bold, color: EncarColors.primary }}>
            {nf.format(stats.encarPoints)}P
          </span>
        </div>
      </div>

      {/* 엔카 등급 시스템 */}
      <div style={{
        background: EncarColors.white,
        padding: EncarSpacing.lg,
        borderRadius: EncarRadius.lg,
        marginBottom: EncarSpacing.lg,
        border: `2px solid ${EncarColors.borderLight}`,
        boxShadow: EncarShadows.card,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: EncarSpacing.md }}>
          <div>
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray, marginBottom: 4 }}>
              엔카 드라이버 등급
            </div>
            <div style={{ 
              fontSize: EncarFonts.size.xxlarge, 
              fontWeight: EncarFonts.weight.extrabold, 
              color: level >= 26 ? "#ff4d4f" : level >= 21 ? "#fa8c16" : level >= 16 ? "#faad14" : level >= 11 ? "#52c41a" : EncarColors.primary,
            }}>
              {level >= 0 && level <= 5 && "Karting Rookie"}
              {level >= 6 && level <= 10 && "Karting Pro"}
              {level >= 11 && level <= 15 && "Formula 4"}
              {level >= 16 && level <= 20 && "Formula 3"}
              {level >= 21 && level <= 25 && "Formula 2"}
              {level >= 26 && level <= 30 && "F1 Driver"}
              {level >= 31 && level <= 35 && "Points Scorer"}
              {level >= 36 && level <= 40 && "Podium Finisher"}
              {level >= 41 && level <= 45 && "Race Winner"}
              {level >= 46 && level <= 49 && "World Champion"}
              {level >= 50 && "Hall of Fame"}
            </div>
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray, marginTop: 4 }}>
              레벨 {level} / 50
            </div>
          </div>
          
          {/* 등급 안내 */}
          <button
            style={{
              padding: `${EncarSpacing.xs} ${EncarSpacing.md}`,
              background: EncarColors.white,
              border: `1px solid ${EncarColors.borderLight}`,
              borderRadius: EncarRadius.md,
              color: EncarColors.darkGray,
              fontSize: EncarFonts.size.tiny,
              fontWeight: EncarFonts.weight.semibold,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fafafa";
              e.currentTarget.style.borderColor = EncarColors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = EncarColors.white;
              e.currentTarget.style.borderColor = EncarColors.borderLight;
            }}
            onClick={() => setShowGradeModal(true)}
          >
            등급 안내
          </button>
        </div>
        
        {/* 경험치 프로그레스 */}
        <div style={{ marginBottom: EncarSpacing.sm }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.darkGray }}>
              EXP {nf.format(expData.expInCurrentLevel)} / {nf.format(expData.expNeededForNextLevel)}
            </div>
            <div style={{ fontSize: EncarFonts.size.tiny, fontWeight: EncarFonts.weight.bold, color: EncarColors.primary }}>
              {Math.round(expData.progress)}%
            </div>
          </div>
          <ProgressBar value={expData.progress} color={EncarColors.primary} height={10} animated />
          <div style={{ fontSize: "10px", color: EncarColors.lightGray, marginTop: 4, textAlign: "right" }}>
            총 {nf.format(expData.totalExp)} EXP
          </div>
        </div>
        
        {/* 경험치 획득 방법 (3열 그리드) */}
        <div style={{
          background: EncarColors.white,
          padding: EncarSpacing.md,
          borderRadius: EncarRadius.md,
          marginTop: EncarSpacing.md,
        }}>
          <div style={{ 
            fontSize: EncarFonts.size.tiny, 
            fontWeight: EncarFonts.weight.bold, 
            color: EncarColors.dark, 
            marginBottom: EncarSpacing.sm,
            display: "flex",
            alignItems: "center",
            gap: EncarSpacing.xs,
          }}>
            <span>경험치 획득</span>
            <span style={{ 
              fontSize: "10px", 
              color: EncarColors.lightGray, 
              fontWeight: EncarFonts.weight.regular,
              background: "#f0f0f0",
              padding: "2px 6px",
              borderRadius: EncarRadius.sm,
            }}>
              내 엔카 계정 전체
            </span>
          </div>
          
          {/* 경험치 획득 버튼 */}
          <button
            onClick={() => setShowExpDetails(!showExpDetails)}
            style={{
              width: "100%",
              padding: EncarSpacing.md,
              background: showExpDetails ? "#f0f0f0" : "white",
              border: `1px solid ${EncarColors.borderLight}`,
              borderRadius: EncarRadius.md,
              fontSize: EncarFonts.size.small,
              fontWeight: EncarFonts.weight.semibold,
              color: EncarColors.dark,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: showExpDetails ? EncarSpacing.sm : 0,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
            onMouseLeave={(e) => e.currentTarget.style.background = showExpDetails ? "#f0f0f0" : "white"}
          >
            <span>경험치 획득 방법 (3가지)</span>
            <span style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.primary }}>
              {showExpDetails ? "▲ 접기" : "▼ 펼치기"}
            </span>
          </button>
          
          {/* 상세 정보 */}
          {showExpDetails && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: EncarSpacing.sm }}>
              {/* 기본 활동 */}
              <div style={{
                padding: EncarSpacing.sm,
                background: "#fafafa",
                borderRadius: EncarRadius.sm,
                border: "1px solid #f0f0f0",
              }}>
                <div style={{ fontSize: "10px", fontWeight: EncarFonts.weight.semibold, color: EncarColors.darkGray, marginBottom: 4 }}>
                  기본 활동
                </div>
                <div style={{ fontSize: "10px", color: EncarColors.lightGray, lineHeight: 1.6 }}>
                  ・주행 1,000km  +30<br/>
                  ・보유 1개월  +50<br/>
                  ・정비 등록  +300
                </div>
              </div>
              
              {/* 커뮤니티 활동 */}
              <div style={{ 
                padding: EncarSpacing.sm,
                background: `${EncarColors.primary}10`,
                borderRadius: EncarRadius.sm,
                border: `1px solid ${EncarColors.primary}30`,
              }}>
                <div style={{ fontSize: "10px", fontWeight: EncarFonts.weight.bold, color: EncarColors.primary, marginBottom: 4 }}>
                  커뮤니티 참여
                </div>
                <div style={{ fontSize: "10px", color: EncarColors.darkGray, lineHeight: 1.6 }}>
                  ・댓글 작성  +50<br/>
                  ・게시글 작성  +200<br/>
                  ・리뷰 작성  +300<br/>
                  ・좋아요 받기  +5
                </div>
              </div>
              
              {/* 엔카 서비스 이용 (강조) */}
              <div style={{ 
                padding: EncarSpacing.sm,
                background: "#fff7e6",
                borderRadius: EncarRadius.sm,
                border: `1px solid ${EncarColors.primary}`,
              }}>
              <div style={{ fontSize: EncarFonts.size.tiny, fontWeight: EncarFonts.weight.bold, color: EncarColors.primary, marginBottom: 4 }}>
                엔카 서비스 ⭐
              </div>
              <div style={{ fontSize: "10px", color: EncarColors.dark, lineHeight: 1.6 }}>
                ・비교견적  +5,000<br/>
                ・셀프진단  +3,000<br/>
                ・차량 판매  +50,000<br/>
                ・차량 구매  +30,000<br/>
                ・믿고 거래  +80,000
              </div>
              </div>
            </div>
          )}
          
          <button
            style={{
              marginTop: EncarSpacing.xs,
              padding: `${EncarSpacing.xs} ${EncarSpacing.sm}`,
              background: `linear-gradient(135deg, ${EncarColors.primary} 0%, ${EncarColors.primaryLight} 100%)`,
              border: "none",
              borderRadius: EncarRadius.md,
              color: "white",
              fontSize: "10px",
              fontWeight: EncarFonts.weight.semibold,
              cursor: "pointer",
              width: "100%",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            onClick={() => setShowActivityModal(true)}
          >
            내 활동 내역 & 팁 보기
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠: 차량 아바타(왼쪽) + 통계(오른쪽) */}
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: EncarSpacing.lg, marginBottom: EncarSpacing.lg }}>
        {/* 차량 아바타 */}
        <div style={{
          background: EncarColors.white,
          padding: EncarSpacing.lg,
          borderRadius: EncarRadius.lg,
          border: `1px solid ${EncarColors.borderLight}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          {/* 차량 커스터마이징 */}
          <VehicleCustomizer
            vehicleId={vehicle.id}
            vehicleType={vehicle.vehicleType}
            onSave={handleCustomizationSave}
          />
          
          <VehicleAvatar
            vehicleType={vehicle.vehicleType}
            condition={healthScore}
            customColor={customization.bodyColor}
          />
        </div>

        {/* 통계 카드 (그리드) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: EncarSpacing.md }}>
          <StatCard
            icon="📅"
            label="함께한 날"
            value={`${nf.format(stats.totalDays)}일`}
            subtext={`${Math.floor(stats.totalDays / 365)}년째`}
            color={EncarColors.primary}
          />
          <StatCard
            icon="🛣️"
            label="누적 주행"
            value={`${nf.format(stats.totalKm)}km`}
            subtext={`일평균 ${Math.round(stats.totalKm / stats.totalDays)}km`}
            color="#1890ff"
            trend="up"
          />
          <StatCard
            icon="🗺️"
            label="여행 기록"
            value={`${stats.journeyCount}회`}
            subtext="추억이 쌓이고 있어요"
            color="#52c41a"
          />
          <StatCard
            icon="🔧"
            label="정비 횟수"
            value={`${stats.maintenanceCount}회`}
            subtext="꼼꼼히 관리 중이에요"
            color="#fa8c16"
          />
        </div>
      </div>

      {/* 마일스톤 배지 */}
      <div>
        <div style={{ fontSize: EncarFonts.size.small, fontWeight: EncarFonts.weight.bold, color: EncarColors.dark, marginBottom: EncarSpacing.md }}>
          달성한 마일스톤 ({achievedMilestones.length}/{milestones.length})
        </div>
        <div style={styles.badgeGrid}>
          {milestones.map((m, idx) => (
            <div key={idx} style={styles.badge(m.achieved)}>
              <span>{m.badge}</span>
              <span>{m.title}</span>
            </div>
          ))}
        </div>
        
        {nextMilestone && (
          <div style={{
            marginTop: EncarSpacing.md,
            padding: EncarSpacing.md,
            background: EncarColors.white,
            borderRadius: EncarRadius.md,
            fontSize: EncarFonts.size.small,
            color: EncarColors.darkGray,
          }}>
            다음 목표: <strong>{nextMilestone.badge} {nextMilestone.title}</strong>
          </div>
        )}
      </div>

      {/* 등급 안내 모달 */}
      <Modal isOpen={showGradeModal} onClose={() => setShowGradeModal(false)} title="엔카 드라이버 등급 안내">
        <div style={{ fontSize: EncarFonts.size.small, lineHeight: 1.8, color: EncarColors.darkGray }}>
          {[
            { level: "Karting Rookie (Lv 1-5)", desc: "엔카와 함께 시작하는 첫걸음이에요", benefits: ["엔카 커뮤니티 가입"] },
            { level: "Karting Pro (Lv 6-10)", desc: "커뮤니티에서 활동을 시작해보세요", benefits: ["프로필에 배지가 표시돼요", "커뮤니티 모임에 참여할 수 있어요"] },
            { level: "Formula 4 (Lv 11-15)", desc: "본격적인 활동의 시작이에요", benefits: ["작성한 글에 F4 마크가 표시돼요", "비교견적 신청 시 우선 매칭돼요"] },
            { level: "Formula 3 (Lv 16-20)", desc: "커뮤니티에서 인정받고 있어요", benefits: ["작성한 글을 주 1회 상단에 고정할 수 있어요", "댓글이 강조 표시돼요", "우선 상담을 받을 수 있어요"] },
            { level: "Formula 2 (Lv 21-25) ⭐ 5년+", desc: "진짜 전문가로 인정받는 단계예요", benefits: ["작성한 글에 하이라이트 배경이 들어가요", "이 차 어때 베스트 답변 우선권이 있어요", "전담 상담원이 배정돼요", "신차 시승 정보를 우선 제공받아요"] },
            { level: "F1 Driver (Lv 26-30)", desc: "드디어 F1 그리드에 입성했어요!", benefits: ["프로필에 F1 레드 배지가 표시돼요", "희귀 차량 입고 시 최우선 알림을 받아요", "엔카 공식 리뷰어 자격이 부여돼요"] },
            { level: "Points Scorer (Lv 31-35)", desc: "포인트를 따내는 미드필더예요", benefits: ["프로필 URL을 커스터마이징할 수 있어요", "커뮤니티 메인에 TOP 드라이버로 등재돼요", "엔카 오너스 클럽 정회원이 돼요"] },
            { level: "Podium Finisher (Lv 36-40)", desc: "포디움에 오르는 상위권 드라이버예요", benefits: ["닉네임에 그라데이션 효과가 적용돼요", "엔카 자문위원으로 위촉돼요", "자동차 문화 콘텐츠를 함께 기획해요"] },
            { level: "Race Winner (Lv 41-45)", desc: "그랑프리 우승자예요", benefits: ["커뮤니티 공식 운영진 자격이 부여돼요", "자동차 전시회에 VIP로 초대돼요"] },
            { level: "World Champion (Lv 46-49)", desc: "세계 챔피언에 오른 전설이에요", benefits: ["닉네임이 챔피언 컬러 (금색)로 표시돼요", "엔카 명예 앰버서더로 위촉돼요", "챔피언 전용 프라이빗 채널이 열려요"] },
            { level: "Hall of Fame (Lv 50)", desc: "명예의 전당에 이름을 새기신 분이에요", benefits: ["당신만을 위한 특별한 혜택이 기다리고 있어요", "혜택은 달성자에게만 공개돼요", "역대 도달자: 0명", "", "당신이 첫 번째가 되어보세요!"] },
          ].map((grade, idx) => (
            <div key={idx} style={{ marginBottom: EncarSpacing.lg, paddingBottom: EncarSpacing.lg, borderBottom: idx < 10 ? `1px solid ${EncarColors.borderLight}` : "none" }}>
              <div style={{ fontSize: EncarFonts.size.medium, fontWeight: EncarFonts.weight.bold, color: EncarColors.dark, marginBottom: EncarSpacing.xs }}>
                {grade.level}
              </div>
              <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.lightGray, marginBottom: EncarSpacing.sm }}>
                {grade.desc}
              </div>
              {grade.benefits.map((benefit, bidx) => (
                <div key={bidx} style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray, marginLeft: EncarSpacing.md, marginTop: 4 }}>
                  {benefit && `・${benefit}`}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Modal>

      {/* 활동 내역 모달 */}
      <Modal isOpen={showActivityModal} onClose={() => setShowActivityModal(false)} title="F1 드라이버로 가는 길">
        <div style={{ fontSize: EncarFonts.size.small, lineHeight: 1.8 }}>
          <h4 style={{ fontSize: EncarFonts.size.medium, fontWeight: EncarFonts.weight.bold, color: EncarColors.dark, marginBottom: EncarSpacing.md }}>
            현재 활동 내역
          </h4>
          
          <div style={{ marginBottom: EncarSpacing.lg, padding: EncarSpacing.md, background: "#f0f5ff", borderRadius: EncarRadius.md }}>
            <div style={{ fontWeight: EncarFonts.weight.semibold, marginBottom: EncarSpacing.sm }}>커뮤니티 활동</div>
            <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray }}>
              ・리뷰 {expData.communityExp.reviews}개 작성 ({expData.communityExp.reviews * 300} EXP)<br/>
              ・댓글 {expData.communityExp.comments}개 작성 ({expData.communityExp.comments * 50} EXP)<br/>
              ・게시글 {expData.communityExp.posts}개 작성 ({expData.communityExp.posts * 200} EXP)
            </div>
          </div>

          <div style={{ marginBottom: EncarSpacing.lg, padding: EncarSpacing.md, background: "#fff7e6", borderRadius: EncarRadius.md }}>
            <div style={{ fontWeight: EncarFonts.weight.semibold, marginBottom: EncarSpacing.sm }}>엔카 서비스 이용</div>
            <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray }}>
              ・비교견적 {expData.serviceExp.comparison}회 신청 ({expData.serviceExp.comparison * 5000} EXP)
            </div>
          </div>

          <h4 style={{ fontSize: EncarFonts.size.medium, fontWeight: EncarFonts.weight.bold, color: EncarColors.dark, marginBottom: EncarSpacing.md, marginTop: EncarSpacing.xl }}>
            빠르게 레벨업하는 팁
          </h4>

          <div style={{ marginBottom: EncarSpacing.md }}>
            <div style={{ fontWeight: EncarFonts.weight.semibold, marginBottom: EncarSpacing.xs }}>1. 엔카 서비스를 적극 이용하세요!</div>
            <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray, marginLeft: EncarSpacing.md }}>
              ・비교견적 1회 = 댓글 100개와 같은 효과예요<br/>
              ・차량 판매 1회 = 댓글 1,000개와 같아요<br/>
              ・믿고 거래 1회 = 댓글 1,600개예요!
            </div>
          </div>

          <div style={{ marginBottom: EncarSpacing.md }}>
            <div style={{ fontWeight: EncarFonts.weight.semibold, marginBottom: EncarSpacing.xs }}>2. 커뮤니티에 꾸준히 참여하세요</div>
            <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray, marginLeft: EncarSpacing.md }}>
              ・매일 댓글 3개만 달아도 월 4,500 EXP예요<br/>
              ・주 1회 게시글 작성하면 월 800 EXP예요<br/>
              ・리뷰 작성은 1개당 300 EXP예요
            </div>
          </div>

          <div style={{ marginBottom: EncarSpacing.md }}>
            <div style={{ fontWeight: EncarFonts.weight.semibold, marginBottom: EncarSpacing.xs }}>3. 정비할 때마다 기록하세요</div>
            <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray, marginLeft: EncarSpacing.md }}>
              ・정비 기록 등록 + 리뷰 작성 = 600 EXP<br/>
              ・사진과 함께 올리면 더 도움이 돼요
            </div>
          </div>

          <div style={{ marginTop: EncarSpacing.xl, padding: EncarSpacing.lg, background: `${EncarColors.primary}10`, borderRadius: EncarRadius.md, textAlign: "center" }}>
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray, marginBottom: 4 }}>F1 드라이버 입성까지 남은 경험치</div>
            <div style={{ fontSize: EncarFonts.size.xxlarge, fontWeight: EncarFonts.weight.extrabold, color: EncarColors.primary, marginBottom: EncarSpacing.xs }}>
              {nf.format(Math.max(0, 120000 - expData.totalExp))} EXP
            </div>
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.darkGray }}>
              지금 차량을 판매하면 한 번에 도달할 수 있어요!
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

