import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { useAuctionTypographyReady } from "../../../designSystem/useAuctionTypographyReady";
import { ArchiveFrame } from "../components/ArchiveFrame";
import { ArchivePanel } from "../components/ArchivePanel";
import { DoubleRule } from "../components/DoubleRule";
import { MetadataScaffold } from "../components/MetadataScaffold";
import { PreviewSurface } from "../components/PreviewSurface";
import { VeilPanel } from "../components/VeilPanel";
import type { MLStructuralOverlayProps } from "../types";
import { resolveTokens } from "../tokens";
import { modernLegacyResolveTokens } from "../variantTokens.modernLegacy";
import { clamp01, progress, sineDrift } from "../utils/timing";

export const structuralOverlaySchema = z.object({
  opacity: z.number(),
  motionAmount: z.number(),
  align: z.enum(["left", "center", "right"]),
  durationFrames: z.number(),
  safeMargins: z.object({
    x: z.number(),
    y: z.number(),
  }),
  previewBackground: z.enum(["none", "checker"]),
  renderSafeGuide: z.boolean(),
});

export const structuralOverlayDefaults: MLStructuralOverlayProps = {
  opacity: 1,
  motionAmount: 1,
  align: "left",
  durationFrames: 120,
  safeMargins: {
    x: 0.0833,
    y: 0.0833,
  },
  previewBackground: "none",
  renderSafeGuide: false,
};

const getSafeMargins = (
  width: number,
  height: number,
  safeMargins: MLStructuralOverlayProps["safeMargins"],
) => {
  return {
    x: width * safeMargins.x,
    y: height * safeMargins.y,
  };
};

const getAnchorX = (
  width: number,
  safeX: number,
  panelWidth: number,
  align: MLStructuralOverlayProps["align"],
) => {
  if (align === "center") {
    return (width - panelWidth) / 2;
  }

  if (align === "right") {
    return width - safeX - panelWidth;
  }

  return safeX;
};

export const MLRulesAlpha: React.FC<MLStructuralOverlayProps> = ({
  align,
  durationFrames,
  motionAmount,
  opacity,
  previewBackground,
  renderSafeGuide,
  safeMargins,
}) => {
  useAuctionTypographyReady();

  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyResolveTokens, { width, height });
  const pxMargins = getSafeMargins(width, height, safeMargins);
  const reveal = progress(frame, tokens.motion.overlay.rulesIn);
  const x = getAnchorX(
    width,
    pxMargins.x,
    tokens.layout.openingRuleWidth,
    align,
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <PreviewSurface
        previewBackground={previewBackground}
        renderSafeGuide={renderSafeGuide}
        safeMargins={pxMargins}
        tokens={tokens}
      />
      <div
        style={{
          left: x,
          position: "absolute",
          top:
            height * 0.56 +
            sineDrift(
              frame,
              durationFrames,
              tokens.motion.overlay.smallDrift * motionAmount,
              0.5,
            ),
        }}
      >
        <DoubleRule
          align={align}
          opacity={opacity * (0.26 + reveal * 0.74)}
          progress={reveal}
          tokens={tokens}
          width={tokens.layout.openingRuleWidth}
        />
      </div>
    </AbsoluteFill>
  );
};

export const MLPanelAlpha: React.FC<MLStructuralOverlayProps> = ({
  align,
  durationFrames,
  motionAmount,
  opacity,
  previewBackground,
  renderSafeGuide,
  safeMargins,
}) => {
  useAuctionTypographyReady();

  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyResolveTokens, { width, height });
  const pxMargins = getSafeMargins(width, height, safeMargins);
  const reveal = progress(frame, tokens.motion.overlay.panelIn);
  const driftY = sineDrift(
    frame,
    durationFrames,
    tokens.motion.overlay.smallDrift * motionAmount,
    0.8,
  );
  const panelWidth = tokens.layout.panelAlphaWidth;
  const panelHeight = tokens.layout.panelAlphaHeight;
  const x = getAnchorX(width, pxMargins.x, panelWidth, align);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <PreviewSurface
        previewBackground={previewBackground}
        renderSafeGuide={renderSafeGuide}
        safeMargins={pxMargins}
        tokens={tokens}
      />
      <div
        style={{
          left: x,
          position: "absolute",
          top: tokens.layout.panelAlphaTop,
          width: panelWidth,
        }}
      >
        <VeilPanel
          height={panelHeight}
          opacity={opacity * reveal * 0.42}
          renderMode="alpha"
          tokens={tokens}
          translateY={driftY}
          width={panelWidth}
          x={0}
          y={0}
        />
        <ArchivePanel
          align={align}
          height={panelHeight}
          opacity={opacity * reveal}
          renderMode="alpha"
          tokens={tokens}
          translateY={(1 - reveal) * tokens.motion.overlay.smallDrift + driftY}
          width={panelWidth}
        />
      </div>
    </AbsoluteFill>
  );
};

