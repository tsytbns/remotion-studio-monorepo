import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { SbiArtAuctionBanner } from "../components/SbiArtAuctionBanner";

// ─── Fonts ──────────────────────────────────────────────────────────
const { fontFamily: cormorantNormal } = loadCormorant("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const { fontFamily: cormorantItalic } = loadCormorant("italic", {
  weights: ["300", "400"],
  subsets: ["latin"],
});

// ─── Design Tokens (matched to SBI Art Auction catalog image — left half) ──
const COLORS = {
  /** Deep teal background */
  bg: "#0b4d40",
  bgDark: "#083a30",
  bgLight: "#0e5e4e",
  /** Gold banner / accent */
  gold: "#b8a466",
  goldLight: "#d4c68a",
  goldDark: "#8a7a3e",
  /** Text colors */
  white: "#ffffff",
  cream: "#f0ece3",
  subtextLight: "rgba(255,255,255,0.75)",
};

// ─── Background ─────────────────────────────────────────────────────
const TealBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: bgOpacity,
        background: `linear-gradient(
          160deg,
          ${COLORS.bgDark} 0%,
          ${COLORS.bg} 30%,
          ${COLORS.bgLight} 55%,
          ${COLORS.bg} 80%,
          ${COLORS.bgDark} 100%
        )`,
      }}
    />
  );
};

// ─── Vignette ───────────────────────────────────────────────────────
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 35%, rgba(6, 30, 24, 0.55) 100%)",
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
  return (
    <AbsoluteFill>
      {/* Deep teal gradient background */}
      <TealBackground />

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
            fontFamily: cormorantNormal,
            fontSize: 100,
            fontWeight: 700,
            letterSpacing: "0.04em",
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
            fontFamily: cormorantItalic,
            fontSize: 26,
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "0.06em",
            color: COLORS.subtextLight,
            lineHeight: 1.5,
            maxWidth: "85%",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
