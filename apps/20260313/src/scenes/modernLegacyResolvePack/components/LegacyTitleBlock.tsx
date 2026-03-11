import React from "react";
import type {
  LegacyOpeningPlateRenderLayer,
  MLAlign,
  MLRenderMode,
} from "../types";
import type { ResolvedTokens } from "../tokens";
import { DoubleRule } from "./DoubleRule";
import { LegacyMeta } from "./LegacyMeta";
import { MLMainTitle } from "./MLMainTitle";
import { MLSubtitle } from "./MLSubtitle";

export type LegacyTitleBlockProps = {
  alignment: "center" | "lower";
  date?: string | null;
  renderLayer: LegacyOpeningPlateRenderLayer;
  renderMode: MLRenderMode;
  ruleProgress: number;
  showMeta: boolean;
  subtitle: string;
  subtitleProgress: number;
  title: string;
  titleProgress: number;
  tokens: ResolvedTokens;
  venue: string;
  metaProgress: number;
};

export const LegacyTitleBlock: React.FC<LegacyTitleBlockProps> = ({
  alignment,
  date,
  renderLayer,
  renderMode,
  ruleProgress,
  showMeta,
  subtitle,
  subtitleProgress,
  title,
  titleProgress,
  tokens,
  venue,
  metaProgress,
}) => {
  const align: MLAlign = alignment === "center" ? "center" : "left";
  const metaItems = [venue, date ?? "", "TOKYO 2026"].filter(Boolean);
  const showTitleLayer = renderLayer === "full" || renderLayer === "title";
  const showRuleLayer = renderLayer === "full" || renderLayer === "rule";
  const showMetaLayer = renderLayer === "full" || renderLayer === "meta";
  const containerWidth = tokens.layout.openingPanelWidth;

  return (
    <div
      style={{
        display: "grid",
        gap: tokens.layout.openingEyebrowGap,
        maxWidth: containerWidth,
        textAlign: align,
        width: containerWidth,
      }}
    >
      {renderLayer === "full" ? (
        <LegacyMeta
          align={align}
          items={["SBI ART AUCTION"]}
          opacity={0.9}
          tokens={tokens}
          tone={tokens.palette.textMeta}
        />
      ) : null}
      {showRuleLayer ? (
        <DoubleRule
          align={align}
          opacity={0.28 + ruleProgress * 0.72}
          progress={ruleProgress}
          tokens={tokens}
          width={tokens.layout.openingRuleWidth}
        />
      ) : null}
      {showTitleLayer ? (
        <div
          style={{
            display: "grid",
            gap: tokens.layout.openingTitleGap,
            justifyItems: align === "center" ? "center" : "start",
          }}
        >
          <MLMainTitle
            align={align}
            maxWidth={tokens.layout.openingTitleWidth}
            progress={titleProgress}
            revealStyle="soft-mask"
            text={title}
            tokens={tokens}
            tone={
              renderMode === "full" ? tokens.palette.ink : tokens.palette.ivory
            }
          />
          <MLSubtitle
            align={align}
            maxWidth={tokens.layout.openingSubtitleWidth}
            progress={subtitleProgress}
            revealStyle="lift"
            text={subtitle}
            tokens={tokens}
            tone={
              renderMode === "full"
                ? tokens.palette.textSecondary
                : tokens.palette.paleSmoke
            }
          />
        </div>
      ) : null}
      {showMeta && showMetaLayer ? (
        <LegacyMeta
          align={align}
          items={metaItems}
          opacity={metaProgress}
          tokens={tokens}
          tone={
            renderMode === "full"
              ? tokens.palette.textMeta
              : tokens.palette.smoke
          }
          translateY={(1 - metaProgress) * tokens.motion.opening.metaRise}
        />
      ) : null}
    </div>
  );
};
