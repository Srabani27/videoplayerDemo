// components/AssVideoNative.jsx
// Android/iOS: WebView page that uses SubtitlesOctopus to render .ass (as text).

import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

export default function AssVideoNative({ videoAssetModule, assAssetModule }) {
  const [videoUri, setVideoUri] = useState(null);
  const [assContent, setAssContent] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const v = Asset.fromModule(videoAssetModule);
      const s = Asset.fromModule(assAssetModule);
      await v.downloadAsync();
      await s.downloadAsync();
      const text = await FileSystem.readAsStringAsync(s.localUri);
      if (mounted) {
        setVideoUri(v.localUri);
        setAssContent(text);
      }
    })();
    return () => { mounted = false; };
  }, [videoAssetModule, assAssetModule]);

  const html = useMemo(() => {
    if (!videoUri || !assContent) return null;
    return `
<!doctype html><html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover"/>
  <style>
    html,body{margin:0;padding:0;background:#000;height:100%}
    #wrap{position:fixed;inset:0;display:grid;place-items:center}
    video{width:100vw;height:100vh;object-fit:contain}
    canvas{pointer-events:none}
  </style>
</head>
<body>
  <div id="wrap">
    <video id="v" playsinline controls preload="metadata" src="${videoUri}"></video>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/libass-wasm@4.1.0/dist/js/subtitles-octopus.js"></script>
  <script>
    (function(){
      function start(){
        if(!window.SubtitlesOctopus) return setTimeout(start,50);
        var video = document.getElementById('v');
        var instance = new window.SubtitlesOctopus({
          video: video,
          // pass the raw .ass text (no conversion!)
          subContent: \`${assContent
            .replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
          workerUrl: "https://cdn.jsdelivr.net/npm/libass-wasm@4.1.0/dist/js/subtitles-octopus-worker.js",
          legacyWorkerUrl: "https://cdn.jsdelivr.net/npm/libass-wasm@4.1.0/dist/js/subtitles-octopus-worker-legacy.js",
          renderMode: 'wasm-blend'
        });
        window._octopus = instance;
      }
      start();
    })();
  </script>
</body>
</html>`;
  }, [videoUri, assContent]);

  if (!html) return <View style={{ flex: 1, backgroundColor: '#000' }} />;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      allowsFullscreenVideo
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      javaScriptEnabled
      style={{ flex: 1, backgroundColor: '#000' }}
    />
  );
}
