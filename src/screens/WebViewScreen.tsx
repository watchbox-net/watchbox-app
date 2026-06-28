import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import type {
  ShouldStartLoadRequest,
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview/lib/WebViewTypes";
import { useBackHandler } from "../lib/useBackHandler";
import { isInAppUrl, openExternalUrl } from "../lib/linking";
import { WEB_URL } from "../config/env";

const WebViewScreen = () => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const canGoBackRef = useRef(false);

  // Android 하드웨어 뒤로가기 → WebView 히스토리 뒤로
  const onHardwareBack = useCallback(() => {
    if (canGoBackRef.current && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  }, []);
  useBackHandler(onHardwareBack);

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      canGoBackRef.current = navState.canGoBack;
    },
    [],
  );

  // http(s)·내부 스킴은 WebView 가 로드, 그 외(카카오/intent/mailto 등)는 OS 로 위임
  const handleShouldStartLoad = useCallback((req: ShouldStartLoadRequest) => {
    const url = String(req?.url ?? "");
    if (!url) return false;
    if (isInAppUrl(url)) return true;

    void openExternalUrl(url);
    return false;
  }, []);

  // Web → Native 메시지 수신 (Stage 2 에서 bridge 로 확장)
  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    const raw = event.nativeEvent.data;
    if (!raw || typeof raw !== "string" || raw.length > 500_000) return;
    if (__DEV__) console.log("[webview] message:", raw);
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_URL }}
        style={styles.webview}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        onMessage={handleMessage}
        // iOS: 좌우 스와이프로 뒤로/앞으로
        allowsBackForwardNavigationGestures
        // 새 창(target=_blank) 요청도 같은 WebView 에서 처리
        setSupportMultipleWindows={false}
        // 미디어 자동재생 등은 추후 필요 시 조정
        originWhitelist={["*"]}
        onError={(e) => {
          if (__DEV__) {
            console.warn(
              "[webview] load error:",
              e.nativeEvent?.description,
              e.nativeEvent?.code,
            );
          }
        }}
      />
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
