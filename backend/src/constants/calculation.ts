// 계산 관련 상수 정의

/**
 * TCO (Total Cost of Ownership) 계산 상수
 */
export const TCO_CONSTANTS = {
  // 감가율 (연간)
  DEPRECIATION_RATE: 0.15,           // 15% 연간 감가
  
  // 유류비
  FUEL_COST_PER_KM: 0.12,           // km당 120원
  
  // 정비비
  BASE_MAINTENANCE_ANNUAL: 400000,   // 연 40만원 기본 정비비
  MAINTENANCE_PER_10K_KM: 50000,     // 1만km당 5만원 추가
  AGE_BASED_INCREASE_ANNUAL: 100000, // 5년차 이후 연 10만원 추가
  
  // 사고 이력 추가 비용
  ACCIDENT_MINOR_COST: 500000,       // 경미한 사고 50만원
  ACCIDENT_MAJOR_COST: 1500000,      // 중대 사고 150만원
  
  // 타이어 교체 비용
  TIRE_REPLACEMENT_COST: 200000,     // 타이어 1개당 20만원
  
  // 외관 수리 비용
  EXTERIOR_FRONT_MINOR: 300000,      // 전면 경미 손상 30만원
  EXTERIOR_FRONT_MAJOR: 1000000,     // 전면 큰 손상 100만원
  EXTERIOR_SIDE_MINOR: 400000,       // 측면 경미 손상 40만원
  EXTERIOR_SIDE_MAJOR: 1200000,      // 측면 큰 손상 120만원
  EXTERIOR_REAR_MINOR: 250000,       // 후면 경미 손상 25만원
  EXTERIOR_REAR_MAJOR: 800000,       // 후면 큰 손상 80만원
  
  // 보험료 (연간, 연식별)
  INSURANCE_NEW: 800000,             // 신차 (3년 미만) 80만원
  INSURANCE_MID: 700000,             // 중고 (3-5년) 70만원
  INSURANCE_OLD: 600000,             // 구형 (5-8년) 60만원
  INSURANCE_VERY_OLD: 500000,        // 노후 (8년 이상) 50만원
  
  // 자동차세 (연간, 차종별)
  TAX_LARGE_VEHICLE: 400000,         // SUV, VAN 40만원
  TAX_STANDARD_VEHICLE: 300000,      // 세단, 해치백 등 30만원
};

/**
 * 정비 스케줄 상수
 */
export const MAINTENANCE_SCHEDULE = {
  ENGINE_OIL_INTERVAL: 10000,        // 엔진오일 1만km마다
  TIRE_INTERVAL: 40000,              // 타이어 4만km마다
  BRAKE_INTERVAL: 30000,             // 브레이크 3만km마다
  AC_FILTER_INTERVAL: 20000,         // 에어컨 필터 2만km마다
  BATTERY_INTERVAL: 50000,           // 배터리 5만km마다
  
  URGENT_THRESHOLD: 5000,            // 5천km 이내면 긴급
  WARNING_THRESHOLD: 15000,          // 1.5만km 이내면 경고
  
  ANNUAL_AVG_MILEAGE: 15000,         // 연평균 주행거리 1.5만km
};

/**
 * 생애주기 관련 상수
 */
export const LIFECYCLE_CONSTANTS = {
  // 연식 기준 (년)
  AGE_THRESHOLD_NEW: 3,              // 3년 미만: 신차급
  AGE_THRESHOLD_MID: 5,              // 5년 미만: 중고
  AGE_THRESHOLD_OLD: 8,              // 8년 미만: 구형
  
  // 주행거리 기준 (km)
  MILEAGE_THRESHOLD_LOW: 50000,      // 5만km 미만: 저주행
  MILEAGE_THRESHOLD_MID: 100000,     // 10만km 미만: 중간
  MILEAGE_THRESHOLD_HIGH: 150000,    // 15만km 미만: 고주행
};

