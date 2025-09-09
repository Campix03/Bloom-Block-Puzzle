import React, { useEffect } from 'react';

const AdBanner: React.FC = () => {
  useEffect(() => {
    try {
      // The `adsbygoogle` array is initialized by the AdSense script in index.html
      // Pushing an empty object triggers the ad loading for units on the page.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="w-full min-h-[80px] mt-4 flex justify-center items-center">
      {/* 
        This is the AdSense ad unit.
        - `data-ad-client`: Your publisher ID.
        - `data-ad-slot`: The ID of the specific ad unit you created in AdSense.
      */}
      {/* TODO: Reemplaza con tu ID de editor e ID de bloque de anuncios reales */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '80px' }}
        data-ad-client="ca-pub-0000000000000000"
        data-ad-slot="0000000000"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;
