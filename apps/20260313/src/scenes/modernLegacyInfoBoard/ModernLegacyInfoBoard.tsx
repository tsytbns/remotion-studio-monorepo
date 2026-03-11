import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { AuctionThemeBackground } from "../../designSystem/AuctionThemeBackground";
import { useAuctionTypographyReady } from "../../designSystem/useAuctionTypographyReady";
import { modernLegacyTokens } from "../modernLegacyOpening/variantTokens.modernLegacy";
import { resolveTokens } from "../modernLegacyOpening/tokens";
import { LegacyInfoBoard } from "./components/LegacyInfoBoard";
import { SoftField } from "./components/SoftField";

export const modernLegacyInfoBoardSchema = z.object({
  mode: z.enum(["preview", "auction", "talk"]),
  title: z.string(),
  lines: z.array(z.string()),
  venue: z.string(),
  showSecondaryMeta: z.boolean(),
  backgroundImageSrc: z.string().nullable().optional(),
  alignment: z.enum(["center", "left"]),
});

export type ModernLegacyInfoBoardMode = z.infer<
  typeof modernLegacyInfoBoardSchema
>["mode"];
export type ModernLegacyInfoBoardAlignment = z.infer<
  typeof modernLegacyInfoBoardSchema
>["alignment"];
export type ModernLegacyInfoBoardProps = z.infer<
  typeof modernLegacyInfoBoardSchema
>;

export const modernLegacyInfoBoardDefaults: ModernLegacyInfoBoardProps = {
  mode: "preview",
  title: "MODERN LEGACY",
  lines: [
    "14 MARCH 2026",
    "AUCTION 14:00",
    "12 MARCH 11:00-19:00",
    "13 MARCH 11:00-19:00",
    "14 MARCH 11:00-13:00",
  ],
  venue: "Auction: Tokyo International Forum Hall D5\nPreview: Hall D7",
  showSecondaryMeta: true,
  backgroundImageSrc: null,
  alignment: "left",
};

export const modernLegacyTalkEventBoardDefaults: ModernLegacyInfoBoardProps = {
  mode: "talk",
  title: "MODERN LEGACY",
  lines: [
    "14 MARCH 2026",
    "11:00-12:00",
    "Tsuguharu Foujita / Portrait of Hélène Frank",
  ],
  venue: "Tokyo International Forum Hall D7",
  showSecondaryMeta: true,
  backgroundImageSrc: null,
  alignment: "left",
};

const getProgress = (
  frame: number,
  input: readonly [number, number],
  easing: (value: number) => number,
) => {
  return interpolate(frame, input, [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const ModernLegacyInfoBoard: React.FC<ModernLegacyInfoBoardProps> = ({
  mode,
  title,
  lines,
  venue,
  showSecondaryMeta,
  backgroundImageSrc,
  alignment,
}) => {
  useAuctionTypographyReady();

  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyTokens, { width, height });
  const backgroundProgress = getProgress(
    frame,
    [0, 18],
    Easing.bezier(0.16, 0.06, 0.18, 1),
  );
  const boardProgress = getProgress(
    frame,
    [10, 28],
    Easing.bezier(0.18, 0.05, 0.16, 1),
  );
  const ruleProgress = getProgress(
    frame,
    [18, 36],
    Easing.bezier(0.22, 0.04, 0.16, 1),
  );
  const textProgress = getProgress(
    frame,
    [26, 46],
    Easing.bezier(0.18, 0.04, 0.16, 1),
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
      }}
    >
      <AuctionThemeBackground program="modernLegacy" />
      <SoftField
        alignment={alignment}
        backgroundImageSrc={backgroundImageSrc}
        height={height}
        progress={backgroundProgress}
        tokens={tokens}
        width={width}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          paddingBottom: tokens.safeArea.y,
          paddingLeft: tokens.safeArea.x,
          paddingRight: tokens.safeArea.x,
          paddingTop: tokens.safeArea.y,
        }}
      >
        <LegacyInfoBoard
          alignment={alignment}
          boardProgress={boardProgress}
          lines={lines}
          mode={mode}
          ruleProgress={ruleProgress}
          showSecondaryMeta={showSecondaryMeta}
          textProgress={textProgress}
          title={title}
          tokens={tokens}
          venue={venue}
          width={width}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
