declare module "@app/remotion3/scenes/PodcastSlides" {
  import type React from "react";

  export type PodcastSlidesProps = Record<string, unknown> & {
    transparentBg?: boolean;
  };

  export const PodcastSlides: React.ComponentType<PodcastSlidesProps>;
}
