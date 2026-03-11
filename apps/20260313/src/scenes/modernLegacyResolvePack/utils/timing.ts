import { Easing, interpolate } from "remotion";

export const ML_HANDLE_FRAMES = 12;
export const ML_OPENING_CORE_DURATION = 80;
export const ML_TEXT_CORE_DURATION = 24;
export const ML_INFO_CORE_DURATION = 54;

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

export const clamp01 = (value: number) => {
  return clamp(value, 0, 1);
};

export const progress = (
  frame: number,
  input: readonly [number, number] | readonly number[],
  easing: (value: number) => number = Easing.bezier(0.18, 0.04, 0.16, 1),
) => {
  const [start = 0, end = 0] = input;

  return interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const toCoreFrame = (frame: number) => {
  return frame - ML_HANDLE_FRAMES;
};

export const getOpeningDuration = (holdFrames: number) => {
  return ML_HANDLE_FRAMES * 2 + ML_OPENING_CORE_DURATION + holdFrames;
};

export const getTextDuration = (holdFrames: number) => {
  return ML_HANDLE_FRAMES * 2 + ML_TEXT_CORE_DURATION + holdFrames;
};

export const getInfoDuration = (holdFrames: number) => {
  return ML_HANDLE_FRAMES * 2 + ML_INFO_CORE_DURATION + holdFrames;
};

export const sineDrift = (
  frame: number,
  durationInFrames: number,
  amplitude: number,
  phase = 0,
) => {
  if (durationInFrames <= 0 || amplitude === 0) {
    return 0;
  }

  return Math.sin((frame / durationInFrames) * Math.PI * 2 + phase) * amplitude;
};
