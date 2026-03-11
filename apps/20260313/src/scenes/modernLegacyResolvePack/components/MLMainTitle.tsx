import React from "react";
import { fitText, measureText } from "@remotion/layout-utils";
import type { MLAlign, MLRevealStyle } from "../types";
import type { ResolvedTokens } from "../tokens";
import { clamp01 } from "../utils/timing";

export type MLMainTitleProps = {
  align: MLAlign;
  maxWidth: number;
  progress: number;
  revealStyle: MLRevealStyle;
  text: string;
  tokens: ResolvedTokens;
  tone: string;
};

const normalizeSpaces = (value: string) => {
  return value.replace(/\s+/g, " ").trim();
};

const measureWidth = (
  text: string,
  fontSize: number,
  tokens: ResolvedTokens,
) => {
  return measureText({
    text,
    fontFamily: tokens.typography.fonts.serif,
    fontSize,
    fontWeight: String(tokens.typography.title.fontWeight),
  }).width;
};

const balanceTitle = (
  text: string,
  width: number,
  tokens: ResolvedTokens,
): string => {
  const normalized = normalizeSpaces(text);

  if (!normalized || normalized.includes("\n")) {
    return normalized;
  }

  const words = normalized.split(" ");

  if (words.length < 2) {
    return normalized;
  }

  const singleLineWidth = measureWidth(
    normalized,
    tokens.typography.title.fontSize,
    tokens,
  );

  if (singleLineWidth <= width) {
    return normalized;
  }

  let best = normalized;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let splitIndex = 1; splitIndex <= words.length - 1; splitIndex++) {
    const first = words.slice(0, splitIndex).join(" ");
    const second = words.slice(splitIndex).join(" ");
    const firstWidth = measureWidth(
      first,
      tokens.typography.title.fontSize,
      tokens,
    );
    const secondWidth = measureWidth(
      second,
      tokens.typography.title.fontSize,
      tokens,
    );
    const widest = Math.max(firstWidth, secondWidth);
    const score =
      Math.abs(firstWidth - secondWidth) + Math.abs(width - widest) * 0.08;

    if (widest <= width * 1.04 && score < bestScore) {
      best = `${first}\n${second}`;
      bestScore = score;
    }
  }

  return best;
};

export const MLMainTitle: React.FC<MLMainTitleProps> = ({
  align,
  maxWidth,
  progress,
  revealStyle,
  text,
  tokens,
  tone,
}) => {
  const balanced = balanceTitle(text, maxWidth, tokens);
  const longestLine = balanced.split("\n").reduce((longest, line) => {
    return line.length > longest.length ? line : longest;
  }, "");
  const fitted = fitText({
    text: longestLine || text,
    withinWidth: maxWidth,
    fontFamily: tokens.typography.fonts.serif,
    fontWeight: String(tokens.typography.title.fontWeight),
  });
  const fontSize = Math.min(
    tokens.typography.title.fontSize,
    Math.max(tokens.typography.title.minFontSize, fitted.fontSize),
  );
  const clamped = clamp01(progress);
  const opacity = 0.12 + clamped * 0.88;
  const translateY =
    (1 - clamped) *
    tokens.motion.opening.titleRise *
    (revealStyle === "lift" ? 1.2 : 1);
  const clipReveal =
    revealStyle === "soft-mask"
      ? `inset(${(1 - clamped) * 100}% 0 0 0)`
      : revealStyle === "line-coupled"
        ? `inset(0 ${(1 - clamped) * 100}% 0 0)`
        : undefined;

  return (
    <div
      style={{
        maxWidth,
        overflow: "hidden",
        textAlign: align,
        width: "100%",
      }}
    >
      <div
        style={{
          clipPath: clipReveal,
          color: tone,
          fontFamily: tokens.typography.fonts.serif,
          fontSize,
          fontWeight: tokens.typography.title.fontWeight,
          letterSpacing: tokens.typography.title.letterSpacing,
          lineHeight: tokens.typography.title.lineHeight,
          opacity,
          textTransform: tokens.typography.title.textTransform,
          transform: `translateY(${translateY}px)`,
          whiteSpace: "pre-line",
        }}
      >
        {balanced}
      </div>
    </div>
  );
};
