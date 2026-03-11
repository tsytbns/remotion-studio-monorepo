import React from "react";
import { Img } from "remotion";
import type { ResolvedTokens } from "../../modernLegacyOpening/tokens";
import type {
  FrameRect,
  ModernLegacyArtworkPosition,
} from "../ModernLegacyArtworkReveal";

export type ArtworkStageProps = {
  artworkPosition: ModernLegacyArtworkPosition;
  imageSrc: string;
  progress: number;
  rect: FrameRect;
  tokens: ResolvedTokens;
};

const objectXMap: Record<ModernLegacyArtworkPosition["x"], string> = {
  left: "34%",
  center: "50%",
  right: "66%",
};

const objectYMap: Record<ModernLegacyArtworkPosition["y"], string> = {
  upper: "34%",
  center: "50%",
  lower: "66%",
};

export const ArtworkStage: React.FC<ArtworkStageProps> = ({
  artworkPosition,
  imageSrc,
  progress,
  rect,
  tokens,
}) => {
  const matteInset = Math.min(rect.width, rect.height) * 0.045;
  const scale = (artworkPosition.scale ?? 1) * (1.01 - progress * 0.01);

  return (
    <div
      style={{
        inset: matteInset,
        overflow: "hidden",
        position: "absolute",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(250, 247, 240, 0.92) 0%, rgba(241, 235, 225, 0.78) 100%)",
          inset: 0,
          position: "absolute",
        }}
      />
      <Img
        src={imageSrc}
        style={{
          filter: "saturate(0.98) contrast(1.01)",
          height: "100%",
          objectFit: artworkPosition.fit,
          objectPosition: `${objectXMap[artworkPosition.x]} ${objectYMap[artworkPosition.y]}`,
          opacity: 0.16 + progress * 0.84,
          transform: `scale(${scale})`,
          width: "100%",
        }}
      />
      <div
        style={{
          border: `${tokens.layout.hairline}px solid rgba(255, 255, 255, 0.4)`,
          inset: 0,
          pointerEvents: "none",
          position: "absolute",
        }}
      />
      <div
        style={{
          boxShadow: "inset 0 0 0 1px rgba(32, 50, 41, 0.06)",
          inset: 0,
          pointerEvents: "none",
          position: "absolute",
        }}
      />
    </div>
  );
};
