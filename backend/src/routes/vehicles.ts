// backend/src/routes/vehicles.ts
import { Router, Request, Response } from "express";
import * as vehicleService from "../services/vehicleService";

const router = Router();

console.log("🚗 vehicles 라우터 파일 로드됨");

// 내 차량 목록 조회
router.get("/", (_req: Request, res: Response) => {
  console.log("📞 GET / 호출됨");
  try {
    const vehicles = vehicleService.getAllVehicles();
    console.log("✅ 차량 목록 반환:", vehicles.length);
    res.json(vehicles);
  } catch (e: any) {
    console.error("❌ 차량 목록 오류:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// 특정 차량 조회
router.get("/:id", (req: Request, res: Response) => {
  const vehicle = vehicleService.getVehicleById(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  res.json(vehicle);
});

// 차량 통합 대시보드
router.get("/:id/dashboard", (req: Request, res: Response) => {
  const dashboard = vehicleService.getVehicleDashboard(req.params.id);
  if (!dashboard) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  res.json(dashboard);
});

// 차량 등록
router.post("/", (req: Request, res: Response) => {
  try {
    const vehicle = vehicleService.createVehicle({
      userId: "demo-user", // 나중에 인증에서 가져옴
      ...req.body,
    });
    res.status(201).json(vehicle);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Failed to create vehicle" });
  }
});

// 주행거리 업데이트
router.patch("/:id/mileage", (req: Request, res: Response) => {
  const { mileage } = req.body;
  if (typeof mileage !== "number" || mileage < 0) {
    return res.status(400).json({ error: "Invalid mileage" });
  }
  
  const vehicle = vehicleService.updateVehicleMileage(req.params.id, mileage);
  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  
  res.json(vehicle);
});

export default router;


