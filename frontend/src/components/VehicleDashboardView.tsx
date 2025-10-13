// frontend/src/components/VehicleDashboardView.tsx
import React from "react";
import { VehicleDashboard } from "../types/vehicle";
import { EncarColors, EncarFonts, EncarRadius, EncarShadows, EncarSpacing } from "../styles/encar-theme";
import VehicleGarage from "./VehicleGarage";
import MemoryTimeline from "./MemoryTimeline";
import AIAnalysis from "./AIAnalysis";
import LifecycleRoadmap from "./LifecycleRoadmap";
import DashboardOnboarding from "./DashboardOnboarding";
import TimingSection from "./VehicleDashboard/TimingSection";
import MaintenanceSection from "./VehicleDashboard/MaintenanceSection";
import TCOSection from "./VehicleDashboard/TCOSection";
import FloatingNav from "./VehicleDashboard/FloatingNav";

interface Props {
  dashboard: VehicleDashboard;
  onBack: () => void;
}

export default function VehicleDashboardView({ dashboard, onBack }: Props) {
  const { vehicle, lifecycle, maintenanceSchedule } = dashboard;
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = React.useState<string>("garage");
  const [showOnboarding, setShowOnboarding] = React.useState(true);
  
  // 닉네임 가져오기 (localStorage에서)
  const getNickname = () => {
    const saved = localStorage.getItem(`vehicle_${vehicle.id}_nickname`);
    return saved || `우리 ${vehicle.model}`;
  };

  // 온보딩 완료 시 첫 액션 유도
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setTimeout(() => {
      scrollToSection('lifecycle');
    }, 300);
  };
  
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // 스크롤 이벤트 핸들러
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "garage", element: document.getElementById("section-garage") },
        { id: "lifecycle", element: document.getElementById("section-lifecycle") },
        { id: "ai", element: document.getElementById("section-ai") },
        { id: "timing", element: document.getElementById("section-timing") },
        { id: "maintenance", element: document.getElementById("section-maintenance") },
        { id: "tco", element: document.getElementById("section-tco") },
        { id: "memory", element: document.getElementById("section-memory") },
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      
      if (isBottom) {
        setActiveSection("memory");
        return;
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 섹션으로 스크롤
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const styles = {
    backButton: {
      background: EncarColors.white,
      border: `2px solid ${EncarColors.primary}`,
      color: EncarColors.primary,
      fontSize: EncarFonts.size.body,
      cursor: "pointer",
      marginBottom: EncarSpacing.lg,
      padding: `${EncarSpacing.sm} ${EncarSpacing.lg}`,
      fontWeight: EncarFonts.weight.bold,
      display: "flex",
      alignItems: "center",
      gap: EncarSpacing.sm,
      borderRadius: EncarRadius.lg,
      boxShadow: EncarShadows.card,
      transition: "all 0.2s",
    } as React.CSSProperties,
  };

  return (
    <div style={{ position: "relative" }}>
      {/* 온보딩 */}
      {showOnboarding && (
        <DashboardOnboarding
          vehicleId={vehicle.id}
          vehicleName={getNickname()}
          onComplete={handleOnboardingComplete}
        />
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: EncarSpacing.lg }}>
        {/* 뒤로가기 */}
        <button 
          onClick={onBack} 
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = EncarColors.primary;
            e.currentTarget.style.color = "white";
            e.currentTarget.style.transform = "translateX(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = EncarColors.white;
            e.currentTarget.style.color = EncarColors.primary;
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <span style={{ fontSize: "20px" }}>←</span>
          <span>내 차고로 돌아가기</span>
        </button>

        {/* 내 차고 (감성 공간) */}
        <div id="section-garage">
          <VehicleGarage vehicle={vehicle} yearsOwned={lifecycle.yearsOwned} />
        </div>

        {/* 내 차의 여정 (생애주기 로드맵) */}
        <div id="section-lifecycle">
          <LifecycleRoadmap dashboard={dashboard} nickname={getNickname()} />
        </div>

        {/* AI 종합 분석 */}
        <div id="section-ai">
          <AIAnalysis dashboard={dashboard} />
        </div>

        {/* 판매 타이밍 분석 */}
        <TimingSection
          dashboard={dashboard}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        {/* 정비 스케줄 */}
        <MaintenanceSection maintenanceSchedule={maintenanceSchedule} />

        {/* TCO (총 소유 비용) */}
        <TCOSection
          dashboard={dashboard}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />

        {/* 추억 타임라인 */}
        <div id="section-memory">
          <MemoryTimeline vehicleId={vehicle.id} vehicleName={`${vehicle.make} ${vehicle.model}`} />
        </div>
      </div>

      {/* 플로팅 네비게이터 */}
      <FloatingNav
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        hasMaintenanceSchedule={maintenanceSchedule && maintenanceSchedule.length > 0}
      />
    </div>
  );
}
