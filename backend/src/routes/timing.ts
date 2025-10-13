import { Router } from "express";
import { prefill, buildReport } from "../services/timing";

const router = Router();

router.post("/prefill", (req, res) => {
  try {
    const r = prefill(req.body);
    res.json(r);
  } catch (e:any) {
    res.status(404).json({ error: e?.message || "PREFILL_ERROR" });
  }
});

router.post("/report", (req, res) => {
  try {
    const r = buildReport(req.body);
    res.json(r);
  } catch (e:any) {
    res.status(400).json({ error: e?.message || "REPORT_ERROR" });
  }
});

export default router;
