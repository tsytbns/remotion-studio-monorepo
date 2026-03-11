import React from "react";
import { fitText } from "@remotion/layout-utils";
import type { MLAlign, MLRevealStyle } from "../types";
import type { ResolvedTokens } from "../tokens";
import { clamp01 } from "../utils/timing";

export type MLSubtitleProps = {
  align: MLAlign;
  maxWidth: number;
  progress: number;
  revealStyle: MLRevealStyle;
  text: string;
  tokens: ResolvedTokens;
  tone: string;
};

const normalize = (value: string) => {
  return value.replace(/\s+/g, " ").trim();
};

const splitBalanced = (text: string) => {
  const normalized = normalize(text);

  if (!normalized || normalized.includes("\n")) {
    return normalized;
  }

  const words = normalized.split(" ");

  if (words.length < 7) {
    return normalized;
  }

  const midpoint = Math.ceil(words.length / 2);
  return `${words.slice(0, midpoint).join(" ")}\n${words.slice(midpoint).join(" ")}`;
};

export const MLSubtitle: React.FC<MLSubtitleProps> = ({
  align,
  maxWidth,
  progress,
  revealStyle,
  text,
  tokens,
  tone,
}) => {
  const balanced = splitBalanced(text);
  const longest = balanced.split("\n").reduce((longestLine, line) => {
    return line.length > longestLine.length ? line : longestLine;
  }, "");
  const fitted = fitText({
    text: longest || text,
    withinWidth: maxWidth,
    fontFamily: tokens.typography.fonts.serif,
    fontWeight: String(tokens.typography.subtitle.fontWeight),
  });
  const fontSize = Math.min(
    tokens.typography.subtitle.fontSize,
    Math.max(tokens.typography.subtitle.minFontSize, fitted.fontSize),
  );
  const clamped = clamp01(progress);
  const opacity = clamped;
  const translateY =
    (1 - clamped) *
    tokens.motion.opening.subtitleRise *
    (revealStyle === "lift" ? 1.12 : 1);

  return (
    <div
      style={{
        color: tone,
        fontFamily: tokens.typography.fonts.serif,
        fontSize,
        fontWeight: tokens.typography.subtitle.fontWeight,
        letterSpacing: tokens.typography.subtitle.letterSpacing,
        lineHeight: tokens.typography.subtitle.lineHeight,
        maxWidth,
        opacity,
        textAlign: align,
        transform: `translateY(${translateY}px)`,
        whiteSpace: "pre-line",
      }}
    >
      {balanced}
    </div>
  );
};
