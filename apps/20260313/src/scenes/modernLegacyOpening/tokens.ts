import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";

const { fontFamily: cormorantSerif } = loadCormorant("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export type RelativeUnit = {
  basis: "width" | "height" | "min";
  ratio: number;
  minPx?: number;
  maxPx?: number;
  round?: "none" | "int";
};

export type FrameRange = readonly [number, number];

export type Dimensions = {
  width: number;
  height: number;
};

export type ResolveTokenValue<T> = T extends RelativeUnit
  ? number
  : T extends readonly (infer U)[]
    ? readonly ResolveTokenValue<U>[]
    : T extends object
      ? { [K in keyof T]: ResolveTokenValue<T[K]> }
      : T;

export type BaseTokens = {
  palette: {
    canvas: string;
    canvasShade: string;
    smoke: string;
    ivory: string;
    gold: string;
    rule: string;
    deepGreen: string;
    deepGreenWash: string;
    ink: string;
    textSecondary: string;
    textMeta: string;
    panelFill: string;
    panelStroke: string;
  };
  safeArea: {
    x: RelativeUnit;
    y: RelativeUnit;
  };
  layout: {
    contentMaxWidth: RelativeUnit;
    panelWidth: RelativeUnit;
    panelMinHeight: RelativeUnit;
    panelPaddingX: RelativeUnit;
    panelPaddingTop: RelativeUnit;
    panelPaddingBottom: RelativeUnit;
    alignmentShiftLower: RelativeUnit;
    alignmentShiftCenter: RelativeUnit;
    gapEyebrowToRule: RelativeUnit;
    gapRuleToTitle: RelativeUnit;
    gapTitleToSubtitle: RelativeUnit;
    gapSubtitleToMeta: RelativeUnit;
    ruleWidth: RelativeUnit;
    ruleGap: RelativeUnit;
    hairline: RelativeUnit;
    innerFrameInset: RelativeUnit;
    maxSubtitleWidth: RelativeUnit;
  };
  typography: {
    fonts: {
      serif: string;
      meta: string;
    };
    eyebrow: {
      fontSize: RelativeUnit;
      letterSpacing: string;
      fontWeight: number;
      textTransform: "uppercase";
    };
    title: {
      fontSize: RelativeUnit;
      minFontSize: RelativeUnit;
      fontWeight: number;
      letterSpacing: string;
      lineHeight: number;
      textTransform: "uppercase";
    };
    subtitle: {
      fontSize: RelativeUnit;
      minFontSize: RelativeUnit;
      fontWeight: number;
      letterSpacing: string;
      lineHeight: number;
      maxWidth: RelativeUnit;
    };
    meta: {
      fontSize: RelativeUnit;
      letterSpacing: string;
      fontWeight: number;
      textTransform: "uppercase";
    };
  };
  motion: {
    frames: {
      backgroundIn: FrameRange;
      panelIn: FrameRange;
      ruleIn: FrameRange;
      titleIn: FrameRange;
      subtitleIn: FrameRange;
      footerMetaFrom: number;
      holdStart: number;
    };
    spring: {
      damping: number;
      stiffness: number;
      mass: number;
    };
    backgroundStartOpacity: number;
    titleStartOpacity: number;
    panelRise: RelativeUnit;
    titleRise: RelativeUnit;
    subtitleRise: RelativeUnit;
    titleMaskOverflow: RelativeUnit;
  };
  imageTreatment: {
    opacity: number;
    grayscale: number;
    saturation: number;
    brightness: number;
    washOpacity: number;
    vignetteOpacity: number;
  };
};

export type ResolvedTokens = ResolveTokenValue<BaseTokens>;

export const rel = (
  basis: RelativeUnit["basis"],
  ratio: number,
  options?: Omit<RelativeUnit, "basis" | "ratio">,
): RelativeUnit => {
  return {
    basis,
    ratio,
    ...options,
  };
};

const isRelativeUnit = (value: unknown): value is RelativeUnit => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "basis" in value && "ratio" in value;
};

const clamp = (value: number, min?: number, max?: number) => {
  const withMin = typeof min === "number" ? Math.max(value, min) : value;
  return typeof max === "number" ? Math.min(withMin, max) : withMin;
};

export const resolveUnit = (
  unit: RelativeUnit,
  { width, height }: Dimensions,
): number => {
  const basisValue =
    unit.basis === "width"
      ? width
      : unit.basis === "height"
        ? height
        : Math.min(width, height);

  const resolved = clamp(basisValue * unit.ratio, unit.minPx, unit.maxPx);

  return unit.round === "int" ? Math.round(resolved) : resolved;
};

