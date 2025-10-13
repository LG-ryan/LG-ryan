// frontend/src/CarLifeManagerApp.tsx
import React, { useMemo, useState, useEffect } from "react";

/** ===================== 공통 설정 ===================== */
const BASE_URL =
  (import.meta as any)?.env?.VITE_API_BASE_URL || "http://localhost:8000";

const API = {
  tco: `${BASE_URL}/api/v1/tco`,
  timing: `${BASE_URL}/api/v1/timing/report`,
  signal: `${BASE_URL}/api/v1/lifecycle/signal`,
};

type TabKey = "tco" | "timing" | "signal" | "personal";

const nf = new Intl.NumberFormat("ko-KR");
const fmt = (n: number | undefined | null) =>
  typeof n === "number" && Number.isFinite(n) ? nf.format(n) : "-";

/** ===================== 공용 유틸 ===================== */
async function safeJsonFetch<T>(
  url: string,
  init?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) return { ok: false, error: json?.error || `HTTP ${res.status}` };
    return { ok: true, data: json as T };
  } catch (e: any) {
    return { ok: false, error: e?.message || "NETWORK_ERROR" };
  }
}

/** ===================== UI 컴포넌트 ===================== */
function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>{props.label}</div>
      {props.children}
    </label>
  );
}

function ErrorText({ text }: { text?: string }) {
  if (!text) return null;
  return <div style={{ marginTop: 6, fontSize: 12, color: "#d4380d" }}>{text}</div>;
}

function Toast({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div
      style={{
        position: "fixed", right: 16, bottom: 16, padding: "10px 12px",
        background: "#fff1f0", border: "1px solid #ffa39e", borderRadius: 10,
        color: "#a8071a", boxShadow: "0 6px 16px rgba(0,0,0,0.1)", zIndex: 9999,
      }}
    >
      {text}
    </div>
  );
}

/** 금액/정수 입력(표시는 콤마) */
function MoneyInput(props: { value: number; onChange: (v: number) => void; placeholder?: string; }) {
  const [text, setText] = useState(nf.format(props.value ?? 0));
  useEffect(() => setText(nf.format(props.value ?? 0)), [props.value]);
  return (
    <input
      type="text" inputMode="numeric" value={text} placeholder={props.placeholder}
      onChange={(e) => {
        const raw = e.currentTarget.value.replace(/[^\d]/g, "");
        const num = raw === "" ? 0 : Number(raw);
        setText(nf.format(num));
        if (Number.isFinite(num)) props.onChange(num);
      }}
      onBlur={(e) => {
        const raw = e.currentTarget.value.replace(/[^\d]/g, "");
        const num = raw === "" ? 0 : Number(raw);
        setText(nf.format(num));
      }}
      style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 }}
    />
  );
}

/** 소수 입력 */
function FloatInput(props: { value: number; onChange: (v: number) => void; step?: number | "any"; placeholder?: string; min?: number; }) {
  return (
    <input
      type="number" value={Number.isFinite(props.value) ? props.value : 0}
      onChange={(e) => props.onChange(Number((e.currentTarget as HTMLInputElement).value))}
      step={props.step ?? "any"} min={props.min} placeholder={props.placeholder}
      style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 }}
    />
  );
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        padding: "10px 14px", borderRadius: 8, border: "1px solid #0e7afe",
        background: "#0e7afe", color: "white", cursor: "pointer", fontWeight: 600,
      }}
    />
  );
}

function Tabs({ tab, setTab }: { tab: TabKey; setTab: (t: TabKey) => void }) {
  const items: { key: TabKey; label: string }[] = [
    { key: "tco", label: "TCO 계산기" },
    { key: "timing", label: "판매 타이밍" },
    { key: "signal", label: "라이트 시그널" },
    { key: "personal", label: "맞춤 추천" }, // 이름 변경
  ];
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
      {items.map((it) => (
        <button
          key={it.key} onClick={() => setTab(it.key)}
          style={{
            padding: "8px 12px", borderRadius: 999, border: "1px solid #ddd",
            background: tab === it.key ? "#0e7afe" : "white",
            color: tab === it.key ? "white" : "#222", cursor: "pointer", fontWeight: 600,
          }}
        >{it.label}</button>
      ))}
    </div>
  );
}

/** ===================== TCO 계산기 ===================== */
type TcoInput = {
  purchasePrice: number; holdYears: number; annualMileage: number; fuelCostPerKm: number;
  maintenancePerYear: number; insurancePerYear: number; taxPerYear: number; resaleValue: number;
};
type TcoResult = {
  tco: number; breakdown: { fuelCost: number; maintenance: number; insurance: number; tax: number; }; netCost?: number;
};

