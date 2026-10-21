// 현재 하네스 단계를 harness/state.json에 기록한다. 훅(guard-write)이 이 값으로 편집 폴더를 검사한다.
//   node harness/scripts/set-stage.mjs N           N단계 시작 (0=대기, 1~5)
//   node harness/scripts/set-stage.mjs N --retry   게이트 실패로 N단계로 되돌아감. 같은 단계 3번째 복귀면 종료 코드 3(멈추고 보고)
//   node harness/scripts/set-stage.mjs --pass      게이트 통과. 복귀 횟수 초기화
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT } from './lib/tokens.mjs';

const MAX_RETRY = 2;
const file = resolve(ROOT, 'harness/state.json');
const state = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { stage: 0, retries: {} };
const args = process.argv.slice(2);
const save = () => writeFileSync(file, JSON.stringify(state, null, 2) + '\n');

if (args.includes('--pass')) {
  state.retries = {};
  save();
  console.log('게이트 통과: 복귀 횟수를 초기화했습니다.');
  process.exit(0);
}

const n = Number(args.find((a) => /^\d$/.test(a)));
if (!Number.isInteger(n) || n < 0 || n > 5) {
  console.error('사용법: node harness/scripts/set-stage.mjs <0-5> [--retry] | --pass');
  process.exit(1);
}

state.stage = n;
if (args.includes('--retry')) {
  state.retries[n] = (state.retries[n] ?? 0) + 1;
  save();
  if (state.retries[n] > MAX_RETRY) {
    console.error(`${n}단계로 ${MAX_RETRY}회 되돌아갔지만 실패했습니다. 멈추고 사람에게 보고하세요.`);
    process.exit(3);
  }
  console.log(`${n}단계로 복귀 (${state.retries[n]}/${MAX_RETRY}회)`);
} else {
  save();
  console.log(`현재 단계: ${n}`);
}
