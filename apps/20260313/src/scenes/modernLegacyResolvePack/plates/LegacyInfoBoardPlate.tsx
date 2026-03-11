import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { useAuctionTypographyReady } from "../../../designSystem/useAuctionTypographyReady";
import { ArchivePanel } from "../components/ArchivePanel";
import { DoubleRule } from "../components/DoubleRule";
import { LegacyMeta } from "../components/LegacyMeta";
import { MLMainTitle } from "../components/MLMainTitle";
import { PreviewSurface } from "../components/PreviewSurface";
import type { MLInfoBoardMode, MLInfoBoardProps } from "../types";
import { resolveTokens } from "../tokens";
import { modernLegacyResolveTokens } from "../variantTokens.modernLegacy";
import { BackgroundFieldLayer } from "../utility/LegacyBackgroundLoop";
import { progress, toCoreFrame } from "../utils/timing";

export const legacyInfoBoardSchema = z.object({
  mode: z.enum(["preview", "auction", "talk"]),
  title: z.string(),
  lines: z.array(z.string()),
  venue: z.string(),
  showSecondaryMeta: z.boolean(),
  backgroundImageSrc: z.string().nullable().optional(),
  alignment: z.enum(["left", "center"]),
  holdFrames: z.number(),
  transparentBackground: z.boolean(),
  previewBackground: z.enum(["none", "checker"]).optional(),
});

export const legacyInfoBoardDefaults: MLInfoBoardProps = {
  mode: "preview",
  title: "MODERN LEGACY",
  lines: [
    "14 MARCH 2026",
    "AUCTION 14:00",
    "12 MARCH 11:00-19:00",
    "13 MARCH 11:00-19:00",
    "14 MARCH 11:00-13:00",
  ],
  venue: "Auction: Tokyo International Forum Hall D5\nPreview: Hall D7",
  showSecondaryMeta: true,
  backgroundImageSrc: null,
  alignment: "left",
  holdFrames: 72,
  transparentBackground: false,
  previewBackground: "none",
};

const getModeLabel = (mode: MLInfoBoardMode) => {
  if (mode === "talk") {
    return "SPECIAL PROGRAM";
  }

  if (mode === "auction") {
    return "AUCTION BOARD";
  }

  return "PREVIEW / AUCTION";
};

const getSectionLabel = (mode: MLInfoBoardMode) => {
  if (mode === "talk") {
    return "TALK EVENT";
  }

  if (mode === "auction") {
    return "AUCTION";
  }

  return "PROGRAM";
};

