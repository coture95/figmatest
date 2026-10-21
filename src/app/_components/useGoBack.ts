"use client";

import { useRouter } from "next/navigation";

/*
 * 이전 페이지로 이동하는 동작 (완료 후 변경 요청: 나중에 다시 확인, 상담 요청 확인 공용).
 * 이동 기록이 있으면 뒤로 가기, 없으면 요금제 목록(/plans)으로 보낸다.
 * 이동 기록 유무는 history 길이가 1 이하인지로 판단한다([문서에 없음]: 사용자 변경 요청에서 정한 기준).
 */
export function useGoBack(): () => void {
  const router = useRouter();
  return () => {
    if (window.history.length <= 1) {
      router.push("/plans");
    } else {
      router.back();
    }
  };
}
