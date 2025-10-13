// frontend/src/components/VehicleFormNew.tsx
import React, { useState, useEffect, useRef } from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarShadows, EncarSpacing } from "../styles/encar-theme";

interface Props {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

// 차량 카탈로그 (차량 타입 포함)
const CATALOG = {
  makes: [
    { id: "hyundai", name: "현대" },
    { id: "kia", name: "기아" },
    { id: "genesis", name: "제네시스" },
  ],
  models: {
    hyundai: [
      { id: "palisade", name: "팰리세이드", type: "suv", trims: ["익스클루시브", "프레스티지", "캘리그래피"] },
      { id: "avante", name: "아반떼", type: "sedan", trims: ["스마트", "모던", "프리미엄", "인스퍼레이션"] },
      { id: "grandeur", name: "그랜저", type: "sedan", trims: ["익스클루시브", "프리미엄", "캘리그래피"] },
      { id: "kona", name: "코나", type: "suv", trims: ["모던", "프리미엄", "하이브리드"] },
      { id: "veloster-n", name: "벨로스터N", type: "coupe", trims: ["베이스", "퍼포먼스"] },
      { id: "santafe", name: "싼타페", type: "suv", trims: ["프레스티지", "캘리그래피"] },
    ],
    kia: [
      { id: "carnival", name: "카니발", type: "suv", trims: ["노블레스", "시그니처"] },
      { id: "sorento", name: "쏘렌토", type: "suv", trims: ["트렌디", "프레스티지", "시그니처"] },
      { id: "k5", name: "K5", type: "sedan", trims: ["트렌디", "프레스티지", "시그니처"] },
      { id: "sportage", name: "스포티지", type: "suv", trims: ["트렌디", "프레스티지", "노블레스"] },
      { id: "morning", name: "모닝", type: "hatchback", trims: ["디럭스", "럭셔리", "프레스티지"] },
    ],
    genesis: [
      { id: "gv80", name: "GV80", type: "suv", trims: ["2.5T", "3.0D", "3.5T"] },
      { id: "g80", name: "G80", type: "sedan", trims: ["2.5T", "3.5T", "전동화"] },
      { id: "gv70", name: "GV70", type: "suv", trims: ["2.5T", "3.5T"] },
    ],
  } as any,
};

const REGIONS = [
  { id: "seoul", name: "서울" }, { id: "gyeonggi", name: "경기" }, { id: "incheon", name: "인천" },
  { id: "busan", name: "부산" }, { id: "daegu", name: "대구" }, { id: "gwangju", name: "광주" },
  { id: "daejeon", name: "대전" }, { id: "ulsan", name: "울산" }, { id: "sejong", name: "세종" },
  { id: "gangwon", name: "강원" }, { id: "chungbuk", name: "충북" }, { id: "chungnam", name: "충남" },
  { id: "jeonbuk", name: "전북" }, { id: "jeonnam", name: "전남" },
  { id: "gyeongbuk", name: "경북" }, { id: "gyeongnam", name: "경남" }, { id: "jeju", name: "제주" },
];

export default function VehicleFormNew({ onSubmit, onCancel }: Props) {
  // localStorage에서 저장된 데이터 불러오기
  const getInitialForm = () => {
    try {
      const saved = localStorage.getItem("vehicleFormDraft");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("폼 데이터 로드 실패:", e);
    }
    return {
      make: "현대",
      makeId: "hyundai",
      model: "",
      modelId: "",
      trim: "",
      year: 2024,
      purchaseDate: "",
      purchasePrice: 0,
      currentMileage: 0,
      accident: "none" as "none" | "minor" | "major",
      exterior: {
        front: "good" as "good" | "minor" | "major",
        side: "good" as "good" | "minor" | "major",
        rear: "good" as "good" | "minor" | "major",
      },
      tires: {
        frontLeft: "good" as "good" | "replace",
        frontRight: "good" as "good" | "replace",
        rearLeft: "good" as "good" | "replace",
        rearRight: "good" as "good" | "replace",
      },
      keys: "twoPlus" as "one" | "twoPlus",
      lease: "none" as "none" | "active",
      leaseDetails: {
        company: "",
        monthlyPayment: 0,
        remainingMonths: 0,
      },
      vehicleType: "sedan" as "sedan" | "suv" | "hatchback" | "coupe" | "van" | "pickup" | "truck",
      regions: [] as string[],
    };
  };

  const [form, setForm] = useState(getInitialForm());

  // 주행거리 입력을 위한 별도 state (uncontrolled)
  const mileageInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  // 초기 로드 시 ref에 값 설정 (0이면 빈 문자열)
  useEffect(() => {
    if (mileageInputRef.current) {
      mileageInputRef.current.value = form.currentMileage > 0 ? formatNumber(form.currentMileage) : "";
    }
    if (priceInputRef.current) {
      priceInputRef.current.value = form.purchasePrice > 0 ? formatNumber(form.purchasePrice) : "";
    }
  }, []); // 빈 배열 = 초기 로드 시 한 번만

  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [availableTrims, setAvailableTrims] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 초기 로드 시 저장된 데이터에 맞게 모델/트림 목록 설정
  useEffect(() => {
    if (form.makeId) {
      const models = CATALOG.models[form.makeId] || [];
      setAvailableModels(models);
      
      if (form.modelId) {
        const selectedModel = models.find((m: any) => m.id === form.modelId);
        if (selectedModel) {
          setAvailableTrims(selectedModel.trims || []);
        }
      }
    }
  }, []); // 초기 로드 시 한 번만

  // 폼 데이터 변경 시 자동 저장 (디바운스)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("vehicleFormDraft", JSON.stringify(form));
      } catch (e) {
        console.error("폼 데이터 저장 실패:", e);
      }
    }, 500); // 0.5초 후 저장

    return () => clearTimeout(timer);
  }, [form]);

  // 제조사 변경
  useEffect(() => {
    const models = CATALOG.models[form.makeId] || [];
    setAvailableModels(models);
    
    // localStorage에서 복원된 경우가 아니면 초기화
    const isInitialLoad = models.length > 0 && form.modelId && models.find((m: any) => m.id === form.modelId);
    if (!isInitialLoad && models.length > 0) {
      setForm(prev => ({ ...prev, model: "", modelId: "", trim: "", vehicleType: "sedan" }));
      setAvailableTrims([]);
    }
  }, [form.makeId]);

  // 모델 변경 시 트림 목록 + 차량 타입 자동 설정
  useEffect(() => {
    if (form.modelId) {
      const selectedModel = availableModels.find(m => m.id === form.modelId);
      if (selectedModel) {
        setAvailableTrims(selectedModel.trims || []);
        setForm(prev => ({ ...prev, trim: "", vehicleType: selectedModel.type || "sedan" }));
      }
    }
  }, [form.modelId, availableModels]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 검증
    const newErrors: Record<string, string> = {};
    if (!form.model) newErrors.model = "모델을 선택해주세요";
    if (!form.trim) newErrors.trim = "트림을 선택해주세요";
    if (!form.purchaseDate) newErrors.purchaseDate = "구매일을 입력해주세요";
    if (form.regions.length === 0) newErrors.regions = "거래 가능 지역을 1개 이상 선택해주세요";
    if (form.lease === "active") {
      if (!form.leaseDetails.company) newErrors.leaseCompany = "금융사를 입력해주세요";
      if (form.leaseDetails.remainingMonths <= 0) newErrors.leaseMonths = "잔여 개월을 입력해주세요";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // makeId, modelId 제거하고 전송
    const { makeId, modelId, ...submitData } = form;
    
    // leaseDetails는 lease가 active일 때만 포함
    const finalData = form.lease === "active" 
      ? submitData 
      : { ...submitData, leaseDetails: undefined };
    
    // 성공 시 localStorage 초기화
    try {
      localStorage.removeItem("vehicleFormDraft");
    } catch (e) {
      console.error("폼 데이터 삭제 실패:", e);
    }
    
    onSubmit(finalData);
  };

  // 취소 시 확인 후 초기화
  const handleCancel = () => {
    const hasData = form.model || form.trim || form.purchaseDate || form.regions.length > 0;
    if (hasData) {
      const confirmed = window.confirm("입력한 내용이 있습니다. 정말 취소하시겠습니까?");
      if (!confirmed) return;
    }
    
    try {
      localStorage.removeItem("vehicleFormDraft");
    } catch (e) {
      console.error("폼 데이터 삭제 실패:", e);
    }
    
    onCancel();
  };

  const handleRegionToggle = (regionId: string) => {
    setForm(prev => ({
      ...prev,
      regions: prev.regions.includes(regionId)
        ? prev.regions.filter(r => r !== regionId)
        : [...prev.regions, regionId]
    }));
    setErrors(prev => ({ ...prev, regions: "" }));
  };

  const formatNumber = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

  // 주행거리 blur 핸들러
  const handleMileageBlur = () => {
    if (mileageInputRef.current) {
      const raw = mileageInputRef.current.value.replace(/,/g, "");
      const num = Number(raw);
      if (!isNaN(num) && num >= 0) {
        setForm(prev => ({ ...prev, currentMileage: num }));
        mileageInputRef.current.value = formatNumber(num);
      }
    }
  };

  const handlePriceBlur = () => {
    if (priceInputRef.current) {
      const raw = priceInputRef.current.value.replace(/,/g, "");
      const num = Number(raw);
      if (!isNaN(num) && num >= 0) {
        setForm(prev => ({ ...prev, purchasePrice: num }));
        priceInputRef.current.value = formatNumber(num);
      }
    }
  };

  // 스타일
  const styles = {
    container: {
      maxWidth: 600,
      margin: "0 auto",
      padding: EncarSpacing.lg,
    },
    header: {
      marginBottom: EncarSpacing.xl,
    },
    title: {
      fontSize: EncarFonts.size.huge,
      fontWeight: EncarFonts.weight.bold,
      color: EncarColors.dark,
      marginBottom: EncarSpacing.sm,
    },
    subtitle: {
      fontSize: EncarFonts.size.body,
      color: EncarColors.lightGray,
    },
    card: {
      background: EncarColors.white,
      borderRadius: EncarRadius.lg,
      padding: EncarSpacing.xl,
      boxShadow: EncarShadows.card,
    },
    section: {
      marginBottom: EncarSpacing.xl,
    },
    sectionTitle: {
      fontSize: EncarFonts.size.medium,
      fontWeight: EncarFonts.weight.bold,
      color: EncarColors.primary,
      marginBottom: EncarSpacing.md,
      display: "flex",
      alignItems: "center",
      gap: EncarSpacing.sm,
    },
    field: {
      marginBottom: EncarSpacing.lg,
    },
    label: {
      display: "block",
      fontSize: EncarFonts.size.small,
      fontWeight: EncarFonts.weight.semibold,
      color: EncarColors.dark,
      marginBottom: EncarSpacing.sm,
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      border: `1px solid ${EncarColors.border}`,
      borderRadius: EncarRadius.md,
      fontSize: EncarFonts.size.body,
      fontFamily: EncarFonts.family,
      transition: "all 0.2s",
    } as React.CSSProperties,
    error: {
      fontSize: EncarFonts.size.tiny,
      color: EncarColors.error,
      marginTop: EncarSpacing.xs,
    },
    regionGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: EncarSpacing.sm,
      marginTop: EncarSpacing.md,
    },
    regionButton: (selected: boolean) => ({
      padding: "10px 12px",
      border: selected ? `2px solid ${EncarColors.primary}` : `1px solid ${EncarColors.border}`,
      background: selected ? `${EncarColors.primary}15` : EncarColors.white,
      color: selected ? EncarColors.primary : EncarColors.darkGray,
      borderRadius: EncarRadius.md,
      fontSize: EncarFonts.size.small,
      fontWeight: selected ? EncarFonts.weight.semibold : EncarFonts.weight.regular,
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center" as const,
    }),
    conditionGrid: {
      display: "grid",
      gridTemplateColumns: "80px 1fr",
      gap: EncarSpacing.sm,
      alignItems: "center",
      marginBottom: EncarSpacing.md,
    },
    conditionLabel: {
      fontSize: EncarFonts.size.small,
      fontWeight: EncarFonts.weight.medium,
      color: EncarColors.darkGray,
    },
    conditionButtons: {
      display: "flex",
      gap: EncarSpacing.xs,
    },
    conditionButton: (selected: boolean, isNegative: boolean = false) => ({
      flex: 1,
      padding: "8px 12px",
      border: selected 
        ? (isNegative ? `2px solid ${EncarColors.error}` : `2px solid ${EncarColors.success}`)
        : `1px solid ${EncarColors.border}`,
      background: selected 
        ? (isNegative ? `${EncarColors.error}15` : `${EncarColors.success}15`)
        : EncarColors.white,
      color: selected 
        ? (isNegative ? EncarColors.error : EncarColors.success)
        : EncarColors.darkGray,
      borderRadius: EncarRadius.md,
      fontSize: EncarFonts.size.small,
      fontWeight: selected ? EncarFonts.weight.semibold : EncarFonts.weight.regular,
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center" as const,
    }),
    buttonContainer: {
      display: "flex",
      gap: EncarSpacing.md,
      marginTop: EncarSpacing.xl,
    },
    button: (primary: boolean, disabled: boolean = false) => ({
      flex: 1,
      padding: "16px 24px",
      fontSize: EncarFonts.size.medium,
      fontWeight: EncarFonts.weight.bold,
      background: disabled ? EncarColors.borderLight : (primary ? EncarColors.primary : EncarColors.white),
      color: disabled ? EncarColors.lightGray : (primary ? EncarColors.white : EncarColors.darkGray),
      border: primary ? "none" : `1px solid ${EncarColors.border}`,
      borderRadius: EncarRadius.lg,
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: primary && !disabled ? EncarShadows.button : "none",
      transition: "all 0.2s",
    }),
  };

  const isFormValid = form.model && form.trim && form.purchaseDate && form.regions.length > 0 && 
    (form.lease === "none" || (form.leaseDetails.company && form.leaseDetails.remainingMonths > 0));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>차량 등록</h2>
        <p style={styles.subtitle}>차량 정보를 입력하면 자동으로 생애주기를 분석해드립니다</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.card}>
          {/* 기본 정보 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🚗 기본 정보</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: EncarSpacing.lg }}>
              <div style={styles.field}>
                <label style={styles.label}>제조사 *</label>
                <select
                  value={form.makeId}
                  onChange={(e) => {
                    const makeObj = CATALOG.makes.find(m => m.id === e.target.value);
                    setForm({ ...form, makeId: e.target.value, make: makeObj?.name || "" });
                  }}
                  style={styles.input}
                >
                  {CATALOG.makes.map(make => (
                    <option key={make.id} value={make.id}>{make.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>모델명 *</label>
                <select
                  value={form.modelId}
                  onChange={(e) => {
                    const modelObj = availableModels.find(m => m.id === e.target.value);
                    setForm({ ...form, modelId: e.target.value, model: modelObj?.name || "" });
                    setErrors(prev => ({ ...prev, model: "" }));
                  }}
                  style={{ ...styles.input, borderColor: errors.model ? EncarColors.error : EncarColors.border }}
                  disabled={availableModels.length === 0}
                >
                  <option value="">선택하세요</option>
                  {availableModels.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
                {errors.model && <div style={styles.error}>{errors.model}</div>}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>트림 *</label>
                <select
                  value={form.trim}
                  onChange={(e) => {
                    setForm({ ...form, trim: e.target.value });
                    setErrors(prev => ({ ...prev, trim: "" }));
                  }}
                  style={{ ...styles.input, borderColor: errors.trim ? EncarColors.error : EncarColors.border }}
                  disabled={availableTrims.length === 0}
                >
                  <option value="">선택하세요</option>
                  {availableTrims.map(trim => (
                    <option key={trim} value={trim}>{trim}</option>
                  ))}
                </select>
                {errors.trim && <div style={styles.error}>{errors.trim}</div>}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>연식 *</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  min={2000}
                  max={2025}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>구매일 *</label>
                <input
                  type="date"
                  value={form.purchaseDate}
                  onChange={(e) => {
                    setForm({ ...form, purchaseDate: e.target.value });
                    setErrors(prev => ({ ...prev, purchaseDate: "" }));
                  }}
                  style={{ ...styles.input, borderColor: errors.purchaseDate ? EncarColors.error : EncarColors.border }}
                />
                {errors.purchaseDate && <div style={styles.error}>{errors.purchaseDate}</div>}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>구매가 (원) *</label>
                <input
                  ref={priceInputRef}
                  type="text"
                  onBlur={handlePriceBlur}
                  placeholder="예: 30,000,000"
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>현재 주행거리 (km) *</label>
                <input
                  ref={mileageInputRef}
                  type="text"
                  onBlur={handleMileageBlur}
                  placeholder="예: 45,000"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* 차량 상태 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🔍 차량 상태</h3>
            
            {/* 사고 이력 */}
            <div style={styles.field}>
              <label style={styles.label}>사고 이력</label>
              <div style={styles.conditionButtons}>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, accident: "none" })}
                  style={styles.conditionButton(form.accident === "none")}
                >
                  무사고
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, accident: "minor" })}
                  style={styles.conditionButton(form.accident === "minor", true)}
                >
                  경미
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, accident: "major" })}
                  style={styles.conditionButton(form.accident === "major", true)}
                >
                  중대
                </button>
              </div>
            </div>

            {/* 외관 상태 */}
            <div style={styles.field}>
              <label style={styles.label}>외관 상태 (부위별)</label>
              <div style={{ display: "flex", flexDirection: "column", gap: EncarSpacing.sm }}>
                <div style={styles.conditionGrid}>
                  <div style={styles.conditionLabel}>전면</div>
                  <div style={styles.conditionButtons}>
                    <button type="button" onClick={() => setForm({ ...form, exterior: { ...form.exterior, front: "good" } })} style={styles.conditionButton(form.exterior.front === "good")}>양호</button>
                    <button type="button" onClick={() => setForm({ ...form, exterior: { ...form.exterior, front: "minor" } })} style={styles.conditionButton(form.exterior.front === "minor", true)}>경미손상</button>
                    <button type="button" onClick={() => setForm({ ...form, exterior: { ...form.exterior, front: "major" } })} style={styles.conditionButton(form.exterior.front === "major", true)}>큰손상</button>
                  </div>
                </div>
                <div style={styles.conditionGrid}>
                  <div style={styles.conditionLabel}>측면</div>
                  <div style={styles.conditionButtons}>
                    <button type="button" onClick={() => setForm({ ...form, exterior: { ...form.exterior, side: "good" } })} style={styles.conditionButton(form.exterior.side === "good")}>양호</button>
                    <button type="button" onClick={() => setForm({ ...form, exterior: { ...form.exterior, side: "minor" } })} style={styles.conditionButton(form.exterior.side === "minor", true)}>경미손상</button>
                    <button type="button" onClick={() => setForm({ ...form, exterior: { ...form.exterior, side: "major" } })} style={styles.conditionButton(form.exterior.side === "major", true)}>큰손상</button>
                  </div>
                </div>
                <div style={styles.conditionGrid}>
                  <div style={styles.conditionLabel}>후면</div>
                  <div style={styles.conditionButtons}>
                    <button type="button" onClick={() => setForm({ ...form, exterior: { ...form.exterior, rear: "good" } })} style={styles.conditionButton(form.exterior.rear === "good")}>양호</button>
                    <button type="button" onClick={() => setForm({ ...form, exterior: { ...form.exterior, rear: "minor" } })} style={styles.conditionButton(form.exterior.rear === "minor", true)}>경미손상</button>
                    <button type="button" onClick={() => setForm({ ...form, exterior: { ...form.exterior, rear: "major" } })} style={styles.conditionButton(form.exterior.rear === "major", true)}>큰손상</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 타이어 상태 */}
            <div style={styles.field}>
              <label style={styles.label}>타이어 상태 (개별 체크)</label>
              <div style={{ display: "flex", flexDirection: "column", gap: EncarSpacing.sm }}>
                <div style={styles.conditionGrid}>
                  <div style={styles.conditionLabel}>전좌</div>
                  <div style={styles.conditionButtons}>
                    <button type="button" onClick={() => setForm({ ...form, tires: { ...form.tires, frontLeft: "good" } })} style={styles.conditionButton(form.tires.frontLeft === "good")}>양호</button>
                    <button type="button" onClick={() => setForm({ ...form, tires: { ...form.tires, frontLeft: "replace" } })} style={styles.conditionButton(form.tires.frontLeft === "replace", true)}>교체필요</button>
                  </div>
                </div>
                <div style={styles.conditionGrid}>
                  <div style={styles.conditionLabel}>전우</div>
                  <div style={styles.conditionButtons}>
                    <button type="button" onClick={() => setForm({ ...form, tires: { ...form.tires, frontRight: "good" } })} style={styles.conditionButton(form.tires.frontRight === "good")}>양호</button>
                    <button type="button" onClick={() => setForm({ ...form, tires: { ...form.tires, frontRight: "replace" } })} style={styles.conditionButton(form.tires.frontRight === "replace", true)}>교체필요</button>
                  </div>
                </div>
                <div style={styles.conditionGrid}>
                  <div style={styles.conditionLabel}>후좌</div>
                  <div style={styles.conditionButtons}>
                    <button type="button" onClick={() => setForm({ ...form, tires: { ...form.tires, rearLeft: "good" } })} style={styles.conditionButton(form.tires.rearLeft === "good")}>양호</button>
                    <button type="button" onClick={() => setForm({ ...form, tires: { ...form.tires, rearLeft: "replace" } })} style={styles.conditionButton(form.tires.rearLeft === "replace", true)}>교체필요</button>
                  </div>
                </div>
                <div style={styles.conditionGrid}>
                  <div style={styles.conditionLabel}>후우</div>
                  <div style={styles.conditionButtons}>
                    <button type="button" onClick={() => setForm({ ...form, tires: { ...form.tires, rearRight: "good" } })} style={styles.conditionButton(form.tires.rearRight === "good")}>양호</button>
                    <button type="button" onClick={() => setForm({ ...form, tires: { ...form.tires, rearRight: "replace" } })} style={styles.conditionButton(form.tires.rearRight === "replace", true)}>교체필요</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 스마트키 */}
            <div style={styles.field}>
              <label style={styles.label}>스마트키</label>
              <div style={styles.conditionButtons}>
                <button type="button" onClick={() => setForm({ ...form, keys: "twoPlus" })} style={styles.conditionButton(form.keys === "twoPlus")}>2개 이상</button>
                <button type="button" onClick={() => setForm({ ...form, keys: "one" })} style={styles.conditionButton(form.keys === "one", true)}>1개</button>
              </div>
            </div>

            {/* 리스/할부 */}
            <div style={styles.field}>
              <label style={styles.label}>리스/할부</label>
              <div style={styles.conditionButtons}>
                <button type="button" onClick={() => setForm({ ...form, lease: "none" })} style={styles.conditionButton(form.lease === "none")}>없음</button>
                <button type="button" onClick={() => setForm({ ...form, lease: "active" })} style={styles.conditionButton(form.lease === "active")}>진행 중</button>
              </div>
            </div>

            {/* 리스/할부 세부 정보 */}
            {form.lease === "active" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: EncarSpacing.lg, marginTop: EncarSpacing.lg }}>
                <div style={styles.field}>
                  <label style={styles.label}>금융사 *</label>
                  <input
                    type="text"
                    value={form.leaseDetails.company}
                    onChange={(e) => {
                      setForm({ ...form, leaseDetails: { ...form.leaseDetails, company: e.target.value } });
                      setErrors(prev => ({ ...prev, leaseCompany: "" }));
                    }}
                    placeholder="예: 현대캐피탈"
                    style={{ ...styles.input, borderColor: errors.leaseCompany ? EncarColors.error : EncarColors.border }}
                  />
                  {errors.leaseCompany && <div style={styles.error}>{errors.leaseCompany}</div>}
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>잔여 개월 *</label>
                  <input
                    type="number"
                    value={form.leaseDetails.remainingMonths}
                    onChange={(e) => {
                      setForm({ ...form, leaseDetails: { ...form.leaseDetails, remainingMonths: Number(e.target.value) } });
                      setErrors(prev => ({ ...prev, leaseMonths: "" }));
                    }}
                    min={1}
                    placeholder="예: 24"
                    style={{ ...styles.input, borderColor: errors.leaseMonths ? EncarColors.error : EncarColors.border }}
                  />
                  {errors.leaseMonths && <div style={styles.error}>{errors.leaseMonths}</div>}
                </div>

                <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>월 납입금 (원)</label>
                  <input
                    type="text"
                    value={formatNumber(form.leaseDetails.monthlyPayment)}
                    onChange={(e) => {
                      const num = Number(e.target.value.replace(/,/g, ""));
                      if (!isNaN(num)) {
                        setForm({ ...form, leaseDetails: { ...form.leaseDetails, monthlyPayment: num } });
                      }
                    }}
                    placeholder="예: 500,000"
                    style={styles.input}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 거래 가능 지역 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              📍 거래 가능 지역 *
              <span style={{ fontSize: EncarFonts.size.tiny, fontWeight: EncarFonts.weight.regular, color: EncarColors.lightGray }}>
                (복수 선택 가능)
              </span>
            </h3>
            <div style={styles.regionGrid}>
              {REGIONS.map(region => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => handleRegionToggle(region.id)}
                  style={styles.regionButton(form.regions.includes(region.id))}
                >
                  {form.regions.includes(region.id) && "✓ "}
                  {region.name}
                </button>
              ))}
            </div>
            {errors.regions && <div style={styles.error}>{errors.regions}</div>}
            <div style={{ fontSize: EncarFonts.size.tiny, color: EncarColors.lightGray, marginTop: EncarSpacing.sm }}>
              선택된 지역: {form.regions.length > 0 ? form.regions.map(id => REGIONS.find(r => r.id === id)?.name).join(", ") : "없음"}
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div style={styles.buttonContainer}>
          <button
            type="button"
            onClick={handleCancel}
            style={styles.button(false)}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            style={styles.button(true, !isFormValid)}
          >
            차량 등록
          </button>
        </div>
        
        {/* 자동 저장 안내 */}
        <div style={{ 
          marginTop: EncarSpacing.md, 
          fontSize: EncarFonts.size.tiny, 
          color: EncarColors.lightGray, 
          textAlign: "center" 
        }}>
          💾 입력 내용은 자동으로 저장됩니다
        </div>
      </form>
    </div>
  );
}