export const LegacyInfoBoardPlate: React.FC<MLInfoBoardProps> = ({
  alignment,
  backgroundImageSrc,
  lines,
  mode,
  previewBackground = "none",
  showSecondaryMeta,
  title,
  transparentBackground,
  venue,
}) => {
  useAuctionTypographyReady();

  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyResolveTokens, { width, height });
  const safeMargins = {
    x: tokens.safeArea.x,
    y: tokens.safeArea.y,
  };
  const coreFrame = toCoreFrame(frame);
  const backgroundProgress = progress(
    coreFrame,
    tokens.motion.info.backgroundIn,
  );
  const structureProgress = progress(coreFrame, tokens.motion.info.structureIn);
  const textProgress = progress(coreFrame, tokens.motion.info.textIn);
  const showBackground = !transparentBackground;
  const panelWidth = tokens.layout.infoPanelWidth;
  const panelX =
    alignment === "center"
      ? (width - panelWidth) / 2
      : safeMargins.x + tokens.layout.fieldLeftBias * 0.4;
  const panelY = height * 0.42;
  const columnGap = tokens.layout.infoColumnGap;
  const primaryWidth = showSecondaryMeta
    ? tokens.layout.infoPrimaryWidth
    : panelWidth - tokens.layout.infoPanelPaddingX * 2;
  const secondaryWidth = showSecondaryMeta
    ? tokens.layout.infoSecondaryWidth
    : 0;
  const venueLines = venue
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {!showBackground ? (
        <PreviewSurface
          previewBackground={previewBackground}
          renderSafeGuide={false}
          safeMargins={safeMargins}
          tokens={tokens}
        />
      ) : null}
      {showBackground ? (
        <>
          <BackgroundFieldLayer
            durationInFrames={durationInFrames}
            frame={frame}
            motionAmount={0.28}
            opacity={0.88 + backgroundProgress * 0.12}
            previewBackground="none"
            renderMode="full"
            renderSafeGuide={false}
            safeMargins={safeMargins}
          />
          {backgroundImageSrc ? (
            <AbsoluteFill style={{ opacity: 0.08 + backgroundProgress * 0.06 }}>
              <Img
                src={backgroundImageSrc}
                style={{
                  filter: "grayscale(1) saturate(0.34) brightness(0.96)",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scale(1.02)",
                  width: "100%",
                }}
              />
            </AbsoluteFill>
          ) : null}
        </>
      ) : null}
      <div
        style={{
          left: panelX,
          position: "absolute",
          top: panelY,
          width: panelWidth,
        }}
      >
        <ArchivePanel
          align={alignment === "center" ? "center" : "left"}
          height={tokens.layout.infoPanelMinHeight}
          opacity={structureProgress}
          renderMode={transparentBackground ? "alpha" : "full"}
          tokens={tokens}
          translateY={(1 - structureProgress) * tokens.motion.info.bodyRise}
          width={panelWidth}
        >
          <div
            style={{
              boxSizing: "border-box",
              display: "grid",
              gap: tokens.layout.infoBlockGap,
              minHeight: tokens.layout.infoPanelMinHeight,
              paddingBottom: tokens.layout.infoPanelPaddingY,
              paddingLeft: tokens.layout.infoPanelPaddingX,
              paddingRight: tokens.layout.infoPanelPaddingX,
              paddingTop: tokens.layout.infoPanelPaddingY,
            }}
          >
            <LegacyMeta
              align={alignment === "center" ? "center" : "left"}
              items={["SBI ART AUCTION", getModeLabel(mode)]}
              opacity={0.92}
              tokens={tokens}
            />
            <MLMainTitle
              align={alignment === "center" ? "center" : "left"}
              maxWidth={tokens.layout.infoPrimaryWidth}
              progress={textProgress}
              revealStyle="soft-mask"
              text={title}
              tokens={tokens}
              tone={
                transparentBackground
                  ? tokens.palette.ivory
                  : tokens.palette.ink
              }
            />
            <DoubleRule
              align={alignment === "center" ? "center" : "left"}
              opacity={0.26 + structureProgress * 0.74}
              progress={structureProgress}
              tokens={tokens}
              width={tokens.layout.openingRuleWidth}
            />
            <div
              style={{
                alignItems: "flex-start",
                display: "flex",
                gap: columnGap,
                justifyContent:
                  alignment === "center" ? "center" : "space-between",
                transform: `translateY(${(1 - textProgress) * tokens.motion.info.bodyRise}px)`,
              }}
            >
              <div
                style={{
                  color: transparentBackground
                    ? tokens.palette.paleSmoke
                    : tokens.palette.textSecondary,
                  display: "grid",
                  gap: tokens.layout.openingSubtitleGap * 0.5,
                  maxWidth: primaryWidth,
                }}
              >
                <div
                  style={{
                    color: transparentBackground
                      ? tokens.palette.smoke
                      : tokens.palette.textMeta,
                    fontFamily: tokens.typography.fonts.meta,
                    fontSize: tokens.typography.label.fontSize,
                    fontWeight: tokens.typography.label.fontWeight,
                    letterSpacing: tokens.typography.label.letterSpacing,
                    textTransform: tokens.typography.label.textTransform,
                  }}
                >
                  {getSectionLabel(mode)}
                </div>
                {lines.map((line, index) => {
                  const isLead = index < 2;

                  return (
                    <div
                      key={`${line}-${index}`}
                      style={{
                        color: transparentBackground
                          ? isLead
                            ? tokens.palette.ivory
                            : tokens.palette.paleSmoke
                          : isLead
                            ? tokens.palette.ink
                            : tokens.palette.textSecondary,
                        fontFamily: tokens.typography.fonts.serif,
                        fontSize: isLead
                          ? tokens.typography.subtitle.fontSize
                          : tokens.typography.subtitle.fontSize * 0.86,
                        fontWeight: isLead ? 600 : 500,
                        letterSpacing: isLead ? "0.028em" : "0.018em",
                        lineHeight: tokens.typography.subtitle.lineHeight,
                      }}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
              {showSecondaryMeta ? (
                <div
                  style={{
                    color: transparentBackground
                      ? tokens.palette.paleSmoke
                      : tokens.palette.textSecondary,
                    display: "grid",
                    gap: tokens.layout.openingSubtitleGap * 0.4,
                    maxWidth: secondaryWidth,
                  }}
                >
                  <div
                    style={{
                      color: transparentBackground
                        ? tokens.palette.smoke
                        : tokens.palette.textMeta,
                      fontFamily: tokens.typography.fonts.meta,
                      fontSize: tokens.typography.label.fontSize,
                      fontWeight: tokens.typography.label.fontWeight,
                      letterSpacing: tokens.typography.label.letterSpacing,
                      textTransform: tokens.typography.label.textTransform,
                    }}
                  >
                    VENUE
                  </div>
                  {venueLines.map((line, index) => {
                    return (
                      <div
                        key={`${line}-${index}`}
                        style={{
                          fontFamily: tokens.typography.fonts.serif,
                          fontSize: tokens.typography.subtitle.fontSize * 0.78,
                          fontWeight: 500,
                          letterSpacing: "0.016em",
                          lineHeight: 1.32,
                        }}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </ArchivePanel>
      </div>
    </AbsoluteFill>
  );
};
