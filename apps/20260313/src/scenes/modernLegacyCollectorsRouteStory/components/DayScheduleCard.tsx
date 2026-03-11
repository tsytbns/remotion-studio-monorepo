import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { ArchivePanel } from "../../modernLegacyOpening/components/ArchivePanel";
import { DoubleRule } from "../../modernLegacyOpening/components/DoubleRule";
import { MicroMeta } from "../../modernLegacyOpening/components/MicroMeta";
import type { ResolvedTokens } from "../../modernLegacyOpening/tokens";
import type { CollectorsRouteScheduleDay } from "../data";

export type DayScheduleCardProps = {
  day: CollectorsRouteScheduleDay;
  days: readonly CollectorsRouteScheduleDay[];
  tokens: ResolvedTokens;
  width: number;
};

const jpFallback =
  '"Hiragino Sans", "Yu Gothic", "Yu Gothic Medium", sans-serif';

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

export const DayScheduleCard: React.FC<DayScheduleCardProps> = ({
  day,
  days,
  tokens,
  width,
}) => {
  const frame = useCurrentFrame();
  const panelProgress = interpolate(frame, [0, 16, 82, 96], [0, 1, 1, 0], {
    easing: Easing.bezier(0.2, 0.08, 0.18, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textProgress = interpolate(frame, [8, 28, 82, 96], [0, 1, 1, 0], {
    easing: Easing.bezier(0.2, 0.08, 0.18, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panelWidth = Math.min(width - tokens.safeArea.x * 2, width * 0.84);
  const panelHeight = width * 1.06;
  const titleTranslateY = (1 - textProgress) * tokens.motion.titleRise * 0.65;
  const panelTranslateY = (1 - panelProgress) * tokens.motion.panelRise;
  const eventTitleSize = Math.min(panelWidth * 0.042, 28);
  const eventMetaSize = Math.min(panelWidth * 0.026, 18);
  const tabFontSize = Math.min(panelWidth * 0.022, 16);

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <ArchivePanel
        fill="rgba(247, 243, 234, 0.78)"
        innerInset={tokens.layout.innerFrameInset}
        minHeight={panelHeight}
        opacity={panelProgress}
        stroke={tokens.palette.panelStroke}
        thickness={tokens.layout.hairline}
        translateY={panelTranslateY}
        width={panelWidth}
      >
        <div
          style={{
            boxSizing: "border-box",
            display: "grid",
            gap: panelWidth * 0.036,
            minHeight: panelHeight,
            paddingBottom: panelWidth * 0.058,
            paddingLeft: panelWidth * 0.064,
            paddingRight: panelWidth * 0.064,
            paddingTop: panelWidth * 0.064,
          }}
        >
          <div
            style={{
              display: "grid",
              gap: panelWidth * 0.022,
              justifyItems: "start",
            }}
          >
            <MicroMeta
              items={["SBI ART AUCTION", "SCHEDULE"]}
              opacity={panelProgress * 0.92}
              fontFamily={tokens.typography.fonts.meta}
              fontSize={tokens.infoBoard.modeFontSize}
              fontWeight={tokens.typography.meta.fontWeight}
              tone={tokens.palette.textMeta}
              tracking={tokens.typography.meta.letterSpacing}
            />
            <div
              style={{
                alignItems: "baseline",
                display: "flex",
                flexWrap: "wrap",
                gap: panelWidth * 0.022,
              }}
            >
              <div
                style={{
                  color: tokens.palette.ink,
                  fontFamily: tokens.typography.fonts.serif,
                  fontSize: Math.min(panelWidth * 0.11, 76),
                  fontWeight: tokens.typography.title.fontWeight,
                  letterSpacing: "0.08em",
                  lineHeight: 0.92,
                  opacity: 0.16 + textProgress * 0.84,
                  textTransform: "uppercase",
                  transform: `translateY(${titleTranslateY}px)`,
                }}
              >
                {day.date}
              </div>
              <div
                style={{
                  color: tokens.palette.textSecondary,
                  fontFamily: `${tokens.typography.fonts.meta}, ${jpFallback}`,
                  fontSize: Math.min(panelWidth * 0.031, 22),
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  lineHeight: 1.3,
                  opacity: textProgress,
                }}
              >
                {day.dateEn}
              </div>
            </div>
            <div
              style={{
                color: tokens.palette.textMeta,
                fontFamily: `${tokens.typography.fonts.meta}, ${jpFallback}`,
                fontSize: Math.min(panelWidth * 0.026, 18),
                fontWeight: 500,
                letterSpacing: "0.08em",
                lineHeight: 1.2,
                opacity: textProgress * 0.92,
                textTransform: "uppercase",
              }}
            >
              Schedule / 日程 / Timetable
            </div>
            <DoubleRule
              color={tokens.palette.rule}
              gap={tokens.layout.ruleGap}
              opacity={0.32 + textProgress * 0.68}
              progress={textProgress}
              thickness={tokens.layout.hairline}
              width={Math.min(
                panelWidth * 0.62,
                tokens.layout.ruleWidth * 1.28,
              )}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: panelWidth * 0.018,
              opacity: textProgress,
            }}
          >
            {days.map((item) => {
              const active = item.date === day.date;

              return (
                <div
                  key={item.date}
                  style={{
                    background: active
                      ? "rgba(180, 155, 99, 0.18)"
                      : "rgba(247, 243, 234, 0.34)",
                    border: `${tokens.layout.hairline}px solid ${
                      active ? tokens.palette.rule : tokens.palette.panelStroke
                    }`,
                    color: active
                      ? tokens.palette.ink
                      : tokens.palette.textMeta,
                    fontFamily: tokens.typography.fonts.meta,
                    fontSize: tabFontSize,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    padding: `${panelWidth * 0.012}px ${panelWidth * 0.022}px`,
                    textTransform: "uppercase",
                  }}
                >
                  {item.date}
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "grid",
              gap: panelWidth * 0.032,
            }}
          >
            {day.events.map((event, index) => {
              const eventProgress = interpolate(
                frame,
                [16 + index * 4, 34 + index * 4, 82, 96],
                [0, 1, 1, 0],
                {
                  easing: Easing.bezier(0.2, 0.08, 0.18, 1),
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              );
              const translateY =
                (1 - eventProgress) * tokens.motion.subtitleRise;

              return (
                <div
                  key={`${event.time}-${event.title}`}
                  style={{
                    columnGap: panelWidth * 0.034,
                    display: "grid",
                    gridTemplateColumns: `${panelWidth * 0.22}px 1fr`,
                    opacity: clamp(eventProgress, 0, 1),
                    transform: `translateY(${translateY}px)`,
                  }}
                >
                  <div
                    style={{
                      color: tokens.palette.textSecondary,
                      fontFamily: tokens.typography.fonts.meta,
                      fontSize: eventMetaSize,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      lineHeight: 1.35,
                      textTransform: "uppercase",
                    }}
                  >
                    {event.time}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gap: panelWidth * 0.008,
                    }}
                  >
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: panelWidth * 0.014,
                      }}
                    >
                      {event.tag ? (
                        <div
                          style={{
                            background: "rgba(180, 155, 99, 0.16)",
                            border: `${tokens.layout.hairline}px solid ${tokens.palette.rule}`,
                            color: tokens.palette.ink,
                            fontFamily: tokens.typography.fonts.meta,
                            fontSize: Math.min(panelWidth * 0.021, 14),
                            fontWeight: 700,
                            letterSpacing: "0.16em",
                            padding: `${panelWidth * 0.006}px ${panelWidth * 0.016}px`,
                            textTransform: "uppercase",
                          }}
                        >
                          {event.tag}
                        </div>
                      ) : null}
                      <div
                        style={{
                          color: tokens.palette.ink,
                          fontFamily: `${tokens.typography.fonts.serif}, ${jpFallback}`,
                          fontSize: eventTitleSize,
                          fontWeight: 500,
                          letterSpacing: "0.01em",
                          lineHeight: 1.16,
                        }}
                      >
                        {event.title}
                      </div>
                    </div>
                    {event.detail ? (
                      <div
                        style={{
                          color: tokens.palette.textSecondary,
                          fontFamily: `${tokens.typography.fonts.meta}, ${jpFallback}`,
                          fontSize: eventMetaSize,
                          fontWeight: 500,
                          letterSpacing: "0.02em",
                          lineHeight: 1.35,
                        }}
                      >
                        {event.detail}
                      </div>
                    ) : null}
                    <div
                      style={{
                        color: tokens.palette.textSecondary,
                        fontFamily: `${tokens.typography.fonts.meta}, ${jpFallback}`,
                        fontSize: eventMetaSize,
                        fontWeight: 500,
                        letterSpacing: "0.02em",
                        lineHeight: 1.35,
                      }}
                    >
                      {event.venue}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              color: tokens.palette.textSecondary,
              fontFamily: `${tokens.typography.fonts.meta}, ${jpFallback}`,
              fontSize: Math.min(panelWidth * 0.023, 16),
              fontWeight: 500,
              letterSpacing: "0.08em",
              lineHeight: 1.2,
              opacity: textProgress * 0.86,
              textTransform: "uppercase",
            }}
          >
            All times are JST.
          </div>
        </div>
      </ArchivePanel>
    </div>
  );
};
