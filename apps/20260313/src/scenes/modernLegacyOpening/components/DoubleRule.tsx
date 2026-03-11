import React from "react";

export type DoubleRuleProps = {
  width: number;
  progress: number;
  color: string;
  thickness: number;
  gap: number;
  opacity: number;
};

export const DoubleRule: React.FC<DoubleRuleProps> = ({
  width,
  progress,
  color,
  thickness,
  gap,
  opacity,
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
