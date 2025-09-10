import { useCallback, useEffect } from 'react';

// Define the global types for the AdSense H5 Games Ads API
declare global {
  interface Window {
    adsbygoogle: any[];
    adConfig?: (config: { preloadAdBreaks?: boolean; sound?: 'on' | 'off'; publisher?: string; }) => void;
    adBreak?: (config: AdBreakConfig) => void;
  }
}

interface AdBreakConfig {
  type: 'reward';
  name: string;
  beforeAd: () => void;
  afterAd: () => void;
  adDismissed: () => void;
  adViewed: () => void;
  adBreakDone: (placementInfo: { breakStatus: 'viewed' | 'dismissed' | 'failed' }) => void;
}

interface ShowRewardedAdParams {
  onReward: () => void;
  onFail?: () => void;
}

// TODO: Reemplaza 'ca-pub-0000000000000000' con tu ID de editor de AdSense real
const ADSENSE_PUBLISHER_ID = 'ca-pub-0000000000000000'; 

export const useAds = () => {
  
  useEffect(() => {
    // Ensure adsbygoogle is initialized
    window.adsbygoogle = window.adsbygoogle || [];
    // Configure ads on initial mount. This preloads the ads.
    if (typeof window.adConfig === 'function') {
      window.adConfig({
        preloadAdBreaks: true,
        sound: 'on',
        publisher: ADSENSE_PUBLISHER_ID,
      });
    }
  }, []);

  const showRewardedAd = useCallback(({ onReward, onFail }: ShowRewardedAdParams) => {
    console.log('Attempting to show rewarded ad...');
    if (typeof window.adBreak !== 'function') {
      console.error('Ad function (adBreak) is not available. Check AdSense script.');
      // In a real scenario, you might not want to grant the reward if ads fail to load
      // For testing purposes, we can call onReward() to not block the user.
      // In production, you'd likely call onFail() here.
      onFail?.();
      return;
    }
    
    window.adBreak({
      type: 'reward',
      name: 'reward_for_action', // A descriptive name for your ad placement
      beforeAd: () => { console.log('Rewarded ad is about to play.'); },
      afterAd: () => { console.log('Rewarded ad finished playing.'); },
      adDismissed: () => {
        console.log('User dismissed the ad without finishing.');
        onFail?.();
      },
      adViewed: () => {
        console.log('User has viewed the ad and earned a reward.');
        onReward();
      },
      // adBreakDone is a fallback that captures the final state
      adBreakDone: (placementInfo) => {
        console.log('Ad break is complete. Status:', placementInfo.breakStatus);
        // Sometimes adViewed doesn't fire, so we double-check here.
        if (placementInfo.breakStatus !== 'viewed') {
           // This case is usually handled by adDismissed, but it's a good safety check.
        }
      },
    });
  }, []);

  return { showRewardedAd };
};
