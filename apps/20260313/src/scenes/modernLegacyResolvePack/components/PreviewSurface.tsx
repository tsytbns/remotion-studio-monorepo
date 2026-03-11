import React from "react";
import { AbsoluteFill } from "remotion";
import type { MLPreviewBackground, MLSafeMargins } from "../types";
import type { ResolvedTokens } from "../tokens";

export type PreviewSurfaceProps = {
  previewBackground: MLPreviewBackground;
  renderSafeGuide: boolean;
  safeMargins: MLSafeMargins;
  tokens: ResolvedTokens;
};

export const PreviewSurface: React.FC<PreviewSurfaceProps> = ({
  previewBackground,
  renderSafeGuide,
  safeMargins,
  tokens,
}) => {
  return (
    <>
      {previewBackground === "checker" ? (
        <AbsoluteFill
          style={{
            backgroundColor: tokens.palette.checkerLight,
            backgroundImage: [
              `linear-gradient(45deg, ${tokens.palette.checkerDark} 25%, transparent 25%)`,
              `linear-gradient(-45deg, ${tokens.palette.checkerDark} 25%, transparent 25%)`,
              `linear-gradient(45deg, transparent 75%, ${tokens.palette.checkerDark} 75%)`,
              `linear-gradient(-45deg, transparent 75%, ${tokens.palette.checkerDark} 75%)`,
            ].join(", "),
            backgroundPosition: "0 0, 0 18px, 18px -18px, -18px 0px",
            backgroundSize: "36px 36px",
          }}
        />
      ) : null}
      {renderSafeGuide ? (
        <div
          style={{
            border: `${tokens.layout.hairline}px dashed ${tokens.palette.safeGuide}`,
            inset: `${safeMargins.y}px ${safeMargins.x}px`,
            opacity: 0.8,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
      ) : null}
    </>
  );
};
