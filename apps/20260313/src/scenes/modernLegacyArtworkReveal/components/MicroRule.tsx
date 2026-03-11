import React from "react";

export type MicroRuleProps = {
  color: string;
  gap: number;
  opacity: number;
  progress: number;
  thickness: number;
  width: number;
};

export const MicroRule: React.FC<MicroRuleProps> = ({
  color,
  gap,
  opacity,
  progress,
  thickness,
  width,
}) => {
  const clampedProgress = Math.max(0, Math.min(progress, 1));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        opacity,
        width,
      }}
    >
      {[1, 0.84].map((lineOpacity, index) => {
        return (
          <div
            key={index}
            style={{
              backgroundColor: color,
              height: thickness,
              opacity: lineOpacity,
              transform: `scaleX(${Math.max(clampedProgress, 0.001)})`,
              transformOrigin: "left center",
              width,
            }}
          />
        );
      })}
    </div>
  );
};