const resolveTokenValue = <T>(
  value: T,
  dimensions: Dimensions,
): ResolveTokenValue<T> => {
  if (isRelativeUnit(value)) {
    return resolveUnit(value, dimensions) as ResolveTokenValue<T>;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => {
      return resolveTokenValue(entry, dimensions);
    }) as ResolveTokenValue<T>;
  }

  if (value && typeof value === "object") {
    const resolvedEntries = Object.entries(value).map(([key, entryValue]) => {
      return [key, resolveTokenValue(entryValue, dimensions)];
    });

    return Object.fromEntries(resolvedEntries) as ResolveTokenValue<T>;
  }

  return value as ResolveTokenValue<T>;
};

export const resolveTokens = <T extends Record<string, unknown>>(
  tokens: T,
  dimensions: Dimensions,
): ResolveTokenValue<T> => {
  return resolveTokenValue(tokens, dimensions);
};

export const baseTokens: BaseTokens = {
  palette: {
    canvas: "#F0EAE0",
    canvasShade: "#D9D2C6",
    smoke: "#D0C9BF",
    ivory: "#F7F1E8",
    gold: "#B49B63",
    rule: "rgba(180, 155, 99, 0.76)",
    deepGreen: "#203229",
    deepGreenWash: "rgba(32, 50, 41, 0.12)",
    ink: "#221D19",
    textSecondary: "rgba(34, 29, 25, 0.76)",
    textMeta: "rgba(34, 29, 25, 0.58)",
    panelFill: "rgba(247, 241, 232, 0.62)",
    panelStroke: "rgba(180, 155, 99, 0.32)",
  },
  safeArea: {
    x: rel("width", 0.075),
    y: rel("height", 0.08),
  },
  layout: {
    contentMaxWidth: rel("width", 0.68),
    panelWidth: rel("width", 0.6),
    panelMinHeight: rel("height", 0.38),
    panelPaddingX: rel("width", 0.045),
    panelPaddingTop: rel("min", 0.048),
    panelPaddingBottom: rel("min", 0.056),
    alignmentShiftLower: rel("min", 0.04),
    alignmentShiftCenter: rel("height", 0),
    gapEyebrowToRule: rel("min", 0.022),
    gapRuleToTitle: rel("min", 0.028),
    gapTitleToSubtitle: rel("min", 0.024),
    gapSubtitleToMeta: rel("min", 0.03),
    ruleWidth: rel("width", 0.38),
    ruleGap: rel("min", 0.005, { minPx: 4 }),
    hairline: rel("min", 1 / 1080, {
      minPx: 1,
      maxPx: 2,
      round: "int",
    }),
    innerFrameInset: rel("min", 12 / 1080, {
      minPx: 8,
      round: "int",
    }),
    maxSubtitleWidth: rel("width", 0.54),
  },
  typography: {
    fonts: {
      serif: cormorantSerif,
      meta: cormorantSerif,
    },
    eyebrow: {
      fontSize: rel("min", 0.016),
      letterSpacing: "0.28em",
      fontWeight: 600,
      textTransform: "uppercase",
    },
    title: {
      fontSize: rel("min", 0.118),
      minFontSize: rel("min", 0.1),
      fontWeight: 600,
      letterSpacing: "0.08em",
      lineHeight: 0.92,
      textTransform: "uppercase",
    },
    subtitle: {
      fontSize: rel("min", 0.028),
      minFontSize: rel("min", 0.023),
      fontWeight: 500,
      letterSpacing: "0.035em",
      lineHeight: 1.28,
      maxWidth: rel("width", 0.5),
    },
    meta: {
      fontSize: rel("min", 0.014),
      letterSpacing: "0.24em",
      fontWeight: 500,
      textTransform: "uppercase",
    },
  },
  motion: {
    frames: {
      backgroundIn: [0, 18],
      panelIn: [12, 30],
      ruleIn: [24, 44],
      titleIn: [36, 68],
      subtitleIn: [48, 84],
      footerMetaFrom: 48,
      holdStart: 84,
    },
    spring: {
      damping: 200,
      stiffness: 80,
      mass: 1.1,
    },
    backgroundStartOpacity: 0.9,
    titleStartOpacity: 0.18,
    panelRise: rel("min", 0.018),
    titleRise: rel("min", 0.024),
    subtitleRise: rel("min", 0.014),
    titleMaskOverflow: rel("min", 0.018),
  },
  imageTreatment: {
    opacity: 0.42,
    grayscale: 1,
    saturation: 0.4,
    brightness: 0.96,
    washOpacity: 0.46,
    vignetteOpacity: 0.18,
  },
};
