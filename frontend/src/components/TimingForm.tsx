import React, { useState } from "react";

export default function TimingForm() {
  const [price, setPrice] = useState(25000000);
  const [years, setYears] = useState(6);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { currentValue: price, years };
    const res = await fetch("http://localhost:3001/api/v1/timing/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setResult(await res.json());
  };

  return (
    <div>
      <h2>매도 타이밍 추천</h2>
      <form onSubmit={handleSubmit}>
        <input value={price} onChange={e => setPrice(+e.target.value)} />
        <input value={years} onChange={e => setYears(+e.target.value)} />
        <button type="submit">추천</button>
      </form>
      {result && (
        <div className="result">
          <p>추천 시점: {result.recommendation}</p>
          <p>사유: {result.reason}</p>
        </div>
      )}
    </div>
  );
}
