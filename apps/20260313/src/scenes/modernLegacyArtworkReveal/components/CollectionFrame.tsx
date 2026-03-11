import React from "react";
import type { ResolvedTokens } from "../../modernLegacyOpening/tokens";
import type { FrameRect } from "../ModernLegacyArtworkReveal";

export type CollectionFrameProps = {
  children: React.ReactNode;
  opacity: number;
  rect: FrameRect;
  tokens: ResolvedTokens;
};

export const CollectionFrame: React.FC<CollectionFrameProps> = ({
  children,
  opacity,
  rect,
  tokens,
}) => {
  return (
    <div
      style={{
        height: rect.height,
        left: rect.x,
        opacity,
        position: "absolute",
        top: rect.y,
        width: rect.width,
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(247, 243, 234, 0.34) 0%, rgba(247, 243, 234, 0.1) 100%)",
          border: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
          boxShadow:
            "0 18px 44px rgba(32, 50, 41, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.24)",
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: `${tokens.layout.hairline}px solid ${tokens.palette.panelStroke}`,
            inset: tokens.layout.innerFrameInset,
            opacity: 0.88,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
        {children}
      </div>
    </div>
  );
};
