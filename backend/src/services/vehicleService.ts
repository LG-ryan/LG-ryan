// backend/src/services/vehicleService.ts
import fs from "fs";
import path from "path";
import { Vehicle, MaintenanceItem, VehicleDashboard } from "../models/vehicle";
import { buildReport } from "./timing";
import { pickStage, LIFECYCLE_4STAGES, StageKey } from "./lifecycleStages";
import { TCO_CONSTANTS, MAINTENANCE_SCHEDULE } from "../constants/calculation";

// 데이터 로드
const dataDir = path.resolve(__dirname, "../../src/data");
const vehiclesPath = path.join(dataDir, "mock-vehicles.json");

let vehicles: Vehicle[] = [];
try {
  vehicles = JSON.parse(fs.readFileSync(vehiclesPath, "utf8"));
  console.log(`✅ vehicleService: ${vehicles.length}개 로드 성공`);
} catch (e: any) {
  console.error("❌ vehicleService 로드 실패:", e.message);
}

function getYearsOwned(purchaseDate: string): number {
  const purchase = new Date(purchaseDate);
  const now = new Date();
  const diffMs = now.getTime() - purchase.getTime();
  return diffMs / (1000 * 60 * 60 * 24 * 365.25);
}

function generateMaintenanceSchedule(vehicle: Vehicle): MaintenanceItem[] {
  const km = vehicle.currentMileage;
  const items: MaintenanceItem[] = [];
  
  const schedules = [
    { item: "엔진오일 교체", interval: MAINTENANCE_SCHEDULE.ENGINE_OIL_INTERVAL, priority: "high" as const },
    { item: "타이어 교체", interval: MAINTENANCE_SCHEDULE.TIRE_INTERVAL, priority: "high" as const },
    { item: "브레이크 패드 점검", interval: MAINTENANCE_SCHEDULE.BRAKE_INTERVAL, priority: "high" as const },
    { item: "에어컨 필터 교체", interval: MAINTENANCE_SCHEDULE.AC_FILTER_INTERVAL, priority: "medium" as const },
    { item: "배터리 교체", interval: MAINTENANCE_SCHEDULE.BATTERY_INTERVAL, priority: "medium" as const },
  ];
  
  for (const s of schedules) {
    const nextDue = Math.ceil(km / s.interval) * s.interval;
    const kmUntil = nextDue - km;
    const daysUntil = Math.round((kmUntil / MAINTENANCE_SCHEDULE.ANNUAL_AVG_MILEAGE) * 365);
    
    if (kmUntil <= MAINTENANCE_SCHEDULE.WARNING_THRESHOLD) {
      items.push({
        item: s.item,
        dueAtKm: nextDue,
        daysUntil: daysUntil > 0 ? daysUntil : 0,
        priority: kmUntil <= MAINTENANCE_SCHEDULE.URGENT_THRESHOLD ? "high" : s.priority,
      });
    }
  }
  
  return items.sort((a, b) => a.dueAtKm - b.dueAtKm).slice(0, 5);
}

function generateEncarCTA(vehicle: Vehicle, stage: StageKey, timing: any, maintenanceSchedule: MaintenanceItem[]) {
  // 판매된 차량 → 재구매 추천
  if (vehicle.isSold) {
    return {
      primary: {
        type: "buy" as const,
        title: `${vehicle.model}를 타셨다면, 이 차는 어때요?`,
        description: "비슷한 취향의 오너들이 많이 선택한 차량",
        action: "AI 추천 차량 보기",
        url: "https://www.encar.com/recommend",
      },
      secondary: {
        type: "buy" as const,
        title: "전체 매물 둘러보기",
        action: "엔카 매물 보기",
        url: "https://www.encar.com",
      },
    };
  }
  
  // 긴급 정비 → 구체적 유도
  const urgentMaintenance = maintenanceSchedule.find(m => m.priority === "high");
  if (urgentMaintenance && (stage === "Green" || stage === "Mint" || stage === "Blue")) {
    return {
      primary: {
        type: "maintain" as const,
        title: urgentMaintenance.item.includes("타이어") ? "타이어 교체 시기가 다가왔어요" :
               urgentMaintenance.item.includes("오일") ? "엔진오일 교체가 필요해요" :
               urgentMaintenance.item.includes("브레이크") ? "브레이크 점검이 필요해요" :
               `${urgentMaintenance.item} 시기예요`,
        description: `약 ${urgentMaintenance.daysUntil}일 내 교체 권장`,
        action: urgentMaintenance.item.includes("타이어") ? "타이어 구매" :
                urgentMaintenance.item.includes("오일") ? "엔진오일 구매" :
                "정비소 찾기",
        url: "https://www.encar.com/service",
      },
    };
  }
  
  // Red/Orange → 믿고 판매 유도
  if (stage === "Red" || stage === "Orange") {
    return {
      primary: {
        type: "sell" as const,
        title: "엔카가 바로 사드려요",
        description: `믿고 서비스 · ${Math.round(timing.nowValue / 10000)}만원 즉시 입금`,
        action: "믿고 판매",
        url: "https://www.encar.com/midgo",
      },
      secondary: {
        type: "sell" as const,
        title: "여러 딜러 견적 비교",
        action: "비교견적",
        url: "https://www.encar.com/comparing",
      },
    };
  }
  
  // Yellow → 셀프진단
  if (stage === "Yellow") {
    return {
      primary: {
        type: "sell" as const,
        title: "우리 차 지금 얼마일까?",
        description: "1분만에 무료로 확인",
        action: "셀프진단 시세조회",
        url: "https://www.encar.com/dc/dc_carsearchpop.do",
      },
      secondary: {
        type: "sell" as const,
        title: "전문가 견적",
        action: "비교견적",
        url: "https://www.encar.com/comparing",
      },
    };
  }
  
  // 기본 → 엔카진단
  return {
    primary: {
      type: "maintain" as const,
      title: "컨디션이 가격을 결정해요",
      description: "엔카진단으로 차량 상태 체크",
      action: "엔카진단 예약",
      url: "https://www.encar.com/inspection",
    },
  };
}

