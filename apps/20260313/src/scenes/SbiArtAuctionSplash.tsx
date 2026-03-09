import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { SbiArtAuctionBanner } from "../components/SbiArtAuctionBanner";

export const sbiArtAuctionSplashSchema = z.object({
  label: z.string(),
  previewBackdrop: z.boolean(),
});

export type SbiArtAuctionSplashProps = z.infer<
  typeof sbiArtAuctionSplashSchema
>;

export const sbiArtAuctionSplashDefaults: SbiArtAuctionSplashProps = {
  label: "SBI Art Auction",
  previewBackdrop: false,
};

const PreviewBackdrop: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.45) 0%, rgba(255,248,232,0.16) 26%, rgba(255,248,232,0) 60%), linear-gradient(160deg, #f0e8d9 0%, #e1d0b0 40%, #efe4d2 68%, #d8c19a 100%)",
      }}
    />
  );
};

export const SbiArtAuctionSplash: React.FC<SbiArtAuctionSplashProps> = ({
  label,
  previewBackdrop,
}) => {
  const frame = useCurrentFrame();

  const pushIn = interpolate(frame, [0, 180], [0, 1], {
    easing: Easing.bezier(0.16, 0.06, 0.18, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        backgroundColor: "transparent",
        justifyContent: "center",
      }}
    >
      {previewBackdrop ? <PreviewBackdrop /> : null}
      <div
        style={{
          position: "relative",
          transform: `translateY(${interpolate(pushIn, [0, 1], [10, -6])}px)`,
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(196, 165, 92, 0.28) 0%, rgba(196, 165, 92, 0.08) 34%, rgba(196, 165, 92, 0) 72%)",
            filter: "blur(36px)",
            height: 180,
            left: "50%",
            pointerEvents: "none",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 820,
          }}
        />
        <SbiArtAuctionBanner
          delayInSeconds={0.15}
          fontSize={54}
          label={label}
          letterSpacing="0.22em"
          paddingX={72}
          paddingYBottom={22}
          paddingYTop={28}
          scale={1}
        />
      </div>
    </AbsoluteFill>
  );
};
