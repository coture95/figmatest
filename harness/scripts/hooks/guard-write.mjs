// PreToolUse 훅 (Write|Edit). 종료 코드 2로 쓰기를 거부한다.
//  1) 읽기 전용 폴더(PRD.md, doc/, ref/)는 어느 단계에서도 쓰지 못한다. 예외: 2단계의 doc/screen-spec.md
//  2) 단계(harness/state.json)별로 편집 가능한 곳은 한 곳. 대기(0)에서도 단계 소유 폴더는 막는다
//  3) src/app 코드는 G2(토큰 밖 값)를 검사한다
import { existsSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { ROOT } from '../lib/tokens.mjs';
import { scanSource } from '../lib/token-scan.mjs';

const STAGE_PATH = {
  1: (p) => p === 'harness/out/01-requirements.md',
  2: (p) => p === 'doc/screen-spec.md',
  3: (p) => p === 'harness/out/03-token-map.md',
  4: (p) => p.startsWith('src/app/'),
  5: () => false,
};
const STAGE_LABEL = { 1: 'harness/out/01-requirements.md', 2: 'doc/screen-spec.md', 3: 'harness/out/03-token-map.md', 4: 'src/app/', 5: '없음(읽기 전용)' };
const READONLY = (p) => p === 'PRD.md' || p.startsWith('doc/') || p.startsWith('ref/');
const STAGE_OWNED = (p) => p.startsWith('src/app/') || p.startsWith('harness/out/') || p === 'doc/screen-spec.md';
const CODE_EXT = /\.(tsx?|jsx?|css|mjs)$/;

const deny = (msg) => {
  console.error(`[하네스 훅] ${msg}`);
  process.exit(2);
};

let input = '';
for await (const chunk of process.stdin) input += chunk;
let event;
try {
  event = JSON.parse(input);
} catch {
  process.exit(0);
}

const ti = event.tool_input ?? {};
if (!ti.file_path) process.exit(0);
const rel = relative(ROOT, resolve(ROOT, ti.file_path)).replaceAll('\\', '/');
if (rel.startsWith('..')) process.exit(0); // 프로젝트 밖은 하네스 관할이 아니다

const stateFile = resolve(ROOT, 'harness/state.json');
const stage = existsSync(stateFile) ? Number(JSON.parse(readFileSync(stateFile, 'utf8')).stage) || 0 : 0;

if (READONLY(rel) && !(stage === 2 && STAGE_PATH[2](rel))) {
  deny(`${rel}은(는) 읽기 전용입니다. (doc/screen-spec.md는 2단계에서만 쓸 수 있음)`);
}

if (stage >= 1 && stage <= 5) {
  if (!STAGE_PATH[stage](rel)) deny(`현재 ${stage}단계입니다. 편집 가능한 곳: ${STAGE_LABEL[stage]}. ${rel}은(는) 쓸 수 없습니다.`);
} else if (STAGE_OWNED(rel)) {
  deny(`${rel}은(는) 하네스 단계의 에이전트만 씁니다. "하네스 N단계"로 진행하세요. (현재 단계: 0 대기)`);
}

if (rel.startsWith('src/app/') && CODE_EXT.test(rel)) {
  const text = ti.content ?? ti.new_string ?? '';
  const violations = scanSource(text);
  if (violations.length) {
    const lines = violations.slice(0, 8).map((v) => `  - ${v.line}줄 [${v.rule}] ${v.found} → ${v.hint}`);
    deny(`G2 토큰 밖 값 ${violations.length}건. doc/tokens.json의 값만 쓸 수 있습니다.\n${lines.join('\n')}`);
  }
}
process.exit(0);
