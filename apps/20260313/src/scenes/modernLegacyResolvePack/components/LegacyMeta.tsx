import React from "react";
import type { MLAlign } from "../types";
import type { ResolvedTokens } from "../tokens";

export type LegacyMetaProps = {
  align: MLAlign;
  items: string[];
  opacity: number;
  tokens: ResolvedTokens;
  tone?: string;
  fontSize?: number;
  tracking?: string;
  translateY?: number;
};

export const LegacyMeta: React.FC<LegacyMetaProps> = ({
  align,
  items,
  opacity,
  tokens,
  tone = tokens.palette.textMeta,
  fontSize = tokens.typography.meta.fontSize,
  tracking = tokens.typography.meta.letterSpacing,
  translateY = 0,
}) => {
  const filtered = items
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (filtered.length === 0) {
    return null;
  }

  const justifyContent =
    align === "center"
      ? "center"
      : align === "right"
        ? "flex-end"
        : "flex-start";

  return (
    <div
      style={{
        alignItems: "center",
        color: tone,
        display: "flex",
        flexWrap: "wrap",
        fontFamily: tokens.typography.fonts.meta,
        fontSize,
        fontWeight: tokens.typography.meta.fontWeight,
        gap: fontSize * 0.72,
        justifyContent,
        letterSpacing: tracking,
        lineHeight: tokens.typography.meta.lineHeight,
        opacity,
        textAlign: align,
        textTransform: tokens.typography.meta.textTransform,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {filtered.map((item, index) => {
        const isLast = index === filtered.length - 1;

        return (
          <React.Fragment key={`${item}-${index}`}>
            <span style={{ whiteSpace: "nowrap" }}>{item}</span>
            {isLast ? null : <span style={{ opacity: 0.56 }}>·</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
};
