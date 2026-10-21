// 게이트 판정 스크립트. 결과를 harness/out/05-verdict.json에 쓰고, 하나라도 실패하면 종료 코드 1.
//   node harness/scripts/verify.mjs               G1~G6 전부
//   node harness/scripts/verify.mjs --skip-build  G5(build·lint) 제외
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from './lib/tokens.mjs';
import { scanSource } from './lib/token-scan.mjs';

const SRC = resolve(ROOT, 'src');
const APP = resolve(SRC, 'app');
const EXPECTED_ROUTES = ['/plans', '/plans/[planId]', '/plans/[planId]/subscribe', '/plans/[planId]/subscribe/complete'];
const FORBIDDEN_PHRASES = ['변경되었어요', '다음 결제일', '매월 자동 결제'];
const CODE_EXT = /\.(tsx?|jsx?|css|mjs)$/;
const MARKERS = ['penalty-notice', 'remaining-term', 'primary-submit'];

const rel = (p) => relative(ROOT, p).replaceAll('\\', '/');

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// 주석 안의 문구는 세지 않는다. (주석 스킬이 금지 문구를 설명으로 적을 수 있음)
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/(^|[^:"'`])\/\/.*$/gm, '$1');

const srcFiles = walk(SRC).filter((f) => CODE_EXT.test(f));
const read = (f) => readFileSync(f, 'utf8');
const gates = [];
const gate = (id, name, returnTo, detail) => gates.push({ id, name, pass: detail.length === 0, returnTo, detail });

// G1 라우트 수: page 파일 위치로 만든 라우트 집합 = PRD 4개. 루트(/)는 /plans로 보내는 redirect일 때만 허용.
{
  const detail = [];
  const routes = [];
  for (const f of walk(APP).filter((p) => /[\\/]page\.(tsx|ts|jsx|js)$/.test(p))) {
    const segs = rel(f).replace(/^src\/app\/?/, '').split('/').slice(0, -1).filter((s) => !/^\(.*\)$/.test(s));
    const route = '/' + segs.join('/');
    if (route === '/') {
      if (!/redirect\(\s*["'`]\/plans["'`]\s*\)/.test(read(f))) detail.push(`${rel(f)}: 루트(/) 화면은 redirect("/plans")만 허용`);
    } else routes.push(route);
  }
  for (const r of EXPECTED_ROUTES) if (!routes.includes(r)) detail.push(`라우트 없음: ${r}`);
  for (const r of routes) if (!EXPECTED_ROUTES.includes(r)) detail.push(`PRD에 없는 라우트: ${r}`);
  detail.push(...routes.filter((r, i) => routes.indexOf(r) !== i).map((r) => `중복 라우트: ${r}`));
  gate('G1', `라우트 수 = ${EXPECTED_ROUTES.length}`, 4, detail);
}

// G2 토큰 밖 값 (훅이 쓰기 때 막고, 여기서는 Bash 우회까지 다시 검사하는 백스톱)
{
  const detail = [];
  for (const f of walk(APP).filter((p) => CODE_EXT.test(p))) {
    for (const v of scanSource(read(f))) detail.push(`${rel(f)}:${v.line} [${v.rule}] ${v.found} (${v.hint})`);
  }
  gate('G2', '토큰 밖 값 0건', 3, detail);
}

// G3 금지 문구: src 전체 코드에서 주석을 뺀 뒤 3개 문구를 센다 (어기면 안 되는 것 B)
{
  const detail = [];
  for (const f of srcFiles) {
    const text = stripComments(read(f));
    for (const phrase of FORBIDDEN_PHRASES) if (text.includes(phrase)) detail.push(`${rel(f)}: "${phrase}"`);
  }
  gate('G3', '금지 문구 0건', 4, detail);
}

// G4 안내 순서: 구독 신청 page 파일에서 penalty-notice, remaining-term이 primary-submit보다 앞 (어기면 안 되는 것 C)
{
  const detail = [];
  const page = ['tsx', 'ts', 'jsx', 'js'].map((e) => resolve(APP, `plans/[planId]/subscribe/page.${e}`)).find(existsSync);
  if (!page) detail.push('구독 신청 page 파일이 없음');
  else {
    const text = stripComments(read(page));
    const at = Object.fromEntries(MARKERS.map((m) => [m, text.search(new RegExp(`data-gate\\s*=\\s*["'{\`]+\\s*${m}\\b`))]));
    for (const m of MARKERS) if (at[m] < 0) detail.push(`${rel(page)}: data-gate="${m}" 없음`);
    if (at['primary-submit'] >= 0) {
      for (const m of ['penalty-notice', 'remaining-term']) {
        if (at[m] >= 0 && at[m] > at['primary-submit']) detail.push(`${rel(page)}: ${m}이(가) primary-submit보다 뒤에 있음`);
      }
    }
  }
  gate('G4', '위약금·약정 안내가 신청 버튼보다 앞', 4, detail);
}

// G5 build·lint
if (process.argv.includes('--skip-build')) {
  gates.push({ id: 'G5', name: 'build·lint (건너뜀)', pass: true, skipped: true, returnTo: 4, detail: [] });
} else {
  const detail = [];
  for (const script of ['build', 'lint']) {
    const r = spawnSync('npm', ['run', script], { cwd: ROOT, shell: true, encoding: 'utf8' });
    if (r.status !== 0) detail.push(`npm run ${script} 실패 (종료 코드 ${r.status})\n${(r.stdout + r.stderr).split('\n').slice(-15).join('\n')}`);
  }
  gate('G5', 'build·lint 통과', 4, detail);
}

// G6 개인정보 형태 값: 허용 더미("테스트 고객", 010-0000-0000) 밖의 전화번호·이메일·이름
{
  const detail = [];
  const ALLOWED_PHONE = '010-0000-0000';
  for (const f of srcFiles) {
    const text = read(f);
    for (const m of text.matchAll(/(?<!\d)(?:01[016789]|02|0[3-6]\d)[-.\s]?\d{3,4}[-.\s]?\d{4}(?!\d)/g)) {
      if (m[0] !== ALLOWED_PHONE) detail.push(`${rel(f)}: 전화번호 형태 "${m[0]}"`);
    }
    for (const m of text.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)) detail.push(`${rel(f)}: 이메일 형태 "${m[0]}"`);
    for (const m of text.matchAll(/\b(?:name|userName|customerName|applicantName|이름)\s*[:=]\s*["'`]([^"'`]+)["'`]/g)) {
      if (m[1] !== '테스트 고객' && /[가-힣]{2,4}/.test(m[1]) && !/요금제|베이직|스탠다드|프리미엄/.test(m[1])) detail.push(`${rel(f)}: 이름 형태 "${m[1]}"`);
    }
  }
  gate('G6', '개인정보 형태 값 0건', 4, detail);
}

const failed = gates.filter((g) => !g.pass);
const verdict = { checkedAt: new Date().toISOString(), passed: failed.length === 0, returnTo: failed.length ? Math.min(...failed.map((g) => g.returnTo)) : null, gates };
writeFileSync(resolve(ROOT, 'harness/out/05-verdict.json'), JSON.stringify(verdict, null, 2) + '\n');

for (const g of gates) {
  console.log(`${g.pass ? '통과' : '실패'}  ${g.id} ${g.name}${g.skipped ? '' : ''}`);
  for (const d of g.detail.slice(0, 10)) console.log(`        - ${d}`);
  if (g.detail.length > 10) console.log(`        … 외 ${g.detail.length - 10}건`);
}
console.log(verdict.passed ? '\n게이트 전부 통과' : `\n실패 ${failed.length}건 → ${verdict.returnTo}단계로 복귀`);
process.exit(verdict.passed ? 0 : 1);
