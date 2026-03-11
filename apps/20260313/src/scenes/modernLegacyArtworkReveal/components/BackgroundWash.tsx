import React from "react";
import { AbsoluteFill } from "remotion";
import type { ModernLegacyArtworkLayoutVariant } from "../ModernLegacyArtworkReveal";
import type { ResolvedTokens } from "../../modernLegacyOpening/tokens";

export type BackgroundWashProps = {
  height: number;
  layoutVariant: ModernLegacyArtworkLayoutVariant;
  progress: number;
  tokens: ResolvedTokens;
  width: number;
};

const getFieldRect = (
  variant: ModernLegacyArtworkLayoutVariant,
  width: number,
  height: number,
) => {
  if (variant === "registry") {
    return {
      height: height * 0.34,
      left: width * 0.18,
      top: height * 0.23,
      width: width * 0.64,
    };
  }

  if (variant === "index") {
    return {
      height: height * 0.4,
      left: width * 0.08,
      top: height * 0.18,
      width: width * 0.72,
    };
  }

  return {
    height: height * 0.36,
    left: width * 0.12,
    top: height * 0.2,
    width: width * 0.76,
  };
};

export const BackgroundWash: React.FC<BackgroundWashProps> = ({
  height,
  layoutVariant,
  progress,
  tokens,
  width,
}) => {
  const fieldRect = getFieldRect(layoutVariant, width, height);

  return (
    <>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(circle at 50% 14%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.06) 26%, rgba(255, 255, 255, 0) 54%)`,
            `radial-gradient(ellipse 95% 75% at 50% 100%, rgba(32, 50, 41, 0.16) 0%, rgba(32, 50, 41, 0) 70%)`,
            `linear-gradient(180deg, rgba(247, 243, 234, 0.12) 0%, rgba(247, 243, 234, 0.05) 48%, rgba(221, 214, 202, 0.18) 100%)`,
          ].join(", "),
          opacity: 0.32 + progress * 0.14,
        }}
      />
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0) 100%)",
          height: fieldRect.height,
          left: fieldRect.left,
          opacity: progress * 0.74,
          position: "absolute",
          top: fieldRect.top,
          transform: `translateY(${(1 - progress) * Math.min(width, height) * 0.012}px)`,
          width: fieldRect.width,
        }}
      />
      <div
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)`,
          filter: `blur(${Math.min(width, height) * 0.06}px)`,
          height: height * 0.28,
          left: width * 0.22,
          opacity: progress * 0.55,
          position: "absolute",
          top: height * 0.1,
          width: width * 0.56,
        }}
      />
      <div
        style={{
          border: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
          inset: `${tokens.safeArea.y}px ${tokens.safeArea.x}px`,
          opacity: progress * 0.48,
          pointerEvents: "none",
          position: "absolute",
        }}
      />
    </>
  );
};
