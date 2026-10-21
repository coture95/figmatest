import Header from "../_components/Header";
import PlanListContent from "../_components/PlanListContent";
import Screen from "../_components/Screen";

/**
 * 화면: 요금제 목록 (/plans)
 * 목적: 최근 3개월 데이터 이용량과 요금제별 제공량을 비교하고, 맞는 요금제를 찾아 상세로 보낸다.
 * 유저 스토리: 1, 5
 * 이동: 흐름의 시작 화면(이전 화면은 문서에 정의 없음)이자 요금제 상세에서 돌아오는 곳.
 *       각 요금제 카드에서 요금제 상세(/plans/:planId)로 나간다.
 * 상태: 로딩, 빈 화면, 에러 표시는 [문서에 없음].
 */
export default function PlansPage() {
  return (
    <Screen
      /* 상단 제목줄 (서비스 진입 화면용 root 형태). 제목은 "요금제 목록". */
      header={<Header type="root" title="요금제 목록" />}
      /* 하단 안내 문구: 이용량 기준으로 고르라는 안내. screens.md의 하단 안내 문구와 다르고,
         이 문구를 PRD가 정했는지는 [문서에 없음]. */
      footer={
        <p className="shrink-0 px-4 pb-8 pt-3 text-caption font-medium text-text-secondary">
          요금제는 최근 3개월 이용량을 기준으로 골라 보세요.
        </p>
      }
    >
      {/* 본문 (별도 컴포넌트): 이용량 비교(F1), 맞는 요금제 표시(F2), "저장함" 표시와
          지난번 확인 안내(F12), 카드별 자세히 이동은 이 컴포넌트 안에 있다.
          이 파일에서는 세부 동작을 확인할 수 없다. */}
      <PlanListContent />
    </Screen>
  );
}
