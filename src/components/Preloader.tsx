import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingConfig } from '../weddingConfig';
import { Heart } from 'lucide-react';

interface PreloaderProps {
  config: WeddingConfig;
  onFinished: () => void;
}

export function Preloader({ config, onFinished }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Collect all image URLs
    const imageUrls = [
      config.openingBackgroundImageUrl,
      config.openingSealImageUrl,
      config.bride.imageUrl,
      config.groom.imageUrl,
      ...(config.galleryImages?.map(img => img.url) || []),
      ...(config.weddingEvents?.map(evt => evt.thumbnailUrl).filter(Boolean) || []),
      config.envelopeIconUrl,
      config.thankYouImageUrl,
      config.heroSettings?.ganeshaIconUrl
    ].filter(Boolean) as string[];

    let loadedCount = 0;
    const totalAssets = imageUrls.length;

    if (totalAssets === 0) {
      setIsFadingOut(true);
      return;
    }

    let hasFinished = false;

    const handleProgress = () => {
      if (hasFinished) return;
      loadedCount++;
      const percent = Math.min(Math.round((loadedCount / totalAssets) * 100), 100);
      setProgress(percent);
      if (loadedCount >= totalAssets) {
        hasFinished = true;
        setTimeout(() => setIsFadingOut(true), 500); // slight delay to show 100%
      }
    };

    // Preload images
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = handleProgress;
      img.onerror = handleProgress; // Continue even if one fails
    });

    // Fallback timeout in case some images hang indefinitely
    const timeout = setTimeout(() => {
      if (!hasFinished) {
        hasFinished = true;
        setProgress(100);
        setIsFadingOut(true);
      }
    }, 10000); // 10 seconds max wait

    return () => clearTimeout(timeout);
  }, [config]);

  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => {
        onFinished();
      }, 800); // wait for fade out animation
      return () => clearTimeout(timer);
    }
  }, [isFadingOut, onFinished]);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FFF8F3] text-gray-800"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_60%)] z-0" />
          
          <motion.div 
            className="relative z-10 flex flex-col items-center gap-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative flex items-center justify-center">
              <Heart size={48} className="text-gold-400 fill-gold-400/20" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="absolute"
              >
                <Heart size={48} className="text-gold-500 fill-gold-500/40" />
              </motion.div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <h2 className="font-display text-xl md:text-2xl text-gold-700 tracking-wider">
                Loading your invitation...
              </h2>
              <div className="w-48 h-1 bg-gold-200/50 rounded-full overflow-hidden mt-2">
                <motion.div 
                  className="h-full bg-gold-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <span className="font-sans text-xs text-gray-500 tracking-widest mt-1">
                {progress}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
