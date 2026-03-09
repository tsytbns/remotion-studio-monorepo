import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const mintRippleBlocksBackgroundSchema = z.object({
  aspectMode: z.enum(["auto", "wide", "portrait"]),
  theme: z.enum(["mint", "champagne"]),
});

export type MintRippleBlocksBackgroundProps = z.infer<
  typeof mintRippleBlocksBackgroundSchema
>;

export const mintRippleBlocksBackgroundDefaults: MintRippleBlocksBackgroundProps =
  {
    aspectMode: "auto",
    theme: "mint",
  };

type BlockName =
  | "echoA"
  | "heroDark"
  | "topGlaze"
  | "bottomLeft"
  | "bottomRight"
  | "echoB";

type NormalizedRect = {
  h: number;
  w: number;
  x: number;
  y: number;
};

type BlockDefinition = {
  durationInFrames: number;
  name: BlockName;
  peakOpacity: number;
  portrait: NormalizedRect;
  startFrame: number;
  wide: NormalizedRect;
};

type RippleThemeName = "mint" | "champagne";

type RippleTheme = {
  baseSolid: string;
  baseGradient: string;
  centerLift: string;
  globalGlow: string;
  vignette: string;
  midToneWash: string;
  centerBloom: string;
  innerFrameStroke: string;
  innerShade: string;
  edgeGloss: string;
  leftShade: string;
  rightShade: string;
  safeAreaWash: string;
  outerFrameStroke: string;
  farVignette: string;
  finalBloom: string;
  topBottomFilm: string;
  gridLine: string;
  blockTopFade: string;
  blocks: Record<BlockName, string>;
};

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const THEMES: Record<RippleThemeName, RippleTheme> = {
  mint: {
    baseSolid: "#0F7D74",
    baseGradient:
      "linear-gradient(160deg, #0A5B55 0%, #0F7D74 32%, #18A79B 68%, #0F7D74 100%)",
    centerLift:
      "radial-gradient(circle at 50% 42%, rgba(192, 247, 238, 0.10) 0%, rgba(192, 247, 238, 0.05) 28%, rgba(192, 247, 238, 0) 68%)",
    globalGlow:
      "radial-gradient(circle at 50% 50%, rgba(188, 244, 236, 0.14) 0%, rgba(188, 244, 236, 0.06) 42%, rgba(188, 244, 236, 0) 78%)",
    vignette:
      "radial-gradient(ellipse 92% 78% at 50% 50%, rgba(0,0,0,0) 36%, rgba(2, 42, 38, 0.14) 100%)",
    midToneWash:
      "radial-gradient(circle at 50% 56%, rgba(15, 125, 116, 0.18) 0%, rgba(15, 125, 116, 0.1) 30%, rgba(15, 125, 116, 0) 68%)",
    centerBloom:
      "radial-gradient(circle at 50% 50%, rgba(15,125,116,0.12) 0%, rgba(15,125,116,0.06) 48%, rgba(15,125,116,0) 100%)",
    innerFrameStroke: "rgba(188,244,236,0.10)",
    innerShade:
      "radial-gradient(circle at 50% 50%, rgba(10,91,85,0.05) 0%, rgba(10,91,85,0.02) 50%, rgba(10,91,85,0) 100%)",
    edgeGloss:
      "linear-gradient(115deg, rgba(255,255,255,0.012) 0%, rgba(255,255,255,0) 24%, rgba(255,255,255,0) 76%, rgba(255,255,255,0.018) 100%)",
    leftShade:
      "linear-gradient(90deg, rgba(8,77,72,0.08) 0%, rgba(8,77,72,0) 100%)",
    rightShade:
      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(4,53,48,0.08) 100%)",
    safeAreaWash:
      "linear-gradient(180deg, rgba(15,125,116,0.03) 0%, rgba(15,125,116,0.02) 45%, rgba(15,125,116,0.01) 100%)",
    outerFrameStroke: "rgba(255,255,255,0.02)",
    farVignette:
      "radial-gradient(circle at 50% 50%, rgba(24,167,155,0) 0%, rgba(24,167,155,0) 42%, rgba(0,0,0,0.05) 100%)",
    finalBloom:
      "radial-gradient(circle at 50% 50%, rgba(188,244,236,0.05) 0%, rgba(188,244,236,0.02) 52%, rgba(188,244,236,0) 100%)",
    topBottomFilm:
      "linear-gradient(180deg, rgba(255,255,255,0.008) 0%, rgba(255,255,255,0) 16%, rgba(0,0,0,0) 84%, rgba(0,0,0,0.03) 100%)",
    gridLine: "rgba(255,255,255,0.4)",
    blockTopFade: "rgba(255,255,255,0.02)",
    blocks: {
      echoA: "#18A79B",
      heroDark: "#084D48",
      topGlaze: "#159084",
      bottomLeft: "#0D6E68",
      bottomRight: "#18A79B",
      echoB: "#159084",
    },
  },
  champagne: {
    baseSolid: "#E7DFCD",
    baseGradient:
      "linear-gradient(160deg, #F0EBE0 0%, #E7DFCD 30%, #D9CFAF 58%, #C0B07B 82%, #9B8B54 100%)",
    centerLift:
      "radial-gradient(circle at 50% 42%, rgba(255, 248, 233, 0.12) 0%, rgba(255, 248, 233, 0.06) 28%, rgba(255, 248, 233, 0) 68%)",
    globalGlow:
      "radial-gradient(circle at 50% 50%, rgba(255, 246, 227, 0.16) 0%, rgba(255, 246, 227, 0.07) 42%, rgba(255, 246, 227, 0) 78%)",
    vignette:
      "radial-gradient(ellipse 92% 78% at 50% 50%, rgba(0,0,0,0) 36%, rgba(72, 61, 28, 0.12) 100%)",
    midToneWash:
      "radial-gradient(circle at 50% 56%, rgba(201, 183, 120, 0.16) 0%, rgba(201, 183, 120, 0.08) 30%, rgba(201, 183, 120, 0) 68%)",
    centerBloom:
      "radial-gradient(circle at 50% 50%, rgba(233,219,176,0.08) 0%, rgba(233,219,176,0.04) 48%, rgba(233,219,176,0) 100%)",
    innerFrameStroke: "rgba(255,248,233,0.08)",
    innerShade:
      "radial-gradient(circle at 50% 50%, rgba(138,122,62,0.05) 0%, rgba(138,122,62,0.02) 50%, rgba(138,122,62,0) 100%)",
    edgeGloss:
      "linear-gradient(115deg, rgba(255,255,255,0.018) 0%, rgba(255,255,255,0) 24%, rgba(255,255,255,0) 76%, rgba(255,255,255,0.024) 100%)",
    leftShade:
      "linear-gradient(90deg, rgba(125,108,57,0.06) 0%, rgba(125,108,57,0) 100%)",
    rightShade:
      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(87,72,27,0.07) 100%)",
    safeAreaWash:
      "linear-gradient(180deg, rgba(238,228,201,0.04) 0%, rgba(238,228,201,0.025) 45%, rgba(238,228,201,0.01) 100%)",
    outerFrameStroke: "rgba(255,255,255,0.035)",
    farVignette:
      "radial-gradient(circle at 50% 50%, rgba(233,219,176,0) 0%, rgba(233,219,176,0) 42%, rgba(0,0,0,0.04) 100%)",
    finalBloom:
      "radial-gradient(circle at 50% 50%, rgba(255,246,229,0.05) 0%, rgba(255,246,229,0.02) 52%, rgba(255,246,229,0) 100%)",
    topBottomFilm:
      "linear-gradient(180deg, rgba(255,255,255,0.012) 0%, rgba(255,255,255,0) 16%, rgba(0,0,0,0) 84%, rgba(0,0,0,0.025) 100%)",
    gridLine: "rgba(255,255,255,0.36)",
    blockTopFade: "rgba(255,255,255,0.03)",
    blocks: {
      echoA: "#EDE6D4",
      heroDark: "#A18F57",
      topGlaze: "#EFE8D7",
      bottomLeft: "#B9AB76",
      bottomRight: "#D6CAAB",
      echoB: "#E7DFCC",
    },
  },
};

