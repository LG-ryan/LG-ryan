// frontend/src/components/MemoryTimeline.tsx
// 차량과의 추억 타임라인

import React, { useState } from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarSpacing } from "../styles/encar-theme";

interface Memory {
  id: string;
  date: string;
  type: "journey" | "maintenance" | "milestone" | "custom" | "upgrade" | "accident" | "family" | "season" | "achievement";
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Props {
  vehicleId: string;
  vehicleName: string;
}

export default function MemoryTimeline({ vehicleId, vehicleName }: Props) {
  // 타입별 색상 매핑 (4색 통일)
  const getColorByType = (type: string) => {
    switch (type) {
      case "milestone": return EncarColors.primary; // 주황 - 기념일
      case "journey": return EncarColors.success; // 초록 - 여행
      case "season": return EncarColors.success; // 초록 - 계절
      case "family": return EncarColors.success; // 초록 - 가족
      case "maintenance": return EncarColors.info; // 파랑 - 정비
      case "achievement": return EncarColors.primary; // 주황 - 달성
      case "upgrade": return EncarColors.info; // 파랑 - 업그레이드
      case "accident": return EncarColors.darkGray; // 회색 - 사고
      default: return EncarColors.primary;
    }
  };

  // 임시 메모리 데이터
  const [memories] = useState<Memory[]>([
    {
      id: "1",
      date: "2021-03-15",
      type: "milestone",
      title: "새 가족을 맞이했어요",
      description: `${vehicleName}와(과) 함께하는 첫 날`,
      icon: "🎉",
      color: getColorByType("milestone"),
    },
    {
      id: "2",
      date: "2021-04-20",
      type: "season",
      title: "첫 벚꽃 드라이브",
      description: "여의도 벚꽃길 · 봄의 시작",
      icon: "🌸",
      color: getColorByType("season"),
    },
    {
      id: "3",
      date: "2021-06-10",
      type: "journey",
      title: "제주도 가족 여행",
      description: "한라산 드라이브 · 450km",
      icon: "🏖️",
      color: getColorByType("journey"),
    },
    {
      id: "4",
      date: "2021-09-20",
      type: "maintenance",
      title: "첫 정기 점검",
      description: "엔진오일 교체 · 10,000km",
      icon: "🔧",
      color: getColorByType("maintenance"),
    },
    {
      id: "5",
      date: "2021-10-15",
      type: "achievement",
      title: "10,000km 돌파",
      description: "함께 달린 만 킬로미터",
      icon: "🎯",
      color: getColorByType("achievement"),
    },
    {
      id: "6",
      date: "2021-12-24",
      type: "family",
      title: "크리스마스 이브 드라이브",
      description: "명동 일루미네이션 투어",
      icon: "🎄",
      color: getColorByType("family"),
    },
    {
      id: "7",
      date: "2022-03-15",
      type: "milestone",
      title: "1주년 기념일",
      description: "함께한 365일",
      icon: "🎂",
      color: getColorByType("milestone"),
    },
    {
      id: "8",
      date: "2022-06-28",
      type: "journey",
      title: "강원도 여름 휴가",
      description: "속초 · 양양 해변 드라이브 · 280km",
      icon: "⛱️",
      color: getColorByType("journey"),
    },
    {
      id: "9",
      date: "2022-09-30",
      type: "achievement",
      title: "30,000km 달성",
      description: "3만 킬로 무사고 운전",
      icon: "🏆",
      color: getColorByType("achievement"),
    },
    {
      id: "10",
      date: "2023-03-15",
      type: "milestone",
      title: "2주년 기념일",
      description: "730일의 동행",
      icon: "💝",
      color: getColorByType("milestone"),
    },
  ]);

  const [showAddMemory, setShowAddMemory] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // 연도 추출
  const years = Array.from(new Set(memories.map(m => m.date.substring(0, 4)))).sort().reverse();
  
  // 필터링된 메모리
  const filteredMemories = selectedYear === "all" 
    ? memories 
    : memories.filter(m => m.date.startsWith(selectedYear));

  return (
    <div style={{
      background: EncarColors.white,
      padding: EncarSpacing.xl,
      borderRadius: EncarRadius.lg,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      {/* 헤더 */}
      <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
        marginBottom: EncarSpacing.md,
      }}>
        <h3 style={{
          fontSize: EncarFonts.size.large,
          fontWeight: EncarFonts.weight.bold,
          color: EncarColors.dark,
        }}>
          📖 추억 타임라인
        </h3>
        <button
          onClick={() => setShowAddMemory(!showAddMemory)}
          style={{
            padding: `${EncarSpacing.sm} ${EncarSpacing.lg}`,
            background: EncarColors.primary,
            color: "white",
            border: "none",
            borderRadius: EncarRadius.md,
            fontSize: EncarFonts.size.small,
            fontWeight: EncarFonts.weight.semibold,
            cursor: "pointer",
          }}
        >
          + 추억 추가
        </button>
      </div>

      {/* 연도 필터 탭 */}
      <div style={{
        display: "flex",
        gap: EncarSpacing.xs,
        marginBottom: EncarSpacing.lg,
        flexWrap: "wrap",
      }}>
        {/* 전체 보기 */}
        <button
          onClick={() => setSelectedYear("all")}
          style={{
            padding: `${EncarSpacing.xs} ${EncarSpacing.md}`,
            background: selectedYear === "all" ? EncarColors.primary : "white",
            color: selectedYear === "all" ? "white" : EncarColors.darkGray,
            border: `2px solid ${selectedYear === "all" ? EncarColors.primary : EncarColors.borderLight}`,
            borderRadius: EncarRadius.md,
            fontSize: EncarFonts.size.small,
            fontWeight: EncarFonts.weight.semibold,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (selectedYear !== "all") {
              e.currentTarget.style.borderColor = EncarColors.primary;
              e.currentTarget.style.color = EncarColors.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (selectedYear !== "all") {
              e.currentTarget.style.borderColor = EncarColors.borderLight;
              e.currentTarget.style.color = EncarColors.darkGray;
            }
          }}
        >
          전체 ({memories.length})
        </button>

        {/* 연도별 탭 */}
        {years.map((year) => {
          const yearCount = memories.filter(m => m.date.startsWith(year)).length;
          return (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              style={{
                padding: `${EncarSpacing.xs} ${EncarSpacing.md}`,
                background: selectedYear === year ? EncarColors.primary : "white",
                color: selectedYear === year ? "white" : EncarColors.darkGray,
                border: `2px solid ${selectedYear === year ? EncarColors.primary : EncarColors.borderLight}`,
                borderRadius: EncarRadius.md,
                fontSize: EncarFonts.size.small,
                fontWeight: EncarFonts.weight.semibold,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (selectedYear !== year) {
                  e.currentTarget.style.borderColor = EncarColors.primary;
                  e.currentTarget.style.color = EncarColors.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedYear !== year) {
                  e.currentTarget.style.borderColor = EncarColors.borderLight;
                  e.currentTarget.style.color = EncarColors.darkGray;
                }
              }}
            >
              {year}년 ({yearCount})
            </button>
          );
        })}
      </div>

      {/* 필터 결과 표시 */}
      {filteredMemories.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: EncarSpacing.xxl,
          color: EncarColors.lightGray,
        }}>
          <div style={{ fontSize: "48px", marginBottom: EncarSpacing.md }}>📭</div>
          <div style={{ fontSize: EncarFonts.size.body }}>
            {selectedYear}년의 추억이 없습니다
          </div>
        </div>
      ) : (
        <>
          {/* 2열 그리드 레이아웃 (컴팩트) */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: EncarSpacing.md,
          }}>
            {filteredMemories.map((memory, idx) => (
          <div
            key={memory.id}
            style={{
              background: `linear-gradient(135deg, ${memory.color}08 0%, white 100%)`,
              padding: EncarSpacing.md,
              borderRadius: EncarRadius.lg,
              border: `2px solid ${memory.color}40`,
              transition: "all 0.2s",
              cursor: "pointer",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              e.currentTarget.style.borderColor = memory.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = `${memory.color}40`;
            }}
          >
            {/* 번호 배지 */}
            <div style={{
              position: "absolute",
              top: EncarSpacing.xs,
              right: EncarSpacing.xs,
              width: "24px",
              height: "24px",
              background: memory.color,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              color: "white",
              fontWeight: "bold",
            }}>
              {idx + 1}
            </div>

            {/* 아이콘 + 제목 */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: EncarSpacing.sm,
              marginBottom: EncarSpacing.xs,
            }}>
              <span style={{ fontSize: "28px" }}>{memory.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: EncarFonts.size.tiny,
                  color: EncarColors.lightGray,
                  marginBottom: "2px",
                }}>
                {memory.date}
              </div>
                <div style={{
                  fontSize: EncarFonts.size.small,
                  fontWeight: EncarFonts.weight.bold,
                  color: EncarColors.dark,
                }}>
                {memory.title}
              </div>
              </div>
            </div>

            {/* 설명 */}
            <div style={{
              fontSize: EncarFonts.size.tiny,
              color: EncarColors.darkGray,
              lineHeight: 1.4,
              paddingLeft: "36px", // 아이콘 크기만큼 들여쓰기
            }}>
                {memory.description}
            </div>
          </div>
        ))}
      </div>
        </>
      )}

      {/* 추억 추가 폼 (간단 버전) */}
      {showAddMemory && (
        <div style={{
          marginTop: EncarSpacing.xl,
          padding: EncarSpacing.lg,
          background: "#f0f5ff",
          borderRadius: EncarRadius.md,
          border: `1px solid ${EncarColors.info}40`,
        }}>
          <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.darkGray, marginBottom: EncarSpacing.sm }}>
            💡 <strong>추억 추가 기능</strong>은 다음 업데이트에서 만나보세요!
          </div>
          <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray }}>
            여행 기록, 사진 업로드, 메모 등을 추가할 수 있습니다.
          </div>
        </div>
      )}
    </div>
  );
}

