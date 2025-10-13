// backend/src/services/lifecycleStages.ts
// 4단계 생애주기 - 믿고 시리즈

export type StageKey = "Trust" | "Keep" | "Care" | "Next";

export interface LifecycleStage {
  key: StageKey;
  label: string;
  color: string;
  description: string;
  yearsMin: number;
  yearsMax: number | null;
  kmMin: number;
  kmMax: number | null;
  encarAdvice: string; // 엔카 서비스 연계 조언
}

export const LIFECYCLE_4STAGES: Record<string, LifecycleStage[]> = {
  suv: [
    {
      key: "Trust",
      label: "믿고 타기",
      color: "#1677ff",
      description: "가장 안정적인 신차감 시기예요",
      yearsMin: 0,
      yearsMax: 3,
      kmMin: 0,
      kmMax: 60000,
      encarAdvice: "엔카진단으로 컨디션만 확인하면 완벽해요",
    },
    {
      key: "Keep",
      label: "믿고 지키기",
      color: "#73d13d",
      description: "관리만 잘하면 가치가 오래 유지되는 시기예요",
      yearsMin: 3,
      yearsMax: 6,
      kmMin: 60000,
      kmMax: 120000,
      encarAdvice: "정기 점검으로 가치를 지키세요",
    },
    {
      key: "Care",
      label: "믿고 케어",
      color: "#faad14",
      description: "정비 비용과 감가를 고민하는 시기예요",
      yearsMin: 6,
      yearsMax: 9,
      kmMin: 120000,
      kmMax: 180000,
      encarAdvice: "셀프진단으로 시세 확인하며 결정하세요",
    },
    {
      key: "Next",
      label: "믿고 넥스트",
      color: "#FF6C00",
      description: "감가가 안정화되어 보유/판매 모두 합리적인 시기예요",
      yearsMin: 9,
      yearsMax: null,
      kmMin: 180000,
      kmMax: null,
      encarAdvice: "판매하신다면 비교견적으로 최고가 받으세요",
    },
  ],
  sedan: [
    {
      key: "Trust",
      label: "믿고 타기",
      color: "#1677ff",
      description: "가장 안정적인 신차감 시기예요",
      yearsMin: 0,
      yearsMax: 3,
      kmMin: 0,
      kmMax: 50000,
      encarAdvice: "엔카진단으로 컨디션만 확인하면 완벽해요",
    },
    {
      key: "Keep",
      label: "믿고 지키기",
      color: "#73d13d",
      description: "관리만 잘하면 가치가 오래 유지되는 시기예요",
      yearsMin: 3,
      yearsMax: 6,
      kmMin: 50000,
      kmMax: 100000,
      encarAdvice: "정기 점검으로 가치를 지키세요",
    },
    {
      key: "Care",
      label: "믿고 케어",
      color: "#faad14",
      description: "정비 비용과 감가를 고민하는 시기예요",
      yearsMin: 6,
      yearsMax: 9,
      kmMin: 100000,
      kmMax: 150000,
      encarAdvice: "셀프진단으로 시세 확인하며 결정하세요",
    },
    {
      key: "Next",
      label: "믿고 넥스트",
      color: "#FF6C00",
      description: "감가가 안정화되어 보유/판매 모두 합리적인 시기예요",
      yearsMin: 9,
      yearsMax: null,
      kmMin: 150000,
      kmMax: null,
      encarAdvice: "판매하신다면 비교견적으로 최고가 받으세요",
    },
  ],
  hatchback: [
    {
      key: "Trust",
      label: "믿고 타기",
      color: "#52c41a",
      description: "안심하고 달려도 되는 베스트 타임",
      yearsMin: 0,
      yearsMax: 3,
      kmMin: 0,
      kmMax: 50000,
      encarAdvice: "엔카진단으로 최상의 컨디션을 유지하세요",
    },
    {
      key: "Keep",
      label: "믿고 지키기",
      color: "#73d13d",
      description: "엔카와 함께라면 가치가 오래 갑니다",
      yearsMin: 3,
      yearsMax: 5,
      kmMin: 50000,
      kmMax: 90000,
      encarAdvice: "정기 점검으로 가치를 보호하세요",
    },
    {
      key: "Care",
      label: "믿고 케어",
      color: "#faad14",
      description: "지금부터가 진짜 관리 포인트예요",
      yearsMin: 5,
      yearsMax: 8,
      kmMin: 90000,
      kmMax: 140000,
      encarAdvice: "예방 정비로 큰 수리비를 막을 수 있어요",
    },
    {
      key: "Next",
      label: "믿고 넥스트",
      color: "#FF6C00",
      description: "엔카에서 다음 차로 업그레이드하세요",
      yearsMin: 8,
      yearsMax: null,
      kmMin: 140000,
      kmMax: null,
      encarAdvice: "믿고 판매하고 새 차를 만나보세요",
    },
  ],
  sports: [
    {
      key: "Trust",
      label: "믿고 타기",
      color: "#52c41a",
      description: "안심하고 달려도 되는 베스트 타임",
      yearsMin: 0,
      yearsMax: 2,
      kmMin: 0,
      kmMax: 30000,
      encarAdvice: "엔카진단으로 최상의 컨디션을 유지하세요",
    },
    {
      key: "Keep",
      label: "믿고 지키기",
      color: "#73d13d",
      description: "엔카와 함께라면 가치가 오래 갑니다",
      yearsMin: 2,
      yearsMax: 4,
      kmMin: 30000,
      kmMax: 60000,
      encarAdvice: "정기 점검으로 가치를 보호하세요",
    },
    {
      key: "Care",
      label: "믿고 케어",
      color: "#faad14",
      description: "지금부터가 진짜 관리 포인트예요",
      yearsMin: 4,
      yearsMax: 6,
      kmMin: 60000,
      kmMax: 90000,
      encarAdvice: "예방 정비로 큰 수리비를 막을 수 있어요",
    },
    {
      key: "Next",
      label: "믿고 넥스트",
      color: "#FF6C00",
      description: "엔카에서 다음 차로 업그레이드하세요",
      yearsMin: 6,
      yearsMax: null,
      kmMin: 90000,
      kmMax: null,
      encarAdvice: "믿고 판매하고 새 차를 만나보세요",
    },
  ],
};

export function pickStage(vehicleType: string, years: number, km: number): LifecycleStage {
  const stages = LIFECYCLE_4STAGES[vehicleType] || LIFECYCLE_4STAGES.sedan;
  
  // Next → Care → Keep → Trust 순서로 체크 (역순)
  for (const stage of [...stages].reverse()) {
    const yearsOk = years >= stage.yearsMin && (stage.yearsMax === null || years < stage.yearsMax);
    const kmOk = km >= stage.kmMin && (stage.kmMax === null || km < stage.kmMax);
    
    if (yearsOk && kmOk) return stage;
  }
  
  return stages[0]; // 기본값: Trust
}

