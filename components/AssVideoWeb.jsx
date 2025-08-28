import { useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';

export default function AssVideoWeb({ videoSrc, assSrc, fonts = [] }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const octopusRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const ensureScript = () =>
      new Promise((resolve, reject) => {
        if (window.SubtitlesOctopus) return resolve();
        const s = document.createElement('script');
        // Load libass-wasm (runtime + workers via CDN)
        s.src = 'https://cdn.jsdelivr.net/npm/libass-wasm@4.1.0/dist/js/subtitles-octopus.js';
        s.async = true;
        s.onload = () => resolve();
        s.onerror = reject;
        document.head.appendChild(s);
      });

    (async () => {
      await ensureScript();

      // Build a real <video> for the renderer to hook into
      const container = containerRef.current;
      const video = document.createElement('video');
      video.setAttribute('playsinline', 'true');
      video.controls = true;
      video.preload = 'metadata';
      video.crossOrigin = 'anonymous';
      video.style.width = '100%';
      video.style.display = 'block';
      video.src = videoSrc; // e.g. /media/sample.mp4
      container.appendChild(video);
      videoRef.current = video;

      const instance = new window.SubtitlesOctopus({
        video,
        // true .ass file (no conversion / no parsing)
        subUrl: assSrc, // e.g. /media/sample.ass
        fonts,
        workerUrl: 'https://cdn.jsdelivr.net/npm/libass-wasm@4.1.0/dist/js/subtitles-octopus-worker.js',
        legacyWorkerUrl:
          'https://cdn.jsdelivr.net/npm/libass-wasm@4.1.0/dist/js/subtitles-octopus-worker-legacy.js',
        renderMode: 'wasm-blend',
        onError: (e) => console.error('SubtitlesOctopus error', e),
      });
      octopusRef.current = instance;
    })();

    return () => {
      try { octopusRef.current?.dispose?.(); } catch {}
      if (videoRef.current?.parentElement) {
        videoRef.current.parentElement.removeChild(videoRef.current);
      }
      videoRef.current = null;
    };
  }, [videoSrc, assSrc, JSON.stringify(fonts)]);

  return (
    <View
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 960,
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
        marginHorizontal: 'auto',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    />
  );
}
