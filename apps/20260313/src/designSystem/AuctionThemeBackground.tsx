import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import {
  MintRippleBlocksBackground,
  type MintRippleBlocksBackgroundProps,
} from "../scenes/MintRippleBlocksBackground";
import {
  auctionProgramThemes,
  getAuctionBackgroundAspectMode,
  type AuctionProgramThemeName,
} from "./auctionThemeTokens";

export type AuctionThemeBackgroundProps = {
  aspectMode?: MintRippleBlocksBackgroundProps["aspectMode"];
  opacity?: number;
  program: AuctionProgramThemeName;
};

export const AuctionThemeBackground: React.FC<AuctionThemeBackgroundProps> = ({
  aspectMode,
  opacity = 1,
  program,
}) => {
  const { width, height } = useVideoConfig();
  const resolvedAspectMode =
    aspectMode ?? getAuctionBackgroundAspectMode(width, height);

  return (
    <AbsoluteFill style={{ opacity }}>
      <MintRippleBlocksBackground
        aspectMode={resolvedAspectMode}
        theme={auctionProgramThemes[program].rippleTheme}
      />
    </AbsoluteFill>
  );
};
