import { Linking } from "react-native";

/**
 * WebView 내부에서 로드되어야 하는 http(s) 및 내부 스킴인지 판별.
 * 이런 URL 은 WebView 가 직접 로드하고, 그 외(외부 앱 스킴 등)는 OS 로 넘긴다.
 */
export function isInAppUrl(url: string): boolean {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("about:") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  );
}

/** 외부 앱/브라우저로 열어야 하는 URL 을 OS 에 위임한다. */
export async function openExternalUrl(url: string): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch (err) {
    if (__DEV__) {
      console.warn("[linking] 외부 URL 열기 실패:", url, err);
    }
  }
}
