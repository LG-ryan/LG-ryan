// frontend/src/types/vehicle.ts
export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  purchaseDate: string;
  purchasePrice: number;
  currentMileage: number;
  accident?: "none" | "minor" | "major";
  exterior?: {
    front: "good" | "minor" | "major";
    side: "good" | "minor" | "major";
    rear: "good" | "minor" | "major";
  };
  tires?: {
    frontLeft: "good" | "replace";
    frontRight: "good" | "replace";
    rearLeft: "good" | "replace";
    rearRight: "good" | "replace";
  };
  keys?: "one" | "twoPlus";
  lease?: "none" | "active";
  leaseDetails?: {
    company: string;
    monthlyPayment: number;
    remainingMonths: number;
  };
  vehicleType: "sedan" | "suv" | "hatchback" | "coupe" | "van" | "pickup" | "truck";
  regions: string[];
  createdAt: string;
  updatedAt: string;
  soldAt?: string;
  soldPrice?: number;
  isSold?: boolean;
}

export interface VehicleDashboard {
  vehicle: Vehicle;
  lifecycle: {
    stage: "Trust" | "Keep" | "Care" | "Next";
    color: string;
    label: string;
    reason: string;
    advice: string;
    yearsOwned: number;
    stageTimeline: Array<{
      stage: "Trust" | "Keep" | "Care" | "Next";
      label: string;
      color: string;
      yearsMin: number;
      yearsMax: number | null;
      kmMin: number;
      kmMax: number | null;
      isCurrent: boolean;
    }>;
  };
  timing: {
    nowValue: number;
    bestMonth: number;
    bestValue: number;
    suggestion: string;
    reasons: string[];
    forecast: Array<{ month: number; value: number }>;
  };
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
  maintenanceSchedule: Array<{
    item: string;
    dueAtKm: number;
    daysUntil: number | null;
    priority: "high" | "medium" | "low";
  }>;
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


