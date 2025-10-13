// frontend/src/components/Modal.tsx
// 범용 모달 컴포넌트

import React from "react";
import { EncarColors, EncarFonts, EncarRadius, EncarShadows, EncarSpacing } from "../styles/encar-theme";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = "600px" }: Props) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: EncarSpacing.lg,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: EncarColors.white,
          borderRadius: EncarRadius.lg,
          boxShadow: EncarShadows.modal,
          maxWidth,
          width: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div style={{
          padding: EncarSpacing.lg,
          borderBottom: `1px solid ${EncarColors.borderLight}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <h3 style={{
            fontSize: EncarFonts.size.large,
            fontWeight: EncarFonts.weight.bold,
            color: EncarColors.dark,
            margin: 0,
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: EncarColors.lightGray,
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* 본문 (스크롤) */}
        <div style={{
          padding: EncarSpacing.lg,
          overflowY: "auto",
          flex: 1,
        }}>
          {children}
        </div>

        {/* 하단 */}
        <div style={{
          padding: EncarSpacing.lg,
          borderTop: `1px solid ${EncarColors.borderLight}`,
          textAlign: "center",
        }}>
          <button
            onClick={onClose}
            style={{
              padding: `${EncarSpacing.sm} ${EncarSpacing.xl}`,
              background: EncarColors.primary,
              color: "white",
              border: "none",
              borderRadius: EncarRadius.md,
              fontSize: EncarFonts.size.body,
              fontWeight: EncarFonts.weight.semibold,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}




