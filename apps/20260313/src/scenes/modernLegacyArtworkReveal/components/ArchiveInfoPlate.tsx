import React from "react";
import type { ResolvedTokens } from "../../modernLegacyOpening/tokens";
import type {
  FrameRect,
  ModernLegacyArtworkLayoutVariant,
} from "../ModernLegacyArtworkReveal";
import { MicroRule } from "./MicroRule";

export type ArchiveInfoPlateProps = {
  archiveLabel?: string | null;
  artist: string;
  estimate?: string | null;
  layoutVariant: ModernLegacyArtworkLayoutVariant;
  lotNo: string;
  medium: string;
  opacity: number;
  rect: FrameRect;
  title: string;
  tokens: ResolvedTokens;
  translateY: number;
  year: string;
};

export const ArchiveInfoPlate: React.FC<ArchiveInfoPlateProps> = ({
  archiveLabel,
  artist,
  estimate,
  layoutVariant,
  lotNo,
  medium,
  opacity,
  rect,
  title,
  tokens,
  translateY,
  year,
}) => {
  const compact = layoutVariant === "index";
  const titleSize = Math.min(
    rect.width * (compact ? 0.125 : 0.094),
    compact ? 38 : 44,
  );
  const artistSize = Math.min(
    rect.width * (compact ? 0.072 : 0.058),
    compact ? 24 : 26,
  );
  const bodySize = Math.min(
    rect.width * (compact ? 0.06 : 0.05),
    compact ? 18 : 20,
  );
  const microSize = Math.min(rect.width * 0.045, 15);

  return (
    <div
      style={{
        left: rect.x,
        opacity,
        position: "absolute",
        top: rect.y,
        transform: `translateY(${translateY}px)`,
        width: rect.width,
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(247, 243, 234, 0.78) 0%, rgba(247, 243, 234, 0.54) 100%)",
          border: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
          boxShadow:
            "0 16px 36px rgba(32, 50, 41, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          paddingBottom: Math.min(rect.width * 0.06, 28),
          paddingLeft: Math.min(rect.width * 0.08, 36),
          paddingRight: Math.min(rect.width * 0.08, 36),
          paddingTop: Math.min(rect.width * 0.08, 38),
          position: "relative",
        }}
      >
        <div
          style={{
            border: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
            inset: Math.min(rect.width * 0.035, 14),
            opacity: 0.86,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              color: tokens.palette.textMeta,
              display: "flex",
              fontFamily: tokens.typography.fonts.meta,
              fontSize: microSize,
              fontWeight: 600,
              justifyContent: compact ? "space-between" : "flex-start",
              letterSpacing: "0.22em",
              lineHeight: 1.2,
              textTransform: "uppercase",
            }}
          >
            <span>Lot {lotNo}</span>
            {archiveLabel ? (
              <span
                style={{
                  maxWidth: compact ? "46%" : "72%",
                  opacity: 0.78,
                  overflow: "hidden",
                  textAlign: "right",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {archiveLabel}
              </span>
            ) : null}
          </div>
          <div style={{ height: Math.min(rect.width * 0.05, 24) }} />
          <MicroRule
            color={tokens.palette.rule}
            gap={Math.max(3, tokens.layout.ruleGap * 0.6)}
            opacity={0.82}
            progress={1}
            thickness={tokens.layout.hairline}
            width={compact ? rect.width * 0.42 : rect.width * 0.5}
          />
          <div style={{ height: Math.min(rect.width * 0.06, 28) }} />
          <div
            style={{
              color: tokens.palette.ink,
              fontFamily: tokens.typography.fonts.meta,
              fontSize: artistSize,
              fontWeight: 600,
              letterSpacing: "0.08em",
              lineHeight: 1.08,
              textTransform: "uppercase",
            }}
          >
            {artist}
          </div>
          <div style={{ height: Math.min(rect.width * 0.03, 14) }} />
          <div
            style={{
              color: tokens.palette.ink,
              fontFamily: tokens.typography.fonts.serif,
              fontSize: titleSize,
              fontWeight: 500,
              letterSpacing: "0.02em",
              lineHeight: 1.04,
            }}
          >
            {title}
          </div>
          <div style={{ height: Math.min(rect.width * 0.04, 18) }} />
          <div
            style={{
              color: tokens.palette.textSecondary,
              fontFamily: tokens.typography.fonts.serif,
              fontSize: bodySize,
              fontWeight: 500,
              letterSpacing: "0.02em",
              lineHeight: 1.3,
            }}
          >
            {[year, medium].filter(Boolean).join("  ·  ")}
          </div>
          {estimate ? (
            <>
              <div style={{ height: Math.min(rect.width * 0.04, 18) }} />
              <div
                style={{
                  color: tokens.palette.textMeta,
                  fontFamily: tokens.typography.fonts.meta,
                  fontSize: microSize,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  lineHeight: 1.3,
                  textTransform: "uppercase",
                }}
              >
                {estimate}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
