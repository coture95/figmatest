import Link from "next/link";
import { notFound } from "next/navigation";
import ConsultRequest from "../../_components/ConsultRequest";
import Header from "../../_components/Header";
import ListRow from "../../_components/ListRow";
import SaveForLater from "../../_components/SaveForLater";
import Screen from "../../_components/Screen";
import Tag from "../../_components/Tag";
import { buttonClass } from "../../_components/buttonStyle";
import {
  CURRENT_PLAN,
  PENALTY_TOTAL,
  PLANS,
  RECOMMENDED_PLAN,
  formatWon,
  getPlan,
  monthlySaving,
} from "../../_lib/plans";

/**
 * 화면: 요금제 상세 (/plans/:planId)
 * 목적: 선택한 요금제의 월 요금 절감액과 위약금을 한 화면에서 나란히 보여주고,
 *       변경 신청, 상담 요청, 나중에 다시 확인 중 하나를 고르게 한다.
 * 유저 스토리: 2, 4, 5
 * 이동: 요금제 목록의 자세히, 구독 신청의 취소에서 들어온다.
 *       변경 신청은 구독 신청으로, 뒤로 가기는 요금제 목록으로 나간다.
 * 상태: 로딩, 에러 표시는 [문서에 없음]. 없는 요금제 주소는 "찾을 수 없음" 화면으로 보낸다
 *       (이 처리는 [문서에 없음]).
 */
export function generateStaticParams() {
  return PLANS.map((plan) => ({ planId: plan.id }));
}

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  const plan = getPlan(planId);
  if (!plan) notFound();

  // 맞는 요금제 여부 (F2): 이 요금제가 "맞는 요금제"로 정해진 요금제와 같은지 확인한다.
  const isRecommended = plan.id === RECOMMENDED_PLAN.id;

  return (
    <Screen
      /* 상단 제목줄: 뒤로 가기를 누르면 요금제 목록으로 돌아간다. */
      header={<Header type="default" title="요금제 상세" backHref="/plans" />}
      /* 하단 액션 3개 (F5): 세로로 쌓고 변경 신청 > 상담 요청 > 나중에 다시 확인 순서로 유도한다.
         세 동작은 단계가 아니라 고객마다 다른 선택지다. */
      footer={
        <div className="flex shrink-0 flex-col gap-2 border-t border-border-subtle bg-bg-surface px-4 pb-8 pt-3">
          {/* 변경 신청 버튼 (F5): 가장 먼저 유도하는 동작. 누르면 구독 신청 화면으로 이동한다. */}
          <Link
            href={`/plans/${plan.id}/subscribe`}
            className={buttonClass({ variant: "primary", size: "xl" })}
          >
            변경 신청
          </Link>
          {/* 상담 요청 버튼 (F11): 입력 없이 접수하고 안내 팝업을 띄운다.
              팝업의 확인을 누르면 이전 페이지로 이동한다(완료 후 변경 요청). */}
          <ConsultRequest />
          {/* 나중에 다시 확인 버튼 (F12): 이 요금제와 저장 시각을 브라우저에만 저장하고
              이전 페이지로 이동한다(완료 후 변경 요청). 저장을 지우는 방법과 유효기간은 [문서에 없음]. */}
          <SaveForLater planId={plan.id} />
        </div>
      }
    >
      {/* 요금제 정보 영역: 선택한 요금제의 이름과 월 요금. 맞는 요금제이면 "맞는 요금제" 표시를 붙인다(F2). */}
      <section className="flex flex-col gap-1 rounded-xl bg-bg-default p-5">
        {isRecommended && <Tag>맞는 요금제</Tag>}
        <h2 className="text-subtitle font-bold text-text-primary">{plan.name}</h2>
        <p className="text-heading-h2 font-bold text-text-primary">월 {formatWon(plan.price)}</p>
        <p className="text-body-small font-medium text-text-secondary">부가세 포함</p>
      </section>

      {/* 절감액과 위약금 (F3, F4): 두 금액만 나란히 보여준다. 위약금 회수 기간 같은 해석은 보여주지 않는다.
          절감액은 현재 이용 중인 요금제와의 월 요금 차이다. 위약금은 예시 데이터의 구성 항목 합계다. */}
      <section className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-xl border border-border-default p-4">
            <p className="text-caption font-medium text-text-secondary">월 요금 절감액</p>
            <p className="text-subtitle font-bold text-text-primary">
              {formatWon(monthlySaving(plan))}
            </p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-border-default p-4">
            <p className="text-caption font-medium text-text-secondary">위약금</p>
            <p className="text-subtitle font-bold text-text-primary">{formatWon(PENALTY_TOTAL)}</p>
          </div>
        </div>
        <p className="text-body-small font-medium text-text-secondary">
          현재 이용 중인 {CURRENT_PLAN.name} 요금제 기준이에요.
        </p>
      </section>

      {/* 제공 혜택: 데이터·통화·문자 제공량을 보여준다. 통화·문자 수치는 screens.md의
          요금제별 값(분·건수)이며, 5단계 승인 때 사용자가 이 값으로 복원하도록 정했다. */}
      <section className="flex flex-col gap-3">
        <h2 className="text-heading-h3 font-bold text-text-primary">제공 혜택</h2>
        <div className="flex flex-col">
          <ListRow label="데이터" value={`${plan.dataGb}GB`} />
          <ListRow label="통화" value={plan.voice} />
          <ListRow label="문자" value={plan.sms} />
        </div>
      </section>
    </Screen>
  );
}
