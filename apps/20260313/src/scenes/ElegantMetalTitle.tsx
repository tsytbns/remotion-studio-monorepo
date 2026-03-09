import React, { useMemo } from "react";
import { fitText, measureText } from "@remotion/layout-utils";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

const { fontFamily: cormorantDisplay } = loadCormorant("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

const { fontFamily: cormorantItalic } = loadCormorant("italic", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const elegantMetalTitleSchema = z.object({
  primaryText: z.string(),
  secondaryText: z.string(),
  previewBackdrop: z.boolean(),
  primaryUppercase: z.boolean(),
});

export type ElegantMetalTitleProps = z.infer<typeof elegantMetalTitleSchema>;

export const elegantMetalTitleDefaults: ElegantMetalTitleProps = {
  primaryText: "Tamara DE LEMPICKA",
  secondaryText: "Study for 'Femmes au Bain'",
  previewBackdrop: false,
  primaryUppercase: true,
};

type LayoutOptions = {
  fontFamily: string;
  fontStyle: "normal" | "italic";
  fontWeight: string;
  idealFontSize: number;
  maxFontSize: number;
  minFontSize: number;
  maxLines: number;
  text: string;
  withinWidth: number;
};

type TextLayout = {
  fontSize: number;
  longestLineWidth: number;
  text: string;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const getLongestLine = (text: string) => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .reduce((longest, line) => {
      return line.length > longest.length ? line : longest;
    }, "");
};

const balanceEnglishText = ({
  text,
  withinWidth,
  fontFamily,
  fontStyle,
  fontWeight,
  idealFontSize,
  maxLines,
}: Omit<LayoutOptions, "maxFontSize" | "minFontSize">) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length === 0 || normalized.includes("\n")) {
    return normalized;
  }

  const words = normalized.split(" ");
  if (words.length <= 2) {
    return normalized;
  }

  const measurementFontSize = 100;
  const lineWidthCache = new Map<string, number>();
  const measureLine = (line: string) => {
    const cached = lineWidthCache.get(line);
    if (typeof cached === "number") {
      return cached;
    }

    const measuredWidth = measureText({
      text: line,
      fontFamily,
      fontSize: measurementFontSize,
      fontWeight,
      additionalStyles: {
        fontStyle,
      },
    }).width;

    lineWidthCache.set(line, measuredWidth);
    return measuredWidth;
  };

  const totalWidth = measureLine(normalized);
  const singleLineFontSize = (withinWidth * measurementFontSize) / totalWidth;
  if (singleLineFontSize >= idealFontSize * 0.84) {
    return normalized;
  }

  let bestText = normalized;
  let bestScore = Number.POSITIVE_INFINITY;

  const evaluateLines = (lines: string[]) => {
    const widths = lines.map((line) => measureLine(line));
    const widestLine = Math.max(...widths);
    const narrowestLine = Math.min(...widths);
    const estimatedFontSize = (withinWidth * measurementFontSize) / widestLine;
    const balancePenalty = widestLine - narrowestLine;
    const linePenalty = (lines.length - 1) * 18;
    const smallTypePenalty =
      estimatedFontSize < idealFontSize * 0.9
        ? (idealFontSize * 0.9 - estimatedFontSize) * 3
        : 0;

    const score =
      Math.abs(idealFontSize - Math.min(estimatedFontSize, idealFontSize)) *
        1.6 +
      balancePenalty * 0.12 +
      linePenalty +
      smallTypePenalty;

    if (score < bestScore) {
      bestScore = score;
      bestText = lines.join("\n");
    }
  };

  const search = (startIndex: number, linesLeft: number, lines: string[]) => {
    if (linesLeft === 1) {
      evaluateLines([...lines, words.slice(startIndex).join(" ")]);
      return;
    }

    const minEnd = startIndex + 1;
    const maxEnd = words.length - linesLeft + 1;

    for (let endIndex = minEnd; endIndex <= maxEnd; endIndex++) {
      lines.push(words.slice(startIndex, endIndex).join(" "));
      search(endIndex, linesLeft - 1, lines);
      lines.pop();
    }
  };

  for (let lineCount = 2; lineCount <= maxLines; lineCount++) {
    search(0, lineCount, []);
  }

  return bestText;
};

