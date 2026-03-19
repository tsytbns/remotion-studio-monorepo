import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { SbiArtAuctionBanner } from "../components/SbiArtAuctionBanner";
import { AuctionThemeBackground } from "../designSystem/AuctionThemeBackground";
import {
  auctionEnglishFontFamily,
  auctionProgramThemes,
} from "../designSystem/auctionThemeTokens";
import { useAuctionTypographyReady } from "../designSystem/useAuctionTypographyReady";

// ─── Design Tokens (matched to SBI Art Auction catalog image — left half) ──
const modernLegacyTheme = auctionProgramThemes.modernLegacy;
const COLORS = {
  /** Gold banner / accent */
  gold: modernLegacyTheme.accentGold,
  /** Text colors */
  white: modernLegacyTheme.displayText,
  cream: modernLegacyTheme.canvasIvory,
  subtextLight: modernLegacyTheme.metaText,
};

// ─── Vignette ───────────────────────────────────────────────────────
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 35%, rgba(6, 30, 24, 0.42) 100%)",
      pointerEvents: "none",
    }}
  />
);

// ─── Animated Text Line ─────────────────────────────────────────────
interface TextLineProps {
  text: string;
  delayInSeconds: number;
  style?: React.CSSProperties;
}

const TextLine: React.FC<TextLineProps> = ({ text, delayInSeconds, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.floor(delayInSeconds * fps);
  const fadeDuration = Math.floor(1.2 * fps);

  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 200 },
    durationInFrames: fadeDuration,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [24, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// ─── Main Scene ─────────────────────────────────────────────────────
export type AuctionModernLegacyProps = {
  showCopy?: boolean;
};

export const auctionModernLegacyDefaults = {
  showCopy: true,
} satisfies AuctionModernLegacyProps;

export const AuctionModernLegacy: React.FC<AuctionModernLegacyProps> = ({
  showCopy = auctionModernLegacyDefaults.showCopy,
}) => {
  useAuctionTypographyReady();

  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const backgroundOpacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const isStoryAspect = height / width >= 1.6;
  const contentPaddingX = isStoryAspect ? 72 : 60;
  const contentPaddingY = showCopy
    ? isStoryAspect
      ? 120
      : 80
    : isStoryAspect
      ? 160
      : 120;
  const bannerFontSize = showCopy
    ? isStoryAspect
      ? 38
      : 34
    : isStoryAspect
      ? 56
      : 48;
  const bannerPaddingX = showCopy ? (isStoryAspect ? 48 : 40) : 56;
  const bannerScale = showCopy ? (isStoryAspect ? 1.08 : 1) : 1.2;
  const bannerSpacerHeight = isStoryAspect ? 72 : 60;
  const titleFontSize = isStoryAspect ? 116 : 100;
  const subtitleSpacerHeight = isStoryAspect ? 36 : 28;
  const subtitleFontSize = isStoryAspect ? 30 : 26;
  const subtitleMaxWidth = isStoryAspect ? "78%" : "85%";

  return (
    <AbsoluteFill>
      <AuctionThemeBackground
        opacity={backgroundOpacity}
        program="modernLegacy"
      />

      {/* Vignette overlay */}
      <Vignette />

      {/* Content layer */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: `${contentPaddingY}px ${contentPaddingX}px`,
          textAlign: "center",
          gap: 0,
        }}
      >
        {/* Gold banner: SBI ART AUCTION */}
        <SbiArtAuctionBanner
          alignSelf="center"
          fontSize={bannerFontSize}
          paddingX={bannerPaddingX}
          scale={bannerScale}
        />

        {showCopy ? (
          <>
            {/* Spacer */}
            <div style={{ height: bannerSpacerHeight }} />

            {/* Line 2: MODERN LEGACY — large white serif */}
            <TextLine
              text="Modern Legacy"
              delayInSeconds={1.8}
              style={{
                fontFamily: auctionEnglishFontFamily,
                fontSize: titleFontSize,
                fontWeight: 400,
                letterSpacing: "0.06em",
                color: COLORS.white,
                lineHeight: 1.15,
                textTransform: "uppercase" as const,
              }}
            />

            {/* Spacer */}
            <div style={{ height: subtitleSpacerHeight }} />

            {/* Line 3: Subtitle — smaller cream/white text */}
            <TextLine
              text="An Important Japanese Collection of 20th & 21st Century Masters"
              delayInSeconds={2.5}
              style={{
                fontFamily: auctionEnglishFontFamily,
                fontSize: subtitleFontSize,
                fontWeight: 400,
                letterSpacing: "0.08em",
                color: COLORS.subtextLight,
                lineHeight: 1.5,
                maxWidth: subtitleMaxWidth,
              }}
            />
          </>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
