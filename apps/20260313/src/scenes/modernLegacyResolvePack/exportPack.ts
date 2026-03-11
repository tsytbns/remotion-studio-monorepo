import type { CalculateMetadataFunction } from "remotion";
import {
  legacyInfoBoardDefaults,
  LegacyInfoBoardPlate,
  legacyInfoBoardSchema,
} from "./plates/LegacyInfoBoardPlate";
import {
  legacyOpeningPlateDefaults,
  LegacyOpeningPlate,
  legacyOpeningPlateSchema,
} from "./plates/LegacyOpeningPlate";
import {
  legacyTextAnimationDefaults,
  legacyTextAnimationSchema,
  MLMetaAlpha,
  MLSubtitleAlpha,
  MLTitleAlpha,
} from "./text/LegacyTextAnimations";
import type {
  LegacyOpeningPlateProps,
  MLExportPackItem,
  MLInfoBoardProps,
  MLStructuralOverlayProps,
  MLTextAnimationProps,
} from "./types";
import {
  structuralOverlayDefaults,
  structuralOverlaySchema,
  MLBridgeAlpha,
  MLFieldVeilAlpha,
  MLFrameAlpha,
  MLPanelAlpha,
  MLRulesAlpha,
} from "./overlays/StructuralOverlays";
import {
  legacyBackgroundLoopDefaults,
  LegacyBackgroundLoop,
  legacyBackgroundLoopSchema,
} from "./utility/LegacyBackgroundLoop";
import {
  legacyStillHoldDefaults,
  LegacyStillHold,
  legacyStillHoldSchema,
} from "./utility/LegacyStillHold";
import {
  getInfoDuration,
  getOpeningDuration,
  getTextDuration,
} from "./utils/timing";

export const resolvePackMetadataDefaults = {
  defaultCodec: "prores" as const,
  defaultPixelFormat: "yuva444p10le" as const,
  defaultProResProfile: "4444" as const,
  defaultVideoImageFormat: "png" as const,
};

const openingMetadata: CalculateMetadataFunction<
  LegacyOpeningPlateProps
> = async ({ props }) => {
  return {
    ...resolvePackMetadataDefaults,
    durationInFrames: getOpeningDuration(props.holdFrames),
  };
};

const infoBoardMetadata: CalculateMetadataFunction<MLInfoBoardProps> = async ({
  props,
}) => {
  return {
    ...resolvePackMetadataDefaults,
    durationInFrames: getInfoDuration(props.holdFrames),
  };
};

const textMetadata: CalculateMetadataFunction<MLTextAnimationProps> = async ({
  props,
}) => {
  return {
    ...resolvePackMetadataDefaults,
    durationInFrames: getTextDuration(props.holdFrames),
  };
};

const overlayMetadata: CalculateMetadataFunction<
  MLStructuralOverlayProps
> = async ({ props }) => {
  return {
    ...resolvePackMetadataDefaults,
    durationInFrames: props.durationFrames,
  };
};

const fixedMetadata = async () => {
  return resolvePackMetadataDefaults;
};

const titleAlphaDefaults: MLTextAnimationProps = {
  ...legacyTextAnimationDefaults,
  text: "MODERN LEGACY",
  colorVariant: "ivory",
};

const subtitleAlphaDefaults: MLTextAnimationProps = {
  ...legacyTextAnimationDefaults,
  text: "An Important Japanese Collection of 20th & 21st Century Masters",
  colorVariant: "smoke",
  revealStyle: "lift",
};

const metaAlphaDefaults: MLTextAnimationProps = {
  ...legacyTextAnimationDefaults,
  text: "14 MARCH 2026 · TOKYO 2026",
  colorVariant: "smoke",
  revealStyle: "lift",
};

const rulesDefaults: MLStructuralOverlayProps = {
  ...structuralOverlayDefaults,
  durationFrames: 90,
  align: "left",
};

const panelDefaults: MLStructuralOverlayProps = {
  ...structuralOverlayDefaults,
  durationFrames: 120,
  align: "left",
};

const frameDefaults: MLStructuralOverlayProps = {
  ...structuralOverlayDefaults,
  durationFrames: 90,
  align: "left",
  motionAmount: 0,
};

const fieldDefaults: MLStructuralOverlayProps = {
  ...structuralOverlayDefaults,
  durationFrames: 120,
  align: "center",
};

const bridgeDefaults: MLStructuralOverlayProps = {
  ...structuralOverlayDefaults,
  durationFrames: 90,
  align: "left",
};