export const MLFrameAlpha: React.FC<MLStructuralOverlayProps> = ({
  align,
  opacity,
  previewBackground,
  renderSafeGuide,
  safeMargins,
}) => {
  useAuctionTypographyReady();

  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyResolveTokens, { width, height });
  const pxMargins = getSafeMargins(width, height, safeMargins);
  const reveal = progress(frame, tokens.motion.overlay.frameIn);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <PreviewSurface
        previewBackground={previewBackground}
        renderSafeGuide={renderSafeGuide}
        safeMargins={pxMargins}
        tokens={tokens}
      />
      <ArchiveFrame
        opacity={opacity * reveal}
        safeMargins={pxMargins}
        tokens={tokens}
      >
        <MetadataScaffold
          align={align}
          opacity={opacity * reveal * 0.92}
          safeMargins={pxMargins}
          tokens={tokens}
        />
      </ArchiveFrame>
    </AbsoluteFill>
  );
};

export const MLFieldVeilAlpha: React.FC<MLStructuralOverlayProps> = ({
  durationFrames,
  motionAmount,
  opacity,
  previewBackground,
  renderSafeGuide,
  safeMargins,
}) => {
  useAuctionTypographyReady();

  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyResolveTokens, { width, height });
  const pxMargins = getSafeMargins(width, height, safeMargins);
  const reveal = progress(frame, tokens.motion.overlay.fieldIn);
  const driftX = sineDrift(
    frame,
    durationFrames,
    tokens.motion.overlay.mediumDrift * motionAmount,
    0.35,
  );
  const driftY = sineDrift(
    frame,
    durationFrames,
    tokens.motion.overlay.smallDrift * motionAmount,
    1.1,
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <PreviewSurface
        previewBackground={previewBackground}
        renderSafeGuide={renderSafeGuide}
        safeMargins={pxMargins}
        tokens={tokens}
      />
      <VeilPanel
        height={tokens.layout.fieldHeight}
        opacity={opacity * reveal * 0.82}
        renderMode="alpha"
        tokens={tokens}
        translateX={driftX}
        translateY={driftY}
        width={tokens.layout.fieldWidth}
        x={pxMargins.x + tokens.layout.fieldLeftBias}
        y={tokens.layout.fieldTop}
      />
    </AbsoluteFill>
  );
};

export const MLBridgeAlpha: React.FC<MLStructuralOverlayProps> = ({
  align,
  durationFrames,
  motionAmount,
  opacity,
  previewBackground,
  renderSafeGuide,
  safeMargins,
}) => {
  useAuctionTypographyReady();

  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyResolveTokens, { width, height });
  const pxMargins = getSafeMargins(width, height, safeMargins);
  const inProgress = progress(frame, tokens.motion.overlay.bridgeIn);
  const outProgress = progress(frame, tokens.motion.overlay.bridgeOut);
  const blend = clamp01(inProgress * (1 - outProgress));
  const driftX = sineDrift(
    frame,
    durationFrames,
    tokens.motion.overlay.smallDrift * motionAmount,
    0.6,
  );
  const driftY = sineDrift(
    frame,
    durationFrames,
    tokens.motion.overlay.smallDrift * motionAmount,
    1.3,
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <PreviewSurface
        previewBackground={previewBackground}
        renderSafeGuide={renderSafeGuide}
        safeMargins={pxMargins}
        tokens={tokens}
      />
      <VeilPanel
        height={tokens.layout.fieldHeight}
        opacity={opacity * blend * 0.56}
        renderMode="alpha"
        tokens={tokens}
        translateX={driftX}
        translateY={driftY}
        width={tokens.layout.fieldWidth}
        x={pxMargins.x + tokens.layout.fieldLeftBias}
        y={tokens.layout.fieldTop}
      />
      <MetadataScaffold
        align={align}
        opacity={opacity * blend * 0.88}
        safeMargins={pxMargins}
        secondaryLabel="TRANSITION FIELD"
        tokens={tokens}
      />
      <div
        style={{
          left: getAnchorX(
            width,
            pxMargins.x,
            tokens.layout.openingRuleWidth * 0.76,
            align,
          ),
          position: "absolute",
          top: height * 0.62,
        }}
      >
        <DoubleRule
          align={align}
          opacity={opacity * blend * 0.32}
          progress={Math.min(1, inProgress * 1.1)}
          tokens={tokens}
          width={tokens.layout.openingRuleWidth * 0.76}
        />
      </div>
    </AbsoluteFill>
  );
};