const createTextLayout = ({
  fontFamily,
  fontStyle,
  fontWeight,
  idealFontSize,
  maxFontSize,
  minFontSize,
  maxLines,
  text,
  withinWidth,
}: LayoutOptions): TextLayout => {
  const balancedText = balanceEnglishText({
    text,
    withinWidth,
    fontFamily,
    fontStyle,
    fontWeight,
    idealFontSize,
    maxLines,
  });

  const longestLine = getLongestLine(balancedText);
  const fitted = fitText({
    text: longestLine,
    withinWidth,
    fontFamily,
    fontWeight,
    additionalStyles: {
      fontStyle,
    },
  });
  const fontSize = clamp(fitted.fontSize, minFontSize, maxFontSize);
  const longestLineWidth = measureText({
    text: longestLine,
    fontFamily,
    fontSize,
    fontWeight,
    additionalStyles: {
      fontStyle,
    },
  }).width;

  return {
    fontSize,
    longestLineWidth,
    text: balancedText,
  };
};

const metalBaseBackground = [
  "linear-gradient(180deg, #4d3913 0%, #6a4f1d 12%, #f2dfab 28%, #b88935 44%, #fff4ce 52%, #b07f2d 64%, #654817 100%)",
  "linear-gradient(108deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.02) 18%, rgba(54,33,4,0.12) 40%, rgba(255,247,220,0.18) 67%, rgba(255,255,255,0.04) 100%)",
  "repeating-linear-gradient(112deg, rgba(255,255,255,0.02) 0 8px, rgba(255,255,255,0.1) 8px 11px, rgba(95,68,18,0.16) 11px 18px)",
].join(",");

const diffuseSweepBackground =
  "linear-gradient(104deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 34%, rgba(255,244,213,0.14) 44%, rgba(255,250,236,0.8) 50%, rgba(255,255,255,0.96) 53%, rgba(255,245,210,0.35) 59%, rgba(255,255,255,0) 69%, rgba(255,255,255,0) 100%)";

const glintBackground =
  "linear-gradient(109deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 47.8%, rgba(255,255,255,0.98) 49.7%, rgba(255,252,245,1) 50%, rgba(255,239,185,0.92) 50.7%, rgba(255,255,255,0) 53%, rgba(255,255,255,0) 100%)";

type MetallicTextProps = {
  fontFamily: string;
  fontSize: number;
  fontStyle: "normal" | "italic";
  fontWeight: string;
  glintOpacity: number;
  glintPosition: number;
  sweepOpacity: number;
  sweepPosition: number;
  text: string;
  textTransform?: "uppercase";
  tracking: string;
};

