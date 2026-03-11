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
export const AuctionModernLegacy: React.FC = () => {
  useAuctionTypographyReady();

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const backgroundOpacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateRight: "clamp",
  });

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
          padding: "80px 60px",
          textAlign: "center",
          gap: 0,
        }}
      >
        {/* Gold banner: SBI ART AUCTION */}
        <SbiArtAuctionBanner alignSelf="center" />

        {/* Spacer */}
        <div style={{ height: 60 }} />

        {/* Line 2: MODERN LEGACY — large white serif */}
        <TextLine
          text="Modern Legacy"
          delayInSeconds={1.8}
          style={{
            fontFamily: auctionEnglishFontFamily,
            fontSize: 100,
            fontWeight: 400,
            letterSpacing: "0.06em",
            color: COLORS.white,
            lineHeight: 1.15,
            textTransform: "uppercase" as const,
          }}
        />

        {/* Spacer */}
        <div style={{ height: 28 }} />

        {/* Line 3: Subtitle — smaller cream/white text */}
        <TextLine
          text="An Important Japanese Collection of 20th & 21st Century Masters"
          delayInSeconds={2.5}
          style={{
            fontFamily: auctionEnglishFontFamily,
            fontSize: 26,
            fontWeight: 400,
            letterSpacing: "0.08em",
            color: COLORS.subtextLight,
            lineHeight: 1.5,
            maxWidth: "85%",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