function TCOCalculator() {
  const [form, setForm] = useState<TcoInput>({
    purchasePrice: 20_000_000, holdYears: 3, annualMileage: 15_000, fuelCostPerKm: 0.15,
    maintenancePerYear: 300_000, insurancePerYear: 500_000, taxPerYear: 300_000, resaleValue: 10_000_000,
  });

  const localCalc = useMemo<TcoResult>(() => {
    const fuelCost = form.annualMileage * form.fuelCostPerKm * form.holdYears;
    const maintenance = form.maintenancePerYear * form.holdYears;
    const insurance = form.insurancePerYear * form.holdYears;
    const tax = form.taxPerYear * form.holdYears;
    const total = Math.round(form.purchasePrice + fuelCost + maintenance + insurance + tax);
    const netCost = total - (form.resaleValue || 0);
    return { tco: total, breakdown: { fuelCost: Math.round(fuelCost), maintenance: Math.round(maintenance), insurance: Math.round(insurance), tax: Math.round(tax) }, netCost };
  }, [form]);

  const [result, setResult] = useState<TcoResult | null>(null);
  useEffect(() => setResult(localCalc), [localCalc]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof TcoInput, string>>>({});

  function validateForm(f: TcoInput) {
    const e: Partial<Record<keyof TcoInput, string>> = {};
    if (f.purchasePrice <= 0) e.purchasePrice = "구매가는 0보다 커야 합니다.";
    if (f.holdYears <= 0) e.holdYears = "보유기간은 0보다 커야 합니다.";
    if (f.annualMileage < 0) e.annualMileage = "주행거리는 0 이상이어야 합니다.";
    if (f.fuelCostPerKm < 0) e.fuelCostPerKm = "유류비는 0 이상이어야 합니다.";
    if (f.maintenancePerYear < 0) e.maintenancePerYear = "정비비는 0 이상이어야 합니다.";
    if (f.insurancePerYear < 0) e.insurancePerYear = "보험료는 0 이상이어야 합니다.";
    if (f.taxPerYear < 0) e.taxPerYear = "자동차세는 0 이상이어야 합니다.";
    if (localCalc.tco - (f.resaleValue || 0) < 0) e.resaleValue = "되팔가가 총비용보다 큽니다.";
    return e;
  }
  useEffect(() => setErrors(validateForm(form)), [form, localCalc]);

  const onChange = (key: keyof TcoInput, v: number) => setForm((s) => ({ ...s, [key]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const currentErrors = validateForm(form);
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      setMsg("입력값을 확인해 주세요.");
      setLoading(false);
      return;
    }

    const payload = {
      purchasePrice: form.purchasePrice, holdYears: form.holdYears, annualMileage: form.annualMileage,
      fuelCostPerKm: form.fuelCostPerKm, maintenancePerYear: form.maintenancePerYear,
    };
    const res = await safeJsonFetch<TcoResult>(API.tco, { method: "POST", body: JSON.stringify(payload) });

    if (!res.ok) {
      setMsg(res.error || "서버 응답 없음 – 로컬 계산 결과를 표시합니다.");
    } else {
      const base = res.data;
      const merged: TcoResult = {
        ...base,
        tco: base.tco + form.insurancePerYear * form.holdYears + form.taxPerYear * form.holdYears,
        breakdown: { ...base.breakdown, insurance: form.insurancePerYear * form.holdYears, tax: form.taxPerYear * form.holdYears },
        netCost: base.tco + form.insurancePerYear * form.holdYears + form.taxPerYear * form.holdYears - (form.resaleValue || 0),
      };
      setResult(merged);
    }
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(220px, 1fr))", gap: 16 }}>
        <Field label="구매가(원)"><MoneyInput value={form.purchasePrice} onChange={(v) => onChange("purchasePrice", v)} placeholder="예: 20,000,000" /><ErrorText text={errors.purchasePrice} /></Field>
        <Field label="보유기간(년)"><FloatInput value={form.holdYears} onChange={(v) => onChange("holdYears", v)} step={0.5} min={0.5} placeholder="예: 3" /><ErrorText text={errors.holdYears} /></Field>
        <Field label="연간 주행거리(km)"><MoneyInput value={form.annualMileage} onChange={(v) => onChange("annualMileage", v)} placeholder="예: 15,000" /><ErrorText text={errors.annualMileage} /></Field>
        <Field label="km당 유류비(원)"><FloatInput value={form.fuelCostPerKm} onChange={(v) => onChange("fuelCostPerKm", v)} step={0.01} min={0} placeholder="예: 0.15" /><ErrorText text={errors.fuelCostPerKm} /></Field>
        <Field label="연간 정비비(원)"><MoneyInput value={form.maintenancePerYear} onChange={(v) => onChange("maintenancePerYear", v)} placeholder="예: 300,000" /><ErrorText text={errors.maintenancePerYear} /></Field>
        <Field label="연간 보험료(원)"><MoneyInput value={form.insurancePerYear} onChange={(v) => onChange("insurancePerYear", v)} placeholder="예: 500,000" /><ErrorText text={errors.insurancePerYear} /></Field>
        <Field label="연간 자동차세(원)"><MoneyInput value={form.taxPerYear} onChange={(v) => onChange("taxPerYear", v)} placeholder="예: 300,000" /><ErrorText text={errors.taxPerYear} /></Field>
        <Field label="되팔 때 가격(원)"><MoneyInput value={form.resaleValue} onChange={(v) => onChange("resaleValue", v)} placeholder="예: 10,000,000" /><ErrorText text={errors.resaleValue} /></Field>
        <div style={{ gridColumn: "1 / -1" }}><Button type="submit" disabled={loading || Object.keys(errors).length > 0}>{loading ? "계산 중…" : "TCO 계산"}</Button></div>
      </form>

      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, minmax(220px, 1fr))", gap: 16 }}>
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, background: "white" }}>
          <div style={{ fontSize: 13, color: "#777" }}>총 소유 비용(TCO)</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{result ? `${fmt(result.tco)} 원` : "-"}</div>
        </div>
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, background: "white" }}>
          <div style={{ fontSize: 13, color: "#777" }}>순비용(되팔가 반영)</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{result && typeof result.netCost === "number" ? `${fmt(result.netCost)} 원` : "-"}</div>
        </div>
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, background: "white" }}>
          <div style={{ fontSize: 13, color: "#777" }}>항목별 합계</div>
          <ul style={{ marginTop: 8, paddingLeft: 16, lineHeight: 1.8 }}>
            <li>유류비: {result ? `${fmt(result.breakdown.fuelCost)} 원` : "-"}</li>
            <li>정비비: {result ? `${fmt(result.breakdown.maintenance)} 원` : "-"}</li>
            <li>보험료: {result ? `${fmt(result.breakdown.insurance)} 원` : "-"}</li>
            <li>자동차세: {result ? `${fmt(result.breakdown.tax)} 원` : "-"}</li>
          </ul>
        </div>
      </div>
      <Toast text={msg || undefined} />
    </div>
  );
}