const MetallicText: React.FC<MetallicTextProps> = ({
  fontFamily,
  fontSize,
  fontStyle,
  fontWeight,
  glintOpacity,
  glintPosition,
  sweepOpacity,
  sweepPosition,
  text,
  textTransform,
  tracking,
}) => {
  const sharedTextStyle: React.CSSProperties = {
    display: "inline-block",
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    letterSpacing: tracking,
    lineHeight: 1,
    position: "relative",
    textAlign: "center",
    textTransform,
    whiteSpace: "pre-line",
  };

  return (
    <div
      style={{
        ...sharedTextStyle,
        filter: "drop-shadow(0 10px 28px rgba(51, 34, 5, 0.24))",
      }}
    >
      <div
        style={{
          ...sharedTextStyle,
          color: "rgba(82, 57, 14, 0.68)",
          position: "absolute",
          inset: 0,
          transform: "translateY(3px)",
        }}
      >
        {text}
      </div>
      <div
        style={{
          ...sharedTextStyle,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          backgroundImage: metalBaseBackground,
          backgroundBlendMode: "screen, overlay, normal",
          color: "transparent",
          textShadow:
            "0 1px 0 rgba(72, 52, 18, 0.55), 0 2px 0 rgba(102, 76, 28, 0.42), 0 14px 36px rgba(63, 42, 10, 0.18)",
        }}
      >
        {text}
      </div>
      <div
        style={{
          ...sharedTextStyle,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          backgroundImage: diffuseSweepBackground,
          backgroundPosition: `${sweepPosition}% 0%`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "220% 100%",
          color: "transparent",
          opacity: sweepOpacity,
          position: "absolute",
          inset: 0,
        }}
      >
        {text}
      </div>
      <div
        style={{
          ...sharedTextStyle,
          color: "rgba(255, 247, 226, 0.3)",
          position: "absolute",
          inset: 0,
          textShadow:
            "0 0 1px rgba(255, 255, 255, 0.85), 0 0 20px rgba(255, 240, 186, 0.38)",
        }}
      >
        {text}
      </div>
      <div
        style={{
          ...sharedTextStyle,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          backgroundImage: glintBackground,
          backgroundPosition: `${glintPosition}% 0%`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "180% 100%",
          color: "transparent",
          opacity: glintOpacity,
          position: "absolute",
          inset: 0,
        }}
      >
        {text}
      </div>
    </div>
  );
};

type MetallicRuleProps = {
  glintOpacity: number;
  glintPosition: number;
  sweepOpacity: number;
  sweepPosition: number;
  width: number;
};

const MetallicRule: React.FC<MetallicRuleProps> = ({
  glintOpacity,
  glintPosition,
  sweepOpacity,
  sweepPosition,
  width,
}) => {
  return (
    <div
      style={{
        height: 2,
        position: "relative",
        width,
      }}
    >
      <div
        style={{
          backgroundImage: metalBaseBackground,
          backgroundBlendMode: "screen, overlay, normal",
          borderRadius: 999,
          boxShadow:
            "0 1px 0 rgba(86, 63, 18, 0.45), 0 6px 20px rgba(72, 50, 14, 0.16)",
          inset: 0,
          position: "absolute",
        }}
      />
      <div
        style={{
          backgroundImage: diffuseSweepBackground,
          backgroundPosition: `${sweepPosition}% 0%`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "220% 100%",
          borderRadius: 999,
          inset: -1,
          opacity: sweepOpacity,
          position: "absolute",
        }}
      />
      <div
        style={{
          backgroundImage: glintBackground,
          backgroundPosition: `${glintPosition}% 0%`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "180% 100%",
          borderRadius: 999,
          filter: "blur(0.3px)",
          inset: -2,
          opacity: glintOpacity,
          position: "absolute",
        }}
      />
    </div>
  );
};

const PreviewBackdrop: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 35%, rgba(255, 252, 244, 0.45) 0%, rgba(255, 247, 228, 0.12) 24%, rgba(240, 229, 204, 0) 56%), linear-gradient(160deg, #f2e7ce 0%, #e8d8b9 34%, #efe4cf 68%, #e1d2b1 100%)",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.06) 0 6px, rgba(221,204,170,0.04) 6px 16px), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 72%)",
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};

