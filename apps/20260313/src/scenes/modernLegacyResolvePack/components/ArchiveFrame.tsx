import React from "react";
import type { MLSafeMargins } from "../types";
import type { ResolvedTokens } from "../tokens";

export type ArchiveFrameProps = {
  opacity: number;
  safeMargins: MLSafeMargins;
  tokens: ResolvedTokens;
  children?: React.ReactNode;
};

export const ArchiveFrame: React.FC<ArchiveFrameProps> = ({
  opacity,
  safeMargins,
  tokens,
  children,
}) => {
  return (
    <>
      <div
        style={{
          border: `${tokens.layout.hairline}px solid ${tokens.palette.frameStroke}`,
          inset: `${safeMargins.y}px ${safeMargins.x}px`,
          opacity,
          pointerEvents: "none",
          position: "absolute",
        }}
      />
      <div
        style={{
          border: `${tokens.layout.hairline}px solid ${tokens.palette.frameStroke}`,
          inset: `${safeMargins.y + tokens.layout.frameInnerInset}px ${
            safeMargins.x + tokens.layout.frameInnerInset
          }px`,
          opacity: opacity * 0.52,
          pointerEvents: "none",
          position: "absolute",
        }}
      />
      {children}
    </>
  );
};
