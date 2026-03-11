import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { useAuctionTypographyReady } from "../../../designSystem/useAuctionTypographyReady";
import { MLMainTitle } from "../components/MLMainTitle";
import { MLMeta } from "../components/MLMeta";
import { PreviewSurface } from "../components/PreviewSurface";
import { MLSubtitle } from "../components/MLSubtitle";
import type { MLColorVariant, MLTextAnimationProps } from "../types";
import { resolveTokens } from "../tokens";
import { modernLegacyResolveTokens } from "../variantTokens.modernLegacy";
import { progress, toCoreFrame } from "../utils/timing";

export const legacyTextAnimationSchema = z.object({
  text: z.string(),
  colorVariant: z.enum(["ivory", "gold", "smoke"]),
  align: z.enum(["left", "center"]),
  revealStyle: z.enum(["soft-mask", "lift", "line-coupled"]),
  holdFrames: z.number(),
  renderSafeGuide: z.boolean(),
  previewBackground: z.enum(["none", "checker"]),
});

export type LegacyTextAnimationComponentProps = MLTextAnimationProps;
export type LegacyTextAnimationKind = "title" | "subtitle" | "meta";

export const legacyTextAnimationDefaults: MLTextAnimationProps = {
  text: "MODERN LEGACY",
  colorVariant: "ivory",
  align: "left",
  revealStyle: "soft-mask",
  holdFrames: 42,
  renderSafeGuide: false,
  previewBackground: "none",
};

const getTone = (
  colorVariant: MLColorVariant,
  tokens: ReturnType<typeof resolveTokens<typeof modernLegacyResolveTokens>>,
) => {
  if (colorVariant === "gold") {
    return tokens.palette.mutedGold;
  }

  if (colorVariant === "smoke") {
    return tokens.palette.paleSmoke;
  }

  return tokens.palette.ivory;
};

const getTop = (kind: LegacyTextAnimationKind, height: number) => {
  if (kind === "subtitle") {
    return height * 0.58;
  }

  if (kind === "meta") {
    return height * 0.69;
  }

  return height * 0.47;
};

const getMaxWidth = (
  kind: LegacyTextAnimationKind,
  width: number,
  tokens: ReturnType<typeof resolveTokens<typeof modernLegacyResolveTokens>>,
) => {
  if (kind === "title") {
    return tokens.layout.openingTitleWidth;
  }

  if (kind === "subtitle") {
    return tokens.layout.openingSubtitleWidth;
  }

  return Math.min(
    width - tokens.safeArea.x * 2,
    tokens.layout.openingMetaWidth,
  );
};

const TextAnimationBase: React.FC<
  LegacyTextAnimationComponentProps & { kind: LegacyTextAnimationKind }
> = ({
  align,
  colorVariant,
  kind,
  previewBackground,
  renderSafeGuide,
  revealStyle,
  text,
}) => {
  useAuctionTypographyReady();

  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyResolveTokens, { width, height });
  const safeMargins = {
    x: tokens.safeArea.x,
    y: tokens.safeArea.y,
  };
  const coreFrame = toCoreFrame(frame);
  const revealProgress = progress(coreFrame, tokens.motion.text.reveal);
  const top = getTop(kind, height);
  const maxWidth = getMaxWidth(kind, width, tokens);
  const tone = getTone(colorVariant, tokens);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <PreviewSurface
        previewBackground={previewBackground}
        renderSafeGuide={renderSafeGuide}
        safeMargins={safeMargins}
        tokens={tokens}
      />
      <div
        style={{
          left: align === "center" ? (width - maxWidth) / 2 : safeMargins.x,
          position: "absolute",
          top,
          width: maxWidth,
        }}
      >
        {kind === "title" ? (
          <MLMainTitle
            align={align}
            maxWidth={maxWidth}
            progress={revealProgress}
            revealStyle={revealStyle}
            text={text}
            tokens={tokens}
            tone={tone}
          />
        ) : null}
        {kind === "subtitle" ? (
          <MLSubtitle
            align={align}
            maxWidth={maxWidth}
            progress={revealProgress}
            revealStyle={revealStyle}
            text={text}
            tokens={tokens}
            tone={tone}
          />
        ) : null}
        {kind === "meta" ? (
          <MLMeta
            align={align}
            progress={revealProgress}
            revealStyle={revealStyle}
            text={text}
            tokens={tokens}
            tone={tone}
          />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const MLTitleAlpha: React.FC<LegacyTextAnimationComponentProps> = (
  props,
) => {
  return <TextAnimationBase {...props} kind="title" />;
};

export const MLSubtitleAlpha: React.FC<LegacyTextAnimationComponentProps> = (
  props,
) => {
  return <TextAnimationBase {...props} kind="subtitle" />;
};

export const MLMetaAlpha: React.FC<LegacyTextAnimationComponentProps> = (
  props,
) => {
  return <TextAnimationBase {...props} kind="meta" />;
};
