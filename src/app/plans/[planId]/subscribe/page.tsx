import Link from "next/link";
import { notFound } from "next/navigation";
import ConsultRequest from "../../../_components/ConsultRequest";
import Header from "../../../_components/Header";
import ListRow from "../../../_components/ListRow";
import Screen from "../../../_components/Screen";
import { buttonClass } from "../../../_components/buttonStyle";
import {
  PENALTY_ITEMS,
  PENALTY_TOTAL,
  PLANS,
  REMAINING_TERM_MONTHS,
  formatWon,
  getPlan,
} from "../../../_lib/plans";

/**
 * 화면: 구독 신청 (/plans/:planId/subscribe)
 * 목적: 신청 내용을 확인하고, 최종 완료 전에 위약금 금액과 약정 남은 기간을 안내한다.
 * 유저 스토리: 3, 4
 * 이동: 요금제 상세의 변경 신청에서 들어온다.
 *       신청은 신청 완료로, 취소와 뒤로 가기는 요금제 상세로 나간다.
 * 상태: 로딩, 에러 표시는 [문서에 없음]. 이름·휴대폰 번호 입력란은 이 화면에 없다
 *       (PRD 열린 질문에 입력 여부가 남아 있음).
 */
export function generateStaticParams() {
  return PLANS.map((plan) => ({ planId: plan.id }));
}

export default async function SubscribePage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  const plan = getPlan(planId);
  if (!plan) notFound();

  const content = (
    <>
      {/* 신청 내용 확인 (F6): 바꿀 요금제의 이름, 월 요금, 데이터 제공량을 보여준다. */}
      <section className="flex flex-col gap-3">
        <h2 className="text-heading-h3 font-bold text-text-primary">신청 내용</h2>
        <div className="flex flex-col rounded-xl bg-bg-default p-4">
          <ListRow label="요금제" value={plan.name} />
          <ListRow label="월 요금" value={`${formatWon(plan.price)} (부가세 포함)`} />
          <ListRow label="데이터" value={`${plan.dataGb}GB`} />
        </div>
      </section>

      {/* 위약금 안내 (F7): 가입 초기 혜택 환수, 단말대금 지원 환수, 요금할인 반환 항목별 금액과 합계를
          최종 완료 전에 보여준다. 금액은 예시 데이터이며 계산 공식은 없다. */}
      <section data-gate="penalty-notice" className="flex flex-col gap-3">
        <h2 className="text-heading-h3 font-bold text-text-primary">위약금 안내</h2>
        <div className="flex flex-col rounded-xl bg-bg-default p-4">
          {PENALTY_ITEMS.map((item) => (
            <ListRow key={item.label} label={item.label} value={formatWon(item.amount)} />
          ))}
          <ListRow label="위약금 합계" value={formatWon(PENALTY_TOTAL)} />
        </div>
      </section>

      {/* 약정 남은 기간 (F7): 혜택을 유지해야 하는 약정 기간 중 남은 기간 안내.
          신청 전 확인을 당부하는 문구가 함께 나온다(안내 시점 규칙). */}
      <section data-gate="remaining-term" className="flex flex-col gap-3">
        <h2 className="text-heading-h3 font-bold text-text-primary">약정 남은 기간</h2>
        <div className="flex flex-col rounded-xl bg-bg-default p-4">
          <ListRow label="약정 남은 기간" value={`${REMAINING_TERM_MONTHS}개월`} />
        </div>
        <p className="text-body-small font-medium text-text-secondary">
          신청하기 전에 위약금과 약정 남은 기간을 확인해 주세요.
        </p>
      </section>
    </>
  );

  // 하단 액션 3개 (F8): 신청 > 상담 요청 > 취소 순서로 유도한다.
  const actions = (
    <div className="flex shrink-0 flex-col gap-2 border-t border-border-subtle bg-bg-surface px-4 pb-8 pt-3">
      {/* 신청 버튼 (F9): 최종 완료. 변경 신청을 접수하고 신청 완료 화면으로 이동한다.
          실제 요금제 변경은 하지 않는다. */}
      <Link
        href={`/plans/${plan.id}/subscribe/complete`}
        data-gate="primary-submit"
        className={buttonClass({ variant: "primary", size: "xl" })}
      >
        신청
      </Link>
      {/* 상담 요청 버튼 (F11): 위약금이 부담스러운 고객이 신청 대신 고르는 선택지.
          입력 없이 접수하고, 접수되면 버튼이 눌리지 않는 상태로 바뀐다([가정]). */}
      <ConsultRequest />
      {/* 취소 버튼 (F10): 신청하지 않고 요금제 상세로 돌아간다. */}
      <Link
        href={`/plans/${plan.id}`}
        className={buttonClass({ variant: "secondary", size: "xl" })}
      >
        취소
      </Link>
    </div>
  );

  return (
    <Screen
      /* 상단 제목줄: 뒤로 가기를 누르면 요금제 상세로 돌아간다. */
      header={<Header type="default" title="구독 신청" backHref={`/plans/${plan.id}`} />}
      footer={actions}
    >
      {content}
    </Screen>
  );
}
