import React from "react";

export type ArchivePanelProps = {
  width: number;
  minHeight: number;
  opacity: number;
  translateY: number;
  fill: string;
  stroke: string;
  children: React.ReactNode;
  innerInset?: number;
  thickness?: number;
};

export const ArchivePanel: React.FC<ArchivePanelProps> = ({
  width,
  minHeight,
  opacity,
  translateY,
  fill,
  stroke,
  children,
  innerInset = 12,
  thickness = 1,
}) => {
  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${fill} 0%, rgba(247, 243, 234, 0.48) 100%)`,
        border: `${thickness}px solid ${stroke}`,
        boxShadow:
          "0 22px 58px rgba(32, 50, 41, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.28)",
        minHeight,
        opacity,
        position: "relative",
        transform: `translateY(${translateY}px)`,
        width,
      }}
    >
      <div
        style={{
          border: `${thickness}px solid ${stroke}`,
          inset: innerInset,
          opacity: 0.88,
          pointerEvents: "none",
          position: "absolute",
        }}
      />
      <div
        style={{
          minHeight,
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
};