function calculateTCO(vehicle: Vehicle, yearsOwned: number, maintenanceSchedule: MaintenanceItem[]) {
  const depreciation = vehicle.purchasePrice * TCO_CONSTANTS.DEPRECIATION_RATE * yearsOwned;
  const fuelPerYear = (vehicle.currentMileage / yearsOwned) * TCO_CONSTANTS.FUEL_COST_PER_KM;
  
  // 정비비 계산 (실제 정비 스케줄 기반)
  let estimatedMaintenanceCost = 0;
  
  // 기본 정비비
  const baseMaintenance = TCO_CONSTANTS.BASE_MAINTENANCE_ANNUAL * yearsOwned;
  
  // 주행거리 기반 추가 정비비
  const kmBased = Math.floor(vehicle.currentMileage / 10000) * TCO_CONSTANTS.MAINTENANCE_PER_10K_KM;
  
  // 연식 기반 추가 정비비 (5년차부터 증가)
  const ageBased = yearsOwned > 5 ? (yearsOwned - 5) * TCO_CONSTANTS.AGE_BASED_INCREASE_ANNUAL : 0;
  
  // 사고 이력 기반 추가 정비비
  const accidentBased = vehicle.accident === "major" ? TCO_CONSTANTS.ACCIDENT_MAJOR_COST : 
                         vehicle.accident === "minor" ? TCO_CONSTANTS.ACCIDENT_MINOR_COST : 0;
  
  // 타이어 교체 비용
  let tireCost = 0;
  if (vehicle.tires) {
    const tireArray = [vehicle.tires.frontLeft, vehicle.tires.frontRight, vehicle.tires.rearLeft, vehicle.tires.rearRight];
    const replaceTires = tireArray.filter(t => t === "replace").length;
    tireCost = replaceTires * TCO_CONSTANTS.TIRE_REPLACEMENT_COST;
  }
  
  // 외관 수리 비용
  let exteriorCost = 0;
  if (vehicle.exterior) {
    if (vehicle.exterior.front === "major") exteriorCost += TCO_CONSTANTS.EXTERIOR_FRONT_MAJOR;
    else if (vehicle.exterior.front === "minor") exteriorCost += TCO_CONSTANTS.EXTERIOR_FRONT_MINOR;
    
    if (vehicle.exterior.side === "major") exteriorCost += TCO_CONSTANTS.EXTERIOR_SIDE_MAJOR;
    else if (vehicle.exterior.side === "minor") exteriorCost += TCO_CONSTANTS.EXTERIOR_SIDE_MINOR;
    
    if (vehicle.exterior.rear === "major") exteriorCost += TCO_CONSTANTS.EXTERIOR_REAR_MAJOR;
    else if (vehicle.exterior.rear === "minor") exteriorCost += TCO_CONSTANTS.EXTERIOR_REAR_MINOR;
  }
  
  estimatedMaintenanceCost = baseMaintenance + kmBased + ageBased + accidentBased + tireCost + exteriorCost;
  
  // 보험료 (연식별 차등)
  const insurancePerYear = yearsOwned < 3 ? TCO_CONSTANTS.INSURANCE_NEW : 
                            yearsOwned < 5 ? TCO_CONSTANTS.INSURANCE_MID : 
                            yearsOwned < 8 ? TCO_CONSTANTS.INSURANCE_OLD : TCO_CONSTANTS.INSURANCE_VERY_OLD;
  
  // 자동차세 (차종별)
  const taxPerYear = vehicle.vehicleType === "suv" || vehicle.vehicleType === "van" 
    ? TCO_CONSTANTS.TAX_LARGE_VEHICLE 
    : TCO_CONSTANTS.TAX_STANDARD_VEHICLE;
  
  const years = Math.ceil(yearsOwned * 10) / 10;
  
  return {
    totalCost: Math.round(depreciation + fuelPerYear * years + estimatedMaintenanceCost + insurancePerYear * years + taxPerYear * years),
    breakdown: {
      depreciation: Math.round(depreciation),
      fuel: Math.round(fuelPerYear * years),
      maintenance: Math.round(estimatedMaintenanceCost),
      insurance: Math.round(insurancePerYear * years),
      tax: Math.round(taxPerYear * years),
    },
    maintenanceDetail: {
      base: Math.round(baseMaintenance),
      kmBased: Math.round(kmBased),
      ageBased: Math.round(ageBased),
      accident: Math.round(accidentBased),
      tire: Math.round(tireCost),
      exterior: Math.round(exteriorCost),
    },
  };
}

