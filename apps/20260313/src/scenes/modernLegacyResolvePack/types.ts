import type React from "react";
import type { CalculateMetadataFunction } from "remotion";
import type { z } from "zod";

export type MLRenderMode = "full" | "alpha";
export type MLAlign = "left" | "center" | "right";
export type MLColorVariant = "ivory" | "gold" | "smoke";
export type MLRevealStyle = "soft-mask" | "lift" | "line-coupled";
export type MLPreviewBackground = "none" | "checker";

export type MLSafeMargins = {
  x: number;
  y: number;
};

export type LegacyOpeningPlateRenderLayer =
  | "full"
  | "title"
  | "rule"
  | "panel"
  | "meta";

export type LegacyOpeningPlateProps = {
  title: string;
  subtitle: string;
  date?: string | null;
  venue: string;
  transparentBackground: boolean;
  renderLayer: LegacyOpeningPlateRenderLayer;
  holdFrames: number;
  alignment: "center" | "lower";
  showMeta: boolean;
  backgroundImageSrc?: string | null;
  previewBackground?: MLPreviewBackground;
};

export type MLTextAnimationProps = {
  text: string;
  colorVariant: MLColorVariant;
  align: "left" | "center";
  revealStyle: MLRevealStyle;
  holdFrames: number;
  renderSafeGuide: boolean;
  previewBackground: MLPreviewBackground;
};

export type MLInfoBoardMode = "preview" | "auction" | "talk";

export type MLInfoBoardProps = {
  mode: MLInfoBoardMode;
  title: string;
  lines: string[];
  venue: string;
  showSecondaryMeta: boolean;
  backgroundImageSrc?: string | null;
  alignment: "left" | "center";
  holdFrames: number;
  transparentBackground: boolean;
  previewBackground?: MLPreviewBackground;
};

export type MLStructuralOverlayProps = {
  opacity: number;
  motionAmount: number;
  align: MLAlign;
  durationFrames: number;
  safeMargins: MLSafeMargins;
  previewBackground: MLPreviewBackground;
  renderSafeGuide: boolean;
};

export type MLBackgroundLoopProps = {
  renderMode: MLRenderMode;
  opacity: number;
  motionAmount: number;
  previewBackground: MLPreviewBackground;
  renderSafeGuide: boolean;
};

export type MLStillHoldProps = {
  renderMode: MLRenderMode;
  opacity: number;
  previewBackground: MLPreviewBackground;
  renderSafeGuide: boolean;
};

export type MLExportPackFolder =
  | "Full-Plates"
  | "Text-Alpha"
  | "Structural-Alpha"
  | "Utility";

export type MLExportPackItem = {
  id: string;
  folder: MLExportPackFolder;
  // Registry boundary for heterogeneous composition prop types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  schema: z.ZodTypeAny;
  defaultProps: Record<string, unknown>;
  width: 1920;
  height: 1080;
  fps: 30;
  durationInFrames: number;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calculateMetadata?: CalculateMetadataFunction<any>;
};
