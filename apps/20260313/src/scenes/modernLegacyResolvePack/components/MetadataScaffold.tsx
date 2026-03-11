import React from "react";
import type { MLAlign, MLSafeMargins } from "../types";
import type { ResolvedTokens } from "../tokens";

export type MetadataScaffoldProps = {
  align: MLAlign;
  opacity: number;
  primaryLabel?: string;
  safeMargins: MLSafeMargins;
  secondaryLabel?: string;
  tokens: ResolvedTokens;
};

export const MetadataScaffold: React.FC<MetadataScaffoldProps> = ({
  align,
  opacity,
  primaryLabel = "MODERN LEGACY",
  safeMargins,
  secondaryLabel = "ARCHIVE NOTE",
  tokens,
}) => {
  const tick = tokens.layout.cornerTickLength;
  const left = safeMargins.x + tokens.layout.scaffoldOffset;
  const right = safeMargins.x + tokens.layout.scaffoldOffset;
  const top = safeMargins.y + tokens.layout.scaffoldOffset;
  const bottom = safeMargins.y + tokens.layout.scaffoldOffset;
  const labelAlign = align === "right" ? "right" : "left";

  return (
    <>
      {[
        {
          horizontal: "left",
          vertical: "top",
          x: left,
          y: top,
        },
        {
          horizontal: "right",
          vertical: "top",
          x: right,
          y: top,
        },
        {
          horizontal: "left",
          vertical: "bottom",
          x: left,
          y: bottom,
        },
        {
          horizontal: "right",
          vertical: "bottom",
          x: right,
          y: bottom,
        },
      ].map((corner, index) => {
        const horizontalStyle =
          corner.horizontal === "left"
            ? { left: corner.x }
            : { right: corner.x };
        const verticalStyle =
          corner.vertical === "top" ? { top: corner.y } : { bottom: corner.y };

        return (
          <React.Fragment key={index}>
            <div
              style={{
                ...horizontalStyle,
                ...verticalStyle,
                borderTop: `${tokens.layout.hairline}px solid ${tokens.palette.scaffoldTone}`,
                opacity,
                position: "absolute",
                width: tick,
              }}
            />
            <div
              style={{
                ...horizontalStyle,
                ...verticalStyle,
                borderLeft:
                  corner.horizontal === "left"
                    ? `${tokens.layout.hairline}px solid ${tokens.palette.scaffoldTone}`
                    : undefined,
                borderRight:
                  corner.horizontal === "right"
                    ? `${tokens.layout.hairline}px solid ${tokens.palette.scaffoldTone}`
                    : undefined,
                height: tick,
                opacity,
                position: "absolute",
              }}
            />
          </React.Fragment>
        );
      })}
      <div
        style={{
          color: tokens.palette.scaffoldTone,
          fontFamily: tokens.typography.fonts.meta,
          fontSize: tokens.typography.scaffold.fontSize,
          fontWeight: tokens.typography.scaffold.fontWeight,
          left: safeMargins.x + tokens.layout.scaffoldOffset,
          letterSpacing: tokens.typography.scaffold.letterSpacing,
          opacity,
          position: "absolute",
          textAlign: labelAlign,
          textTransform: tokens.typography.scaffold.textTransform,
          top:
            safeMargins.y +
            tokens.layout.scaffoldOffset +
            tokens.layout.cornerTickLength +
            tokens.layout.scaffoldLabelGap,
        }}
      >
        {primaryLabel}
      </div>
      <div
        style={{
          color: tokens.palette.scaffoldTone,
          fontFamily: tokens.typography.fonts.meta,
          fontSize: tokens.typography.scaffold.fontSize,
          fontWeight: tokens.typography.scaffold.fontWeight,
          letterSpacing: tokens.typography.scaffold.letterSpacing,
          opacity: opacity * 0.88,
          position: "absolute",
          right: safeMargins.x + tokens.layout.scaffoldOffset,
          textAlign: "right",
          textTransform: tokens.typography.scaffold.textTransform,
          top:
            safeMargins.y +
            tokens.layout.scaffoldOffset +
            tokens.layout.cornerTickLength +
            tokens.layout.scaffoldLabelGap,
        }}
      >
        {secondaryLabel}
      </div>
    </>
  );
};
