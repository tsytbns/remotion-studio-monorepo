import React from "react";
import {
  Composition,
  AbsoluteFill,
  Folder,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { LinkedParticles } from "./scenes/LinkedParticles";
import { AuctionModernLegacy } from "./scenes/AuctionModernLegacy";
import { AuctionBloomNow } from "./scenes/AuctionBloomNow";
import {
  ElegantMetalTitle,
  elegantMetalTitleDefaults,
  elegantMetalTitleSchema,
} from "./scenes/ElegantMetalTitle";
import {
  SbiArtAuctionSplash,
  sbiArtAuctionSplashDefaults,
  sbiArtAuctionSplashSchema,
} from "./scenes/SbiArtAuctionSplash";
import {
  MintRippleBlocksBackground,
  mintRippleBlocksBackgroundDefaults,
  mintRippleBlocksBackgroundSchema,
} from "./scenes/MintRippleBlocksBackground";

// These placeholders are replaced by scripts/create-project.ts when generating a new project
const WIDTH = 1350;
const HEIGHT = 1080;
const FPS = 30;
const DURATION = 180;

const templateMainSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  background: z.string(),
  textColor: z.string(),
});

const linkedParticlesSchema = z.object({
  seed: z.union([z.string(), z.number()]).optional(),
  showGUI: z.boolean().optional(),
});

type TemplateMainProps = z.infer<typeof templateMainSchema>;
type LinkedParticlesProps = z.infer<typeof linkedParticlesSchema>;

const templateMainDefaults: TemplateMainProps = {
  title: "New Remotion Project",
  subtitle: "Frame/FPS preview",
  background: "#0b0d12",
  textColor: "#fff",
};

const linkedParticlesDefaults: LinkedParticlesProps = {
  seed: "LinkedParticles",
};

const transparentProResDefaults = {
  defaultCodec: "prores" as const,
  defaultPixelFormat: "yuva444p10le" as const,
  defaultProResProfile: "4444" as const,
  defaultVideoImageFormat: "png" as const,
};

const TemplateMain: React.FC<TemplateMainProps> = ({
  title,
  subtitle,
  background,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        background,
        color: textColor,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 800, marginBottom: 16 }}>
          {title}
        </div>
        <div style={{ fontSize: 24, opacity: 0.8 }}>
          {subtitle} / Frame: {frame} / FPS: {fps}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => {
  return (
    <>
      <Folder name="Backgrounds">
        <Composition
          id="MintRippleBackground16x9"
          component={MintRippleBlocksBackground}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={180}
          schema={mintRippleBlocksBackgroundSchema}
          defaultProps={{
            ...mintRippleBlocksBackgroundDefaults,
            aspectMode: "wide",
            theme: "mint",
          }}
          calculateMetadata={async () => transparentProResDefaults}
        />
        <Composition
          id="MintRippleBackground4x5"
          component={MintRippleBlocksBackground}
          width={1080}
          height={1350}
          fps={60}
          durationInFrames={180}
          schema={mintRippleBlocksBackgroundSchema}
          defaultProps={{
            ...mintRippleBlocksBackgroundDefaults,
            aspectMode: "portrait",
            theme: "mint",
          }}
          calculateMetadata={async () => transparentProResDefaults}
        />
        <Composition
          id="ChampagneRippleBackground16x9"
          component={MintRippleBlocksBackground}
          width={1920}
          height={1080}
          fps={60}
          durationInFrames={180}
          schema={mintRippleBlocksBackgroundSchema}
          defaultProps={{
            ...mintRippleBlocksBackgroundDefaults,
            aspectMode: "wide",
            theme: "champagne",
          }}
          calculateMetadata={async () => transparentProResDefaults}
        />
        <Composition
          id="ChampagneRippleBackground4x5"
          component={MintRippleBlocksBackground}
          width={1080}
          height={1350}
          fps={60}
          durationInFrames={180}
          schema={mintRippleBlocksBackgroundSchema}
          defaultProps={{
            ...mintRippleBlocksBackgroundDefaults,
            aspectMode: "portrait",
            theme: "champagne",
          }}
          calculateMetadata={async () => transparentProResDefaults}
        />
      </Folder>
      <Composition
        id="ElegantMetalTitle"
        component={ElegantMetalTitle}
        width={1920}
        height={1080}
        fps={60}
        durationInFrames={180}
        schema={elegantMetalTitleSchema}
        defaultProps={elegantMetalTitleDefaults}
        calculateMetadata={async () => transparentProResDefaults}
      />
      <Composition
        id="SbiArtAuctionSplash"
        component={SbiArtAuctionSplash}
        width={1920}
        height={1080}
        fps={60}
        durationInFrames={180}
        schema={sbiArtAuctionSplashSchema}
        defaultProps={sbiArtAuctionSplashDefaults}
        calculateMetadata={async () => transparentProResDefaults}
      />
      <Composition
        id="Main"
        component={TemplateMain}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={DURATION}
        schema={templateMainSchema}
        defaultProps={templateMainDefaults}
      />
      <Composition
        id="LinkedParticles"
        component={LinkedParticles}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={DURATION}
        schema={linkedParticlesSchema}
        defaultProps={linkedParticlesDefaults}
      />
      <Composition
        id="AuctionModernLegacy"
        component={AuctionModernLegacy}
        width={1080}
        height={1350}
        fps={FPS}
        durationInFrames={DURATION}
      />
      <Composition
        id="AuctionBloomNow"
        component={AuctionBloomNow}
        width={1080}
        height={1350}
        fps={FPS}
        durationInFrames={DURATION}
      />
    </>
  );
};

export { TemplateMain };
