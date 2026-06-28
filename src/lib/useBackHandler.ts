import { useEffect } from "react";
import { BackHandler } from "react-native";

/**
 * Android 하드웨어 뒤로가기 핸들러.
 * handler 가 true 를 반환하면 기본 동작(앱 종료)을 막는다.
 * iOS 에는 하드웨어 백이 없어 무해하게 동작한다.
 */
export function useBackHandler(handler: () => boolean): void {
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handler,
    );
    return () => subscription.remove();
  }, [handler]);
}