/** ===================== 판매 타이밍 ===================== */
type TimingRes = { forecast: { month: number; value: number }[]; suggestion: string };

function TimingReport() {
  const [currentValue, setCurrentValue] = useState(12_000_000);
  const [monthlyDepRate, setMonthlyDepRate] = useState(0.012);
  const [horizonMonths, setHorizonMonths] = useState(12);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<TimingRes | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setMsg(null);
    setRes(null);
    const payload = { currentValue, monthlyDepRate, horizonMonths };
    const r = await safeJsonFetch<TimingRes>(API.timing, { method: "POST", body: JSON.stringify(payload) });
    if (!r.ok) setMsg(r.error); else setRes(r.data);
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(220px, 1fr))", gap: 16, marginBottom: 12 }}>
        <Field label="현재 차량가치(원)"><MoneyInput value={currentValue} onChange={setCurrentValue} /></Field>
        <Field label="월 감가율(0~0.2)"><FloatInput value={monthlyDepRate} onChange={setMonthlyDepRate} step={0.001} /></Field>
        <Field label="예측 기간(개월)"><FloatInput value={horizonMonths} onChange={setHorizonMonths} step={1} min={1} /></Field>
      </div>
      <Button onClick={run} disabled={loading}>{loading ? "분석 중…" : "리포트 생성"}</Button>
      {msg && <div style={{ marginTop: 10, color: "#ad6800", background: "#fff7e6", padding: 8, borderRadius: 8 }}>{msg}</div>}

      {res && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>제안: {res.suggestion}</div>
          <table style={{ borderCollapse: "collapse", width: "100%", border: "1px solid #eee", background: "white" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee" }}>개월</th>
                <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #eee" }}>예상가치(원)</th>
              </tr>
            </thead>
            <tbody>
              {res.forecast.map((f) => (
                <tr key={f.month}>
                  <td style={{ padding: 8 }}>{f.month}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{fmt(f.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** ===================== 라이트 시그널 ===================== */
type SignalRes = { ageMonths: number; odoKm: number; signal: "Blue" | "Yellow" | "Red" };

function LightSignal() {
  const [ageMonths, setAgeMonths] = useState(24);
  const [odoKm, setOdoKm] = useState(40_000);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<SignalRes | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setMsg(null);
    setRes(null);
    const u = new URL(API.signal);
    u.searchParams.set("ageMonths", String(ageMonths));
    u.searchParams.set("odoKm", String(odoKm));
    const r = await safeJsonFetch<SignalRes>(u.toString(), { method: "GET" });
    if (!r.ok) setMsg(r.error); else setRes(r.data);
    setLoading(false);
  }

  const color = res?.signal === "Blue" ? "#1677ff" : res?.signal === "Yellow" ? "#faad14" : res?.signal === "Red" ? "#ff4d4f" : "#ccc";

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(220px, 1fr))", gap: 16, marginBottom: 12 }}>
        <Field label="차량 연령(개월)"><FloatInput value={ageMonths} onChange={setAgeMonths} step={1} min={0} /></Field>
        <Field label="주행거리(km)"><MoneyInput value={odoKm} onChange={setOdoKm} /></Field>
      </div>
      <Button onClick={run} disabled={loading}>{loading ? "분석 중…" : "신호 확인"}</Button>
      {msg && <div style={{ marginTop: 10, color: "#ad6800", background: "#fff7e6", padding: 8, borderRadius: 8 }}>{msg}</div>}

      {res && (
        <div style={{ marginTop: 16, padding: 16, border: `2px solid ${color}`, borderRadius: 12, background: "white", fontWeight: 700 }}>
          현재 신호: <span style={{ color }}>{res.signal}</span>
          <div style={{ marginTop: 8, fontSize: 13, color: "#555", fontWeight: 500 }}>
            (연령 {res.ageMonths}개월 / 주행 {fmt(res.odoKm)}km)
          </div>
        </div>
      )}
    </div>
  );
}

/** ===================== 맞춤 추천(개인화) ===================== */
function Personalization() {
  const [pref, setPref] = useState({
    preferFuelEconomy: true,
    preferPerformance: false,
    serviceStyle: "center" as "center" | "self" | "dealer",
    nickname: "Ryan",
  });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(220px, 1fr))", gap: 16 }}>
      <Field label="닉네임">
        <input
          value={pref.nickname}
          onChange={(e) => setPref((p) => ({ ...p, nickname: e.currentTarget.value }))}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 }}
        />
      </Field>
      <Field label="정비 선호">
        <select
          value={pref.serviceStyle}
          onChange={(e) => setPref((p) => ({ ...p, serviceStyle: e.currentTarget.value as any }))}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 }}
        >
          <option value="center">공식 센터</option>
          <option value="dealer">협력 딜러</option>
          <option value="self">셀프 정비</option>
        </select>
      </Field>
      <Field label="연비 우선"><input type="checkbox" checked={pref.preferFuelEconomy} onChange={(e) => setPref((p) => ({ ...p, preferFuelEconomy: e.currentTarget.checked }))} /></Field>
      <Field label="성능 우선"><input type="checkbox" checked={pref.preferPerformance} onChange={(e) => setPref((p) => ({ ...p, preferPerformance: e.currentTarget.checked }))} /></Field>

      <div style={{ gridColumn: "1 / -1", color: "#555", fontSize: 14 }}>
        <b>메모:</b> MVP에서는 서버 저장 없이 화면에서만 활용합니다.
      </div>
    </div>
  );
}

/** ===================== 루트 앱 ===================== */
export default function CarLifeManagerApp() {
  const [tab, setTab] = useState<TabKey>("tco");

  return (
    <div style={{ maxWidth: 1000, margin: "32px auto", padding: 20, borderRadius: 16, border: "1px solid #eee", background: "#fafafa" }}>
      <h1 style={{ marginTop: 0, marginBottom: 10 }}>AI 차량 생애주기 매니저 (MVP)</h1>
      <div style={{ color: "#666", marginBottom: 16, fontSize: 14 }}>데모용: TCO · 판매 타이밍 · 라이트 시그널 · 맞춤 추천</div>

      <Tabs tab={tab} setTab={setTab} />

      <div style={{ border: "1px solid #eee", background: "#fff", padding: 20, borderRadius: 12 }}>
        {tab === "tco" && <TCOCalculator />}
        {tab === "timing" && <TimingReport />}
        {tab === "signal" && <LightSignal />}
        {tab === "personal" && <Personalization />}
      </div>
    </div>
  );
}
