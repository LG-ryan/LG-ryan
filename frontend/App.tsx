import React, { useState } from "react";
import TCOCalculator from "./features/TCOCalculator";
import TimingReport from "./features/TimingReport";
import LightSignal from "./features/LightSignal";
import Personalization from "./features/Personalization";

type TabKey = "tco" | "timing" | "signal" | "personal";

function Tabs({ tab, setTab }: { tab: TabKey; setTab: (t: TabKey) => void }) {
  const items: { key: TabKey; label: string }[] = [
    { key: "tco", label: "TCO 계산기" },
    { key: "timing", label: "판매 타이밍" },
    { key: "signal", label: "라이트 시그널" },
    { key: "personal", label: "맞춤 추천" },
  ];
  return (
    <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
      {items.map(it=>(
        <button key={it.key} onClick={()=> setTab(it.key)}
          style={{
            padding:"8px 12px", borderRadius:999, border:"1px solid #ddd",
            background: tab===it.key ? "#0e7afe" : "#fff",
            color: tab===it.key ? "#fff" : "#222", cursor:"pointer", fontWeight:600
          }}>{it.label}</button>
      ))}
    </div>
  );
}

export default function App(){
  const [tab, setTab] = useState<TabKey>("tco");
  return (
    <div style={{ maxWidth:1000, margin:"32px auto", padding:20, borderRadius:16, border:"1px solid #eee", background:"#fafafa" }}>
      <h1 style={{ marginTop:0, marginBottom:10 }}>AI 차량 생애주기 매니저 (MVP)</h1>
      <div style={{ color:"#666", marginBottom:16, fontSize:14 }}>데모용: TCO · 판매 타이밍 · 라이트 시그널 · 맞춤 추천</div>
      <Tabs tab={tab} setTab={setTab} />
      <div style={{ border:"1px solid #eee", background:"#fff", padding:20, borderRadius:12 }}>
        {tab==="tco" && <TCOCalculator />}
        {tab==="timing" && <TimingReport />}
        {tab==="signal" && <LightSignal />}
        {tab==="personal" && <Personalization />}
      </div>
    </div>
  );
}
