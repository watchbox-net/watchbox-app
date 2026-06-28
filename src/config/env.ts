/**
 * 앱 환경 설정.
 * EXPO_PUBLIC_* 변수는 빌드 타임에 번들에 인라인된다.
 * 값은 .env.local (로컬) / EAS 빌드 환경변수(배포) 로 주입한다.
 */

const FALLBACK_WEB_URL = "http://localhost:4000";

/** WebView 가 로드할 watchbox-fe 주소 */
export const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? FALLBACK_WEB_URL;

if (__DEV__ && WEB_URL === FALLBACK_WEB_URL) {
  console.warn(
    "[env] EXPO_PUBLIC_WEB_URL 가 설정되지 않아 localhost 로 폴백합니다. " +
      ".env.local 을 확인하세요.",
  );
}
