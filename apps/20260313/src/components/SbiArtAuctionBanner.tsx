import React from "react";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily: cormorantNormal } = loadCormorant("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

export type SbiArtAuctionBannerProps = {
  alignSelf?: React.CSSProperties["alignSelf"];
  animateIn?: boolean;
  bannerColor?: string;
  delayInSeconds?: number;
  fontSize?: number;
  label?: string;
  letterSpacing?: string;
  paddingX?: number;
  paddingYBottom?: number;
  paddingYTop?: number;
  scale?: number;
  textColor?: string;
};

export const SbiArtAuctionBanner: React.FC<SbiArtAuctionBannerProps> = ({
  alignSelf,
  animateIn = true,
  bannerColor = "#b8a466",
  delayInSeconds = 0.8,
  fontSize = 34,
  label = "SBI Art Auction",
  letterSpacing = "0.25em",
  paddingX = 40,
  paddingYBottom = 14,
  paddingYTop = 18,
  scale = 1,
  textColor = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = Math.floor(delayInSeconds * fps);
  const progress = animateIn
    ? spring({
        frame: frame - delay,
        fps,
        config: { damping: 200 },
        durationInFrames: Math.floor(1.2 * fps),
      })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(progress, [0, 1], [-20 * scale, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sheenProgress = interpolate(
    frame,
    [Math.floor(0.9 * fps), Math.floor(3 * fps)],
    [0, 1],
    {
      easing: Easing.bezier(0.22, 0.08, 0.18, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const sheenPosition = interpolate(sheenProgress, [0, 1], [-36, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sheenOpacity = interpolate(
    sheenProgress,
    [0, 0.2, 0.75, 1],
    [0.08, 0.18, 0.16, 0.12],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        alignSelf,
        display: "inline-block",
        opacity,
        position: "relative",
        textAlign: "center",
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          backgroundColor: bannerColor,
          boxShadow:
            "0 1px 0 rgba(255, 255, 255, 0.2) inset, 0 -1px 0 rgba(122, 96, 36, 0.35) inset, 0 18px 40px rgba(85, 63, 16, 0.18)",
          overflow: "hidden",
          paddingBottom: paddingYBottom,
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop: paddingYTop,
          position: "relative",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(102deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.02) 18%, rgba(255,244,218,0.1) 34%, rgba(255,248,231,0.22) 50%, rgba(255,250,238,0.28) 58%, rgba(247,227,176,0.12) 72%, rgba(255,255,255,0.02) 88%, rgba(255,255,255,0) 100%)",
            inset: 0,
            opacity: sheenOpacity,
            pointerEvents: "none",
            position: "absolute",
            transform: `translateX(${sheenPosition}%)`,
          }}
        />
        <div
          style={{
            color: textColor,
            fontFamily: cormorantNormal,
            fontSize,
            fontWeight: 600,
            letterSpacing,
            lineHeight: 1.2,
            position: "relative",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};
