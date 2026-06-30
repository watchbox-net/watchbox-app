/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: "watchbox-app",
  slug: "watchbox-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "net.watchbox.app",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSAppTransportSecurity: {
        NSAllowsLocalNetworking: true,
      },
    },
  },
  android: {
    package: "net.watchbox.app",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    [
      "@react-native-google-signin/google-signin",
      {
        // Google Cloud Console > iOS OAuth 클라이언트의 역순 ID
        // 형식: com.googleusercontent.apps.<ios-client-id>
        // .env.local 의 EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME 에 설정
        iosUrlScheme: process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME ?? "",
      },
    ],
  ],
};

module.exports = { expo: config };
