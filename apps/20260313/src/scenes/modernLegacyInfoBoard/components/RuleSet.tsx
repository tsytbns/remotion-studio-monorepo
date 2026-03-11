import React from "react";
import type { ResolvedTokens } from "../../modernLegacyOpening/tokens";
import type { ModernLegacyInfoBoardAlignment } from "../ModernLegacyInfoBoard";

export type RuleSetProps = {
  alignment: ModernLegacyInfoBoardAlignment;
  opacity: number;
  progress: number;
  tokens: ResolvedTokens;
};

export const RuleSet: React.FC<RuleSetProps> = ({
  alignment,
  opacity,
  progress,
  tokens,
}) => {
  const transformOrigin =
    alignment === "center" ? "center center" : "left center";
  const primaryWidth = tokens.infoBoard.lineDrawWidth;
  const secondaryWidth = tokens.infoBoard.secondaryRuleWidth;

  return (
    <div
      style={{
        display: "grid",
        gap: tokens.layout.ruleGap * 1.4,
        justifyItems: alignment === "center" ? "center" : "start",
        opacity,
      }}
    >
      <div
        style={{
          display: "grid",
          gap: tokens.layout.ruleGap,
          transform: `scaleX(${progress})`,
          transformOrigin,
          width: primaryWidth,
        }}
      >
        <div
          style={{
            borderTop: `${tokens.layout.hairline}px solid ${tokens.palette.rule}`,
            width: "100%",
          }}
        />
        <div
          style={{
            borderTop: `${tokens.layout.hairline}px solid ${tokens.palette.rule}`,
            width: "100%",
          }}
        />
      </div>
      <div
        style={{
          borderTop: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
          opacity: 0.78,
          transform: `scaleX(${progress})`,
          transformOrigin,
          width: secondaryWidth,
        }}
      />
    </div>
  );
};
