import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import { modernLegacyTokens } from "./variantTokens.modernLegacy";
import { LegacyTitleBlock } from "./components/LegacyTitleBlock";
import { resolveTokens } from "./tokens";

export const modernLegacyOpeningSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  date: z.string().nullable().optional(),
  venue: z.string(),
  showMeta: z.boolean(),
  backgroundImageSrc: z.string().nullable().optional(),
  alignment: z.enum(["center", "lower"]),
  durationVariant: z.enum(["8s", "12s"]),
});

export type ModernLegacyAlignment = z.infer<
  typeof modernLegacyOpeningSchema
>["alignment"];
export type ModernLegacyDurationVariant = z.infer<
  typeof modernLegacyOpeningSchema
>["durationVariant"];
export type ModernLegacyOpeningProps = z.infer<
  typeof modernLegacyOpeningSchema
>;

export const modernLegacyOpeningDefaults: ModernLegacyOpeningProps = {
  title: "MODERN LEGACY",
  subtitle: "An Important Japanese Collection of 20th & 21st Century Masters",
  date: "14 MARCH 2026",
  venue: "TOKYO 2026",
  showMeta: true,
  backgroundImageSrc: null,
  alignment: "lower",
  durationVariant: "8s",
};

export const calculateModernLegacyOpeningMetadata: CalculateMetadataFunction<
  ModernLegacyOpeningProps
> = async ({ props }) => {
  return {
    durationInFrames: props.durationVariant === "12s" ? 360 : 240,
  };
};

const getProgress = (
  frame: number,
  range: readonly number[],
  easing?: (input: number) => number,
) => {
  return interpolate(frame, range, [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const ModernLegacyOpening: React.FC<ModernLegacyOpeningProps> = ({
  title,
  subtitle,
  date,
  venue,
  showMeta,
  backgroundImageSrc,
  alignment,
}) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyTokens, { width, height });
  const contentWidth = Math.min(
    tokens.layout.contentMaxWidth,
    width - tokens.safeArea.x * 2,
  );
  const panelWidth = Math.min(tokens.layout.panelWidth, contentWidth);
  const backgroundOpacity = interpolate(
    frame,
    tokens.motion.frames.backgroundIn,
    [tokens.motion.backgroundStartOpacity, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const panelProgress = spring({
    frame: frame - tokens.motion.frames.panelIn[0],
    fps,
    config: tokens.motion.spring,
    durationInFrames:
      tokens.motion.frames.panelIn[1] - tokens.motion.frames.panelIn[0],
  });
  const titleProgress = spring({
    frame: frame - tokens.motion.frames.titleIn[0],
    fps,
    config: tokens.motion.spring,
    durationInFrames:
      tokens.motion.frames.titleIn[1] - tokens.motion.frames.titleIn[0],
  });
  const ruleProgress = getProgress(
    frame,
    tokens.motion.frames.ruleIn,
    Easing.bezier(0.28, 0.04, 0.16, 1),
  );
  const subtitleProgress = getProgress(
    frame,
    tokens.motion.frames.subtitleIn,
    Easing.bezier(0.22, 0.06, 0.16, 1),
  );
  const showBackgroundImage =
    typeof backgroundImageSrc === "string" &&
    backgroundImageSrc.trim().length > 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.palette.canvas,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(circle at 50% 16%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.14) 28%, rgba(255, 255, 255, 0) 58%)`,
            `radial-gradient(ellipse 90% 76% at 50% 100%, ${tokens.palette.deepGreenWash} 0%, rgba(32, 50, 41, 0) 72%)`,
            `linear-gradient(180deg, ${tokens.palette.ivory} 0%, ${tokens.palette.canvas} 52%, ${tokens.palette.canvasShade} 100%)`,
          ].join(", "),
        }}
      />
      {showBackgroundImage ? (
        <AbsoluteFill
          style={{
            opacity: tokens.imageTreatment.opacity,
          }}
        >
          <Img
            src={backgroundImageSrc}
            style={{
              filter: `grayscale(${tokens.imageTreatment.grayscale}) saturate(${tokens.imageTreatment.saturation}) brightness(${tokens.imageTreatment.brightness})`,
              height: "100%",
              objectFit: "cover",
              transform: "scale(1.03)",
              width: "100%",
            }}
          />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill
        style={{
          background: [
            `linear-gradient(180deg, rgba(247, 243, 234, ${tokens.imageTreatment.washOpacity}) 0%, rgba(247, 243, 234, 0.14) 42%, rgba(247, 243, 234, 0.52) 100%)`,
            `radial-gradient(ellipse 110% 82% at 50% 50%, rgba(255, 255, 255, 0) 56%, rgba(32, 50, 41, ${tokens.imageTreatment.vignetteOpacity}) 100%)`,
          ].join(", "),
          opacity: backgroundOpacity,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: tokens.safeArea.y,
          paddingLeft: tokens.safeArea.x,
          paddingRight: tokens.safeArea.x,
          paddingTop: tokens.safeArea.y,
        }}
      >
        <LegacyTitleBlock
          title={title}
          subtitle={subtitle}
          date={date}
          venue={venue}
          showMeta={showMeta}
          alignment={alignment}
          panelProgress={panelProgress}
          ruleProgress={ruleProgress}
          titleProgress={titleProgress}
          subtitleProgress={subtitleProgress}
          eyebrowLabel="SBI ART AUCTION"
          tokens={tokens}
          contentWidth={contentWidth}
          panelWidth={panelWidth}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
