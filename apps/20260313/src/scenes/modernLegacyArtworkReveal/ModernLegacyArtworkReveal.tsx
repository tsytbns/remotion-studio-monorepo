import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { modernLegacyTokens } from "../modernLegacyOpening/variantTokens.modernLegacy";
import { resolveTokens } from "../modernLegacyOpening/tokens";
import { getModernLegacyArtworkRecord } from "./data";
import { ArchiveInfoPlate } from "./components/ArchiveInfoPlate";
import { ArtworkStage } from "./components/ArtworkStage";
import { BackgroundWash } from "./components/BackgroundWash";
import { CollectionFrame } from "./components/CollectionFrame";

export type FrameRect = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export const artworkPositionSchema = z.object({
  fit: z.enum(["contain", "cover"]),
  x: z.enum(["left", "center", "right"]),
  y: z.enum(["upper", "center", "lower"]),
  scale: z.number().optional(),
});

export const layoutVariantSchema = z.enum(["catalog", "registry", "index"]);

export const modernLegacyArtworkRevealSchema = z.object({
  imageSrc: z.string(),
  artist: z.string(),
  title: z.string(),
  year: z.string(),
  medium: z.string(),
  lotNo: z.string(),
  estimate: z.string().nullable().optional(),
  artworkPosition: artworkPositionSchema,
  layoutVariant: layoutVariantSchema,
  archiveLabel: z.string().nullable().optional(),
});

export type ModernLegacyArtworkPosition = z.infer<typeof artworkPositionSchema>;
export type ModernLegacyArtworkLayoutVariant = z.infer<
  typeof layoutVariantSchema
>;
export type ModernLegacyArtworkRevealProps = z.infer<
  typeof modernLegacyArtworkRevealSchema
>;

const defaultRecord = getModernLegacyArtworkRecord("001");

export const modernLegacyArtworkRevealDefaults: ModernLegacyArtworkRevealProps =
  {
    imageSrc: defaultRecord.imageSrc,
    artist: defaultRecord.artist,
    title: defaultRecord.title,
    year: defaultRecord.year,
    medium: defaultRecord.medium,
    lotNo: defaultRecord.lotNo,
    estimate: defaultRecord.estimate,
    archiveLabel: defaultRecord.archiveLabel,
    artworkPosition: {
      fit: "contain",
      x: "center",
      y: "center",
      scale: 1,
    },
    layoutVariant: "catalog",
  };

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const getLayout = (
  variant: ModernLegacyArtworkLayoutVariant,
  width: number,
  height: number,
) => {
  if (variant === "registry") {
    return {
      plateRect: {
        height: height * 0.19,
        width: width * 0.58,
        x: width * 0.21,
        y: height * 0.74,
      },
      stageRect: {
        height: height * 0.52,
        width: width * 0.72,
        x: width * 0.14,
        y: height * 0.16,
      },
    };
  }

  if (variant === "index") {
    return {
      plateRect: {
        height: height * 0.22,
        width: width * 0.3,
        x: width * 0.58,
        y: height * 0.72,
      },
      stageRect: {
        height: height * 0.58,
        width: width * 0.68,
        x: width * 0.11,
        y: height * 0.12,
      },
    };
  }

  return {
    plateRect: {
      height: height * 0.2,
      width: width * 0.56,
      x: width * 0.11,
      y: height * 0.76,
    },
    stageRect: {
      height: height * 0.56,
      width: width * 0.76,
      x: width * 0.12,
      y: height * 0.14,
    },
  };
};

export const ModernLegacyArtworkReveal: React.FC<
  ModernLegacyArtworkRevealProps
> = ({
  imageSrc,
  artist,
  title,
  year,
  medium,
  lotNo,
  estimate,
  artworkPosition,
  layoutVariant,
  archiveLabel,
}) => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyTokens, { width, height });
  const backgroundProgress = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const artworkProgress = interpolate(frame, [12, 34], [0, 1], {
    easing: Easing.bezier(0.2, 0.06, 0.16, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const plateProgress = interpolate(frame, [26, 46], [0, 1], {
    easing: Easing.bezier(0.18, 0.04, 0.16, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const { plateRect, stageRect } = getLayout(layoutVariant, width, height);
  const frameOpacity = 0.42 + backgroundProgress * 0.58;
  const plateTranslateY = (1 - plateProgress) * Math.min(width, height) * 0.02;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.palette.canvas,
        overflow: "hidden",
      }}
    >
      <BackgroundWash
        width={width}
        height={height}
        layoutVariant={layoutVariant}
        progress={backgroundProgress}
        tokens={tokens}
      />
      <CollectionFrame rect={stageRect} opacity={frameOpacity} tokens={tokens}>
        <ArtworkStage
          artworkPosition={artworkPosition}
          imageSrc={imageSrc}
          progress={artworkProgress}
          rect={stageRect}
          tokens={tokens}
        />
      </CollectionFrame>
      <ArchiveInfoPlate
        archiveLabel={archiveLabel}
        artist={artist}
        estimate={estimate}
        layoutVariant={layoutVariant}
        lotNo={lotNo}
        medium={medium}
        opacity={clamp(plateProgress, 0, 1)}
        rect={plateRect}
        title={title}
        tokens={tokens}
        translateY={plateTranslateY}
        year={year}
      />
    </AbsoluteFill>
  );
};
