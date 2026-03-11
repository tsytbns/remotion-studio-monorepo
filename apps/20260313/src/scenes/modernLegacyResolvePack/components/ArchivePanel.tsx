import React from "react";
import type { MLAlign, MLRenderMode } from "../types";
import type { ResolvedTokens } from "../tokens";

export type ArchivePanelProps = {
  align: MLAlign;
  height: number;
  opacity: number;
  renderMode: MLRenderMode;
  tokens: ResolvedTokens;
  translateY?: number;
  width: number;
  children?: React.ReactNode;
};

export const ArchivePanel: React.FC<ArchivePanelProps> = ({
  align,
  height,
  opacity,
  renderMode,
  tokens,
  translateY = 0,
  width,
  children,
}) => {
  const justifyContent =
    align === "center"
      ? "center"
      : align === "right"
        ? "flex-end"
        : "flex-start";

  return (
    <div
      style={{
        display: "flex",
        justifyContent,
        opacity,
        transform: `translateY(${translateY}px)`,
        width: "100%",
      }}
    >
      <div
        style={{
          background:
            renderMode === "full"
              ? `linear-gradient(180deg, ${tokens.palette.panelFill} 0%, rgba(247, 243, 234, 0.56) 100%)`
              : `linear-gradient(180deg, ${tokens.palette.panelFillAlpha} 0%, rgba(247, 243, 234, 0.08) 100%)`,
          border: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
          minHeight: height,
          position: "relative",
          width,
        }}
      >
        <div
          style={{
            border: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
            boxShadow:
              renderMode === "full"
                ? `inset 0 1px 0 rgba(255, 255, 255, 0.26)`
                : "none",
            inset: tokens.layout.frameInset,
            opacity: 0.9,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
        <div
          style={{
            minHeight: height,
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
