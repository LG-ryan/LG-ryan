// frontend/src/components/VehicleList.tsx
import React from "react";
import { Vehicle } from "../types/vehicle";
import { EncarColors, EncarFonts, EncarRadius, EncarShadows, EncarSpacing } from "../styles/encar-theme";

interface Props {
  vehicles: Vehicle[];
  onSelectVehicle: (id: string) => void;
  onAddVehicle: () => void;
}

const nf = new Intl.NumberFormat("ko-KR");

export default function VehicleList({ vehicles, onSelectVehicle, onAddVehicle }: Props) {
  const styles = {
    emptyState: {
      textAlign: "center" as const,
      padding: `${EncarSpacing.xxl} ${EncarSpacing.xl}`,
      background: EncarColors.white,
      borderRadius: EncarRadius.lg,
      boxShadow: EncarShadows.card,
    },
    emptyIcon: {
      fontSize: "64px",
      marginBottom: EncarSpacing.lg,
    },
    emptyTitle: {
      fontSize: EncarFonts.size.xlarge,
      fontWeight: EncarFonts.weight.bold,
      color: EncarColors.dark,
      marginBottom: EncarSpacing.md,
    },
    emptySubtitle: {
      fontSize: EncarFonts.size.body,
      color: EncarColors.lightGray,
      marginBottom: EncarSpacing.xl,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: EncarSpacing.xl,
    },
    title: {
      fontSize: EncarFonts.size.xlarge,
      fontWeight: EncarFonts.weight.bold,
      color: EncarColors.dark,
    },
    addButton: {
      padding: `${EncarSpacing.md} ${EncarSpacing.xl}`,
      fontSize: EncarFonts.size.body,
      fontWeight: EncarFonts.weight.bold,
      background: EncarColors.primary,
      color: EncarColors.white,
      border: "none",
      borderRadius: EncarRadius.lg,
      cursor: "pointer",
      boxShadow: EncarShadows.button,
      transition: "all 0.2s",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
      gap: EncarSpacing.lg,
    },
    card: {
      background: EncarColors.white,
      borderRadius: EncarRadius.lg,
      padding: EncarSpacing.xl,
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: EncarShadows.card,
      border: `1px solid ${EncarColors.borderLight}`,
    },
    cardTitle: {
      fontSize: EncarFonts.size.large,
      fontWeight: EncarFonts.weight.bold,
      color: EncarColors.dark,
      marginBottom: EncarSpacing.sm,
    },
    cardSubtitle: {
      fontSize: EncarFonts.size.body,
      color: EncarColors.lightGray,
      marginBottom: EncarSpacing.lg,
    },
    cardInfo: {
      display: "flex",
      gap: EncarSpacing.md,
      fontSize: EncarFonts.size.small,
      color: EncarColors.darkGray,
      marginBottom: EncarSpacing.md,
    },
    cardFooter: {
      fontSize: EncarFonts.size.small,
      color: EncarColors.primary,
      fontWeight: EncarFonts.weight.semibold,
      display: "flex",
      alignItems: "center",
      gap: EncarSpacing.xs,
    },
  };

  if (vehicles.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>🚗</div>
        <h2 style={styles.emptyTitle}>아직 등록된 차량이 없습니다</h2>
        <p style={styles.emptySubtitle}>첫 차량을 등록하고 생애주기를 관리해보세요</p>
        <button
          onClick={onAddVehicle}
          style={{
            ...styles.addButton,
            fontSize: EncarFonts.size.medium,
            padding: `${EncarSpacing.lg} ${EncarSpacing.xxl}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = EncarColors.primaryDark;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = EncarColors.primary;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          + 차량 등록하기
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>내 차량 목록 ({vehicles.length}대)</h2>
        <button
          onClick={onAddVehicle}
          style={styles.addButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = EncarColors.primaryDark;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = EncarColors.primary;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          + 차량 추가
        </button>
      </div>

      <div style={styles.grid}>
        {vehicles.map((v) => (
          <div
            key={v.id}
            onClick={() => onSelectVehicle(v.id)}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = EncarShadows.cardHover;
              e.currentTarget.style.borderColor = EncarColors.primary;
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = EncarShadows.card;
              e.currentTarget.style.borderColor = EncarColors.borderLight;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={styles.cardTitle}>
              {v.make} {v.model}
            </div>
            <div style={styles.cardSubtitle}>
              {v.trim} · {v.year}년식
            </div>
            <div style={styles.cardInfo}>
              <span>주행거리: {nf.format(v.currentMileage)}km</span>
            </div>
            <div style={styles.cardFooter}>
              <span>자세히 보기</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
