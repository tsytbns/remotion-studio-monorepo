import { auctionEnglishFontFamily } from "../../designSystem/auctionThemeTokens";

export type RelativeUnit = {
  basis: "width" | "height" | "min";
  ratio: number;
  minPx?: number;
  maxPx?: number;
  round?: "none" | "int";
};

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
    transparent: string;
    checkerLight: string;
    checkerDark: string;
    canvas: string;
    canvasShade: string;
    ivory: string;
    paleSmoke: string;
    smoke: string;
    mutedGold: string;
    mutedGoldSoft: string;
    deepGreen: string;
    deepGreenWash: string;
    ink: string;
    textSecondary: string;
    textMeta: string;
    panelFill: string;
    panelFillAlpha: string;
    panelStroke: string;
    frameStroke: string;
    scaffoldTone: string;
    safeGuide: string;
  };
  safeArea: {
    x: RelativeUnit;
    y: RelativeUnit;
  };
  layout: {
    hairline: RelativeUnit;
    doubleHairline: RelativeUnit;
    frameInset: RelativeUnit;
    frameInnerInset: RelativeUnit;
    openingPanelWidth: RelativeUnit;
    openingPanelMinHeight: RelativeUnit;
    openingPanelPaddingX: RelativeUnit;
    openingPanelPaddingTop: RelativeUnit;
    openingPanelPaddingBottom: RelativeUnit;
    openingRuleWidth: RelativeUnit;
    openingTitleWidth: RelativeUnit;
    openingSubtitleWidth: RelativeUnit;
    openingMetaWidth: RelativeUnit;
    openingEyebrowGap: RelativeUnit;
    openingRuleGap: RelativeUnit;
    openingTitleGap: RelativeUnit;
    openingSubtitleGap: RelativeUnit;
    infoPanelWidth: RelativeUnit;
    infoPanelMinHeight: RelativeUnit;
    infoPanelPaddingX: RelativeUnit;
    infoPanelPaddingY: RelativeUnit;
    infoPrimaryWidth: RelativeUnit;
    infoSecondaryWidth: RelativeUnit;
    infoColumnGap: RelativeUnit;
    infoBlockGap: RelativeUnit;
    fieldWidth: RelativeUnit;
    fieldHeight: RelativeUnit;
    fieldTop: RelativeUnit;
    fieldLeftBias: RelativeUnit;
    veilWidth: RelativeUnit;
    veilHeight: RelativeUnit;
    veilTop: RelativeUnit;
    panelAlphaWidth: RelativeUnit;
    panelAlphaHeight: RelativeUnit;
    panelAlphaTop: RelativeUnit;
    cornerTickLength: RelativeUnit;
    scaffoldOffset: RelativeUnit;
    scaffoldLabelGap: RelativeUnit;
  };
  typography: {
    fonts: {
      serif: string;
      meta: string;
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
    };
    meta: {
      fontSize: RelativeUnit;
      fontWeight: number;
      letterSpacing: string;
      lineHeight: number;
      textTransform: "uppercase";
    };
    label: {
      fontSize: RelativeUnit;
      fontWeight: number;
      letterSpacing: string;
      textTransform: "uppercase";
    };
    scaffold: {
      fontSize: RelativeUnit;
      fontWeight: number;
      letterSpacing: string;
      textTransform: "uppercase";
    };
  };
  motion: {
    opening: {
      backgroundIn: readonly [number, number];
      structureIn: readonly [number, number];
      titleIn: readonly [number, number];
      subtitleIn: readonly [number, number];
      metaIn: readonly [number, number];
      titleRise: RelativeUnit;
      subtitleRise: RelativeUnit;
      metaRise: RelativeUnit;
      panelRise: RelativeUnit;
    };
    text: {
      reveal: readonly [number, number];
      rise: RelativeUnit;
      metaRise: RelativeUnit;
    };
    info: {
      backgroundIn: readonly [number, number];
      structureIn: readonly [number, number];
      textIn: readonly [number, number];
      titleRise: RelativeUnit;
      bodyRise: RelativeUnit;
    };
    overlay: {
      rulesIn: readonly [number, number];
      panelIn: readonly [number, number];
      frameIn: readonly [number, number];
      fieldIn: readonly [number, number];
      bridgeIn: readonly [number, number];
      bridgeOut: readonly [number, number];
      smallDrift: RelativeUnit;
      mediumDrift: RelativeUnit;
    };
    backgroundLoop: {
      xAmplitude: RelativeUnit;
      yAmplitude: RelativeUnit;
      veilOpacity: number;
      fieldOpacity: number;
      lineOpacity: number;
    };
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
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => {
        return [key, resolveTokenValue(entryValue, dimensions)];
      }),
    ) as ResolveTokenValue<T>;
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
    transparent: "rgba(0, 0, 0, 0)",
    checkerLight: "#F4EFE5",
    checkerDark: "#E0D8CC",
    canvas: "#F3EEE2",
    canvasShade: "#DDD6CA",
    ivory: "#F7F3EA",
    paleSmoke: "#E3DDD3",
    smoke: "#D8D2C7",
    mutedGold: "#B49B63",
    mutedGoldSoft: "rgba(180, 155, 99, 0.42)",
    deepGreen: "#203229",
    deepGreenWash: "rgba(32, 50, 41, 0.14)",
    ink: "#211C17",
    textSecondary: "rgba(33, 28, 23, 0.76)",
    textMeta: "rgba(33, 28, 23, 0.58)",
    panelFill: "rgba(247, 243, 234, 0.72)",
    panelFillAlpha: "rgba(247, 243, 234, 0.2)",
    panelStroke: "rgba(180, 155, 99, 0.34)",
    frameStroke: "rgba(180, 155, 99, 0.24)",
    scaffoldTone: "rgba(180, 155, 99, 0.54)",
    safeGuide: "rgba(32, 50, 41, 0.18)",
  },
  safeArea: {
    x: rel("width", 0.0833),
    y: rel("height", 0.0889),
  },
  layout: {
    hairline: rel("min", 1 / 1080, {
      minPx: 1,
      maxPx: 2,
      round: "int",
    }),
    doubleHairline: rel("min", 2 / 1080, {
      minPx: 1,
      maxPx: 3,
      round: "int",
    }),
    frameInset: rel("min", 0.022, { minPx: 18 }),
    frameInnerInset: rel("min", 0.048, { minPx: 32 }),
    openingPanelWidth: rel("width", 0.64),
    openingPanelMinHeight: rel("height", 0.42),
    openingPanelPaddingX: rel("width", 0.049),
    openingPanelPaddingTop: rel("min", 0.05),
    openingPanelPaddingBottom: rel("min", 0.058),
    openingRuleWidth: rel("width", 0.34),
    openingTitleWidth: rel("width", 0.54),
    openingSubtitleWidth: rel("width", 0.46),
    openingMetaWidth: rel("width", 0.4),
    openingEyebrowGap: rel("min", 0.02),
    openingRuleGap: rel("min", 0.024),
    openingTitleGap: rel("min", 0.022),
    openingSubtitleGap: rel("min", 0.026),
    infoPanelWidth: rel("width", 0.74),
    infoPanelMinHeight: rel("height", 0.34),
    infoPanelPaddingX: rel("width", 0.046),
    infoPanelPaddingY: rel("min", 0.046),
    infoPrimaryWidth: rel("width", 0.38),
    infoSecondaryWidth: rel("width", 0.18),
    infoColumnGap: rel("width", 0.035),
    infoBlockGap: rel("min", 0.024),
    fieldWidth: rel("width", 0.72),
    fieldHeight: rel("height", 0.28),
    fieldTop: rel("height", 0.18),
    fieldLeftBias: rel("width", 0.06),
    veilWidth: rel("width", 0.54),
    veilHeight: rel("height", 0.34),
    veilTop: rel("height", 0.18),
    panelAlphaWidth: rel("width", 0.48),
    panelAlphaHeight: rel("height", 0.26),
    panelAlphaTop: rel("height", 0.5),
    cornerTickLength: rel("min", 0.032),
    scaffoldOffset: rel("min", 0.018),
    scaffoldLabelGap: rel("min", 0.012),
  },
  typography: {
    fonts: {
      serif: auctionEnglishFontFamily,
      meta: auctionEnglishFontFamily,
    },
    title: {
      fontSize: rel("min", 0.118),
      minFontSize: rel("min", 0.092),
      fontWeight: 400,
      letterSpacing: "0.08em",
      lineHeight: 0.92,
      textTransform: "uppercase",
    },
    subtitle: {
      fontSize: rel("min", 0.028),
      minFontSize: rel("min", 0.022),
      fontWeight: 400,
      letterSpacing: "0.032em",
      lineHeight: 1.28,
    },
    meta: {
      fontSize: rel("min", 0.015),
      fontWeight: 400,
      letterSpacing: "0.24em",
      lineHeight: 1.2,
      textTransform: "uppercase",
    },
    label: {
      fontSize: rel("min", 0.0142),
      fontWeight: 400,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
    },
    scaffold: {
      fontSize: rel("min", 0.011),
      fontWeight: 400,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
    },
  },
  motion: {
    opening: {
      backgroundIn: [0, 18],
      structureIn: [18, 42],
      titleIn: [36, 72],
      subtitleIn: [46, 74],
      metaIn: [52, 80],
      titleRise: rel("min", 0.02),
      subtitleRise: rel("min", 0.012),
      metaRise: rel("min", 0.01),
      panelRise: rel("min", 0.015),
    },
    text: {
      reveal: [0, 24],
      rise: rel("min", 0.015),
      metaRise: rel("min", 0.01),
    },
    info: {
      backgroundIn: [0, 18],
      structureIn: [14, 38],
      textIn: [30, 54],
      titleRise: rel("min", 0.016),
      bodyRise: rel("min", 0.012),
    },
    overlay: {
      rulesIn: [0, 24],
      panelIn: [0, 24],
      frameIn: [0, 18],
      fieldIn: [0, 20],
      bridgeIn: [0, 18],
      bridgeOut: [60, 90],
      smallDrift: rel("min", 0.0065),
      mediumDrift: rel("min", 0.012),
    },
    backgroundLoop: {
      xAmplitude: rel("width", 0.012),
      yAmplitude: rel("height", 0.008),
      veilOpacity: 0.18,
      fieldOpacity: 0.44,
      lineOpacity: 0.24,
    },
  },
};
