import React from "react";
import { fitText } from "@remotion/layout-utils";
import { ArchivePanel } from "../../modernLegacyOpening/components/ArchivePanel";
import { MicroMeta } from "../../modernLegacyOpening/components/MicroMeta";
import type { ResolvedTokens } from "../../modernLegacyOpening/tokens";
import type {
  ModernLegacyInfoBoardAlignment,
  ModernLegacyInfoBoardMode,
} from "../ModernLegacyInfoBoard";
import { MetaColumn } from "./MetaColumn";
import { RuleSet } from "./RuleSet";

export type LegacyInfoBoardProps = {
  alignment: ModernLegacyInfoBoardAlignment;
  boardProgress: number;
  lines: string[];
  mode: ModernLegacyInfoBoardMode;
  ruleProgress: number;
  showSecondaryMeta: boolean;
  textProgress: number;
  title: string;
  tokens: ResolvedTokens;
  venue: string;
  width: number;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const getModeEyebrow = (mode: ModernLegacyInfoBoardMode) => {
  if (mode === "talk") {
    return "SPECIAL PROGRAM";
  }

  if (mode === "auction") {
    return "AUCTION BOARD";
  }

  return "PREVIEW / AUCTION";
};

const getPrimaryLabel = (mode: ModernLegacyInfoBoardMode) => {
  if (mode === "talk") {
    return "TALK EVENT";
  }

  if (mode === "auction") {
    return "AUCTION";
  }

  return "PROGRAM";
};

export const LegacyInfoBoard: React.FC<LegacyInfoBoardProps> = ({
  alignment,
  boardProgress,
  lines,
  mode,
  ruleProgress,
  showSecondaryMeta,
  textProgress,
  title,
  tokens,
  venue,
  width,
}) => {
  const contentWidth = width - tokens.safeArea.x * 2;
  const panelWidth = Math.min(tokens.infoBoard.panelWidth, contentWidth);
  const panelOpacity = clamp(boardProgress, 0, 1);
  const panelTranslateY = (1 - panelOpacity) * tokens.motion.subtitleRise;
  const textOpacity = clamp(textProgress, 0, 1);
  const titleOpacity = 0.16 + textOpacity * 0.84;
  const titleTranslateY = (1 - textOpacity) * tokens.motion.titleRise * 0.55;
  const ruleOpacity = 0.3 + clamp(ruleProgress, 0, 1) * 0.7;
  const innerWidth = panelWidth - tokens.infoBoard.panelPaddingX * 2;
  const secondaryWidth = showSecondaryMeta
    ? tokens.infoBoard.secondaryColumnWidth
    : 0;
  const primaryWidth = showSecondaryMeta
    ? Math.min(
        tokens.infoBoard.maxPrimaryWidth,
        innerWidth - secondaryWidth - tokens.infoBoard.columnGap,
      )
    : innerWidth;
  const titleFontSize = clamp(
    fitText({
      text: title,
      withinWidth: innerWidth,
      fontFamily: tokens.typography.fonts.serif,
      fontWeight: String(tokens.typography.title.fontWeight),
    }).fontSize,
    tokens.infoBoard.titleMinFontSize,
    tokens.infoBoard.titleFontSize,
  );
  const venueLines = venue
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div
      style={{
        alignSelf: alignment === "center" ? "center" : "flex-start",
        marginLeft:
          alignment === "center" ? 0 : tokens.infoBoard.panelBiasInset,
        transform: `translateY(${tokens.infoBoard.panelShiftY}px)`,
        width: panelWidth,
      }}
    >
      <ArchivePanel
        fill={tokens.palette.panelFill}
        innerInset={tokens.layout.innerFrameInset}
        minHeight={tokens.infoBoard.panelMinHeight}
        opacity={panelOpacity}
        stroke={tokens.palette.panelStroke}
        thickness={tokens.layout.hairline}
        translateY={panelTranslateY}
        width={panelWidth}
      >
        <div
          style={{
            boxSizing: "border-box",
            display: "grid",
            gap: tokens.infoBoard.blockGap,
            minHeight: tokens.infoBoard.panelMinHeight,
            paddingBottom: tokens.infoBoard.panelPaddingY,
            paddingLeft: tokens.infoBoard.panelPaddingX,
            paddingRight: tokens.infoBoard.panelPaddingX,
            paddingTop: tokens.infoBoard.panelPaddingY,
          }}
        >
          <div
            style={{
              display: "grid",
              gap: tokens.layout.gapEyebrowToRule,
              justifyItems: alignment === "center" ? "center" : "start",
            }}
          >
            <MicroMeta
              items={["SBI ART AUCTION", getModeEyebrow(mode)]}
              opacity={panelOpacity * 0.92}
              fontFamily={tokens.typography.fonts.meta}
              fontSize={tokens.infoBoard.modeFontSize}
              fontWeight={tokens.typography.meta.fontWeight}
              tone={tokens.palette.textMeta}
              tracking={tokens.typography.meta.letterSpacing}
            />
            <div
              style={{
                color: tokens.palette.ink,
                fontFamily: tokens.typography.fonts.serif,
                fontSize: titleFontSize,
                fontWeight: tokens.typography.title.fontWeight,
                letterSpacing: tokens.typography.title.letterSpacing,
                lineHeight: 0.94,
                margin: 0,
                opacity: titleOpacity,
                textAlign: alignment,
                textTransform: tokens.typography.title.textTransform,
                transform: `translateY(${titleTranslateY}px)`,
              }}
            >
              {title}
            </div>
            <RuleSet
              alignment={alignment}
              opacity={ruleOpacity}
              progress={clamp(ruleProgress, 0, 1)}
              tokens={tokens}
            />
          </div>
          <div
            style={{
              alignItems: "flex-start",
              display: "flex",
              flexDirection: showSecondaryMeta ? "row" : "column",
              gap: tokens.infoBoard.columnGap,
              justifyContent:
                alignment === "center" ? "center" : "space-between",
            }}
          >
            <MetaColumn
              alignment={alignment}
              label={getPrimaryLabel(mode)}
              leadCount={2}
              opacity={textOpacity}
              rows={lines}
              tone="primary"
              tokens={tokens}
              width={primaryWidth}
            />
            {showSecondaryMeta && venueLines.length > 0 ? (
              <div
                style={{
                  alignItems: "stretch",
                  display: "flex",
                  gap: tokens.infoBoard.columnGap * 0.5,
                }}
              >
                <div
                  style={{
                    alignSelf: "stretch",
                    borderLeft: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
                    opacity: 0.6 * textOpacity,
                  }}
                />
                <MetaColumn
                  alignment="left"
                  label="VENUE"
                  opacity={textOpacity}
                  rows={venueLines}
                  tone="secondary"
                  tokens={tokens}
                  width={secondaryWidth}
                />
              </div>
            ) : null}
          </div>
          {showSecondaryMeta ? (
            <MicroMeta
              items={[
                mode === "talk" ? "PROGRAM NOTE" : "PROGRAM BOARD",
                "TOKYO 2026",
              ]}
              opacity={textOpacity * 0.88}
              fontFamily={tokens.typography.fonts.meta}
              fontSize={tokens.infoBoard.noteFontSize}
              fontWeight={tokens.typography.meta.fontWeight}
              tone={tokens.palette.textMeta}
              tracking="0.18em"
            />
          ) : null}
        </div>
      </ArchivePanel>
    </div>
  );
};
