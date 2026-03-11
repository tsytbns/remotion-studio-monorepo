import React from "react";
import { fitText, measureText } from "@remotion/layout-utils";
import { Sequence } from "remotion";
import type { ModernLegacyAlignment } from "../ModernLegacyOpening";
import type { ResolvedTokens } from "../tokens";
import { ArchivePanel } from "./ArchivePanel";
import { DoubleRule } from "./DoubleRule";
import { MicroMeta } from "./MicroMeta";

export type LegacyTitleBlockProps = {
  title: string;
  subtitle: string;
  date?: string | null;
  venue: string;
  showMeta: boolean;
  alignment: ModernLegacyAlignment;
  panelProgress: number;
  ruleProgress: number;
  titleProgress: number;
  subtitleProgress: number;
  eyebrowLabel: string;
  tokens: ResolvedTokens;
  contentWidth: number;
  panelWidth: number;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const normalizeSpaces = (value: string) => {
  return value.replace(/\s+/g, " ").trim();
};

const getLongestLine = (value: string) => {
  return value.split("\n").reduce((longest, line) => {
    return line.length > longest.length ? line : longest;
  }, "");
};

const measureLineWidth = ({
  text,
  fontFamily,
  fontWeight,
  fontSize,
}: {
  text: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
}) => {
  return measureText({
    text,
    fontFamily,
    fontSize,
    fontWeight: String(fontWeight),
  }).width;
};

const balanceSubtitle = ({
  text,
  width,
  fontFamily,
  fontWeight,
  fontSize,
}: {
  text: string;
  width: number;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
}) => {
  const normalized = normalizeSpaces(text);
  if (normalized.length === 0 || normalized.includes("\n")) {
    return normalized;
  }

  const words = normalized.split(" ");
  if (words.length < 7) {
    return normalized;
  }

  let best = normalized;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let splitIndex = 2; splitIndex <= words.length - 2; splitIndex++) {
    const firstLine = words.slice(0, splitIndex).join(" ");
    const secondLine = words.slice(splitIndex).join(" ");
    const firstWidth = measureLineWidth({
      text: firstLine,
      fontFamily,
      fontWeight,
      fontSize,
    });
    const secondWidth = measureLineWidth({
      text: secondLine,
      fontFamily,
      fontWeight,
      fontSize,
    });
    const widest = Math.max(firstWidth, secondWidth);

    if (widest > width * 1.18) {
      continue;
    }

    const score =
      Math.abs(firstWidth - secondWidth) +
      Math.abs(width - widest) * 0.15 +
      Math.abs(words.length / 2 - splitIndex) * 10;

    if (score < bestScore) {
      best = `${firstLine}\n${secondLine}`;
      bestScore = score;
    }
  }

  return best;
};

const balanceTitle = ({
  text,
  width,
  fontFamily,
  fontWeight,
  fontSize,
}: {
  text: string;
  width: number;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
}) => {
  const normalized = normalizeSpaces(text);
  if (normalized.length === 0 || normalized.includes("\n")) {
    return normalized;
  }

  const words = normalized.split(" ");
  if (words.length < 2) {
    return normalized;
  }

  const singleLineWidth = measureLineWidth({
    text: normalized,
    fontFamily,
    fontWeight,
    fontSize,
  });

  if (singleLineWidth <= width) {
    return normalized;
  }

  let best = normalized;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let splitIndex = 1; splitIndex <= words.length - 1; splitIndex++) {
    const firstLine = words.slice(0, splitIndex).join(" ");
    const secondLine = words.slice(splitIndex).join(" ");
    const firstWidth = measureLineWidth({
      text: firstLine,
      fontFamily,
      fontWeight,
      fontSize,
    });
    const secondWidth = measureLineWidth({
      text: secondLine,
      fontFamily,
      fontWeight,
      fontSize,
    });
    const widest = Math.max(firstWidth, secondWidth);
    const score =
      Math.abs(firstWidth - secondWidth) + Math.abs(width - widest) * 0.1;

    if (score < bestScore) {
      best = `${firstLine}\n${secondLine}`;
      bestScore = score;
    }
  }

  return best;
};

