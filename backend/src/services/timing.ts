import fs from "fs";
import path from "path";

type Baseline = { make:string; model:string; trim:string; year:number; region:string; baseValue:number; monthlyDepRate:number };
type Trim = { make:string; model:string; year:number; trim:string; fuel:string; transmission:string; displacement:number };

const dataDir = path.resolve(__dirname, "../../src/data"); // dist 기준: ../../src/data

function readJSON<T>(name: string): T {
  const p = path.join(dataDir, name);
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw) as T;
}

const BASELINES = readJSON<Baseline[]>("baseline.json");
const ADJ = readJSON<any>("adjustments.json");
const TRIMS = readJSON<Trim[]>("trims.json");

export function prefill(payload: {
  make:string; model:string; trim:string; year:number; region?:string; regions?:string[]; mileageKm:number;
}) {
  const region = payload.region || (Array.isArray(payload.regions) && payload.regions[0]) || "capital";
  const base = BASELINES.find(b =>
    b.make===payload.make && b.model===payload.model && b.trim===payload.trim &&
    b.year===payload.year && b.region===region
  ) || BASELINES.find(b =>
    b.make===payload.make && b.model===payload.model && b.trim===payload.trim &&
    b.year===payload.year && b.region==="capital"
  );
  if(!base) throw new Error("BASELINE_NOT_FOUND");

  const tinfo = TRIMS.find(t=> t.make===payload.make && t.model===payload.model && t.trim===payload.trim && t.year===payload.year);
  return {
    baseValue: base.baseValue,
    monthlyDepRate: base.monthlyDepRate,
    fuel: tinfo?.fuel ?? null,
    transmission: tinfo?.transmission ?? null
  };
}

function mileageAdj(km:number): number {
  const band = (ADJ.mileageBands as {maxKm:number; adj:number}[]).find(b=> km <= b.maxKm);
  return band ? band.adj : 0;
}

function sumAdj(p:any): number {
  let s = 0;
  s += (ADJ.accident?.[p.accident ?? "none"] ?? 0);
  
  // 외관 상태 매핑 (부위별)
  if (p.exterior && typeof p.exterior === "object") {
    const exteriorScores: any = { "good": 0, "minor": -0.03, "major": -0.08 };
    s += (exteriorScores[p.exterior.front] ?? 0);
    s += (exteriorScores[p.exterior.side] ?? 0);
    s += (exteriorScores[p.exterior.rear] ?? 0);
  }
  
  // 타이어 상태 매핑 (개별)
  if (p.tires && typeof p.tires === "object") {
    const tireScore: any = { "good": 0, "replace": -0.01 };
    s += (tireScore[p.tires.frontLeft] ?? 0);
    s += (tireScore[p.tires.frontRight] ?? 0);
    s += (tireScore[p.tires.rearLeft] ?? 0);
    s += (tireScore[p.tires.rearRight] ?? 0);
  }
  
  s += (ADJ.keys?.[p.keys ?? "twoPlus"] ?? 0);
  s += (ADJ.lease?.[p.lease ?? "none"] ?? 0);
  s += mileageAdj(p.mileageKm ?? 0);
  
  // 지역 처리
  const region = p.region || (Array.isArray(p.regions) && p.regions[0]) || "default";
  s += (ADJ.regionWeight?.[region] ?? 0);
  
  return s;
}

export function buildReport(payload: {
  make:string; model:string; trim:string; year:number; region?:string; regions?:string[]; mileageKm:number;
  accident?: "none"|"minor"|"major";
  exterior?: {
    front: "good"|"minor"|"major";
    side: "good"|"minor"|"major";
    rear: "good"|"minor"|"major";
  };
  tires?: {
    frontLeft: "good"|"replace";
    frontRight: "good"|"replace";
    rearLeft: "good"|"replace";
    rearRight: "good"|"replace";
  };
  lease?: "none"|"active";
  keys?: "one"|"twoPlus";
  horizonMonths?: number;
}){
  const horizon = Math.max(1, Math.min(24, payload.horizonMonths ?? 12));

  // 1) 기준가/감가율 조회
  const pf = prefill(payload);
  const baseValue = pf.baseValue;
  const r = pf.monthlyDepRate;

  // 2) 보정 퍼센트 합산
  const adjPct = sumAdj(payload);
  const adjustedNow = Math.round(baseValue * (1 + adjPct));

  // 3) 예측 곡선
  const forecast = Array.from({length: horizon+1}, (_,m)=>({
    month: m,
    value: Math.round(adjustedNow * Math.pow(1 - r, m))
  }));

  // 4) 후보 시점(0/3/6/12) 중 best (단, horizon 이내만)
  const candidates = [0,3,6,12].filter(m=> m <= horizon);
  let bestMonth = 0;
  let bestValue = forecast[0].value;
  for(const m of candidates){
    const v = forecast[m].value;
    if(v > bestValue){ bestValue = v; bestMonth = m; }
  }

  // 5) 추천 문구
  const v0 = forecast[0].value;
  const v3 = forecast[Math.min(3,horizon)].value;
  const drop3 = (v0 - v3) / v0;
  let suggestion = "6~12개월 더 타셔도 괜찮아요";
  if (drop3 >= 0.05) suggestion = "지금이 베스트 타이밍이에요";
  else if (bestMonth === 3) suggestion = "3개월 내 판매하면 좋아요";
  else if (bestMonth === 6) suggestion = "6개월 내 판매를 추천해요";

  const reasons: string[] = [];
  if (drop3 >= 0.05) reasons.push("단기하락경고");
  if ((payload.mileageKm ?? 0) >= 150000) reasons.push("고주행 가속화 위험");
  const now = adjustedNow;
  const lossIfWait = bestValue - now;

  return {
    nowValue: now,
    bestMonth,
    bestValue,
    lossIfWait,
    suggestion,
    reasons,
    forecast
  };
}
