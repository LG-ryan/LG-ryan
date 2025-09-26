import React, { useState } from "react";

export default function TCOForm() {
  const [price, setPrice] = useState(20000000);
  const [mileage, setMileage] = useState(15000);
  const [years, setYears] = useState(5);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { purchasePrice: price, annualMileage: mileage, years };
    const res = await fetch("http://localhost:3001/api/v1/tco/calc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setResult(await res.json());
  };

  return (
    <div>
      <h2>TCO 계산기</h2>
      <form onSubmit={handleSubmit}>
        <input value={price} onChange={e => setPrice(+e.target.value)} />
        <input value={mileage} onChange={e => setMileage(+e.target.value)} />
        <input value={years} onChange={e => setYears(+e.target.value)} />
        <button type="submit">계산</button>
      </form>
      {result && (
        <div className="result">
          <p>총 비용: {result.totalCost}원</p>
          <p>연평균 비용: {result.avgAnnual}원</p>
        </div>
      )}
    </div>
  );
}
