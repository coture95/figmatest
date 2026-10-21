export type Plan = {
  id: string;
  name: string;
  price: number;
  dataGb: number;
  voice: string;
  sms: string;
};

// 통화·문자 제공량: doc/screens.md 요금제 목록의 요금제별 값
export const PLANS: Plan[] = [
  { id: "basic", name: "베이직", price: 4900, dataGb: 3, voice: "50분", sms: "50건" },
  { id: "standard", name: "스탠다드", price: 9900, dataGb: 10, voice: "100분", sms: "100건" },
  { id: "premium", name: "프리미엄", price: 19900, dataGb: 30, voice: "무제한", sms: "무제한" },
];

export const CUSTOMER_NAME = "테스트 고객";
export const CURRENT_PLAN_ID = "premium";

export const MONTHLY_USAGE = [
  { label: "3개월 전", gb: 4.2 },
  { label: "2개월 전", gb: 6.8 },
  { label: "지난달", gb: 5.5 },
];

export const PEAK_USAGE_GB = Math.max(...MONTHLY_USAGE.map((m) => m.gb));

export const PENALTY_ITEMS = [
  { label: "가입 초기 혜택 환수", amount: 30000 },
  { label: "단말대금 지원 환수", amount: 50000 },
  { label: "요금할인 반환", amount: 20000 },
];

export const PENALTY_TOTAL = PENALTY_ITEMS.reduce((sum, item) => sum + item.amount, 0);

export const REMAINING_TERM_MONTHS = 8;

export const RECOMMENDED_PLAN = [...PLANS]
  .filter((plan) => plan.dataGb >= PEAK_USAGE_GB)
  .sort((a, b) => a.price - b.price)[0];

export const CURRENT_PLAN = PLANS.find((plan) => plan.id === CURRENT_PLAN_ID) ?? PLANS[0];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((plan) => plan.id === id);
}

export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function monthlySaving(plan: Plan): number {
  return Math.max(0, CURRENT_PLAN.price - plan.price);
}