export const ElegantMetalTitle: React.FC<ElegantMetalTitleProps> = ({
  primaryText,
  secondaryText,
  previewBackdrop,
  primaryUppercase,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const primaryDisplayText = primaryUppercase
    ? primaryText.toUpperCase()
    : primaryText;
  const safeSecondaryText = secondaryText.trim();
  const hasSecondaryText = safeSecondaryText.length > 0;

  const primaryLayout = useMemo(() => {
    return createTextLayout({
      fontFamily: cormorantDisplay,
      fontStyle: "normal",
      fontWeight: "600",
      idealFontSize: 146,
      maxFontSize: 176,
      minFontSize: 88,
      maxLines: 3,
      text: primaryDisplayText,
      withinWidth: width * 0.58,
    });
  }, [primaryDisplayText, width]);

  const secondaryLayout = useMemo(() => {
    if (!hasSecondaryText) {
      return null;
    }

    return createTextLayout({
      fontFamily: cormorantItalic,
      fontStyle: "italic",
      fontWeight: "500",
      idealFontSize: 56,
      maxFontSize: 66,
      minFontSize: 34,
      maxLines: 4,
      text: safeSecondaryText,
      withinWidth: width * 0.46,
    });
  }, [hasSecondaryText, safeSecondaryText, width]);

  const diffuseProgress = interpolate(frame, [0, 90], [0, 1], {
    easing: Easing.bezier(0.2, 0.1, 0.22, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const macroProgress = interpolate(frame, [91, 150], [0, 1], {
    easing: Easing.bezier(0.18, 0.04, 0.22, 0.98),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glintTravel = interpolate(frame, [151, 168], [-120, 118], {
    easing: Easing.bezier(0.34, 0, 0.72, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glintOpacity = interpolate(
    frame,
    [151, 158, 166, 180],
    [0, 0.92, 0.72, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const sweepPosition = frame <= 90 ? -145 + diffuseProgress * 255 : 42;
  const sweepOpacity =
    frame <= 90
      ? interpolate(diffuseProgress, [0, 1], [0.54, 0.84], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(macroProgress, [0, 1], [0.5, 0.34], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const ruleWidth = clamp(
    Math.max(
      primaryLayout.longestLineWidth * 1.05,
      secondaryLayout ? secondaryLayout.longestLineWidth * 1.12 : 0,
      width * 0.22,
    ),
    width * 0.22,
    width * 0.54,
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        backgroundColor: "transparent",
        justifyContent: "center",
      }}
    >
      {previewBackdrop ? <PreviewBackdrop /> : null}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: width * 0.12,
          paddingRight: width * 0.12,
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: hasSecondaryText ? 24 : 0,
            position: "relative",
            textAlign: "center",
            transform: `perspective(2200px) translateY(${interpolate(
              macroProgress,
              [0, 1],
              [0, -7],
            )}px) scale(${interpolate(macroProgress, [0, 1], [1, 1.036])}) rotateX(${interpolate(
              macroProgress,
              [0, 1],
              [0, -1.35],
            )}deg) rotateY(${interpolate(macroProgress, [0, 1], [0, 1.85])}deg)`,
            transformStyle: "preserve-3d",
            width: width * 0.62,
          }}
        >
          <div
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(206, 169, 80, 0.22) 0%, rgba(206, 169, 80, 0.06) 38%, rgba(206, 169, 80, 0) 72%)",
              filter: "blur(42px)",
              height: 220,
              left: "50%",
              pointerEvents: "none",
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -46%)",
              width: Math.max(ruleWidth * 1.15, width * 0.3),
            }}
          />
          <MetallicText
            fontFamily={cormorantDisplay}
            fontSize={primaryLayout.fontSize}
            fontStyle="normal"
            fontWeight="600"
            glintOpacity={glintOpacity}
            glintPosition={glintTravel}
            sweepOpacity={sweepOpacity}
            sweepPosition={sweepPosition}
            text={primaryLayout.text}
            textTransform={primaryUppercase ? "uppercase" : undefined}
            tracking={primaryLayout.text.includes("\n") ? "0.03em" : "0.055em"}
          />
          {hasSecondaryText ? (
            <>
              <MetallicRule
                glintOpacity={glintOpacity}
                glintPosition={glintTravel}
                sweepOpacity={sweepOpacity}
                sweepPosition={sweepPosition}
                width={ruleWidth}
              />
              <MetallicText
                fontFamily={cormorantItalic}
                fontSize={secondaryLayout?.fontSize ?? 46}
                fontStyle="italic"
                fontWeight="500"
                glintOpacity={glintOpacity}
                glintPosition={glintTravel}
                sweepOpacity={sweepOpacity * 0.82}
                sweepPosition={sweepPosition}
                text={secondaryLayout?.text ?? ""}
                tracking="0.018em"
              />
            </>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
