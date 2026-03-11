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

const bloomNowTheme = auctionProgramThemes.bloomNow;
const COLORS = {
  gold: bloomNowTheme.accentGold,
  white: "#ffffff",
  title: bloomNowTheme.titleInk,
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 35%, rgba(225, 220, 210, 0.4) 100%)",
      pointerEvents: "none",
    }}
  />
);

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = Math.floor(1.8 * fps);
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.floor(1.2 * fps),
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [24, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: auctionEnglishFontFamily,
        fontSize: 100,
        fontWeight: 400,
        letterSpacing: "0.06em",
        color: COLORS.title,
        lineHeight: 1.15,
        textTransform: "uppercase" as const,
      }}
    >
      Bloom Now
    </div>
  );
};

export const AuctionBloomNow: React.FC = () => {
  useAuctionTypographyReady();

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const backgroundOpacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AuctionThemeBackground opacity={backgroundOpacity} program="bloomNow" />
      <Vignette />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 60px",
          textAlign: "center",
          gap: 60,
        }}
      >
        <SbiArtAuctionBanner />
        <Title />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
