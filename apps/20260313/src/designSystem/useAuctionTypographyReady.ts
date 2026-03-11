import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";
import { auctionEnglishFontReady } from "./auctionThemeTokens";

export const useAuctionTypographyReady = () => {
  const [handle] = useState(() => {
    return delayRender("Loading Collier");
  });

  useEffect(() => {
    let mounted = true;

    auctionEnglishFontReady
      .then(() => {
        if (mounted) {
          continueRender(handle);
        }
      })
      .catch((error) => {
        if (mounted) {
          cancelRender(error);
        }
      });

    return () => {
      mounted = false;
    };
  }, [handle]);
};
