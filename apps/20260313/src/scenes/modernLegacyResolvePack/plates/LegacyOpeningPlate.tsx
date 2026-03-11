import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { useAuctionTypographyReady } from "../../../designSystem/useAuctionTypographyReady";
import { ArchivePanel } from "../components/ArchivePanel";
import { LegacyTitleBlock } from "../components/LegacyTitleBlock";
import { PreviewSurface } from "../components/PreviewSurface";
import type { LegacyOpeningPlateProps } from "../types";
import { resolveTokens } from "../tokens";
import { modernLegacyResolveTokens } from "../variantTokens.modernLegacy";
import { BackgroundFieldLayer } from "../utility/LegacyBackgroundLoop";
import { progress, toCoreFrame } from "../utils/timing";

export const legacyOpeningPlateSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  date: z.string().nullable().optional(),
  venue: z.string(),
  transparentBackground: z.boolean(),
  renderLayer: z.enum(["full", "title", "rule", "panel", "meta"]),
  holdFrames: z.number(),
  alignment: z.enum(["center", "lower"]),
  showMeta: z.boolean(),
  backgroundImageSrc: z.string().nullable().optional(),
  previewBackground: z.enum(["none", "checker"]).optional(),
});

export const legacyOpeningPlateDefaults: LegacyOpeningPlateProps = {
  title: "MODERN LEGACY",
  subtitle: "An Important Japanese Collection of 20th & 21st Century Masters",
  date: "14 MARCH 2026",
  venue: "TOKYO 2026",
  transparentBackground: false,
  renderLayer: "full",
  holdFrames: 48,
  alignment: "lower",
  showMeta: true,
  backgroundImageSrc: null,
  previewBackground: "none",
};

export const LegacyOpeningPlate: React.FC<LegacyOpeningPlateProps> = ({
  alignment,
  backgroundImageSrc,
  date,
  previewBackground = "none",
  renderLayer,
  showMeta,
  subtitle,
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
    tokens.motion.opening.backgroundIn,
  );
  const structureProgress = progress(
    coreFrame,
    tokens.motion.opening.structureIn,
  );
  const titleProgress = progress(coreFrame, tokens.motion.opening.titleIn);
  const subtitleProgress = progress(
    coreFrame,
    tokens.motion.opening.subtitleIn,
  );
  const metaProgress = progress(coreFrame, tokens.motion.opening.metaIn);
  const showPanel = renderLayer === "full" || renderLayer === "panel";
  const showBackground = renderLayer === "full" && !transparentBackground;
  const contentWidth = tokens.layout.openingPanelWidth;
  const contentX =
    alignment === "center"
      ? (width - contentWidth) / 2
      : safeMargins.x + tokens.layout.fieldLeftBias * 0.5;
  const contentY =
    alignment === "center"
      ? height * 0.3
      : height * 0.46 - tokens.layout.openingPanelMinHeight * 0.22;

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
            motionAmount={0.32}
            opacity={0.86 + backgroundProgress * 0.14}
            previewBackground="none"
            renderMode="full"
            renderSafeGuide={false}
            safeMargins={safeMargins}
          />
          {backgroundImageSrc ? (
            <AbsoluteFill
              style={{
                opacity: 0.1 + backgroundProgress * 0.08,
              }}
            >
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
          left: contentX,
          position: "absolute",
          top: contentY,
          width: contentWidth,
        }}
      >
        {showPanel ? (
          <ArchivePanel
            align={alignment === "center" ? "center" : "left"}
            height={tokens.layout.openingPanelMinHeight}
            opacity={structureProgress}
            renderMode={transparentBackground ? "alpha" : "full"}
            tokens={tokens}
            translateY={
              (1 - structureProgress) * tokens.motion.opening.panelRise
            }
            width={contentWidth}
          >
            <div
              style={{
                boxSizing: "border-box",
                display: "grid",
                minHeight: tokens.layout.openingPanelMinHeight,
                paddingBottom: tokens.layout.openingPanelPaddingBottom,
                paddingLeft: tokens.layout.openingPanelPaddingX,
                paddingRight: tokens.layout.openingPanelPaddingX,
                paddingTop: tokens.layout.openingPanelPaddingTop,
              }}
            >
              <LegacyTitleBlock
                alignment={alignment}
                date={date}
                metaProgress={metaProgress}
                renderLayer={renderLayer}
                renderMode={transparentBackground ? "alpha" : "full"}
                ruleProgress={structureProgress}
                showMeta={showMeta}
                subtitle={subtitle}
                subtitleProgress={subtitleProgress}
                title={title}
                titleProgress={titleProgress}
                tokens={tokens}
                venue={venue}
              />
            </div>
          </ArchivePanel>
        ) : (
          <LegacyTitleBlock
            alignment={alignment}
            date={date}
            metaProgress={metaProgress}
            renderLayer={renderLayer}
            renderMode="alpha"
            ruleProgress={structureProgress}
            showMeta={showMeta}
            subtitle={subtitle}
            subtitleProgress={subtitleProgress}
            title={title}
            titleProgress={titleProgress}
            tokens={tokens}
            venue={venue}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
