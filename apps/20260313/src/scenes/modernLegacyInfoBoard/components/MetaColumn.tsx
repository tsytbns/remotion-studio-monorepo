import React from "react";
import type { ResolvedTokens } from "../../modernLegacyOpening/tokens";
import type { ModernLegacyInfoBoardAlignment } from "../ModernLegacyInfoBoard";

export type MetaColumnProps = {
  alignment: ModernLegacyInfoBoardAlignment;
  label: string;
  leadCount?: number;
  opacity: number;
  rows: string[];
  tone: "primary" | "secondary";
  tokens: ResolvedTokens;
  width?: number;
};

const isSectionLabel = (value: string) => {
  const normalized = value.trim().toLowerCase();
  return (
    normalized.endsWith(":") ||
    normalized === "preview" ||
    normalized === "auction" ||
    normalized === "talk event" ||
    normalized === "venue"
  );
};

export const MetaColumn: React.FC<MetaColumnProps> = ({
  alignment,
  label,
  leadCount = 0,
  opacity,
  rows,
  tone,
  tokens,
  width,
}) => {
  const labelColor =
    tone === "primary" ? tokens.palette.textMeta : tokens.palette.textSecondary;
  const leadColor =
    tone === "primary" ? tokens.palette.ink : tokens.palette.textSecondary;
  const bodyColor =
    tone === "primary" ? tokens.palette.textSecondary : tokens.palette.textMeta;

  return (
    <div
      style={{
        display: "grid",
        gap: tokens.infoBoard.lineGap,
        justifyItems: alignment === "center" ? "center" : "start",
        maxWidth: width,
        opacity,
        width: width ?? "100%",
      }}
    >
      <div
        style={{
          color: labelColor,
          fontFamily: tokens.typography.fonts.meta,
          fontSize: tokens.infoBoard.modeFontSize,
          fontWeight: tokens.typography.meta.fontWeight,
          letterSpacing: tokens.typography.meta.letterSpacing,
          textAlign: alignment,
          textTransform: tokens.typography.meta.textTransform,
          width: "100%",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "grid",
          gap:
            tone === "primary"
              ? tokens.infoBoard.lineGap
              : tokens.infoBoard.secondaryLineGap,
          width: "100%",
        }}
      >
        {rows.map((row, index) => {
          const trimmed = row.trim();
          const rowIsLabel = isSectionLabel(trimmed);
          const isLead = index < leadCount && !rowIsLabel;

          return (
            <div
              key={`${label}-${row}-${index}`}
              style={{
                color: rowIsLabel ? labelColor : isLead ? leadColor : bodyColor,
                fontFamily: tokens.typography.fonts.serif,
                fontSize: rowIsLabel
                  ? tokens.infoBoard.noteFontSize
                  : isLead
                    ? tokens.infoBoard.bodyFontSize * 1.08
                    : tone === "primary"
                      ? tokens.infoBoard.bodyFontSize
                      : tokens.infoBoard.venueFontSize,
                fontWeight: rowIsLabel ? 500 : isLead ? 600 : 500,
                letterSpacing: rowIsLabel
                  ? "0.08em"
                  : isLead
                    ? "0.032em"
                    : "0.018em",
                lineHeight: rowIsLabel ? 1.15 : 1.28,
                textAlign: alignment,
                textTransform: rowIsLabel ? "uppercase" : "none",
                whiteSpace: "pre-line",
              }}
            >
              {trimmed}
            </div>
          );
        })}
      </div>
    </div>
  );
};
