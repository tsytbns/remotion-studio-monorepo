import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { z } from "zod";
import { ArchiveFrame } from "../components/ArchiveFrame";
import type { MLStillHoldProps } from "../types";
import { resolveTokens } from "../tokens";
import { modernLegacyResolveTokens } from "../variantTokens.modernLegacy";
import {
  BackgroundFieldLayer,
  legacyBackgroundLoopDefaults,
} from "./LegacyBackgroundLoop";

export const legacyStillHoldSchema = z.object({
  renderMode: z.enum(["full", "alpha"]),
  opacity: z.number(),
  previewBackground: z.enum(["none", "checker"]),
  renderSafeGuide: z.boolean(),
});

export type LegacyStillHoldComponentProps = MLStillHoldProps;

export const legacyStillHoldDefaults: LegacyStillHoldComponentProps = {
  renderMode: legacyBackgroundLoopDefaults.renderMode,
  opacity: 1,
  previewBackground: legacyBackgroundLoopDefaults.previewBackground,
  renderSafeGuide: legacyBackgroundLoopDefaults.renderSafeGuide,
};

export const LegacyStillHold: React.FC<LegacyStillHoldComponentProps> = ({
  opacity,
  previewBackground,
  renderMode,
  renderSafeGuide,
}) => {
  const { width, height, durationInFrames } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyResolveTokens, { width, height });
  const safeMargins = {
    x: tokens.safeArea.x,
    y: tokens.safeArea.y,
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <BackgroundFieldLayer
        durationInFrames={durationInFrames}
        frame={0}
        motionAmount={0}
        opacity={opacity}
        previewBackground={previewBackground}
        renderMode={renderMode}
        renderSafeGuide={renderSafeGuide}
        safeMargins={safeMargins}
      />
      <ArchiveFrame
        opacity={opacity * 0.28}
        safeMargins={safeMargins}
        tokens={tokens}
      />
    </AbsoluteFill>
  );
};
