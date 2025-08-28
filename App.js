import React from "react";
import { SafeAreaView } from "react-native";
import AssVideoNative from "./components/AssVideoNative";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <AssVideoNative
       videoAssetModule={require("./assets/media/sample.mp4")}
       assAssetModule={require("./assets/subs/sample.ass")}
         />
    </SafeAreaView>
  );
}
