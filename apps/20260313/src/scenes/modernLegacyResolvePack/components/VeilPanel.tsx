import React from "react";
import type { MLRenderMode } from "../types";
import type { ResolvedTokens } from "../tokens";

export type VeilPanelProps = {
  height: number;
  opacity: number;
  renderMode: MLRenderMode;
  tokens: ResolvedTokens;
  translateX?: number;
  translateY?: number;
  width: number;
  x: number;
  y: number;
};

export const VeilPanel: React.FC<VeilPanelProps> = ({
  height,
  opacity,
  renderMode,
  tokens,
  translateX = 0,
  translateY = 0,
  width,
  x,
  y,
}) => {
  return (
    <div
      style={{
        background:
          renderMode === "full"
            ? [
                `linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 52%, rgba(255,255,255,0) 100%)`,
                `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${tokens.palette.deepGreenWash} 100%)`,
              ].join(", ")
            : [
                `linear-gradient(180deg, rgba(247,243,234,0.16) 0%, rgba(247,243,234,0.02) 60%, rgba(247,243,234,0) 100%)`,
                `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(247,243,234,0.06) 100%)`,
              ].join(", "),
        border: `${tokens.layout.hairline}px solid ${tokens.palette.frameStroke}`,
        height,
        left: x,
        opacity,
        position: "absolute",
        top: y,
        transform: `translate(${translateX}px, ${translateY}px)`,
        width,
      }}
    />
  );
};
