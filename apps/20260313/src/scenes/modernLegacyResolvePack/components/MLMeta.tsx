import React from "react";
import type { MLAlign, MLRevealStyle } from "../types";
import type { ResolvedTokens } from "../tokens";
import { LegacyMeta } from "./LegacyMeta";
import { clamp01 } from "../utils/timing";

export type MLMetaProps = {
  align: MLAlign;
  progress: number;
  revealStyle: MLRevealStyle;
  text: string;
  tokens: ResolvedTokens;
  tone: string;
};

export const MLMeta: React.FC<MLMetaProps> = ({
  align,
  progress,
  revealStyle,
  text,
  tokens,
  tone,
}) => {
  const items = text
    .split(/[\n·]/)
    .map((item) => item.trim())
    .filter(Boolean);
  const clamped = clamp01(progress);
  const translateY =
    (1 - clamped) *
    tokens.motion.text.metaRise *
    (revealStyle === "lift" ? 1.08 : 1);

  return (
    <LegacyMeta
      align={align}
      items={items}
      opacity={clamped}
      tokens={tokens}
      tone={tone}
      translateY={translateY}
    />
  );
};
