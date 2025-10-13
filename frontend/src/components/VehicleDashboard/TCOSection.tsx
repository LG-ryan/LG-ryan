// frontend/src/components/VehicleDashboard/TCOSection.tsx
import React from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarSpacing } from "../../styles/encar-theme";
import { VehicleDashboard } from "../../types/vehicle";

interface Props {
  dashboard: VehicleDashboard;
  expandedSections: Set<string>;
  toggleSection: (sectionId: string) => void;
}

const nf = new Intl.NumberFormat("ko-KR");
const fmt = (n: number) => nf.format(Math.round(n));

export default function TCOSection({ dashboard, expandedSections, toggleSection }: Props) {
  const { vehicle, lifecycle, timing, tco } = dashboard;
  
  // TCO 계산 설명
  const tcoExplanation = `구매일(${vehicle.purchaseDate})부터 현재까지 ${Math.round(lifecycle.yearsOwned * 10) / 10}년간의 누적 비용입니다.`;
  
  // 투자 대비 가치 계산
  const totalInvested = vehicle.purchasePrice + tco.totalCost;
  const currentValue = timing.nowValue;
  const netValue = currentValue - totalInvested;
  const valueRetention = (currentValue / vehicle.purchasePrice) * 100;
  
  // 메시지 생성
  let message = "";
  let advice = "";
  let emoji = "";
  let bgColor = "";
  let textColor = "";
  
  if (netValue > 0) {
    message = `${Math.round(lifecycle.yearsOwned)}년 타고 오히려 수익이에요! 🎉`;
    advice = lifecycle.stage === "Next" ? "지금 팔면 최고예요! 다음 차도 엔카에서 찾아보세요" : 
             "더 타셔도 괜찮지만, 업그레이드 생각 있으시면 지금도 좋은 타이밍이에요";
    emoji = "🤑";
    bgColor = "#f6ffed";
    textColor = "#52c41a";
  } else if (valueRetention >= 85) {
    message = `가치 보존이 아주 잘 되고 있어요 👍`;
    advice = lifecycle.stage === "Next" ? "이 정도 타셨으면 판매 타이밍 좋아요. 다음 차 둘러보시면 어떨까요?" : 
             lifecycle.stage === "Care" ? "조금 더 타셔도 가치가 잘 유지될 거예요. 새 차가 궁금하시면 비교견적 확인해보세요" : 
             "신차감이라 당분간 안심하고 타세요";
    emoji = "😊";
    bgColor = "#f6ffed";
    textColor = "#52c41a";
  } else if (valueRetention >= 70) {
    message = `평균 이상으로 가치 유지 중이에요`;
    advice = lifecycle.stage === "Next" ? "지금 팔면 합리적인 타이밍이에요. 엔카에서 다음 차 찾아보세요" : 
             lifecycle.stage === "Care" ? "정기 점검하며 조금 더 타셔도 좋지만, 새 차 고려하신다면 지금도 괜찮아요" : 
             "가치가 잘 유지되는 차예요. 더 타시거나 바꾸시거나 둘 다 좋아요";
    emoji = "😊";
    bgColor = "#f6ffed";
    textColor = "#52c41a";
  } else if (valueRetention >= 60) {
    message = `${Math.round(lifecycle.yearsOwned)}년 타신 것 치고 괜찮아요`;
    advice = lifecycle.stage === "Next" ? "계속 타면 가치 하락이 빨라질 수 있어요. 새 차 알아보시는 건 어때요?" : 
             lifecycle.stage === "Care" ? "지금부터 관리가 중요해요. 라이프스타일 바뀌셨다면 바꾸시는 것도 방법이에요" : 
             "더 타시면서 가치를 누리세요";
    emoji = "😐";
    bgColor = "#fffbe6";
    textColor = "#faad14";
  } else if (valueRetention >= 50) {
    message = `${Math.round(lifecycle.yearsOwned)}년간 충분히 타셨어요`;
    advice = lifecycle.stage === "Next" ? "다음 차로 갈아타기 좋은 시점이에요. 엔카에서 맘에 드는 차 찾아보세요" : 
             lifecycle.stage === "Care" ? "비교견적으로 시세 확인하고, 다음 차 둘러보시는 것도 좋아요" : 
             "차가 제 역할을 다 하고 있어요. 필요하시면 바꾸셔도 괜찮아요";
    emoji = "😐";
    bgColor = "#fffbe6";
    textColor = "#faad14";
  } else {
    message = `${Math.round(lifecycle.yearsOwned)}년간 잘 타셨네요`;
    advice = lifecycle.stage === "Next" || lifecycle.stage === "Care" 
      ? "새 차로 바꾸실 타이밍이에요. 엔카 비교견적으로 최고가 받고, 다음 차도 함께 찾아보세요" 
      : "충분히 가치를 누리셨어요. 새 차가 필요하시면 엔카에서 찾아보세요";
    emoji = "😊";
    bgColor = "#e6f4ff";
    textColor = "#1677ff";
  }
  
  const styles = {
    card: {
      background: EncarColors.white,
      padding: EncarSpacing.lg,
      borderRadius: EncarRadius.lg,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
      marginBottom: EncarSpacing.lg,
    },
    sectionTitle: {
      fontSize: EncarFonts.size.large,
      fontWeight: EncarFonts.weight.bold,
      color: EncarColors.dark,
      marginBottom: EncarSpacing.md,
      display: "flex",
      alignItems: "center",
      gap: EncarSpacing.sm,
    },
  };
  
  return (
    <div id="section-tco" style={styles.card}>
      <h3 style={styles.sectionTitle}>
        <span>💵</span>
        <span>지금까지 든 비용</span>
      </h3>
      
      <div style={{ marginBottom: EncarSpacing.lg }}>
        <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray, marginBottom: EncarSpacing.xs }}>누적 총 비용</div>
        <div style={{ fontSize: "32px", fontWeight: EncarFonts.weight.extrabold, color: EncarColors.primary }}>
          {fmt(tco.totalCost / 10000)}만원
        </div>
      </div>

      {/* 항목별 요약 (간단히) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: EncarSpacing.sm, marginBottom: EncarSpacing.md }}>
        {[
          { label: "감가비", value: tco.breakdown.depreciation, icon: "📉" },
          { label: "유류비", value: tco.breakdown.fuel, icon: "⛽" },
          { label: "정비비", value: tco.breakdown.maintenance, icon: "🔧" },
          { label: "보험·세금", value: tco.breakdown.insurance + tco.breakdown.tax, icon: "📄" },
        ].map((item, idx) => (
          <div key={idx} style={{
            padding: EncarSpacing.md,
            background: "#fafafa",
            borderRadius: EncarRadius.md,
          }}>
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray, marginBottom: EncarSpacing.xs }}>
              {item.icon} {item.label}
            </div>
            <div style={{ fontSize: EncarFonts.size.medium, fontWeight: EncarFonts.weight.bold, color: EncarColors.dark }}>
              {fmt(item.value / 10000)}만원
            </div>
          </div>
        ))}
      </div>

      {/* 상세 내역 (접기/펼치기) */}
      <button
        onClick={() => toggleSection("tcoDetail")}
        style={{
          width: "100%",
          padding: EncarSpacing.md,
          background: expandedSections.has("tcoDetail") ? "#f0f0f0" : "white",
          border: `1px solid ${EncarColors.borderLight}`,
          borderRadius: EncarRadius.md,
          fontSize: EncarFonts.size.small,
          fontWeight: EncarFonts.weight.semibold,
          color: EncarColors.dark,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: EncarSpacing.md,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
        onMouseLeave={(e) => e.currentTarget.style.background = expandedSections.has("tcoDetail") ? "#f0f0f0" : "white"}
      >
        <span>📊 상세 계산 내역</span>
        <span style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.primary }}>
          {expandedSections.has("tcoDetail") ? "▲ 접기" : "▼ 펼치기"}
        </span>
      </button>
      
      {expandedSections.has("tcoDetail") && (
        <div style={{ marginBottom: EncarSpacing.lg }}>
          {/* 계산 설명 */}
          <div style={{
            padding: EncarSpacing.md,
            background: "#f0f5ff",
            borderRadius: EncarRadius.md,
            fontSize: EncarFonts.size.tiny,
            color: EncarColors.darkGray,
            marginBottom: EncarSpacing.md,
            lineHeight: 1.5,
          }}>
            📌 <strong>계산 방식:</strong> {tcoExplanation}
            <br/>
            감가 + 유류비 + 정비비 + 보험료 + 자동차세 합산
          </div>
          
          {/* 항목별 상세 */}
          <div style={{ fontSize: EncarFonts.size.small }}>
            {[
              { label: "감가비", value: tco.breakdown.depreciation, desc: `연 15% 감가율 적용 (${lifecycle.yearsOwned}년)` },
              { label: "유류비", value: tco.breakdown.fuel, desc: `주행거리 기반 (km당 120원)` },
              { 
                label: "정비비", 
                value: tco.breakdown.maintenance, 
                desc: tco.maintenanceDetail 
                  ? `기본 ${fmt(tco.maintenanceDetail.base / 10000)}만 + 주행 ${fmt(tco.maintenanceDetail.kmBased / 10000)}만 ${tco.maintenanceDetail.ageBased > 0 ? `+ 연식 ${fmt(tco.maintenanceDetail.ageBased / 10000)}만` : ""}${tco.maintenanceDetail.accident > 0 ? ` + 사고 ${fmt(tco.maintenanceDetail.accident / 10000)}만` : ""}${tco.maintenanceDetail.tire > 0 ? ` + 타이어 ${fmt(tco.maintenanceDetail.tire / 10000)}만` : ""}${tco.maintenanceDetail.exterior > 0 ? ` + 외관 ${fmt(tco.maintenanceDetail.exterior / 10000)}만` : ""}`
                  : "실제 차량 컨디션 기반"
              },
              { label: "보험료", value: tco.breakdown.insurance, desc: `연식별 차등 (${lifecycle.yearsOwned < 3 ? "신차" : lifecycle.yearsOwned < 5 ? "중급" : "경차"} 기준)` },
              { label: "자동차세", value: tco.breakdown.tax, desc: `${vehicle.vehicleType.toUpperCase()} 기준` },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: `${EncarSpacing.sm} 0`,
                  borderBottom: idx < 4 ? `1px solid ${EncarColors.borderLight}` : "none",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: EncarFonts.weight.semibold, color: EncarColors.dark }}>{item.label}</div>
                  <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray, marginTop: 2, lineHeight: 1.4 }}>{item.desc}</div>
                </div>
                <div style={{ fontWeight: EncarFonts.weight.bold, color: EncarColors.dark, marginLeft: EncarSpacing.md, whiteSpace: "nowrap" }}>
                  {fmt(item.value / 10000)}만원
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 투자 대비 가치 */}
      <div style={{
        marginTop: EncarSpacing.lg,
        padding: EncarSpacing.lg,
        background: bgColor,
        borderRadius: EncarRadius.md,
        border: `2px solid ${textColor}30`,
      }}>
        <div style={{ marginBottom: EncarSpacing.sm }}>
          <div style={{ fontSize: EncarFonts.size.body, fontWeight: EncarFonts.weight.bold, color: textColor, marginBottom: EncarSpacing.xs }}>
            {emoji} {message}
          </div>
          <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.darkGray }}>
            구매가 대비 {valueRetention.toFixed(1)}% 가치 보존 · {Math.round(lifecycle.yearsOwned)}년 보유
          </div>
        </div>
        
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: EncarSpacing.sm,
          marginBottom: EncarSpacing.sm,
          padding: EncarSpacing.sm,
          background: "white",
          borderRadius: EncarRadius.sm,
        }}>
          <div>
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray }}>구매가</div>
            <div style={{ fontSize: EncarFonts.size.small, fontWeight: EncarFonts.weight.bold, color: EncarColors.dark }}>
              {fmt(vehicle.purchasePrice / 10000)}만원
            </div>
          </div>
          <div>
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray }}>현재 시세</div>
            <div style={{ fontSize: EncarFonts.size.small, fontWeight: EncarFonts.weight.bold, color: "#1677ff" }}>
              {fmt(timing.nowValue / 10000)}만원
            </div>
          </div>
          <div>
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray }}>유지비용</div>
            <div style={{ fontSize: EncarFonts.size.small, fontWeight: EncarFonts.weight.bold, color: EncarColors.dark }}>
              {fmt(tco.totalCost / 10000)}만원
            </div>
          </div>
        </div>
        
        <div style={{ 
          fontSize: EncarFonts.size.small, 
          color: textColor, 
          fontWeight: EncarFonts.weight.semibold,
          padding: `${EncarSpacing.xs} ${EncarSpacing.sm}`,
          background: `${textColor}10`,
          borderRadius: EncarRadius.sm,
        }}>
          💡 {advice}
        </div>
      </div>
    </div>
  );
}

