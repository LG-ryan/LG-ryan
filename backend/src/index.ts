import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import timingRouter from "./routes/timing";
import * as vehicleService from "./services/vehicleService";

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// --- Catalog (자동완성) ---
const dataDir = process.env.DATA_DIR || path.resolve(__dirname, "../src/data");
const MAKES = JSON.parse(fs.readFileSync(path.join(dataDir, "makes.json"), "utf8"));
const MODELS = JSON.parse(fs.readFileSync(path.join(dataDir, "models.json"), "utf8"));
const TRIMS = JSON.parse(fs.readFileSync(path.join(dataDir, "trims.json"), "utf8"));

app.get("/api/v1/catalog/makes", (_req, res) => res.json(MAKES));
app.get("/api/v1/catalog/models", (req, res) => {
  const { make } = req.query;
  const list = MODELS.filter((m:any) => !make || m.make === make);
  res.json(list);
});
app.get("/api/v1/catalog/trims", (req, res) => {
  const { make, model, year } = req.query;
  const y = Number(year);
  const list = TRIMS.filter((t:any) =>
    (!make || t.make===make) && (!model || t.model===model) && (!year || t.year===y)
  );
  res.json(list);
});

// --- 내 차고 (직접 등록) ---
app.get("/api/v1/vehicles", (_req, res) => {
  console.log("📞 GET /api/v1/vehicles 호출됨");
  try {
    const vehicles = vehicleService.getAllVehicles();
    console.log("✅ 반환:", vehicles.length, "대");
    res.json(vehicles);
  } catch (e: any) {
    console.error("❌ 오류:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/v1/vehicles", (req, res) => {
  console.log("📞 POST /api/v1/vehicles 호출됨");
  try {
    const vehicle = vehicleService.createVehicle({
      userId: "demo-user",
      ...req.body,
    });
    console.log("✅ 등록 완료:", vehicle.id);
    res.status(201).json(vehicle);
  } catch (e: any) {
    console.error("❌ 등록 오류:", e.message);
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/v1/vehicles/:id/dashboard", (req, res) => {
  console.log("📞 GET /api/v1/vehicles/:id/dashboard 호출됨");
  try {
    const dashboard = vehicleService.getVehicleDashboard(req.params.id);
    if (!dashboard) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(dashboard);
  } catch (e: any) {
    console.error("❌ 대시보드 오류:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// 테스트 라우트
app.get("/api/v1/test", (_req, res) => {
  res.json({ ok: true, message: "테스트 성공" });
});

// --- Timing ---
app.use("/api/v1/timing", timingRouter);

// Port
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
app.listen(PORT, () => {
  console.log(`[backend] listening http://localhost:${PORT}`);
});
