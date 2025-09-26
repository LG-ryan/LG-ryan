// backend/src/routes/tco.ts
import { Router, Request, Response } from 'express';

const router = Router();

/**
 * POST /api/tco/simulate
 * body: { purchasePrice: number, annualMileage: number, years: 1 | 3 | 5 }
 * return: { years, purchasePrice, annualMileage, depreciation, runningCosts, tco, notes }
 *
 * ⚠️ 임시(모형) 계산값. 나중에 실제 모델/데이터로 바꿀 예정.
 */
router.post('/simulate', (req: Request, res: Response) => {
  const { purchasePrice, annualMileage, years } = req.body || {};

  if (
    typeof purchasePrice !== 'number' ||
    typeof annualMileage !== 'number' ||
    ![1, 3, 5].includes(years)
  ) {
    return res.status(400).json({
      error:
        'Invalid input. Expect { purchasePrice:number, annualMileage:number, years:1|3|5 }',
    });
  }

  // ── 임시 계산 로직(더미) ─────────────────────────────
  // 감가: 연 15% 가정, 유지비: km당 120원 가정
  const depreciationRatePerYear = 0.15;
  const depreciation = Math.round(
    purchasePrice * (1 - Math.pow(1 - depreciationRatePerYear, years))
  );
  const runningCosts = Math.round(annualMileage * years * 120);
  const tco = depreciation + runningCosts;

  const result = {
    years,
    purchasePrice,
    annualMileage,
    depreciation,
    runningCosts,
    tco,
    notes: '모형값(placeholder). 실제 모델/데이터로 교체 예정.',
  };

  return res.status(200).json(result);
});

export default router;