export const modernLegacyResolvePackItems: readonly MLExportPackItem[] = [
  // Resolve-ready opening plate with background, panel, rule, title, subtitle, and meta.
  {
    id: "ML-Opening-Full",
    folder: "Full-Plates",
    component: LegacyOpeningPlate,
    schema: legacyOpeningPlateSchema,
    defaultProps: legacyOpeningPlateDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: getOpeningDuration(legacyOpeningPlateDefaults.holdFrames),
    description: "Full opening plate for Resolve editorial assembly.",
    calculateMetadata: openingMetadata,
  },
  // Program-note board for preview / auction / talk information.
  {
    id: "ML-InfoBoard-Full",
    folder: "Full-Plates",
    component: LegacyInfoBoardPlate,
    schema: legacyInfoBoardSchema,
    defaultProps: legacyInfoBoardDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: getInfoDuration(legacyInfoBoardDefaults.holdFrames),
    description: "Full institutional information board.",
    calculateMetadata: infoBoardMetadata,
  },
  // Primary title alpha element for compositing over live-action or still art.
  {
    id: "ML-Title-Alpha",
    folder: "Text-Alpha",
    component: MLTitleAlpha,
    schema: legacyTextAnimationSchema,
    defaultProps: titleAlphaDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: getTextDuration(titleAlphaDefaults.holdFrames),
    description: "Main title alpha overlay.",
    calculateMetadata: textMetadata,
  },
  // Subtitle alpha element for collection descriptor lines.
  {
    id: "ML-Subtitle-Alpha",
    folder: "Text-Alpha",
    component: MLSubtitleAlpha,
    schema: legacyTextAnimationSchema,
    defaultProps: subtitleAlphaDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: getTextDuration(subtitleAlphaDefaults.holdFrames),
    description: "Subtitle alpha overlay.",
    calculateMetadata: textMetadata,
  },
  // Meta alpha element for date / venue / Tokyo lines.
  {
    id: "ML-Meta-Alpha",
    folder: "Text-Alpha",
    component: MLMetaAlpha,
    schema: legacyTextAnimationSchema,
    defaultProps: metaAlphaDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: getTextDuration(metaAlphaDefaults.holdFrames),
    description: "Meta text alpha overlay.",
    calculateMetadata: textMetadata,
  },
  // Double-rule alpha overlay to anchor titles without adding full plates.
  {
    id: "ML-Rules-Alpha",
    folder: "Structural-Alpha",
    component: MLRulesAlpha,
    schema: structuralOverlaySchema,
    defaultProps: rulesDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: rulesDefaults.durationFrames,
    description: "Thin gold double-rule alpha overlay.",
    calculateMetadata: overlayMetadata,
  },
  // Panel alpha overlay for quiet architectural grounding.
  {
    id: "ML-Panel-Alpha",
    folder: "Structural-Alpha",
    component: MLPanelAlpha,
    schema: structuralOverlaySchema,
    defaultProps: panelDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: panelDefaults.durationFrames,
    description: "Translucent archival panel alpha overlay.",
    calculateMetadata: overlayMetadata,
  },
  // Frame alpha overlay with scaffold marks for institutional compositing.
  {
    id: "ML-Frame-Alpha",
    folder: "Structural-Alpha",
    component: MLFrameAlpha,
    schema: structuralOverlaySchema,
    defaultProps: frameDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: frameDefaults.durationFrames,
    description: "Archival frame alpha overlay.",
    calculateMetadata: overlayMetadata,
  },
  // Broad field veil alpha overlay for quieting live-action plates.
  {
    id: "ML-FieldVeil-Alpha",
    folder: "Structural-Alpha",
    component: MLFieldVeilAlpha,
    schema: structuralOverlaySchema,
    defaultProps: fieldDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: fieldDefaults.durationFrames,
    description: "Subtle field veil alpha overlay.",
    calculateMetadata: overlayMetadata,
  },
  // Composite bridge element for cross-dissolves and shot transitions.
  {
    id: "ML-Bridge-Alpha",
    folder: "Structural-Alpha",
    component: MLBridgeAlpha,
    schema: structuralOverlaySchema,
    defaultProps: bridgeDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: bridgeDefaults.durationFrames,
    description: "Bridge alpha overlay for transitions.",
    calculateMetadata: overlayMetadata,
  },
  // Static 2-second hold plate with faint frame and field.
  {
    id: "ML-StillHold-2s",
    folder: "Utility",
    component: LegacyStillHold,
    schema: legacyStillHoldSchema,
    defaultProps: legacyStillHoldDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 60,
    description: "Two-second still hold plate.",
    calculateMetadata: fixedMetadata,
  },
  // Static 4-second hold plate with faint frame and field.
  {
    id: "ML-StillHold-4s",
    folder: "Utility",
    component: LegacyStillHold,
    schema: legacyStillHoldSchema,
    defaultProps: legacyStillHoldDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 120,
    description: "Four-second still hold plate.",
    calculateMetadata: fixedMetadata,
  },
  // Opaque institutional background loop for turnkey edits.
  {
    id: "ML-BackgroundLoop-Full",
    folder: "Utility",
    component: LegacyBackgroundLoop,
    schema: legacyBackgroundLoopSchema,
    defaultProps: legacyBackgroundLoopDefaults,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 180,
    description: "Opaque background loop.",
    calculateMetadata: fixedMetadata,
  },
  // Transparent optional background field overlay for Resolve stacking.
  {
    id: "ML-BackgroundLoop-AlphaOptional",
    folder: "Utility",
    component: LegacyBackgroundLoop,
    schema: legacyBackgroundLoopSchema,
    defaultProps: {
      ...legacyBackgroundLoopDefaults,
      renderMode: "alpha",
    },
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 180,
    description: "Transparent background loop overlay.",
    calculateMetadata: fixedMetadata,
  },
] satisfies readonly MLExportPackItem[];

export const modernLegacyResolvePackFolders = [
  "Full-Plates",
  "Text-Alpha",
  "Structural-Alpha",
  "Utility",
] as const;
