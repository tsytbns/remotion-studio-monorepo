import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { AuctionThemeBackground } from "../../../designSystem/AuctionThemeBackground";
import { ArchiveFrame } from "../components/ArchiveFrame";
import { PreviewSurface } from "../components/PreviewSurface";
import { VeilPanel } from "../components/VeilPanel";
import type { MLBackgroundLoopProps, MLSafeMargins } from "../types";
import { resolveTokens } from "../tokens";
import { modernLegacyResolveTokens } from "../variantTokens.modernLegacy";
import { sineDrift } from "../utils/timing";

export const legacyBackgroundLoopSchema = z.object({
  renderMode: z.enum(["full", "alpha"]),
  opacity: z.number(),
  motionAmount: z.number(),
  previewBackground: z.enum(["none", "checker"]),
  renderSafeGuide: z.boolean(),
});

export type LegacyBackgroundLoopComponentProps = MLBackgroundLoopProps;

export const legacyBackgroundLoopDefaults: LegacyBackgroundLoopComponentProps =
  {
    renderMode: "full",
    opacity: 1,
    motionAmount: 1,
    previewBackground: "none",
    renderSafeGuide: false,
  };

export type BackgroundFieldLayerProps = LegacyBackgroundLoopComponentProps & {
  durationInFrames: number;
  frame: number;
  safeMargins: MLSafeMargins;
};

export const BackgroundFieldLayer: React.FC<BackgroundFieldLayerProps> = ({
  durationInFrames,
  frame,
  motionAmount,
  opacity,
  previewBackground,
  renderMode,
  renderSafeGuide,
  safeMargins,
}) => {
  const { width, height } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyResolveTokens, { width, height });
  const driftX = sineDrift(
    frame,
    durationInFrames,
    tokens.motion.backgroundLoop.xAmplitude * motionAmount,
    0,
  );
  const driftY = sineDrift(
    frame,
    durationInFrames,
    tokens.motion.backgroundLoop.yAmplitude * motionAmount,
    Math.PI * 0.5,
  );
  const secondaryDriftX = sineDrift(
    frame,
    durationInFrames,
    tokens.motion.backgroundLoop.xAmplitude * 0.56 * motionAmount,
    Math.PI * 1.15,
  );
  const secondaryDriftY = sineDrift(
    frame,
    durationInFrames,
    tokens.motion.backgroundLoop.yAmplitude * 0.72 * motionAmount,
    Math.PI * 0.35,
  );

  return (
    <>
      <PreviewSurface
        previewBackground={previewBackground}
        renderSafeGuide={renderSafeGuide}
        safeMargins={safeMargins}
        tokens={tokens}
      />
      {renderMode === "full" ? (
        <>
          <AuctionThemeBackground opacity={opacity} program="modernLegacy" />
          <AbsoluteFill
            style={{
              backgroundImage: [
                `radial-gradient(circle at 50% 18%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 28%, rgba(255,255,255,0) 60%)`,
                `linear-gradient(180deg, rgba(247,243,234,0.18) 0%, rgba(247,243,234,0.08) 56%, rgba(247,243,234,0.24) 100%)`,
              ].join(", "),
              opacity,
            }}
          />
        </>
      ) : null}
      <VeilPanel
        height={tokens.layout.fieldHeight}
        opacity={opacity * tokens.motion.backgroundLoop.fieldOpacity}
        renderMode={renderMode}
        tokens={tokens}
        translateX={driftX}
        translateY={driftY}
        width={tokens.layout.fieldWidth}
        x={safeMargins.x + tokens.layout.fieldLeftBias}
        y={tokens.layout.fieldTop}
      />
      <VeilPanel
        height={tokens.layout.veilHeight}
        opacity={opacity * tokens.motion.backgroundLoop.veilOpacity}
        renderMode={renderMode}
        tokens={tokens}
        translateX={secondaryDriftX}
        translateY={secondaryDriftY}
        width={tokens.layout.veilWidth}
        x={width - safeMargins.x - tokens.layout.veilWidth}
        y={tokens.layout.veilTop}
      />
      <div
        style={{
          borderTop: `${tokens.layout.hairline}px solid ${tokens.palette.frameStroke}`,
          left: safeMargins.x,
          opacity: opacity * tokens.motion.backgroundLoop.lineOpacity,
          position: "absolute",
          top: height * 0.64 + secondaryDriftY * 0.25,
          width: width - safeMargins.x * 2,
        }}
      />
      {renderMode === "alpha" ? (
        <ArchiveFrame
          opacity={opacity * 0.18}
          safeMargins={safeMargins}
          tokens={tokens}
        />
      ) : null}
    </>
  );
};

export const LegacyBackgroundLoop: React.FC<
  LegacyBackgroundLoopComponentProps
> = (props) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyResolveTokens, { width, height });
  const safeMargins = {
    x: tokens.safeArea.x,
    y: tokens.safeArea.y,
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <BackgroundFieldLayer
        {...props}
        durationInFrames={durationInFrames}
        frame={frame}
        safeMargins={safeMargins}
      />
    </AbsoluteFill>
  );
};
