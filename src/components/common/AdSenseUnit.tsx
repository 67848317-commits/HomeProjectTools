import React, { useEffect, useRef } from 'react';

interface AdSenseUnitProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

/**
 * Reusable Google AdSense Ad Unit Component
 * Configured with Publisher ID: ca-pub-1850854173653124
 */
export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (pushedRef.current) return;
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch {
      // Gracefully ignore ad blocker or environment errors
    }
  }, []);

  return (
    <div className={`my-8 flex justify-center items-center overflow-hidden min-h-[90px] ${className}`} aria-label="Advertisement">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '280px', width: '100%' }}
        data-ad-client="ca-pub-1850854173653124"
        {...(slot ? { 'data-ad-slot': slot } : {})}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
