import React from "react";
import { AbsoluteFill, Img } from "remotion";
import type { ResolvedTokens } from "../../modernLegacyOpening/tokens";
import type { ModernLegacyInfoBoardAlignment } from "../ModernLegacyInfoBoard";

export type SoftFieldProps = {
  alignment: ModernLegacyInfoBoardAlignment;
  backgroundImageSrc?: string | null;
  height: number;
  progress: number;
  tokens: ResolvedTokens;
  width: number;
};

const getFieldRect = (
  alignment: ModernLegacyInfoBoardAlignment,
  width: number,
  height: number,
  tokens: ResolvedTokens,
) => {
  if (alignment === "center") {
    return {
      height: tokens.infoBoard.softFieldHeight,
      left: (width - tokens.infoBoard.softFieldWidth) / 2,
      top: height * 0.17,
      width: tokens.infoBoard.softFieldWidth,
    };
  }

  return {
    height: tokens.infoBoard.softFieldHeight,
    left: tokens.safeArea.x + tokens.infoBoard.panelBiasInset * 0.6,
    top: height * 0.18,
    width: tokens.infoBoard.softFieldWidth,
  };
};

export const SoftField: React.FC<SoftFieldProps> = ({
  alignment,
  backgroundImageSrc,
  height,
  progress,
  tokens,
  width,
}) => {
  const hasImage =
    typeof backgroundImageSrc === "string" &&
    backgroundImageSrc.trim().length > 0;
  const fieldRect = getFieldRect(alignment, width, height, tokens);

  return (
    <>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(circle at 50% 12%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.06) 26%, rgba(255, 255, 255, 0) 58%)`,
            `radial-gradient(ellipse 100% 78% at 50% 100%, rgba(32, 50, 41, 0.18) 0%, rgba(32, 50, 41, 0) 72%)`,
            `linear-gradient(180deg, rgba(247, 243, 234, 0.14) 0%, rgba(247, 243, 234, 0.06) 52%, rgba(221, 214, 202, 0.2) 100%)`,
          ].join(", "),
          opacity: 0.34 + progress * 0.16,
        }}
      />
      {hasImage ? (
        <AbsoluteFill
          style={{
            mixBlendMode: "screen",
            opacity: 0.08 + progress * 0.06,
          }}
        >
          <Img
            src={backgroundImageSrc}
            style={{
              filter: `grayscale(${tokens.imageTreatment.grayscale}) saturate(${tokens.imageTreatment.saturation}) brightness(${tokens.imageTreatment.brightness})`,
              height: "100%",
              objectFit: "cover",
              transform: "scale(1.04)",
              width: "100%",
            }}
          />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill
        style={{
          background: [
            `linear-gradient(180deg, rgba(247, 243, 234, 0.16) 0%, rgba(247, 243, 234, 0.06) 42%, rgba(247, 243, 234, 0.24) 100%)`,
            `radial-gradient(ellipse 110% 84% at 50% 48%, rgba(255, 255, 255, 0) 56%, rgba(32, 50, 41, 0.16) 100%)`,
          ].join(", "),
          opacity: 0.26 + progress * 0.12,
        }}
      />
      <div
        style={{
          background: [
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 44%, rgba(255,255,255,0) 100%)",
            `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${tokens.palette.deepGreenWash} 100%)`,
          ].join(", "),
          border: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
          boxShadow: `inset 0 0 0 ${tokens.layout.hairline}px rgba(255, 255, 255, 0.18)`,
          height: fieldRect.height,
          left: fieldRect.left,
          opacity: 0.26 + progress * 0.42,
          position: "absolute",
          top: fieldRect.top,
          transform: `translateY(${(1 - progress) * tokens.infoBoard.fieldShiftY}px)`,
          width: fieldRect.width,
        }}
      />
      <div
        style={{
          border: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
          inset: `${tokens.safeArea.y}px ${tokens.safeArea.x}px`,
          opacity: 0.18 + progress * 0.34,
          pointerEvents: "none",
          position: "absolute",
        }}
      />
    </>
  );
};
