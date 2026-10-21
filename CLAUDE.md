# 하네스 오케스트레이터 규칙

@AGENTS.md

## 역할
- 이 대화(메인)는 **직접 구현하지 않는다.** 에이전트를 부르고, 게이트 스크립트를 돌리고, 결과를 사람에게 보고한다.
- `src/`, `harness/out/`, `doc/screen-spec.md`는 메인이 직접 수정하지 않는다. 해당 단계의 에이전트만 쓴다.
- 읽기 전용: `PRD.md`, `doc/*`(단 `doc/screen-spec.md`는 2단계 에이전트만 쓸 수 있음), `ref/*`.
- 규칙의 기준(SSOT)은 `doc/tokens.json` 하나. 토큰 밖 값은 쓰지 않는다.
- 어느 문서도 지어내지 않는다. 문서에 없으면 '미정'으로 표시하고 사람에게 묻는다.
- Figma 링크(`ref/links.md`)를 읽지 못하면 추측하지 않고 멈추고 알린다. 우선순위: PRD.md > screens.md > 화면 링크 > Make 링크 > flow.png.

## 부르는 말
- "하네스 N단계" (N=1~5): 해당 단계를 실행한다.
- "하네스 이어서": `git log`의 마지막 `harness(N)` 커밋을 확인해 N+1단계부터 실행한다. 커밋이 없으면 1단계.

## 단계
| N | 에이전트 | 편집 폴더 | 산출물 |
|---|---|---|---|
| 1 | req-reader | harness/out/ | 01-requirements.md |
| 2 | screen-spec-writer (기존) | doc/ | screen-spec.md |
| 3 | token-mapper | harness/out/ | 03-token-map.md |
| 4 | screen-builder → annotate-screen-code (기존 스킬) | src/app/ | 화면 4개 |
| 5 | verdict-judge (읽기 전용) + verify.mjs | 없음 | 05-verdict.json (스크립트가 기록) |

단계를 시작하기 전에 `node harness/scripts/set-stage.mjs N`으로 `harness/state.json`의 `stage`를 N으로 쓴다. 훅(`harness/scripts/hooks/guard-write.mjs`)이 이 값으로 폴더 쓰기를 검사한다. 하네스를 쉬거나 하네스 파일을 고칠 때는 `set-stage.mjs 0`.
4단계 에이전트는 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 관련 문서를 읽는다.
4단계의 `annotate-screen-code`는 `screen-builder`가 끝난 뒤, 같은 4단계 안에서 실행한다.

## 게이트 (`node harness/scripts/verify.mjs`, 5단계에서 실행)
- G1 라우트 집합 = PRD 4개(`/plans`, `/plans/[planId]`, `/plans/[planId]/subscribe`, `/plans/[planId]/subscribe/complete`). 루트(`/`)는 `redirect("/plans")`일 때만 허용
- G2 (훅) 색·글자 크기·간격·모서리·폰트가 `doc/tokens.json` 목록 밖이면 쓰기 거부. width/height는 제외. verify.mjs가 같은 검사를 한 번 더 한다
- G3 "변경되었어요", "다음 결제일", "매월 자동 결제" 0건 (주석 제외) — 어기면 안 되는 것 B
- G4 구독 신청 page 파일에서 `data-gate="penalty-notice"`, `data-gate="remaining-term"`이 `data-gate="primary-submit"`보다 앞 — 어기면 안 되는 것 C
- G5 `npm run build`, `npm run lint` 종료 코드 0
- G6 허용 더미("테스트 고객", "010-0000-0000") 밖의 전화번호·이메일·이름 형태 0건

## 실패 시 복귀
- G1·G3·G4·G5·G6 실패 → 4단계 / G2 위반 → 3단계 / 화면 구성이 screen-spec.md와 다름(판정자 보고) → 2단계
- 복귀는 `node harness/scripts/set-stage.mjs N --retry`로 한다. 같은 단계로 2회 돌아가도 실패하면(종료 코드 3) 멈추고 사람에게 보고한다.

## 커밋과 승인
- 단계의 게이트를 통과하면 `node harness/scripts/set-stage.mjs --pass` 후 `harness(N): <산출물 이름>` 커밋을 만든다. push는 하지 않는다.
- 1·2·3단계의 게이트는 산출물 파일이 있고 '미정'이 아닌 항목이 채워졌는지 확인하는 것이다. 4단계는 `verify.mjs --skip-build`, 5단계는 `verify.mjs` 전체.
- 사람 승인은 5단계 검증 직후 1회. 승인 전에는 완료로 보고하지 않는다.
- 응답과 산출물에 고객 PII를 쓰지 않는다. 더미값만 쓴다.

## 보고 형식
- 매 단계가 끝나면 한국어 평어로 3줄 이내: 한 일, 게이트 결과(통과/실패 N건), 다음 단계.
