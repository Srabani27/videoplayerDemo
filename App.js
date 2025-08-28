// App.js
import React from 'react';
import { Platform, SafeAreaView, View, Text } from 'react-native';
import AssVideoWeb from './components/AssVideoWeb';
import AssVideoNative from './components/AssVideoNative';

export default function App() {
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0b0b0b' }}>
        <View style={{ padding: 16, gap: 16 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
            ASS Player (Web / React Native Web)
          </Text>
          <AssVideoWeb
            videoSrc="/media/sample.mp4"
            assSrc="/media/sample.ass"
            // fonts={['/media/fonts/MyFont.ttf']} // optional if your .ass references fonts
          />
        </View>
      </SafeAreaView>
    );
  }

  // Bonus: Native (Android/iOS) via WebView
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <AssVideoWeb
  videoSrc="/media/sample.mp4"
  assSrc="/media/sample.ass"
// fonts={['/media/fonts/MyFont.ttf']}  // optional if ASS references fonts
/>
    </SafeAreaView>
  );
}