const BLOCKS: BlockDefinition[] = [
  {
    name: "echoA",
    wide: { x: 0, y: 0, w: 0.62, h: 0.38 },
    portrait: { x: 0, y: 0, w: 0.68, h: 0.34 },
    peakOpacity: 0.05,
    startFrame: 8,
    durationInFrames: 24,
  },
  {
    name: "heroDark",
    wide: { x: 0.3, y: 0.12, w: 0.7, h: 0.56 },
    portrait: { x: 0.2, y: 0.14, w: 0.8, h: 0.49 },
    peakOpacity: 0.28,
    startFrame: 20,
    durationInFrames: 34,
  },
  {
    name: "topGlaze",
    wide: { x: 0.5, y: 0.12, w: 0.5, h: 0.27 },
    portrait: { x: 0.42, y: 0.14, w: 0.58, h: 0.23 },
    peakOpacity: 0.1,
    startFrame: 28,
    durationInFrames: 26,
  },
  {
    name: "bottomLeft",
    wide: { x: 0, y: 0.5, w: 0.5, h: 0.5 },
    portrait: { x: 0, y: 0.57, w: 0.44, h: 0.43 },
    peakOpacity: 0.2,
    startFrame: 42,
    durationInFrames: 32,
  },
  {
    name: "bottomRight",
    wide: { x: 0.3, y: 0.48, w: 0.53, h: 0.52 },
    portrait: { x: 0.22, y: 0.53, w: 0.56, h: 0.47 },
    peakOpacity: 0.14,
    startFrame: 52,
    durationInFrames: 36,
  },
  {
    name: "echoB",
    wide: { x: 0.38, y: 0.18, w: 0.62, h: 0.55 },
    portrait: { x: 0.34, y: 0.24, w: 0.66, h: 0.49 },
    peakOpacity: 0.07,
    startFrame: 64,
    durationInFrames: 30,
  },
];

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const mix = (from: number, to: number, progress: number) => {
  return from + (to - from) * progress;
};

