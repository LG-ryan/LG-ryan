import React, { useEffect, useState } from "react";
import { nf } from "../utils/format";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        padding: "10px 14px", borderRadius: 8, border: "1px solid #0e7afe",
        background: "#0e7afe", color: "#fff", cursor: "pointer", fontWeight: 600,
        ...(props.style || {}),
      }}
    />
  );
}

export function ErrorText({ text }: { text?: string }) {
  if (!text) return null;
  return <div style={{ marginTop: 6, fontSize: 12, color: "#d4380d" }}>{text}</div>;
}

export function Toast({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div style={{
      position: "fixed", right: 16, bottom: 16, padding: "10px 12px",
      background: "#fff1f0", border: "1px solid #ffa39e", borderRadius: 10,
      color: "#a8071a", boxShadow: "0 6px 16px rgba(0,0,0,.1)", zIndex: 9999
    }}>
      {text}
    </div>
  );
}

/** 콤마 표기 정수 입력 */
export function MoneyInput({ value, onChange, placeholder }:{
  value: number; onChange: (v:number)=>void; placeholder?:string;
}) {
  const [text, setText] = useState(nf.format(value ?? 0));
  useEffect(()=> setText(nf.format(value ?? 0)), [value]);
  return (
    <input
      type="text" inputMode="numeric" value={text} placeholder={placeholder}
      onChange={(e)=>{
        const raw = e.currentTarget.value.replace(/[^\d]/g, "");
        const num = raw === "" ? 0 : Number(raw);
        setText(nf.format(num));
        if (Number.isFinite(num)) onChange(num);
      }}
      onBlur={(e)=>{
        const raw = e.currentTarget.value.replace(/[^\d]/g, "");
        const num = raw === "" ? 0 : Number(raw);
        setText(nf.format(num));
      }}
      style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8 }}
    />
  );
}

/** 소수 입력 */
export function FloatInput({ value, onChange, step="any", placeholder, min }:{
  value:number; onChange:(v:number)=>void; step?:number|"any"; placeholder?:string; min?:number;
}) {
  return (
    <input
      type="number" value={Number.isFinite(value) ? value : 0}
      onChange={(e)=> onChange(Number((e.currentTarget as HTMLInputElement).value))}
      step={step} min={min} placeholder={placeholder}
      style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8 }}
    />
  );
}
