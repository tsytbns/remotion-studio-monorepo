import React from "react";
import { Img } from "remotion";
import { ArchivePanel } from "../../modernLegacyOpening/components/ArchivePanel";
import { DoubleRule } from "../../modernLegacyOpening/components/DoubleRule";
import { MicroMeta } from "../../modernLegacyOpening/components/MicroMeta";
import type { ResolvedTokens } from "../../modernLegacyOpening/tokens";

export type RouteMapCardProps = {
  imageSrc: string;
  opacity: number;
  progress: number;
  tokens: ResolvedTokens;
  width: number;
};

export const RouteMapCard: React.FC<RouteMapCardProps> = ({
  imageSrc,
  opacity,
  progress,
  tokens,
  width,
}) => {
  const panelWidth = Math.min(width - tokens.safeArea.x * 2, width * 0.82);
  const panelHeight = panelWidth * 1.02;
  const translateY = (1 - opacity) * tokens.motion.panelRise;
  const titleTranslateY = (1 - progress) * tokens.motion.titleRise * 0.6;

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <ArchivePanel
        fill="rgba(247, 243, 234, 0.76)"
        innerInset={tokens.layout.innerFrameInset}
        minHeight={panelHeight}
        opacity={opacity}
        stroke={tokens.palette.panelStroke}
        thickness={tokens.layout.hairline}
        translateY={translateY}
        width={panelWidth}
      >
        <div
          style={{
            boxSizing: "border-box",
            display: "grid",
            gap: panelWidth * 0.045,
            minHeight: panelHeight,
            paddingBottom: panelWidth * 0.06,
            paddingLeft: panelWidth * 0.065,
            paddingRight: panelWidth * 0.065,
            paddingTop: panelWidth * 0.065,
          }}
        >
          <div
            style={{
              display: "grid",
              gap: panelWidth * 0.028,
              justifyItems: "center",
            }}
          >
            <MicroMeta
              items={["SBI ART AUCTION", "SPECIAL PROGRAM"]}
              opacity={opacity * 0.92}
              fontFamily={tokens.typography.fonts.meta}
              fontSize={tokens.infoBoard.modeFontSize}
              fontWeight={tokens.typography.meta.fontWeight}
              tone={tokens.palette.textMeta}
              tracking={tokens.typography.meta.letterSpacing}
            />
            <div
              style={{
                color: tokens.palette.ink,
                fontFamily: tokens.typography.fonts.serif,
                fontSize: Math.min(panelWidth * 0.075, 58),
                fontWeight: tokens.typography.title.fontWeight,
                letterSpacing: "0.08em",
                lineHeight: 0.94,
                opacity: 0.14 + progress * 0.86,
                textAlign: "center",
                textTransform: "uppercase",
                transform: `translateY(${titleTranslateY}px)`,
              }}
            >
              Collectors Route Map
            </div>
            <DoubleRule
              color={tokens.palette.rule}
              gap={tokens.layout.ruleGap}
              opacity={0.32 + progress * 0.68}
              progress={progress}
              thickness={tokens.layout.hairline}
              width={Math.min(panelWidth * 0.58, tokens.layout.ruleWidth * 1.2)}
            />
          </div>
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(247, 243, 234, 0.94) 0%, rgba(247, 243, 234, 0.82) 100%)",
              border: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.44)",
              height: panelWidth * 0.72,
              overflow: "hidden",
              padding: panelWidth * 0.028,
              position: "relative",
            }}
          >
            <div
              style={{
                border: `${tokens.layout.hairline}px solid rgba(255, 255, 255, 0.48)`,
                inset: panelWidth * 0.022,
                pointerEvents: "none",
                position: "absolute",
              }}
            />
            <Img
              src={imageSrc}
              style={{
                height: "100%",
                objectFit: "contain",
                width: "100%",
              }}
            />
          </div>
        </div>
      </ArchivePanel>
    </div>
  );
};