const mixRect = (
  portrait: NormalizedRect,
  wide: NormalizedRect,
  progress: number,
): NormalizedRect => {
  return {
    x: mix(portrait.x, wide.x, progress),
    y: mix(portrait.y, wide.y, progress),
    w: mix(portrait.w, wide.w, progress),
    h: mix(portrait.h, wide.h, progress),
  };
};

const blockFadeEasing = Easing.inOut(Easing.ease);

export const MintRippleBlocksBackground: React.FC<
  MintRippleBlocksBackgroundProps
> = ({ aspectMode, theme }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const themeTokens = THEMES[theme];
  const globalGlowOpacity = theme === "champagne" ? 0.48 : 0.55;
  const innerFrameOpacity = theme === "champagne" ? 0.04 : 0.03;
  const gridOpacity = theme === "champagne" ? 0.015 : 0.02;
  const blockStartCornerHighlight =
    theme === "champagne" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)";

  const vmin = Math.min(width, height) / 100;
  const vmax = Math.max(width, height) / 100;

  const aspect = width / height;
  const aspectMix =
    aspectMode === "wide"
      ? 1
      : aspectMode === "portrait"
        ? 0
        : clamp((aspect - 0.8) / (1.7778 - 0.8), 0, 1);

  const baseOpacity = interpolate(frame, [0, 18], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: themeTokens.baseSolid,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: baseOpacity,
          background: themeTokens.baseGradient,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: baseOpacity,
          background: themeTokens.centerLift,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * 0.5 - width * 0.36,
          top: height * 0.5 - height * 0.29,
          width: width * 0.72,
          height: height * 0.58,
          background: themeTokens.globalGlow,
          filter: `blur(${vmin * 3.2}px)`,
          opacity: globalGlowOpacity,
          pointerEvents: "none",
        }}
      />
      {BLOCKS.map((block) => {
        const rect = mixRect(block.portrait, block.wide, aspectMix);
        const fadeProgress = interpolate(
          frame,
          [block.startFrame, block.startFrame + block.durationInFrames],
          [0, 1],
          {
            easing: blockFadeEasing,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        const blockOpacity = fadeProgress * block.peakOpacity;
        const blockColor = themeTokens.blocks[block.name];

        return (
          <div
            key={block.name}
            style={{
              position: "absolute",
              left: rect.x * width,
              top: rect.y * height,
              width: rect.w * width,
              height: rect.h * height,
              opacity: blockOpacity,
              boxSizing: "border-box",
              background: [
                `linear-gradient(135deg, ${blockStartCornerHighlight} 0%, rgba(255,255,255,0) 18%, rgba(255,255,255,0) 100%)`,
                `linear-gradient(135deg, ${hexToRgba(blockColor, 0.96)} 0%, ${hexToRgba(blockColor, 0.8)} 18%, ${hexToRgba(blockColor, 0.48)} 42%, ${hexToRgba(blockColor, 0.16)} 68%, ${hexToRgba(blockColor, 0.04)} 84%, ${hexToRgba(blockColor, 0)} 100%)`,
                `linear-gradient(135deg, ${themeTokens.blockTopFade} 0%, rgba(255,255,255,0) 36%, rgba(255,255,255,0) 100%)`,
              ].join(","),
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background: themeTokens.vignette,
          opacity: 0.52,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: themeTokens.midToneWash,
          opacity: 0.72,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0.016) 0%, rgba(255,255,255,0.008) 20%, rgba(255,255,255,0) 40%), linear-gradient(0deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 28%)`,
          opacity: clamp(0.6 + vmax / 200, 0.6, 0.7),
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * 0.18,
          top: height * 0.25,
          width: width * 0.64,
          height: height * 0.42,
          background: themeTokens.centerBloom,
          opacity: 0.75,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * 0.24,
          top: height * 0.12,
          width: width * 0.52,
          height: height * 0.7,
          border: `${Math.max(1, vmin * 0.06)}px solid ${themeTokens.innerFrameStroke}`,
          opacity: innerFrameOpacity,
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * 0.22,
          top: height * 0.18,
          width: width * 0.56,
          height: height * 0.52,
          background: themeTokens.innerShade,
          opacity: 0.8,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: themeTokens.edgeGloss,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: width * 0.18,
          height: height,
          background: themeTokens.leftShade,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: width * 0.16,
          height: height * 0.28,
          background: themeTokens.rightShade,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * 0.3,
          top: height * 0.22,
          width: width * 0.4,
          height: height * 0.36,
          background: themeTokens.safeAreaWash,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * 0.08,
          top: height * 0.06,
          width: width * 0.84,
          height: height * 0.88,
          boxSizing: "border-box",
          border: `${Math.max(1, vmin * 0.04)}px solid ${themeTokens.outerFrameStroke}`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: themeTokens.farVignette,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * 0.24,
          top: height * 0.2,
          width: width * 0.52,
          height: height * 0.44,
          background: themeTokens.finalBloom,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: themeTokens.topBottomFilm,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: gridOpacity,
          backgroundImage: `repeating-linear-gradient(0deg, ${themeTokens.gridLine} 0 1px, transparent 1px 6vh), repeating-linear-gradient(90deg, ${themeTokens.gridLine} 0 1px, transparent 1px 6vw)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
