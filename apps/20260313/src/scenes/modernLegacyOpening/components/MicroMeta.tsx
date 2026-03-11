import React from "react";

export type MicroMetaProps = {
  items: string[];
  opacity: number;
  fontSize: number;
  tracking: string;
  tone: string;
  fontFamily?: string;
  fontWeight?: number;
};

export const MicroMeta: React.FC<MicroMetaProps> = ({
  items,
  opacity,
  fontSize,
  tracking,
  tone,
  fontFamily,
  fontWeight = 500,
}) => {
  const filteredItems = items
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        alignItems: "center",
        color: tone,
        display: "flex",
        flexWrap: "wrap",
        fontFamily,
        fontSize,
        fontWeight,
        gap: fontSize * 0.75,
        justifyContent: "center",
        letterSpacing: tracking,
        lineHeight: 1.2,
        opacity,
        textAlign: "center",
        textTransform: "uppercase",
      }}
    >
      {filteredItems.map((item, index) => {
        const isLast = index === filteredItems.length - 1;

        return (
          <React.Fragment key={`${item}-${index}`}>
            <span
              style={{
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
            {isLast ? null : (
              <span
                style={{
                  opacity: 0.58,
                }}
              >
                ·
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