export function getAllVehicles(): Vehicle[] {
  console.log("📞 getAllVehicles:", vehicles.length);
  return vehicles.filter(v => !v.isSold); // 판매되지 않은 차량만
}

export function getVehicleById(id: string): Vehicle | null {
  return vehicles.find(v => v.id === id) || null;
}

export function createVehicle(data: any): Vehicle {
  const newVehicle: Vehicle = {
    ...data,
    id: `v${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isSold: false,
  };
  vehicles.push(newVehicle);
  console.log("✅ 차량 등록:", newVehicle.id);
  return newVehicle;
}

export function updateVehicleMileage(id: string, mileage: number): Vehicle | null {
  const vehicle = vehicles.find(v => v.id === id);
  if (!vehicle) return null;
  
  vehicle.currentMileage = mileage;
  vehicle.updatedAt = new Date().toISOString();
  return vehicle;
}

export function getVehicleDashboard(id: string): VehicleDashboard | null {
  const vehicle = getVehicleById(id);
  if (!vehicle) return null;
  
  const yearsOwned = getYearsOwned(vehicle.purchaseDate);
  const currentStage = pickStage(vehicle.vehicleType, yearsOwned, vehicle.currentMileage);
  
  // 전체 타임라인 (4단계)
  const allStages = LIFECYCLE_4STAGES[vehicle.vehicleType] || LIFECYCLE_4STAGES.sedan;
  const stageTimeline = allStages.map(s => ({
    stage: s.key,
    label: s.label,
    color: s.color,
    yearsMin: s.yearsMin,
    yearsMax: s.yearsMax,
    kmMin: s.kmMin,
    kmMax: s.kmMax,
    isCurrent: s.key === currentStage.key,
  }));
  
  // 판매 타이밍
  let timingReport;
  try {
    timingReport = buildReport({
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim,
      year: vehicle.year,
      regions: vehicle.regions,
      mileageKm: vehicle.currentMileage,
      accident: vehicle.accident,
      exterior: vehicle.exterior,
      tires: vehicle.tires,
      lease: vehicle.lease,
      keys: vehicle.keys,
      horizonMonths: 12,
    });
  } catch (e) {
    timingReport = {
      nowValue: Math.round(vehicle.purchasePrice * 0.7),
      bestMonth: 0,
      bestValue: Math.round(vehicle.purchasePrice * 0.7),
      suggestion: "지금이 좋은 타이밍이에요",
      reasons: [],
      forecast: [],
    };
  }
  
  const maintenanceSchedule = generateMaintenanceSchedule(vehicle);
  const tco = calculateTCO(vehicle, yearsOwned, maintenanceSchedule);
  const encarCTA = generateEncarCTA(vehicle, currentStage.key, timingReport, maintenanceSchedule);
  
  return {
    vehicle,
    lifecycle: {
      stage: currentStage.key,
      color: currentStage.color,
      label: currentStage.label,
      reason: currentStage.description,
      advice: currentStage.encarAdvice,
      yearsOwned: Math.round(yearsOwned * 10) / 10,
      stageTimeline,
    },
    timing: timingReport,
    tco,
    maintenanceSchedule,
    encarCTA,
  };
}
