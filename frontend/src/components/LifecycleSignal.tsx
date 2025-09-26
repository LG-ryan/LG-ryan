import React, { useState } from "react";

export default function LifecycleSignal() {
  const [vehicleType, setVehicleType] = useState("suv");
  const [years, setYears] = useState(5);
  const [odometer, setOdometer] = useState(80000);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { vehicleType, years, odometer };
    const res = await fetch("http://localhost:3001/api/v1/lifecycle/stage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setResult(await res.json());
  };

  return (
    <div>
      <h2>라이트 시그널</h2>
      <form onSubmit={handleSubmit}>
        <input value={vehicleType} onChange={e => setVehicleType(e.target.value)} />
        <input value={years} onChange={e => setYears(+e.target.value)} />
        <input value={odometer} onChange={e => setOdometer(+e.target.value)} />
        <button type="submit">조회</button>
      </form>
      {result && (
        <div className="result">
          <p>신호: {result.color} {result.label}</p>
          <p>사유: {result.reason}</p>
          <p>조언: {result.advice}</p>
        </div>
      )}
    </div>
  );
}
