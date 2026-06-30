import { Platform } from "react-native";
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from "@react-native-google-signin/google-signin";

export type GoogleSignInResult =
  | { status: "success"; serverAuthCode: string }
  | { status: "cancelled" }
  | { status: "error"; message: string };

const configure = () => {
  GoogleSignin.configure({
    // Google Cloud Console > 웹 애플리케이션 OAuth 클라이언트 ID
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
    iosClientId:
      Platform.OS === "ios"
        ? (process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? undefined)
        : undefined,
    offlineAccess: true,   // serverAuthCode 획득을 위해 필수
  });
};

export const performGoogleLogin = async (): Promise<GoogleSignInResult> => {
  configure();

  try {
    if (Platform.OS === "android") {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }

    const response = await GoogleSignin.signIn();

    if (response.type === "cancelled") {
      return { status: "cancelled" };
    }

    const serverAuthCode = response.data?.serverAuthCode;
    if (!serverAuthCode) {
      return { status: "error", message: "서버 인증 코드를 받지 못했습니다." };
    }

    return { status: "success", serverAuthCode };
  } catch (error) {
    if (isErrorWithCode(error)) {
      if (
        error.code === statusCodes.SIGN_IN_CANCELLED ||
        error.code === statusCodes.IN_PROGRESS
      ) {
        return { status: "cancelled" };
      }
      return { status: "error", message: error.message ?? "Google 로그인 실패" };
    }
    return { status: "error", message: "Google 로그인 실패" };
  }
};
