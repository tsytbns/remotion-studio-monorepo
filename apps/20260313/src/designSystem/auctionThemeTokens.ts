import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import type { MintRippleBlocksBackgroundProps } from "../scenes/MintRippleBlocksBackground";

export const auctionEnglishFontFamily = "Collier";

export const auctionEnglishFontReady = loadFont({
  display: "block",
  family: auctionEnglishFontFamily,
  format: "opentype",
  url: staticFile("fonts/Collier-Thin.otf"),
  weight: "300",
});

export type AuctionProgramThemeName = "modernLegacy" | "bloomNow";

export type AuctionProgramTheme = {
  accentGold: string;
  canvasIvory: string;
  canvasSmoke: string;
  deepTone: string;
  deepToneWash: string;
  displayText: string;
  metaText: string;
  panelStroke: string;
  rippleTheme: MintRippleBlocksBackgroundProps["theme"];
  titleInk: string;
};

export const auctionProgramThemes: Record<
  AuctionProgramThemeName,
  AuctionProgramTheme
> = {
  modernLegacy: {
    accentGold: "#B49B63",
    canvasIvory: "#F7F3EA",
    canvasSmoke: "#D8D2C7",
    deepTone: "#203229",
    deepToneWash: "rgba(32, 50, 41, 0.16)",
    displayText: "#F7F3EA",
    metaText: "rgba(247, 243, 234, 0.76)",
    panelStroke: "rgba(180, 155, 99, 0.32)",
    rippleTheme: "mint",
    titleInk: "#211C17",
  },
  bloomNow: {
    accentGold: "#B49B63",
    canvasIvory: "#F7F0E4",
    canvasSmoke: "#DCCFAF",
    deepTone: "#9A8B59",
    deepToneWash: "rgba(154, 139, 89, 0.12)",
    displayText: "#2A2520",
    metaText: "rgba(42, 37, 32, 0.72)",
    panelStroke: "rgba(180, 155, 99, 0.28)",
    rippleTheme: "champagne",
    titleInk: "#2A2520",
  },
};

export const getAuctionBackgroundAspectMode = (
  width: number,
  height: number,
): MintRippleBlocksBackgroundProps["aspectMode"] => {
  const ratio = height / width;

  if (ratio >= 1.6) {
    return "story";
  }

  if (ratio >= 1.2) {
    return "portrait";
  }

  return "wide";
};
