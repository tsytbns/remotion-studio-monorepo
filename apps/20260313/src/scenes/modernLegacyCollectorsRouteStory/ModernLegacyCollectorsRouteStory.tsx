import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { AuctionThemeBackground } from "../../designSystem/AuctionThemeBackground";
import { useAuctionTypographyReady } from "../../designSystem/useAuctionTypographyReady";
import { resolveTokens } from "../modernLegacyOpening/tokens";
import { modernLegacyTokens } from "../modernLegacyOpening/variantTokens.modernLegacy";
import { collectorsRouteMapNote, collectorsRouteScheduleDays } from "./data";
import { DayScheduleCard } from "./components/DayScheduleCard";
import { RouteMapCard } from "./components/RouteMapCard";

export const modernLegacyCollectorsRouteStorySchema = z.object({
  routeMapImageSrc: z.string(),
  routeMapNote: z.string(),
});

export type ModernLegacyCollectorsRouteStoryProps = z.infer<
  typeof modernLegacyCollectorsRouteStorySchema
>;

export const modernLegacyCollectorsRouteStoryDefaults: ModernLegacyCollectorsRouteStoryProps =
  {
    routeMapImageSrc: staticFile("assets/lp/collectors-route-map.jpg"),
    routeMapNote: collectorsRouteMapNote,
  };

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const routeMapDuration = 162;
const scheduleFrom = 150;
const dayFromStep = 84;
const dayDuration = 96;

export const modernLegacyCollectorsRouteStoryDurationInFrames =
  scheduleFrom +
  dayFromStep * (collectorsRouteScheduleDays.length - 1) +
  dayDuration +
  12;

export const ModernLegacyCollectorsRouteStory: React.FC<
  ModernLegacyCollectorsRouteStoryProps
> = ({ routeMapImageSrc, routeMapNote }) => {
  useAuctionTypographyReady();

  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tokens = resolveTokens(modernLegacyTokens, { width, height });
  const backgroundProgress = interpolate(frame, [0, 18], [0, 1], {
    easing: Easing.bezier(0.18, 0.06, 0.16, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const routeMapOpacity = interpolate(
    frame,
    [0, 18, routeMapDuration - 24, routeMapDuration],
    [0, 1, 1, 0],
    {
      easing: Easing.bezier(0.18, 0.06, 0.16, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const routeMapProgress = interpolate(frame, [12, 38], [0, 1], {
    easing: Easing.bezier(0.18, 0.06, 0.16, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
      }}
    >
      <AuctionThemeBackground aspectMode="story" program="modernLegacy" />
      <AbsoluteFill
        style={{
          background: [
            `linear-gradient(180deg, rgba(247, 243, 234, 0.1) 0%, rgba(247, 243, 234, 0.02) 42%, rgba(15, 28, 23, 0.12) 100%)`,
            `radial-gradient(circle at 50% 14%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 26%, rgba(255, 255, 255, 0) 54%)`,
          ].join(", "),
          opacity: 0.24 + backgroundProgress * 0.28,
        }}
      />
      <div
        style={{
          border: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
          inset: `${tokens.safeArea.y}px ${tokens.safeArea.x}px`,
          opacity: 0.2 + backgroundProgress * 0.24,
          pointerEvents: "none",
          position: "absolute",
        }}
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
        <Sequence from={0} durationInFrames={routeMapDuration}>
          <RouteMapCard
            imageSrc={routeMapImageSrc}
            note={routeMapNote}
            opacity={clamp(routeMapOpacity, 0, 1)}
            progress={clamp(routeMapProgress, 0, 1)}
            tokens={tokens}
            width={width}
          />
        </Sequence>
        {collectorsRouteScheduleDays.map((day, index) => {
          return (
            <Sequence
              key={day.date}
              from={scheduleFrom + index * dayFromStep}
              durationInFrames={dayDuration}
            >
              <DayScheduleCard
                day={day}
                days={collectorsRouteScheduleDays}
                tokens={tokens}
                width={width}
              />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
