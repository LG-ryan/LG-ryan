// frontend/src/components/VehicleForm.tsx
import React, { useState, useEffect } from "react";

interface Props {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

// 카탈로그 데이터
const CATALOG = {
  makes: [
    { id: "hyundai", name: "현대" },
    { id: "kia", name: "기아" },
    { id: "genesis", name: "제네시스" },
  ],
  models: {
    hyundai: [
      { id: "palisade", name: "팰리세이드", trims: ["익스클루시브", "프레스티지", "캘리그래피"] },
      { id: "avante", name: "아반떼", trims: ["스마트", "모던", "프리미엄", "인스퍼레이션"] },
      { id: "grandeur", name: "그랜저", trims: ["익스클루시브", "프리미엄", "캘리그래피"] },
      { id: "kona", name: "코나", trims: ["모던", "프리미엄", "하이브리드"] },
      { id: "veloster-n", name: "벨로스터N", trims: ["베이스", "퍼포먼스"] },
      { id: "santafe", name: "싼타페", trims: ["프레스티지", "캘리그래피"] },
    ],
    kia: [
      { id: "carnival", name: "카니발", trims: ["노블레스", "시그니처"] },
      { id: "sorento", name: "쏘렌토", trims: ["트렌디", "프레스티지", "시그니처"] },
      { id: "k5", name: "K5", trims: ["트렌디", "프레스티지", "시그니처"] },
      { id: "sportage", name: "스포티지", trims: ["트렌디", "프레스티지", "노블레스"] },
      { id: "morning", name: "모닝", trims: ["디럭스", "럭셔리", "프레스티지"] },
    ],
    genesis: [
      { id: "gv80", name: "GV80", trims: ["2.5T", "3.0D", "3.5T"] },
      { id: "g80", name: "G80", trims: ["2.5T", "3.5T", "전동화"] },
      { id: "gv70", name: "GV70", trims: ["2.5T", "3.5T"] },
    ],
  } as any,
};

const REGIONS = [
  { id: "seoul", name: "서울" },
  { id: "gyeonggi", name: "경기" },
  { id: "incheon", name: "인천" },
  { id: "busan", name: "부산" },
  { id: "daegu", name: "대구" },
  { id: "gwangju", name: "광주" },
  { id: "daejeon", name: "대전" },
  { id: "ulsan", name: "울산" },
  { id: "sejong", name: "세종" },
  { id: "gangwon", name: "강원" },
  { id: "chungbuk", name: "충북" },
  { id: "chungnam", name: "충남" },
  { id: "jeonbuk", name: "전북" },
  { id: "jeonnam", name: "전남" },
  { id: "gyeongbuk", name: "경북" },
  { id: "gyeongnam", name: "경남" },
  { id: "jeju", name: "제주" },
];

export default function VehicleForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    make: "현대",
    makeId: "hyundai",
    model: "",
    modelId: "",
    trim: "",
    year: 2024,
    purchaseDate: "",
    purchasePrice: 30000000,
    currentMileage: 0,
    accident: "none" as "none" | "minor" | "major",
    exterior: "good" as "excellent" | "good" | "normal" | "scratched" | "dented" | "repainted",
    tires: "good" as "new" | "good" | "normal" | "worn" | "replace",
    keys: "twoPlus" as "one" | "twoPlus",
    lease: "none" as "none" | "active",
    vehicleType: "sedan" as "suv" | "sedan" | "hatchback" | "sports",
    regions: [] as string[],
  });

  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [availableTrims, setAvailableTrims] = useState<string[]>([]);

  // 제조사 변경 시 모델 목록 업데이트
  useEffect(() => {
    const models = CATALOG.models[form.makeId] || [];
    setAvailableModels(models);
    setForm(prev => ({ ...prev, model: "", modelId: "", trim: "" }));
    setAvailableTrims([]);
  }, [form.makeId]);

  // 모델 변경 시 트림 목록 업데이트
  useEffect(() => {
    if (form.modelId) {
      const selectedModel = availableModels.find(m => m.id === form.modelId);
      setAvailableTrims(selectedModel?.trims || []);
      setForm(prev => ({ ...prev, trim: "" }));
    }
  }, [form.modelId, availableModels]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // makeId, modelId 제거하고 전송
    const { makeId, modelId, ...submitData } = form;
    onSubmit(submitData);
  };

  const handleRegionToggle = (regionId: string) => {
    setForm(prev => ({
      ...prev,
      regions: prev.regions.includes(regionId)
        ? prev.regions.filter(r => r !== regionId)
        : [...prev.regions, regionId]
    }));
  };

  const formatNumber = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

  const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <label style={{ display: "block", marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#333" }}>
        {label} {required && <span style={{ color: "#ff4d4f" }}>*</span>}
      </div>
      {children}
    </label>
  );

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d9d9d9",
    borderRadius: 6,
    fontSize: 14,
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>차량 등록</h2>
        <p style={{ color: "#666", fontSize: 14 }}>
          차량 정보를 입력하면 자동으로 생애주기를 분석해드립니다
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: "white", padding: 32, borderRadius: 12, border: "1px solid #e8e8e8" }}>
        {/* 기본 정보 */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#0e7afe" }}>기본 정보</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
            <Field label="제조사" required>
              <select
                value={form.makeId}
                onChange={(e) => {
                  const makeObj = CATALOG.makes.find(m => m.id === e.target.value);
                  setForm({ ...form, makeId: e.target.value, make: makeObj?.name || "" });
                }}
                style={inputStyle}
              >
                {CATALOG.makes.map(make => (
                  <option key={make.id} value={make.id}>{make.name}</option>
                ))}
              </select>
            </Field>

            <Field label="모델명" required>
              <select
                value={form.modelId}
                onChange={(e) => {
                  const modelObj = availableModels.find(m => m.id === e.target.value);
                  setForm({ ...form, modelId: e.target.value, model: modelObj?.name || "" });
                }}
                style={inputStyle}
                disabled={availableModels.length === 0}
                required
              >
                <option value="">선택하세요</option>
                {availableModels.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </Field>

            <Field label="트림" required>
              <select
                value={form.trim}
                onChange={(e) => setForm({ ...form, trim: e.target.value })}
                style={inputStyle}
                disabled={availableTrims.length === 0}
                required
              >
                <option value="">선택하세요</option>
                {availableTrims.map(trim => (
                  <option key={trim} value={trim}>{trim}</option>
                ))}
              </select>
            </Field>

            <Field label="연식" required>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                min={2000}
                max={2025}
                style={inputStyle}
                required
              />
            </Field>

            <Field label="구매일" required>
              <input
                type="date"
                value={form.purchaseDate}
                onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                style={inputStyle}
                required
              />
            </Field>

            <Field label="구매가 (원)" required>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={formatNumber(form.purchasePrice)}
                  onChange={(e) => {
                    const num = Number(e.target.value.replace(/,/g, ""));
                    if (!isNaN(num)) setForm({ ...form, purchasePrice: num });
                  }}
                  style={inputStyle}
                  placeholder="예: 30,000,000"
                  required
                />
              </div>
            </Field>

            <Field label="현재 주행거리 (km)" required>
              <input
                type="text"
                value={formatNumber(form.currentMileage)}
                onChange={(e) => {
                  const num = Number(e.target.value.replace(/,/g, ""));
                  if (!isNaN(num)) setForm({ ...form, currentMileage: num });
                }}
                style={inputStyle}
                placeholder="예: 45,000"
                required
              />
            </Field>

            <Field label="차량 타입" required>
              <select
                value={form.vehicleType}
                onChange={(e) => setForm({ ...form, vehicleType: e.target.value as any })}
                style={inputStyle}
              >
                <option value="sedan">세단</option>
                <option value="suv">SUV</option>
                <option value="hatchback">해치백</option>
                <option value="sports">스포츠카</option>
              </select>
            </Field>
          </div>
        </div>

        {/* 차량 상태 */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#0e7afe" }}>차량 상태</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
            <Field label="사고 이력">
              <select
                value={form.accident}
                onChange={(e) => setForm({ ...form, accident: e.target.value as any })}
                style={inputStyle}
              >
                <option value="none">무사고</option>
                <option value="minor">경미한 사고 (긁힘, 작은 찌그러짐)</option>
                <option value="major">중대 사고 (프레임 손상)</option>
              </select>
            </Field>

            <Field label="외관 상태">
              <select
                value={form.exterior}
                onChange={(e) => setForm({ ...form, exterior: e.target.value as any })}
                style={inputStyle}
              >
                <option value="excellent">최상 (신차급)</option>
                <option value="good">양호 (미세한 스크래치)</option>
                <option value="normal">보통 (생활 기스)</option>
                <option value="scratched">스크래치 다수</option>
                <option value="dented">찌그러짐 있음</option>
                <option value="repainted">부분 재도색</option>
              </select>
            </Field>

            <Field label="타이어 상태">
              <select
                value={form.tires}
                onChange={(e) => setForm({ ...form, tires: e.target.value as any })}
                style={inputStyle}
              >
                <option value="new">신품 (6개월 이내)</option>
                <option value="good">양호 (70% 이상)</option>
                <option value="normal">보통 (50-70%)</option>
                <option value="worn">마모됨 (30-50%)</option>
                <option value="replace">교체 필요 (30% 이하)</option>
              </select>
            </Field>

            <Field label="스마트키 개수">
              <select
                value={form.keys}
                onChange={(e) => setForm({ ...form, keys: e.target.value as any })}
                style={inputStyle}
              >
                <option value="twoPlus">2개 이상</option>
                <option value="one">1개</option>
              </select>
            </Field>

            <Field label="리스/할부">
              <select
                value={form.lease}
                onChange={(e) => setForm({ ...form, lease: e.target.value as any })}
                style={inputStyle}
              >
                <option value="none">없음</option>
                <option value="active">진행 중</option>
              </select>
            </Field>
          </div>
        </div>

        {/* 거래 가능 지역 (복수 선택) */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#0e7afe" }}>
            거래 가능 지역 <span style={{ fontSize: 13, fontWeight: 400, color: "#999" }}>(복수 선택 가능)</span>
          </h3>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", 
            gap: 8,
            padding: 16,
            background: "#f5f5f5",
            borderRadius: 8,
          }}>
            {REGIONS.map(region => (
              <button
                key={region.id}
                type="button"
                onClick={() => handleRegionToggle(region.id)}
                style={{
                  padding: "8px 12px",
                  border: form.regions.includes(region.id) ? "2px solid #0e7afe" : "1px solid #d9d9d9",
                  background: form.regions.includes(region.id) ? "#e6f4ff" : "white",
                  color: form.regions.includes(region.id) ? "#0e7afe" : "#666",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: form.regions.includes(region.id) ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                {form.regions.includes(region.id) && "✓ "}
                {region.name}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
            선택된 지역: {form.regions.length > 0 ? form.regions.map(id => REGIONS.find(r => r.id === id)?.name).join(", ") : "없음"}
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "14px 20px",
              fontSize: 15,
              fontWeight: 600,
              background: "white",
              color: "#666",
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!form.model || !form.trim || form.regions.length === 0}
            style={{
              flex: 1,
              padding: "14px 20px",
              fontSize: 15,
              fontWeight: 600,
              background: (!form.model || !form.trim || form.regions.length === 0) ? "#d9d9d9" : "#0e7afe",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: (!form.model || !form.trim || form.regions.length === 0) ? "not-allowed" : "pointer",
            }}
          >
            차량 등록
          </button>
        </div>
      </form>
    </div>
  );
}
