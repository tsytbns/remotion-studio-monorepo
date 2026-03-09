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

const { fontFamily: cormorantNormal } = loadCormorant("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const COLORS = {
  bg0: "#ede7d8",
  bg1: "#f0ebe0",
  bg2: "#ede3d5",
  gold: "#b8a466",
  white: "#ffffff",
  title: "#2a2520",
};

const CreamBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: bgOpacity,
        background: `linear-gradient(160deg, ${COLORS.bg0} 0%, ${COLORS.bg1} 30%, ${COLORS.bg2} 55%, ${COLORS.bg1} 80%, ${COLORS.bg0} 100%)`,
      }}
    />
  );
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
        fontFamily: cormorantNormal,
        fontSize: 100,
        fontWeight: 700,
        letterSpacing: "0.04em",
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
  return (
    <AbsoluteFill>
      <CreamBackground />
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
