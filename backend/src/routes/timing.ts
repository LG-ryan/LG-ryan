import { Router, Request, Response } from "express";

const router = Router();

/**
 * POST /api/timing/report
 * body: { purchasePrice:number, annualMileage:number }
 * return: { scenarios: Array<{label:string, months:number, depreciation:number, runningCosts:number, total:number}>, recommendation:string }
 *
 * ⚠️ 임시(모형) 로직: 감가 연 15%, km당 120원, 6개월은 연간비의 0.5배로 환산
 */
router.post("/report", (req: Request, res: Response) => {
  const { purchasePrice, annualMileage } = req.body || {};
  if (typeof purchasePrice !== "number" || typeof annualMileage !== "number") {
    return res.status(400).json({ error: "Invalid input. Expect { purchasePrice:number, annualMileage:number }" });
  }

  const depYear = 0.15;                 // 연 15% 감가 가정
  const costPerKm = 120;                // 1km당 120원 가정
  const monthsToYears = (m: number) => m / 12;

  const scenarios = [
    { label: "지금", months: 0 },
    { label: "6개월 후", months: 6 },
    { label: "12개월 후", months: 12 },
  ].map(s => {
    const years = monthsToYears(s.months);
    const depreciation = Math.round(purchasePrice * (1 - Math.pow(1 - depYear, years)));
    const runningCosts = Math.round(annualMileage * years * costPerKm);
    const total = depreciation + runningCosts;
    return { ...s, depreciation, runningCosts, total };
  });

  // 가장 총비용(total)이 낮은 시점 추천 (단순 규칙)
  const best = scenarios.reduce((a, b) => (a.total <= b.total ? a : b));
  const recommendation = `추천: ${best.label} (예상 총비용 ${best.total.toLocaleString()}원 기준)`;

  return res.status(200).json({ scenarios, recommendation, notes: "모형값(placeholder). 실제 모델/데이터로 교체 예정." });
});

export default router;
