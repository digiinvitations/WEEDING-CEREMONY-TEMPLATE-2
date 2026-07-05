import React, { useState, useEffect } from "react";
import { fetchFromFsdb } from "../lib/fsdb";



export function FirestoreImage(props: React.ComponentProps<"img"> & { disableFallback?: boolean; fallbackNode?: React.ReactNode }) {
  const { src, disableFallback, fallbackNode, ...rest } = props;


  const [resolvedSrc, setResolvedSrc] = useState<string | undefined>(src);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const universalFallback = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800";

  useEffect(() => {
    if (src && src.startsWith("fsdb://")) {
      setLoading(true);
      setError(false);
      fetchFromFsdb(src).then(base64 => {
        if (!base64) {
          setError(true);
        } else {
          setResolvedSrc(base64);
        }
        setLoading(false);
      });
    } else {
      setResolvedSrc(src || universalFallback);
      setError(!src);
    }
  }, [src]);

  if (loading) {
    return (
      <div 
        className={`animate-pulse bg-pink-100 flex items-center justify-center ${props.className || ''}`}
        style={props.style}
      >
        <span className="text-xs text-pink-300">Loading...</span>
      </div>
    );
  }

  // If there is an error or no resolved src, instead of showing a grey box with "Image Unavailable",
  // we render the gorgeous universal fallback image. This keeps the application look professional at all times.
  if (error || !resolvedSrc) {
    if (disableFallback) {
        return fallbackNode ? <>{fallbackNode}</> : null;
    }
    return (
      <img 
        src={universalFallback} 
        {...rest} 
        className={props.className}
        style={props.style}
      />
    );
  }

  return (
    <img 
      src={resolvedSrc} 
      {...rest} 
      className={props.className}
      style={props.style}
      onError={() => {
        if (disableFallback) {
          setError(true);
        } else {
          setResolvedSrc(universalFallback);
        }
      }} 
    />
  );
}
