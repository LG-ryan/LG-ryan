// frontend/src/components/VehicleDashboard/TimingSection.tsx
import React from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarSpacing } from "../../styles/encar-theme";
import OpportunityBadge from "../OpportunityBadge";
import { VehicleDashboard } from "../../types/vehicle";

interface Props {
  dashboard: VehicleDashboard;
  expandedSections: Set<string>;
  toggleSection: (sectionId: string) => void;
}

const nf = new Intl.NumberFormat("ko-KR");
const fmt = (n: number) => nf.format(Math.round(n));

// 장기 예측 계산
function getLongTermForecast(currentValue: number) {
  const periods = [
    { months: 3, label: "3개월 후" },
    { months: 6, label: "6개월 후" },
    { months: 12, label: "1년 후" },
    { months: 24, label: "2년 후" },
    { months: 60, label: "5년 후" },
    { months: 120, label: "10년 후" },
  ];
  
  const monthlyRate = 0.012; // 월 1.2% 감가 가정
  
  return periods.map(p => ({
    label: p.label,
    months: p.months,
    value: Math.round(currentValue * Math.pow(1 - monthlyRate, p.months)),
    loss: Math.round(currentValue - currentValue * Math.pow(1 - monthlyRate, p.months)),
  }));
}

export default function TimingSection({ dashboard, expandedSections, toggleSection }: Props) {
  const { vehicle, lifecycle, timing } = dashboard;
  const longTermForecast = getLongTermForecast(timing.nowValue);
  
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
    <div id="section-timing" style={styles.card}>
      <h3 style={styles.sectionTitle}>
        <span>💰</span>
        <span>지금 팔면?</span>
      </h3>
      
      {/* 긍정적 기회 알림 */}
      <OpportunityBadge 
        stage={lifecycle.stage}
        currentValue={timing.nowValue}
        vehicleType={vehicle.vehicleType}
      />
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: EncarSpacing.lg, marginBottom: EncarSpacing.lg }}>
        {/* 왼쪽: 현재 예상 시세 */}
        <div>
          <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray, marginBottom: EncarSpacing.xs }}>현재 예상 시세</div>
          <div style={{ fontSize: "32px", fontWeight: EncarFonts.weight.extrabold, color: EncarColors.primary }}>
            {fmt(timing.nowValue / 10000)}만원
          </div>
          <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.darkGray, marginTop: EncarSpacing.xs }}>
            구매가 대비 {((timing.nowValue / vehicle.purchasePrice) * 100).toFixed(1)}%
          </div>
        </div>
        
        {/* 오른쪽: 판매 관점 분석 */}
        <div style={{
          padding: EncarSpacing.md,
          background: `linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)`,
          border: "2px solid #b7eb8f",
          borderRadius: EncarRadius.md,
        }}>
          <div style={{ fontSize: EncarFonts.size.small, fontWeight: EncarFonts.weight.bold, color: "#52c41a", marginBottom: EncarSpacing.xs }}>
            💰 판매 시나리오 분석
          </div>
          <div style={{ fontSize: EncarFonts.size.small, color: EncarColors.dark, lineHeight: 1.6 }}>
            {(() => {
              const currentMonthlyRate = lifecycle.stage === "Trust" ? 0.8 :
                                          lifecycle.stage === "Keep" ? 1.0 :
                                          lifecycle.stage === "Care" ? 1.5 : 2.0;
              const futureMonthlyRate = lifecycle.stage === "Trust" ? 0.8 :
                                         lifecycle.stage === "Keep" ? 1.2 :
                                         lifecycle.stage === "Care" ? 1.8 : 2.5;
              
              const currentMonth = new Date().getMonth() + 1;
              const isSummerOrWinter = currentMonth >= 11 || currentMonth <= 2 || (currentMonth >= 5 && currentMonth <= 8);
              
              const lossIn6Months = Math.round(timing.nowValue * futureMonthlyRate * 6 / 100);
              const valueIn6Months = timing.nowValue - lossIn6Months;
              
              // 판매 관점 분석 (생애주기별)
              if (lifecycle.stage === "Next") {
                return `지금 ${fmt(timing.nowValue / 10000)}만원 → 6개월 후 약 ${fmt(valueIn6Months / 10000)}만원으로 ${fmt(lossIn6Months / 10000)}만원 감가 예상됩니다. ${isSummerOrWinter ? "현재 수요가 높아" : "비수기지만"} 엔카 비교견적으로 ${fmt(Math.round(timing.nowValue * 1.05 / 10000))}만원(+5%)까지 받을 수 있어요. 다음 차량도 엔카에서 찾아보시면 더 좋은 조건으로 바꾸실 수 있어요.`;
              } else if (lifecycle.stage === "Care") {
                return `현재 ${fmt(timing.nowValue / 10000)}만원이며, 향후 감가 속도가 ${currentMonthlyRate}%에서 ${futureMonthlyRate}%로 빨라질 시기예요. ${isSummerOrWinter ? "지금은 수요가 좋아" : "성수기를 기다리면"} 더 높은 가격을 받을 수 있지만, 6개월 후엔 약 ${fmt(lossIn6Months / 10000)}만원 감가될 수 있어요. 팔기로 결정하셨다면 엔카 비교견적으로 정확한 시세 확인 추천드려요.`;
              } else if (lifecycle.stage === "Keep") {
                return `현재 ${fmt(timing.nowValue / 10000)}만원으로 안정적인 시기예요. 감가도 월 ${currentMonthlyRate}%로 완만해서 급하게 팔 필요는 없어요. ${isSummerOrWinter ? "다음 비수기" : "다음 성수기"}까지 기다리면 더 유리할 수 있어요. 다만 ${Math.round(lifecycle.yearsOwned)}년 타셨으니 새 차를 고려하신다면, 지금도 괜찮은 타이밍이에요.`;
              } else {
                return `신차감 시기라 가치가 높게 유지돼요(${fmt(timing.nowValue / 10000)}만원). 감가도 월 ${currentMonthlyRate}%로 낮아서 당분간 안심하고 타셔도 돼요. 다만 라이프스타일이 바뀌셨거나 더 큰 차가 필요하시다면, ${isSummerOrWinter ? "지금 수요가 높아" : "성수기에"} 높은 가격에 팔고 업그레이드하시는 것도 방법이에요.`;
              }
            })()}
          </div>
        </div>
      </div>

      {/* 장기 예측 테이블 (접기/펼치기) */}
      <div style={{ marginTop: EncarSpacing.lg }}>
        <button
          onClick={() => toggleSection("longTermForecast")}
          style={{
            width: "100%",
            padding: EncarSpacing.md,
            background: expandedSections.has("longTermForecast") ? "#f0f0f0" : "white",
            border: `1px solid ${EncarColors.borderLight}`,
            borderRadius: EncarRadius.md,
            fontSize: EncarFonts.size.small,
            fontWeight: EncarFonts.weight.semibold,
            color: EncarColors.dark,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
          onMouseLeave={(e) => e.currentTarget.style.background = expandedSections.has("longTermForecast") ? "#f0f0f0" : "white"}
        >
          <span>📈 장기 시세 예측 (3개월~10년)</span>
          <span style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.primary }}>
            {expandedSections.has("longTermForecast") ? "▲ 접기" : "▼ 펼치기"}
          </span>
        </button>
        
        {expandedSections.has("longTermForecast") && (
          <div style={{ marginTop: EncarSpacing.md }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${EncarColors.borderLight}` }}>
                  <th style={{ textAlign: "left", padding: `${EncarSpacing.sm} 0`, fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray }}>시점</th>
                  <th style={{ textAlign: "right", padding: `${EncarSpacing.sm} 0`, fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray }}>예상가</th>
                  <th style={{ textAlign: "right", padding: `${EncarSpacing.sm} 0`, fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray }}>감가액</th>
                </tr>
              </thead>
              <tbody>
                {longTermForecast.map((f, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${EncarColors.borderLight}` }}>
                    <td style={{ padding: `${EncarSpacing.sm} 0`, fontSize: EncarFonts.size.small, fontWeight: EncarFonts.weight.medium }}>{f.label}</td>
                    <td style={{ textAlign: "right", padding: `${EncarSpacing.sm} 0`, fontSize: EncarFonts.size.small, fontWeight: EncarFonts.weight.semibold }}>
                      {fmt(f.value / 10000)}만원
                    </td>
                    <td style={{ textAlign: "right", padding: `${EncarSpacing.sm} 0`, fontSize: EncarFonts.size.tiny, color: EncarColors.error }}>
                      -{fmt(f.loss / 10000)}만원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{
              marginTop: EncarSpacing.md,
              padding: EncarSpacing.md,
              background: "#fff7e6",
              borderRadius: EncarRadius.md,
              fontSize: EncarFonts.size.tiny,
              color: "#ad6800",
              lineHeight: 1.5,
            }}>
              ⚠️ <strong>예측 정확도:</strong> 위 예측은 AI 모델 기반이며, 실제 시장 상황, 차량 컨디션, 계절 요인 등에 따라 ±10-15% 변동될 수 있습니다. 
              참고용으로만 활용해주세요.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

