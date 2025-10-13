// frontend/src/NewApp.tsx
import React, { useState, useEffect } from "react";
import { Vehicle, VehicleDashboard } from "./types/vehicle";
import VehicleList from "./components/VehicleList";
import VehicleFormNew from "./components/VehicleFormNew";
import VehicleDashboardView from "./components/VehicleDashboardView";
import { EncarColors, EncarFonts, EncarRadius, EncarSpacing } from "./styles/encar-theme";
import { vehicleApi } from "./services/vehicleApi";

export default function NewApp() {
  const [view, setView] = useState<"list" | "add" | "dashboard">("list");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 차량 목록 로드
  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleApi.getAll();
      console.log("로드된 차량:", data.length, "대");
      setVehicles(data);
    } catch (e: any) {
      console.error("차량 로드 오류:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // 차량 상세 대시보드 로드
  async function loadDashboard(vehicleId: string) {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleApi.getDashboard(vehicleId);
      setSelectedVehicle(data);
      setView("dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // 차량 등록
  async function handleCreateVehicle(vehicleData: any) {
    try {
      setLoading(true);
      setError(null);
      
      console.log("전송 데이터:", vehicleData);
      await vehicleApi.create(vehicleData);
      console.log("등록 성공!");
      
      await loadVehicles();
      setView("list");
    } catch (e: any) {
      setError(e.message);
      console.error("차량 등록 오류:", e);
      // 오류 발생 시 폼으로 돌아가지 않음 (사용자가 수정할 수 있도록)
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    app: {
      minHeight: "100vh",
      background: EncarColors.background,
      fontFamily: EncarFonts.family,
    },
    header: {
      background: EncarColors.white,
      borderBottom: `1px solid ${EncarColors.border}`,
      padding: `${EncarSpacing.lg} ${EncarSpacing.xl}`,
      boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
    },
    headerContent: {
      maxWidth: 1200,
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      gap: EncarSpacing.md,
    },
    logo: {
      fontSize: EncarFonts.size.xxlarge,
      fontWeight: EncarFonts.weight.extrabold,
      color: EncarColors.primary,
      display: "flex",
      alignItems: "center",
      gap: EncarSpacing.sm,
    },
    subtitle: {
      fontSize: EncarFonts.size.small,
      color: EncarColors.lightGray,
      marginLeft: EncarSpacing.md,
    },
    container: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: EncarSpacing.xl,
    },
    errorBanner: {
      background: "#FFF1F0",
      border: `1px solid ${EncarColors.error}`,
      borderRadius: EncarRadius.md,
      padding: EncarSpacing.lg,
      marginBottom: EncarSpacing.lg,
      color: EncarColors.error,
      fontSize: EncarFonts.size.body,
    },
    loadingSpinner: {
      textAlign: "center" as const,
      padding: EncarSpacing.xxl,
      color: EncarColors.lightGray,
      fontSize: EncarFonts.size.body,
    },
  };

  return (
    <div style={styles.app}>
      {/* 헤더 */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span>🚗</span>
            <span>내 차고</span>
          </div>
          <span style={styles.subtitle}>엔카 AI 차량 생애주기 매니저</span>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div style={styles.container}>
        {/* 에러 메시지 */}
        {error && (
          <div style={styles.errorBanner}>
            ⚠️ {error}
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div style={styles.loadingSpinner}>
            로딩 중...
          </div>
        )}

        {/* 뷰 전환 */}
        {!loading && (
          <>
            {view === "list" && (
              <VehicleList
                vehicles={vehicles}
                onSelectVehicle={loadDashboard}
                onAddVehicle={() => setView("add")}
              />
            )}

            {view === "add" && (
              <VehicleFormNew
                onSubmit={handleCreateVehicle}
                onCancel={() => setView("list")}
              />
            )}

            {view === "dashboard" && selectedVehicle && (
              <VehicleDashboardView
                dashboard={selectedVehicle}
                onBack={() => setView("list")}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
