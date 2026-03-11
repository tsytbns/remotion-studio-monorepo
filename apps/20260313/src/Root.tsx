import React from "react";
import { Composition, Folder } from "remotion";
import { AuctionBloomNow } from "./scenes/AuctionBloomNow";
import { AuctionModernLegacy } from "./scenes/AuctionModernLegacy";
import {
  ElegantMetalTitle,
  elegantMetalTitleDefaults,
  elegantMetalTitleSchema,
} from "./scenes/ElegantMetalTitle";
import {
  MintRippleBlocksBackground,
  mintRippleBlocksBackgroundDefaults,
  mintRippleBlocksBackgroundSchema,
} from "./scenes/MintRippleBlocksBackground";
import {
  SbiArtAuctionSplash,
  sbiArtAuctionSplashDefaults,
  sbiArtAuctionSplashSchema,
} from "./scenes/SbiArtAuctionSplash";
import {
  ModernLegacyArtworkReveal,
  modernLegacyArtworkRevealDefaults,
  modernLegacyArtworkRevealSchema,
} from "./scenes/modernLegacyArtworkReveal/ModernLegacyArtworkReveal";
import {
  ModernLegacyCollectorsRouteStory,
  modernLegacyCollectorsRouteStoryDefaults,
  modernLegacyCollectorsRouteStoryDurationInFrames,
  modernLegacyCollectorsRouteStorySchema,
} from "./scenes/modernLegacyCollectorsRouteStory/ModernLegacyCollectorsRouteStory";
import {
  ModernLegacyInfoBoard,
  modernLegacyInfoBoardDefaults,
  modernLegacyInfoBoardSchema,
  modernLegacyTalkEventBoardDefaults,
} from "./scenes/modernLegacyInfoBoard/ModernLegacyInfoBoard";
import {
  calculateModernLegacyOpeningMetadata,
  ModernLegacyOpening,
  modernLegacyOpeningDefaults,
  modernLegacyOpeningSchema,
} from "./scenes/modernLegacyOpening/ModernLegacyOpening";
import {
  modernLegacyResolvePackFolders,
  modernLegacyResolvePackItems,
} from "./scenes/modernLegacyResolvePack/exportPack";

const FPS = 30;
const DURATION = 180;

const transparentProResDefaults = {
  defaultCodec: "prores" as const,
  defaultPixelFormat: "yuva444p10le" as const,
  defaultProResProfile: "4444" as const,
  defaultVideoImageFormat: "png" as const,
};

export const Root: React.FC = () => {
  return (
    <>
      <Folder name="Modern-Legacy">
        <Folder name="Openings">
          <Composition
            id="ModernLegacyOpening"
            component={ModernLegacyOpening}
            width={1080}
            height={1920}
            fps={FPS}
            durationInFrames={360}
            schema={modernLegacyOpeningSchema}
            defaultProps={modernLegacyOpeningDefaults}
            calculateMetadata={calculateModernLegacyOpeningMetadata}
          />
          <Composition
            id="ModernLegacyOpeningWide"
            component={ModernLegacyOpening}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={360}
            schema={modernLegacyOpeningSchema}
            defaultProps={modernLegacyOpeningDefaults}
            calculateMetadata={calculateModernLegacyOpeningMetadata}
          />
        </Folder>
        <Folder name="Boards">
          <Composition
            id="ModernLegacyInfoBoard"
            component={ModernLegacyInfoBoard}
            width={1080}
            height={1920}
            fps={FPS}
            durationInFrames={180}
            schema={modernLegacyInfoBoardSchema}
            defaultProps={modernLegacyInfoBoardDefaults}
          />
          <Composition
            id="ModernLegacyTalkEventBoard"
            component={ModernLegacyInfoBoard}
            width={1080}
            height={1920}
            fps={FPS}
            durationInFrames={300}
            schema={modernLegacyInfoBoardSchema}
            defaultProps={modernLegacyTalkEventBoardDefaults}
          />
        </Folder>
        <Folder name="Artwork">
          <Composition
            id="ModernLegacyArtworkReveal"
            component={ModernLegacyArtworkReveal}
            width={1080}
            height={1920}
            fps={FPS}
            durationInFrames={150}
            schema={modernLegacyArtworkRevealSchema}
            defaultProps={modernLegacyArtworkRevealDefaults}
          />
        </Folder>
        <Folder name="Stories">
          <Composition
            id="ModernLegacyCollectorsRouteStory"
            component={ModernLegacyCollectorsRouteStory}
            width={1080}
            height={1920}
            fps={FPS}
            durationInFrames={modernLegacyCollectorsRouteStoryDurationInFrames}
            schema={modernLegacyCollectorsRouteStorySchema}
            defaultProps={modernLegacyCollectorsRouteStoryDefaults}
          />
        </Folder>
        <Folder name="Resolve-Pack">
          {modernLegacyResolvePackFolders.map((folderName) => {
            return (
              <Folder key={folderName} name={folderName}>
                {modernLegacyResolvePackItems
                  .filter((item) => item.folder === folderName)
                  .map((item) => {
                    return (
                      <Composition
                        key={item.id}
                        id={item.id}
                        component={item.component}
                        width={item.width}
                        height={item.height}
                        fps={item.fps}
                        durationInFrames={item.durationInFrames}
                        schema={item.schema}
                        defaultProps={item.defaultProps}
                        calculateMetadata={item.calculateMetadata}
                      />
                    );
                  })}
              </Folder>
            );
          })}
        </Folder>
      </Folder>

      <Folder name="Title-Cards">
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
      </Folder>

      <Folder name="Backgrounds">
        <Folder name="Aspect-16x9">
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
        </Folder>
        <Folder name="Aspect-4x5">
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
        <Folder name="Aspect-9x16">
          <Composition
            id="MintRippleBackground9x16"
            component={MintRippleBlocksBackground}
            width={1080}
            height={1920}
            fps={60}
            durationInFrames={180}
            schema={mintRippleBlocksBackgroundSchema}
            defaultProps={{
              ...mintRippleBlocksBackgroundDefaults,
              aspectMode: "story",
              theme: "mint",
            }}
            calculateMetadata={async () => transparentProResDefaults}
          />
          <Composition
            id="ChampagneRippleBackground9x16"
            component={MintRippleBlocksBackground}
            width={1080}
            height={1920}
            fps={60}
            durationInFrames={180}
            schema={mintRippleBlocksBackgroundSchema}
            defaultProps={{
              ...mintRippleBlocksBackgroundDefaults,
              aspectMode: "story",
              theme: "champagne",
            }}
            calculateMetadata={async () => transparentProResDefaults}
          />
        </Folder>
      </Folder>

      <Folder name="Studies">
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
      </Folder>
    </>
  );
};
