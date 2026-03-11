import React from "react";
import type { MLAlign } from "../types";
import type { ResolvedTokens } from "../tokens";
import { clamp01 } from "../utils/timing";

export type DoubleRuleProps = {
  align: MLAlign;
  opacity: number;
  progress: number;
  tokens: ResolvedTokens;
  width: number;
};

export const DoubleRule: React.FC<DoubleRuleProps> = ({
  align,
  opacity,
  progress,
  tokens,
  width,
}) => {
  const clamped = Math.max(0.001, clamp01(progress));
  const origin =
    align === "center"
      ? "center center"
      : align === "right"
        ? "right center"
        : "left center";

  return (
    <div
      style={{
        display: "grid",
        gap: tokens.layout.hairline * 4,
        opacity,
        width,
      }}
    >
      {[1, 0.84].map((lineOpacity, index) => {
        return (
          <div
            key={index}
            style={{
              backgroundColor: tokens.palette.mutedGold,
              height:
                index === 0
                  ? tokens.layout.hairline
                  : tokens.layout.doubleHairline,
              opacity: lineOpacity,
              transform: `scaleX(${clamped})`,
              transformOrigin: origin,
              width,
            }}
          />
        );
      })}
    </div>
  );
};
