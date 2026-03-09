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
});

export type MintRippleBlocksBackgroundProps = z.infer<
  typeof mintRippleBlocksBackgroundSchema
>;

export const mintRippleBlocksBackgroundDefaults: MintRippleBlocksBackgroundProps =
  {
    aspectMode: "auto",
  };

const COLORS = {
  baseDark: "#0A5B55",
  base: "#0F7D74",
  baseLight: "#18A79B",
  panelDeep: "#084D48",
  panelMid: "#0D6E68",
  panelLight: "#159084",
  panelMist: "rgba(188,244,236,0.10)",
  edgeSoft: "rgba(255,255,255,0.05)",
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
  color: string;
  durationInFrames: number;
  name: BlockName;
  peakOpacity: number;
  portrait: NormalizedRect;
  startFrame: number;
  wide: NormalizedRect;
};

const BLOCKS: BlockDefinition[] = [
  {
    name: "echoA",
    wide: { x: 0, y: 0, w: 0.62, h: 0.38 },
    portrait: { x: 0, y: 0, w: 0.68, h: 0.34 },
    color: COLORS.baseLight,
    peakOpacity: 0.05,
    startFrame: 8,
    durationInFrames: 24,
  },
  {
    name: "heroDark",
    wide: { x: 0.3, y: 0.12, w: 0.7, h: 0.56 },
    portrait: { x: 0.2, y: 0.14, w: 0.8, h: 0.49 },
    color: COLORS.panelDeep,
    peakOpacity: 0.28,
    startFrame: 20,
    durationInFrames: 34,
  },
  {
    name: "topGlaze",
    wide: { x: 0.5, y: 0.12, w: 0.5, h: 0.27 },
    portrait: { x: 0.42, y: 0.14, w: 0.58, h: 0.23 },
    color: COLORS.panelLight,
    peakOpacity: 0.1,
    startFrame: 28,
    durationInFrames: 26,
  },
  {
    name: "bottomLeft",
    wide: { x: 0, y: 0.5, w: 0.5, h: 0.5 },
    portrait: { x: 0, y: 0.57, w: 0.44, h: 0.43 },
    color: COLORS.panelMid,
    peakOpacity: 0.2,
    startFrame: 42,
    durationInFrames: 32,
  },
  {
    name: "bottomRight",
    wide: { x: 0.3, y: 0.48, w: 0.53, h: 0.52 },
    portrait: { x: 0.22, y: 0.53, w: 0.56, h: 0.47 },
    color: COLORS.baseLight,
    peakOpacity: 0.14,
    startFrame: 52,
    durationInFrames: 36,
  },
  {
    name: "echoB",
    wide: { x: 0.38, y: 0.18, w: 0.62, h: 0.55 },
    portrait: { x: 0.34, y: 0.24, w: 0.66, h: 0.49 },
    color: COLORS.panelLight,
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

const revealEasing = Easing.bezier(0.16, 1, 0.3, 1);
const settleEasing = Easing.bezier(0.22, 0, 0.18, 1);
const sheenEasing = Easing.bezier(0.2, 0.04, 0.3, 1);

export const MintRippleBlocksBackground: React.FC<
  MintRippleBlocksBackgroundProps
> = ({ aspectMode }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const vw = width / 100;
  const vh = height / 100;
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
  const settleMultiplier = interpolate(frame, [96, 150], [1, 0.82], {
    easing: settleEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sheenWidth = vw * 22;
  const sheenTravel = interpolate(
    frame,
    [18, 92],
    [-sheenWidth * 2, width + sheenWidth * 2],
    {
      easing: sheenEasing,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const sheenOpacity = interpolate(
    frame,
    [18, 32, 78, 92],
    [0, 0.08, 0.06, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const borderWidth = Math.max(1, vmin * 0.11);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.base,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: baseOpacity,
          background: `linear-gradient(160deg, ${COLORS.baseDark} 0%, ${COLORS.base} 32%, ${COLORS.baseLight} 68%, ${COLORS.base} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: baseOpacity,
          background:
            "radial-gradient(circle at 50% 42%, rgba(192, 247, 238, 0.10) 0%, rgba(192, 247, 238, 0.05) 28%, rgba(192, 247, 238, 0) 68%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * 0.5 - width * 0.36,
          top: height * 0.5 - height * 0.29,
          width: width * 0.72,
          height: height * 0.58,
          background:
            "radial-gradient(circle at 50% 50%, rgba(188, 244, 236, 0.14) 0%, rgba(188, 244, 236, 0.06) 42%, rgba(188, 244, 236, 0) 78%)",
          filter: `blur(${vmin * 3.2}px)`,
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />
      {BLOCKS.map((block) => {
        const rect = mixRect(block.portrait, block.wide, aspectMix);
        const revealProgress = interpolate(
          frame,
          [block.startFrame, block.startFrame + block.durationInFrames],
          [0, 1],
          {
            easing: revealEasing,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        const blockOpacity =
          revealProgress * block.peakOpacity * settleMultiplier;
        const blockScale = interpolate(revealProgress, [0, 1], [0.985, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

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
              transform: `scale(${blockScale})`,
              transformOrigin: "top left",
              border: `${borderWidth}px solid ${COLORS.edgeSoft}`,
              boxSizing: "border-box",
              background: `linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 34%, rgba(0,0,0,0.05) 100%), ${block.color}`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: sheenTravel,
          top: -(vh * 18),
          width: sheenWidth,
          height: vh * 136,
          opacity: sheenOpacity,
          transform: "rotate(-18deg)",
          transformOrigin: "center",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(223,255,250,0.18) 18%, rgba(255,255,255,0.7) 50%, rgba(223,255,250,0.18) 82%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 92% 78% at 50% 50%, rgba(0,0,0,0) 36%, rgba(2, 42, 38, 0.14) 100%)`,
          opacity: 0.52,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 56%, rgba(15, 125, 116, 0.18) 0%, rgba(15, 125, 116, 0.1) 30%, rgba(15, 125, 116, 0) 68%)`,
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
          background:
            "radial-gradient(circle at 50% 50%, rgba(15,125,116,0.12) 0%, rgba(15,125,116,0.06) 48%, rgba(15,125,116,0) 100%)",
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
          border: `${Math.max(1, vmin * 0.06)}px solid ${COLORS.panelMist}`,
          opacity: 0.03,
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
          background:
            "radial-gradient(circle at 50% 50%, rgba(10,91,85,0.05) 0%, rgba(10,91,85,0.02) 50%, rgba(10,91,85,0) 100%)",
          opacity: 0.8,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, rgba(255,255,255,0.012) 0%, rgba(255,255,255,0) 24%, rgba(255,255,255,0) 76%, rgba(255,255,255,0.018) 100%)",
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
          background:
            "linear-gradient(90deg, rgba(8,77,72,0.08) 0%, rgba(8,77,72,0) 100%)",
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
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(4,53,48,0.08) 100%)",
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
          background:
            "linear-gradient(180deg, rgba(15,125,116,0.03) 0%, rgba(15,125,116,0.02) 45%, rgba(15,125,116,0.01) 100%)",
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
          border: `${Math.max(1, vmin * 0.04)}px solid rgba(255,255,255,0.02)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(24,167,155,0) 0%, rgba(24,167,155,0) 42%, rgba(0,0,0,0.05) 100%)",
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
          background:
            "radial-gradient(circle at 50% 50%, rgba(188,244,236,0.05) 0%, rgba(188,244,236,0.02) 52%, rgba(188,244,236,0) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.008) 0%, rgba(255,255,255,0) 16%, rgba(0,0,0,0) 84%, rgba(0,0,0,0.03) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.02,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 6vh), repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 6vw)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
