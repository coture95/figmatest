import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../../_components/Header";
import ListRow from "../../../../_components/ListRow";
import Screen from "../../../../_components/Screen";
import { buttonClass } from "../../../../_components/buttonStyle";
import { DoneMark } from "../../../../_components/icons";
import { PLANS, formatWon, getPlan } from "../../../../_lib/plans";

/**
 * 화면: 신청 완료 (/plans/:planId/subscribe/complete)
 * 목적: 변경 신청이 접수된 사실과 신청 내역을 확인한다. 요금제가 이미 바뀐 것으로 오해하지 않도록
 *       "접수" 기준으로 안내한다.
 * 유저 스토리: 3
 * 이동: 구독 신청의 신청 버튼에서 들어온다. 완료 버튼은 요금제 목록으로 나간다.
 *       (screens.md는 완료 이후 이동 화면을 정의하지 않았으므로, 목록으로 보내는 것은 [문서에 없음].)
 * 상태: 로딩, 에러 표시는 [문서에 없음].
 */
export function generateStaticParams() {
  return PLANS.map((plan) => ({ planId: plan.id }));
}

export default async function SubscribeCompletePage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  const plan = getPlan(planId);
  if (!plan) notFound();

  return (
    <Screen
      /* 상단 제목줄 (root 형태). 제목은 "신청 완료". */
      header={<Header type="root" title="신청 완료" />}
      footer={
        <div className="flex shrink-0 flex-col border-t border-border-subtle bg-bg-surface px-4 pb-8 pt-3">
          {/* 완료 버튼: 흐름을 마치고 요금제 목록으로 돌아간다. */}
          <Link href="/plans" className={buttonClass({ variant: "primary", size: "xl" })}>
            완료
          </Link>
        </div>
      }
    >
      {/* 완료 안내 (F9): 완료 표시와 "신청이 접수되었어요" 제목. 실제 요금제 변경은 하지 않았다는 점을
          설명 문구로 알린다. */}
      <div className="flex flex-col items-center gap-6">
        <DoneMark />
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <p className="text-heading-h3 font-bold text-text-primary">신청이 접수되었어요</p>
          <p className="text-body-small font-medium text-text-secondary">
            접수만 완료된 상태예요. 아래 신청 내역을 확인해 주세요.
          </p>
        </div>
      </div>

      {/* 신청 내역: 변경 후 요금제, 월 요금, 위약금 안내 확인 여부. 신청 번호, 이용 시작일, 변경 적용 시점은
          보여주지 않는다(적용 시점을 넣을지는 PRD 열린 질문). 위약금 안내 확인은 항상 "확인함"으로
          표시되며, 실제 확인 기록을 남기는지는 [문서에 없음]. */}
      <section className="flex flex-col gap-3">
        <h2 className="text-heading-h3 font-bold text-text-primary">신청 내역</h2>
        <div className="flex flex-col rounded-xl bg-bg-default p-4">
          <ListRow label="변경 후 요금제" value={plan.name} />
          <ListRow label="월 요금" value={formatWon(plan.price)} />
          <ListRow label="위약금 안내 확인" value="확인함" />
        </div>
      </section>
    </Screen>
  );
}
