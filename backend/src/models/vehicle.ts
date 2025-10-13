// backend/src/models/vehicle.ts
export interface Vehicle {
  id: string;
  userId: string; // 나중에 인증 추가, 지금은 "demo-user"
  
  // 기본 정보
  make: string;           // 제조사
  model: string;          // 모델명
  trim: string;           // 트림
  year: number;           // 연식
  
  // 구매 정보
  purchaseDate: string;   // 구매일 (YYYY-MM-DD)
  purchasePrice: number;  // 구매가
  
  // 현재 상태
  currentMileage: number; // 현재 주행거리
  
  // 차량 상태 (헤이딜러/비교견적 스타일)
  accident?: "none" | "minor" | "major"; // 사고이력
  exterior?: {
    front: "good" | "minor" | "major";   // 전면 (범퍼, 후드, 헤드라이트)
    side: "good" | "minor" | "major";    // 측면 (도어, 휀더)
    rear: "good" | "minor" | "major";    // 후면 (트렁크, 리어램프)
  };
  tires?: {
    frontLeft: "good" | "replace";   // 전좌
    frontRight: "good" | "replace";  // 전우
    rearLeft: "good" | "replace";    // 후좌
    rearRight: "good" | "replace";   // 후우
  };
  keys?: "one" | "twoPlus";              // 스마트키 개수
  lease?: "none" | "active";             // 리스/할부
  leaseDetails?: {                       // 리스/할부 세부정보
    company: string;
    monthlyPayment: number;
    remainingMonths: number;
  };
  
  // 차량 타입 (생애주기 판단용)
  vehicleType: "sedan" | "suv" | "hatchback" | "coupe" | "van" | "pickup" | "truck";
  
  // 거래 가능 지역 (복수 선택)
  regions: string[]; // ["seoul", "incheon", "gyeonggi", ...]
  
  // 메타
  createdAt: string;
  updatedAt: string;
  
  // 판매 정보
  soldAt?: string;            // 판매일 (판매 완료 시)
  soldPrice?: number;         // 판매가
  isSold?: boolean;           // 판매 여부
}

export interface MaintenanceItem {
  item: string;
  dueAtKm: number;
  daysUntil: number | null;
  priority: "high" | "medium" | "low";
}

export interface VehicleDashboard {
  vehicle: Vehicle;
  
  // 생애주기 정보
  lifecycle: {
    stage: "Blue" | "Green" | "Mint" | "Yellow" | "Orange" | "Red";
    color: string;
    label: string;
    reason: string;
    advice: string;
    yearsOwned: number;
    stageTimeline: Array<{
      stage: string;
      label: string;
      color: string;
      yearsMin: number;
      yearsMax: number | null;
      kmMin: number;
      kmMax: number | null;
      isCurrent: boolean;
    }>;
  };
  
  // 판매 타이밍
  timing: {
    nowValue: number;
    bestMonth: number;
    bestValue: number;
    suggestion: string;
    reasons: string[];
    forecast: Array<{ month: number; value: number }>;
  };
  
  // TCO 예측
  tco: {
    totalCost: number;
    breakdown: {
      depreciation: number;
      fuel: number;
      maintenance: number;
      insurance: number;
      tax: number;
    };
    maintenanceDetail?: {
      base: number;
      kmBased: number;
      ageBased: number;
      accident: number;
      tire: number;
      exterior: number;
    };
  };
  
  // 정비 스케줄
  maintenanceSchedule: MaintenanceItem[];
  
  // 엔카 CTA
  encarCTA: {
    primary: {
      type: "sell" | "buy" | "maintain";
      title: string;
      description: string;
      action: string;
      url: string;
    };
    secondary?: {
      type: "sell" | "buy" | "maintain";
      title: string;
      action: string;
      url: string;
    };
  };
}