const fitLine = ({
  text,
  width,
  fontFamily,
  fontWeight,
  targetFontSize,
  minFontSize,
}: {
  text: string;
  width: number;
  fontFamily: string;
  fontWeight: number;
  targetFontSize: number;
  minFontSize: number;
}) => {
  const fitted = fitText({
    text,
    withinWidth: width,
    fontFamily,
    fontWeight: String(fontWeight),
  });

  return clamp(fitted.fontSize, minFontSize, targetFontSize);
};

export const LegacyTitleBlock: React.FC<LegacyTitleBlockProps> = ({
  title,
  subtitle,
  date,
  venue,
  showMeta,
  alignment,
  panelProgress,
  ruleProgress,
  titleProgress,
  subtitleProgress,
  eyebrowLabel,
  tokens,
  contentWidth,
  panelWidth,
}) => {
  const panelOpacity = clamp(panelProgress, 0, 1);
  const panelTranslateY = (1 - panelOpacity) * tokens.motion.panelRise;
  const ruleOpacity = 0.35 + clamp(ruleProgress, 0, 1) * 0.65;
  const titleOpacity =
    tokens.motion.titleStartOpacity +
    (1 - tokens.motion.titleStartOpacity) * clamp(titleProgress, 0, 1);
  const titleTranslateY =
    (1 - clamp(titleProgress, 0, 1)) * tokens.motion.titleRise;
  const subtitleOpacity = clamp(subtitleProgress, 0, 1);
  const subtitleTranslateY =
    (1 - clamp(subtitleProgress, 0, 1)) * tokens.motion.subtitleRise;
  const panelContentWidth = panelWidth - tokens.layout.panelPaddingX * 2;
  const titleWidth = panelContentWidth;
  const effectiveTitleWidth = titleWidth * 0.9;
  const subtitleWidth = Math.min(
    tokens.typography.subtitle.maxWidth,
    panelContentWidth,
  );
  const balancedTitle = balanceTitle({
    text: title,
    width: effectiveTitleWidth,
    fontFamily: tokens.typography.fonts.serif,
    fontWeight: tokens.typography.title.fontWeight,
    fontSize: tokens.typography.title.fontSize,
  });
  const titleFontSize = fitLine({
    text: getLongestLine(balancedTitle),
    width: effectiveTitleWidth,
    fontFamily: tokens.typography.fonts.serif,
    fontWeight: tokens.typography.title.fontWeight,
    targetFontSize: tokens.typography.title.fontSize,
    minFontSize: tokens.typography.title.minFontSize,
  });
  const balancedSubtitle = balanceSubtitle({
    text: subtitle,
    width: subtitleWidth,
    fontFamily: tokens.typography.fonts.serif,
    fontWeight: tokens.typography.subtitle.fontWeight,
    fontSize: tokens.typography.subtitle.fontSize,
  });
  const subtitleFontSize = fitLine({
    text: getLongestLine(balancedSubtitle),
    width: subtitleWidth,
    fontFamily: tokens.typography.fonts.serif,
    fontWeight: tokens.typography.subtitle.fontWeight,
    targetFontSize: tokens.typography.subtitle.fontSize,
    minFontSize: tokens.typography.subtitle.minFontSize,
  });
  const alignmentShift =
    alignment === "center"
      ? tokens.layout.alignmentShiftCenter
      : tokens.layout.alignmentShiftLower;
  const metaItems = [venue, date ?? ""].filter(
    (item) => item && item.trim().length > 0,
  );
  const innerContentMinHeight = Math.max(
    0,
    tokens.layout.panelMinHeight -
      tokens.layout.panelPaddingTop -
      tokens.layout.panelPaddingBottom,
  );

  return (
    <div
      style={{
        margin: "0 auto",
        maxWidth: contentWidth,
        transform: `translateY(${alignmentShift}px)`,
        width: panelWidth,
      }}
    >
      <ArchivePanel
        width={panelWidth}
        minHeight={tokens.layout.panelMinHeight}
        opacity={panelOpacity}
        translateY={panelTranslateY}
        fill={tokens.palette.panelFill}
        stroke={tokens.palette.panelStroke}
        innerInset={tokens.layout.innerFrameInset}
        thickness={tokens.layout.hairline}
      >
        <div
          style={{
            boxSizing: "border-box",
            minHeight: innerContentMinHeight,
            paddingBottom: tokens.layout.panelPaddingBottom,
            paddingLeft: tokens.layout.panelPaddingX,
            paddingRight: tokens.layout.panelPaddingX,
            paddingTop: tokens.layout.panelPaddingTop,
            textAlign: "center",
          }}
        >
          <MicroMeta
            items={[eyebrowLabel]}
            opacity={panelOpacity * 0.92}
            fontFamily={tokens.typography.fonts.meta}
            fontSize={tokens.typography.eyebrow.fontSize}
            fontWeight={tokens.typography.eyebrow.fontWeight}
            tone={tokens.palette.ink}
            tracking={tokens.typography.eyebrow.letterSpacing}
          />
          <div style={{ height: tokens.layout.gapEyebrowToRule }} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <DoubleRule
              width={tokens.layout.ruleWidth}
              progress={ruleProgress}
              color={tokens.palette.rule}
              thickness={tokens.layout.hairline}
              gap={tokens.layout.ruleGap}
              opacity={ruleOpacity}
            />
          </div>
          <div style={{ height: tokens.layout.gapRuleToTitle }} />
          <div
            style={{
              overflow: "hidden",
              paddingBottom: tokens.motion.titleMaskOverflow,
            }}
          >
            <div
              style={{
                color: tokens.palette.ink,
                fontFamily: tokens.typography.fonts.serif,
                fontSize: titleFontSize,
                fontWeight: tokens.typography.title.fontWeight,
                letterSpacing: tokens.typography.title.letterSpacing,
                lineHeight: tokens.typography.title.lineHeight,
                margin: 0,
                opacity: titleOpacity,
                textTransform: tokens.typography.title.textTransform,
                transform: `translateY(${titleTranslateY}px)`,
                whiteSpace: "pre-line",
              }}
            >
              {balancedTitle}
            </div>
          </div>
          <div style={{ height: tokens.layout.gapTitleToSubtitle }} />
          <div
            style={{
              color: tokens.palette.textSecondary,
              fontFamily: tokens.typography.fonts.serif,
              fontSize: subtitleFontSize,
              fontWeight: tokens.typography.subtitle.fontWeight,
              letterSpacing: tokens.typography.subtitle.letterSpacing,
              lineHeight: tokens.typography.subtitle.lineHeight,
              margin: "0 auto",
              maxWidth: subtitleWidth,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleTranslateY}px)`,
              whiteSpace: "pre-line",
            }}
          >
            {balancedSubtitle}
          </div>
          {showMeta && metaItems.length > 0 ? (
            <Sequence from={tokens.motion.frames.footerMetaFrom} layout="none">
              <div style={{ height: tokens.layout.gapSubtitleToMeta }} />
              <MicroMeta
                items={metaItems}
                opacity={subtitleOpacity}
                fontFamily={tokens.typography.fonts.meta}
                fontSize={tokens.typography.meta.fontSize}
                fontWeight={tokens.typography.meta.fontWeight}
                tone={tokens.palette.textMeta}
                tracking={tokens.typography.meta.letterSpacing}
              />
            </Sequence>
          ) : null}
        </div>
      </ArchivePanel>
    </div>
  );
};
