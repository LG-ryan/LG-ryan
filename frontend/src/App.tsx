import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [backendStatus, setBackendStatus] = useState("확인 안됨");

  const checkBackend = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/health");
      const data = await res.json();
      setBackendStatus(`${data.status}: ${data.message}`);
    } catch {
      setBackendStatus("연결 실패");
    }
  };

  return (
    <div className="dashboard">
      <h1>🚗 AI Car Life Manager</h1>
      <p className="subtitle">간단 TCO & 판매 타이밍 리포트 — 실제 모델/데이터로 곧 교체 예정</p>

      <div className="layout">
        <div className="sidebar">
          <h3>시스템</h3>
          <button onClick={checkBackend}>백엔드 상태 확인</button>
          <p>Backend: {backendStatus}</p>
        </div>

        <div className="main">
          <h3>입력</h3>
          <form>
            <label>구매가(원)</label>
            <input defaultValue={20000000} />
            <label>연간 주행거리(km)</label>
            <input defaultValue={15000} />
            <label>보유 기간(년) — (TCO용)</label>
            <select defaultValue={3}>
              <option value={3}>3년</option>
              <option value={5}>5년</option>
              <option value={7}>7년</option>
            </select>
            <div className="buttons">
              <button type="button">TCO 계산하기</button>
              <button type="button">판매 타이밍 리포트</button>
            </div>
          </form>

          <div className="report">
            <h3>판매 타이밍 리포트</h3>
            <table>
              <thead>
                <tr>
                  <th>시점</th>
                  <th>감가(원)</th>
                  <th>운영비(원)</th>
                  <th>총비용</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>지금</td><td>0</td><td>0</td><td>0</td></tr>
                <tr><td>6개월 후</td><td>1,560,911</td><td>900,000</td><td>2,460,911</td></tr>
                <tr><td>12개월 후</td><td>3,000,000</td><td>1,800,000</td><td>4,800,000</td></tr>
              </tbody>
            </table>
            <p>추천: 지금 (예상 총비용 0원 기준)</p>
            <small>모형값(placeholder), 실제 모델/데이터로 교체 예정.</small>
          </div>
        </div>
      </div>
    </div>
  );
}
