// frontend/src/components/VehicleDashboard/MaintenanceSection.tsx
import React from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarSpacing } from "../../styles/encar-theme";

interface MaintenanceItem {
  item: string;
  dueAtKm: number;
  daysUntil: number | null;
  priority: "high" | "medium" | "low";
}

interface Props {
  maintenanceSchedule: MaintenanceItem[];
}

const nf = new Intl.NumberFormat("ko-KR");
const fmt = (n: number) => nf.format(Math.round(n));

// 정비 항목별 맞춤 문구
function getMaintenanceLink(itemName: string) {
  const name = itemName.toLowerCase();
  
  if (name.includes("타이어")) {
    return {
      text: "엔카 검증 타이어샵",
      badge: "엔카 이용자 선호",
      action: "교체하기",
    };
  } else if (name.includes("오일") || name.includes("엔진")) {
    return {
      text: "엔카 제휴 정비소",
      badge: "검증완료",
      action: "교체하기",
    };
  } else if (name.includes("브레이크")) {
    return {
      text: "엔카 인증 정비소",
      badge: "안심",
      action: "점검하기",
    };
  } else {
    return {
      text: "엔카 제휴 정비소",
      badge: "검증완료",
      action: "예약하기",
    };
  }
}

export default function MaintenanceSection({ maintenanceSchedule }: Props) {
  if (!maintenanceSchedule || maintenanceSchedule.length === 0) {
    return null;
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
    <div id="section-maintenance" style={styles.card}>
      <h3 style={styles.sectionTitle}>
        <span>🔧</span>
        <span>정비 일정</span>
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: EncarSpacing.sm }}>
        {maintenanceSchedule.map((item, idx) => {
          if (idx >= 3) return null;
          
          const linkInfo = getMaintenanceLink(item.item);
          
          return (
            <div
              key={idx}
              style={{
                padding: EncarSpacing.md,
                background: item.priority === "high" ? "#fff7e6" : "#fafafa",
                borderRadius: EncarRadius.md,
                border: item.priority === "high" ? `2px solid #ffc069` : "1px solid #f0f0f0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: EncarSpacing.xs }}>
                <div style={{ fontWeight: EncarFonts.weight.semibold, fontSize: EncarFonts.size.small }}>{item.item}</div>
                {item.priority === "high" && <span style={{ fontSize: "16px" }}>🔴</span>}
              </div>
              <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.darkGray, marginBottom: EncarSpacing.sm }}>
                {item.daysUntil !== null && `D-${item.daysUntil} · `}{fmt(item.dueAtKm)}km
              </div>
              {item.priority === "high" && (
                <div>
                  <div style={{
                    display: "inline-block",
                    padding: "2px 6px",
                    background: "#e6f4ff",
                    borderRadius: EncarRadius.sm,
                    fontSize: "10px",
                    color: "#1677ff",
                    fontWeight: EncarFonts.weight.bold,
                    marginBottom: EncarSpacing.xs,
                  }}>
                    {linkInfo.badge}
                  </div>
                  <a
                    href="https://www.encar.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      fontSize: EncarFonts.size.tiny,
                      color: EncarColors.primary,
                      textDecoration: "none",
                      fontWeight: EncarFonts.weight.semibold,
                    }}
                  >
                    {linkInfo.text}에서 {linkInfo.action} →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

