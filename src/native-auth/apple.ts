import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

export type AppleSignInResult =
  | { status: "success"; identityToken: string }
  | { status: "cancelled" }
  | { status: "unavailable" }
  | { status: "error"; message: string };

// Sign in with Apple 은 iOS 에서만 네이티브로 동작한다. (Android/웹은 별도 OAuth 리다이렉트 필요)
// 성공 시 Apple 이 서명한 identityToken(JWT)을 반환 → 백엔드가 Apple JWKS 로 검증한다.
export const performAppleLogin = async (): Promise<AppleSignInResult> => {
  if (Platform.OS !== "ios") {
    return { status: "unavailable" };
  }

  try {
    const available = await AppleAuthentication.isAvailableAsync();
    if (!available) return { status: "unavailable" };

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    console.log("[apple] signIn credential user:", credential.user);

    if (!credential.identityToken) {
      console.warn("[apple] identityToken 없음");
      return { status: "error", message: "Apple 인증 토큰을 받지 못했습니다." };
    }

    return { status: "success", identityToken: credential.identityToken };
  } catch (error) {
    console.warn("[apple] signIn error:", JSON.stringify(error), error);
    // 사용자가 취소하면 ERR_REQUEST_CANCELED
    if ((error as { code?: string })?.code === "ERR_REQUEST_CANCELED") {
      return { status: "cancelled" };
    }
    return {
      status: "error",
      message: (error as { message?: string })?.message ?? "Apple 로그인 실패",
    };
  }
};
