"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import {
  CUSTOMER_NAME,
  MONTHLY_USAGE,
  PEAK_USAGE_GB,
  PLANS,
  RECOMMENDED_PLAN,
  formatWon,
} from "../_lib/plans";
import { getSavedRaw, getSavedServerRaw, parseSaved, subscribeSaved } from "../_lib/saved";
import ListRow from "./ListRow";
import Tag from "./Tag";
import { buttonClass } from "./buttonStyle";

export default function PlanListContent() {
  const raw = useSyncExternalStore(subscribeSaved, getSavedRaw, getSavedServerRaw);
  const saved = useMemo(() => parseSaved(raw), [raw]);

  return (
    <>
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-h3 font-bold text-text-primary">
            나에게 맞는 요금제를 선택하세요
          </h2>
          <p className="text-body-small font-medium text-text-secondary">
            최근 3개월 이용량과 요금제별 제공량을 비교해 보세요.
          </p>
        </div>
        {saved && (
          <p className="text-body-small font-medium text-text-secondary">
            지난번에 확인한 요금제가 있어요
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-heading-h3 font-bold text-text-primary">최근 3개월 데이터 이용량</h2>
        <p className="text-body-small font-medium text-text-secondary">
          {CUSTOMER_NAME}님 기준 예시 데이터예요.
        </p>
        <div className="flex flex-col">
          {MONTHLY_USAGE.map((month) => (
            <ListRow key={month.label} label={month.label} value={`${month.gb}GB`} />
          ))}
          <ListRow label="가장 많이 쓴 달" value={`${PEAK_USAGE_GB}GB`} />
        </div>
      </section>

      <ul className="flex flex-col gap-6">
        {PLANS.map((plan) => {
          const isRecommended = plan.id === RECOMMENDED_PLAN.id;
          const isSaved = saved?.planId === plan.id;
          return (
            <li key={plan.id}>
              <article className="flex flex-col gap-2 rounded-2xl border border-border-default bg-bg-surface p-5">
                {(isRecommended || isSaved) && (
                  <div className="flex gap-2">
                    {isRecommended && <Tag>맞는 요금제</Tag>}
                    {isSaved && <Tag>저장함</Tag>}
                  </div>
                )}
                <h3 className="text-subtitle font-bold text-text-primary">{plan.name}</h3>
                <p className="text-body-small font-medium text-text-secondary">
                  데이터 {plan.dataGb}GB · 통화·문자 기본 제공
                </p>
                <ListRow
                  label="최대 이용량 / 제공량"
                  value={`${PEAK_USAGE_GB}GB / ${plan.dataGb}GB`}
                />
                <div className="flex items-center gap-3 pt-2">
                  <p className="flex-1 text-heading-h2 font-bold text-text-primary">
                    월 {formatWon(plan.price)}
                  </p>
                  <Link
                    href={`/plans/${plan.id}`}
                    aria-label={`${plan.name} 자세히`}
                    className={buttonClass({ variant: "secondary", size: "sm" })}
                  >
                    자세히
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <p className="text-body-small font-medium text-text-secondary">
        모든 요금은 부가세 포함 금액이에요.
      </p>
    </>
  );
}
