// backend/src/models/memory.ts
// 차량과의 추억 기능

export interface VehicleNickname {
  vehicleId: string;
  nickname: string;           // "우리 팰이", "빨간 마차" 등
  createdAt: string;
}

export interface Milestone {
  id: string;
  vehicleId: string;
  type: "distance" | "time" | "maintenance" | "journey" | "achievement";
  title: string;              // "첫 10,000km 달성!"
  description: string;        // "함께한 첫 만 킬로미터"
  badge: string;              // 이모지
  achievedAt: string;
  metadata?: any;             // 추가 정보
}

export interface JourneyMemory {
  id: string;
  vehicleId: string;
  date: string;
  title: string;              // "제주도 여행"
  location?: string;          // "제주 한라산"
  distance?: number;          // 주행거리
  photos?: string[];          // 사진 URL
  note?: string;              // 메모
  mood?: "😊" | "😍" | "🥰" | "🤩" | "😎"; // 기분
}

export interface MaintenanceMemory {
  id: string;
  vehicleId: string;
  date: string;
  type: string;               // "엔진오일", "타이어" 등
  location: string;           // 정비소
  cost: number;
  mileage: number;            // 정비 시점 주행거리
  photos?: string[];
  note?: string;
}

export interface VehicleStats {
  vehicleId: string;
  totalDays: number;          // 함께한 일수
  totalKm: number;            // 총 주행거리
  journeyCount: number;       // 여행 횟수
  maintenanceCount: number;   // 정비 횟수
  achievementCount: number;   // 달성한 마일스톤
  encarPoints: number;        // 엔카 포인트
}

// 엔카 포인트 획득 규칙
export const POINT_RULES = {
  REGISTER_VEHICLE: 100,          // 차량 등록
  UPDATE_MILEAGE: 10,             // 주행거리 업데이트
  ADD_JOURNEY: 50,                // 여행 기록 추가
  COMPLETE_MAINTENANCE: 100,      // 정비 완료
  ACHIEVE_MILESTONE: 200,         // 마일스톤 달성
  MONTHLY_CHECKIN: 30,            // 월 1회 접속
  SELL_VIA_ENCAR: 500,           // 엔카로 판매
};

// 마일스톤 정의
export const MILESTONES = {
  DISTANCE: [
    { km: 10000, title: "첫 만 킬로", badge: "🎯", points: 100 },
    { km: 50000, badge: "🌟", title: "오만 킬로 달성", points: 200 },
    { km: 100000, title: "십만 킬로 클럽", badge: "💎", points: 500 },
    { km: 200000, title: "이십만 킬로 레전드", badge: "👑", points: 1000 },
  ],
  TIME: [
    { months: 3, title: "첫 3개월", badge: "🌱", points: 50 },
    { months: 12, title: "1주년 기념", badge: "🎂", points: 200 },
    { months: 36, title: "3년 동행", badge: "🏆", points: 500 },
    { months: 60, title: "5년 파트너", badge: "💍", points: 1000 },
  ],
};




