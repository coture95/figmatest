# 03 토큰 적용 (하네스 3단계)

기준: `doc/tokens.json`(SSOT), `doc/Design.md`, `doc/screen-spec.md`, `harness/out/01-requirements.md`.

## 읽는 법

- 색은 semantic 토큰 이름만 쓴다. hex는 쓰지 않는다.
- 글자 크기·간격·모서리는 tokens.json에 있는 이름만 쓴다. 목록 밖이면 '토큰 없음'과 사유를 적는다.
- '미정'은 screen-spec.md가 정하지 않은 항목이다. 임의로 정하지 않았다.
- '-'는 해당 속성이 없다는 뜻이다.
- 고정 크기(width/height)는 tokens.json에 없다. '고정 크기(Design.md)'로 적고 값을 근거와 함께 쓴다.
- `text/error`는 위약금 강조에 쓰지 않는다 (PRD §9).
- 글자 크기 토큰은 텍스트 스타일(서체·굵기·줄높이) 단위로 함께 적용한다. 표의 괄호는 Design.md의 텍스트 스타일 이름이다.

## 공통 기준 (Design.md)

| 영역 | 색 | 글자 크기 | 간격 | 모서리 |
|---|---|---|---|---|
| 일반 화면 본문 | bg/surface | - | 상하좌우 `spacing/24`, 요소 사이 `spacing/24` | - |
| Header | bg/surface | - | 상하 `spacing/4`, 좌우 `spacing/16`, 내부 gap `spacing/8`(default)·`spacing/12`(root) | - |
| 세로 3버튼 하단 영역 | bg/surface | - | 좌우 `spacing/16`, 상단 `spacing/12`, 버튼 사이 `spacing/8`, 하단 `spacing/32` | - |

---

## 1. 요금제 목록 (/plans)

| 화면 | 구성 요소 | 컴포넌트 | 색 토큰 | 글자 크기 토큰 | 간격 토큰 | 모서리 토큰 |
|---|---|---|---|---|---|---|
| 요금제 목록 | Header "요금제 목록" | Header (Type=root) | 배경 bg/surface, 제목 text/primary | font-size/heading-h4 (heading/h4) | 상하 spacing/4, 좌우 spacing/16, gap spacing/12 | - |
| 요금제 목록 | Header 로고 | Logo | brand/primary | - | - | - |
| 요금제 목록 | 목록 안내 영역(기본 안내 문구) | 미정 (전용 컴포넌트 없음, 텍스트) | text/secondary | font-size/body-small (body/small-medium) | 본문 spacing/24 | - |
| 요금제 목록 | 목록 안내 "지난번에 확인한 요금제가 있어요" (저장함 상태) | 미정 (전용 컴포넌트 없음, 텍스트) | text/secondary | font-size/body-small (body/small-medium) | 미정 | - |
| 요금제 목록 | 최근 3개월 데이터 이용량 표시 | 미정 (이용량·제공량 비교 전용 컴포넌트 없음, 구성 방식 미정) | 미정 | 미정 | 미정 | 미정 |
| 요금제 목록 | 요금제 카드 x3 (베이직, 스탠다드, 프리미엄) | Card/Plan (State=default) | border/default | 아래 카드 내부 항목 참고 | 안쪽 spacing/20, 내부 gap spacing/8, 카드 사이 spacing/24 | radius/16 |
| 요금제 목록 | 카드 요금제 이름 | Card/Plan 내부 Name | text/primary | font-size/subtitle (subtitle/bold) | - | - |
| 요금제 목록 | 카드 월 요금 | Card/Plan 내부 Price | text/primary | font-size/heading-h2 (heading/h2, 가격 요약 핵심 금액 기준) | - | - |
| 요금제 목록 | 카드 데이터·통화·문자 제공량 | Card/Plan 내부 Desc | text/secondary | font-size/body-small (body/small-medium) | - | - |
| 요금제 목록 | 카드의 이용량 대비 제공량 비교 | 미정 (비교용 컴포넌트 없음) | 미정 | 미정 | 미정 | 미정 |
| 요금제 목록 | "맞는 요금제" 표시 | 미정 (Chip·Tag 등 표시 방식 미정) | 미정 | 미정 | 미정 | 미정 |
| 요금제 목록 | 저장한 요금제 카드의 "저장함" | Tag | 배경 border/subtle, 글자 text/secondary | font-size/caption (caption/bold) | 상하 spacing/4, 좌우 spacing/12 | radius/999 |
| 요금제 목록 | 카드 내부 "자세히" 버튼 | Button (Type=Secondary, Size=sm, State=Default) | 배경 surface/default, 테두리 border/default, 글자 text/primary | font-size/body (body/strong) | 좌우 spacing/24, 상하 spacing/8 | radius/8 |
| 요금제 목록 | 부가세 포함 설명 | 미정 (전용 컴포넌트 없음, 텍스트) | text/secondary | font-size/body-small (body/small-medium) | 본문 spacing/24 | - |
| 요금제 목록 | 하단 안내 "요금제 선택 안내" | 미정 (Design.md의 안내 텍스트 영역 62px 패턴) | text/secondary | 토큰 없음 (Design.md에 이 안내의 글자 스타일이 없다. 줄높이 18px만 확인됨) | 상단 spacing/12, 하단 spacing/32 | - |

### 상태별 표시 (요금제 목록)

| 상태 | 매핑 |
|---|---|
| 기본 | 위 표 그대로 |
| 저장함 | 저장한 카드에 Tag "저장함"과 목록 안내 문구를 추가한다 |
| 로딩 / 빈 / 에러 | 미정 |

---

## 2. 요금제 상세 (/plans/:planId)

| 화면 | 구성 요소 | 컴포넌트 | 색 토큰 | 글자 크기 토큰 | 간격 토큰 | 모서리 토큰 |
|---|---|---|---|---|---|---|
| 요금제 상세 | Header | Header (Type=default) | 배경 bg/surface, 제목 text/primary | font-size/subtitle (subtitle/default) | 상하 spacing/4, 좌우 spacing/16, gap spacing/8 | - |
| 요금제 상세 | Header 뒤로 가기 | icon/arrowLeft | icon/default | - | - | - |
| 요금제 상세 | 정보 영역 요금제 이름 | 미정 (전용 컴포넌트 없음, 텍스트) | text/primary | font-size/subtitle (subtitle/bold) | 본문 spacing/24 | - |
| 요금제 상세 | 정보 영역 월 요금 | 미정 (전용 컴포넌트 없음, 텍스트) | text/primary | font-size/heading-h2 (heading/h2) | 본문 spacing/24 | - |
| 요금제 상세 | 부가세 포함 안내 | 미정 (텍스트) | text/secondary | font-size/body-small (body/small-medium) | 본문 spacing/24 | - |
| 요금제 상세 | "매월 정기 구독" 문구 | 유지 여부 미정 | 미정 | 미정 | 미정 | 미정 |
| 요금제 상세 | 맞는 요금제 표시 | 미정 (표시 방식 미정) | 미정 | 미정 | 미정 | 미정 |
| 요금제 상세 | 월 요금 절감액 | 미정 (Card/Price는 공개 Text 속성이 없고 크기가 고정이라 쓸 수 없는지 확인 필요, 새 사양 필요 여부 미정) | 미정 | 미정 | 미정 | 미정 |
| 요금제 상세 | 위약금 (절감액과 나란히, 회수 기간 같은 해석 없음) | 미정 (위와 같음) | text/error 사용 금지. 그 외 미정 | 미정 | 미정 | 미정 |
| 요금제 상세 | 섹션 제목 "제공 혜택", "구독 안내" | 미정 (전용 컴포넌트 없음, 텍스트) | text/primary | 토큰 없음 (Design.md에 섹션 제목에 쓸 스타일이 정해져 있지 않다) | 섹션 간격 spacing/24 | - |
| 요금제 상세 | 데이터·통화·문자 행 x3 | List/Row (Type=default) | 레이블 text/secondary(역할 기준), 값 text/primary, 구분선 border/subtle | 값 font-size/body-small (body/small-strong), 레이블 font-size/body-small | 상하 spacing/12, 좌우 spacing/4, gap spacing/12 | radius/0 |
| 요금제 상세 | 이용 시작·자동 결제 설명 | 미정 (텍스트, 문구 유지 여부 미정) | text/secondary | font-size/body-small (body/small-medium) | 본문 spacing/24 | - |
| 요금제 상세 | 하단 "변경 신청" | Button (Type=Primary, Size=xl, State=Default) | 배경 fill/primary, 글자 text/on-dark | font-size/body (body/strong) | 좌우 spacing/24, 상하 spacing/16 | radius/8 |
| 요금제 상세 | 하단 "상담 요청" | Button (Type=Secondary, Size=xl, State=Default) | 배경 surface/default, 테두리 border/default, 글자 text/primary | font-size/body (body/strong) | 좌우 spacing/24, 상하 spacing/16 | radius/8 |
| 요금제 상세 | 하단 "나중에 다시 확인" | Button (Type=Secondary, Size=xl, State=Default) | 배경 surface/default, 테두리 border/default, 글자 text/primary | font-size/body (body/strong) | 좌우 spacing/24, 상하 spacing/16 | radius/8 |
| 요금제 상세 | 하단 액션 영역 (버튼 3개 세로) | Button xl x3 (BottomCTA와 다른 구조) | bg/surface | - | 좌우 spacing/16, 상단 spacing/12, 버튼 사이 spacing/8, 하단 spacing/32 | - |
| 요금제 상세 | "뒤로 · 요금제 목록" 버튼 | 유지 여부 미정 | 미정 | 미정 | 미정 | 미정 |

### 상태별 표시 (요금제 상세)

| 상태 | 매핑 |
|---|---|
| 기본 | 위 표 그대로 |
| 상담 요청 접수 후 | "상담 요청" 버튼을 State=Disabled로 바꾼다. 배경 fill/disabled, 글자는 body/medium(font-size/body). 글자 색은 Design.md에 Button Disabled용이 없어 미정 |
| 상담 요청 접수 안내 "상담 요청이 접수되었어요" | 안내 문구 정확한 내용, 컴포넌트, 색 모두 미정 |
| 나중에 다시 확인 저장 후 | 저장 직후 화면 표시 미정 |
| 로딩 / 빈 / 에러 | 미정 |

---

## 3. 구독 신청 (/plans/:planId/subscribe)

| 화면 | 구성 요소 | 컴포넌트 | 색 토큰 | 글자 크기 토큰 | 간격 토큰 | 모서리 토큰 |
|---|---|---|---|---|---|---|
| 구독 신청 | Header | Header (Type=default) | 배경 bg/surface, 제목 text/primary | font-size/subtitle (subtitle/default) | 상하 spacing/4, 좌우 spacing/16, gap spacing/8 | - |
| 구독 신청 | Header 뒤로 가기 | icon/arrowLeft | icon/default | - | - | - |
| 구독 신청 | 섹션 제목 "신청 내용", "신청자 정보" | 미정 (텍스트) | text/primary | 토큰 없음 (섹션 제목 스타일 미기재) | 섹션 간격 spacing/24 | - |
| 구독 신청 | 요금제·월 요금·이용 시작일 행 x3 | List/Row (Type=default) | 레이블 text/secondary(역할 기준), 값 text/primary, 구분선 border/subtle | 값 font-size/body-small (body/small-strong), 레이블 font-size/body-small | 상하 spacing/12, 좌우 spacing/4, gap spacing/12 | radius/0 |
| 구독 신청 | "이용 시작일" 행 | 유지 여부 미정 | 미정 | 미정 | 미정 | 미정 |
| 구독 신청 | 위약금 금액·약정 남은 기간 안내 (최종 완료보다 앞) | 미정 (컴포넌트·구성 미정, 약정 구조 미정) | 위약금 강조에 text/error 사용 금지. 그 외 미정 | 미정 | 미정 | 미정 |
| 구독 신청 | 입력 항목 레이블 "이름", "휴대폰 번호" | 미정 (텍스트, 입력란 유지 여부 미정) | text/secondary(역할 기준) | font-size/body-small (body/small-medium) | 미정 | - |
| 구독 신청 | 이름·휴대폰 번호 입력란 x2 (더미값만 사용) | Input (State=filled), 유지 여부 미정 | 글자 text/primary, 테두리 border/default | font-size/body (body/strong) | 내부 gap spacing/10, 입력란과 메시지 사이 spacing/12 | radius/0 |
| 구독 신청 | 신청 내용 확인·자동 결제 설명 | 미정 (텍스트, 문구 유지 여부 미정) | text/secondary | font-size/body-small (body/small-medium) | 본문 spacing/24 | - |
| 구독 신청 | 하단 "신청" (최종 완료) | Button (Type=Primary, Size=xl, State=Default) | 배경 fill/primary, 글자 text/on-dark | font-size/body (body/strong) | 좌우 spacing/24, 상하 spacing/16 | radius/8 |
| 구독 신청 | 하단 "상담 요청" | Button (Type=Secondary, Size=xl, State=Default) | 배경 surface/default, 테두리 border/default, 글자 text/primary | font-size/body (body/strong) | 좌우 spacing/24, 상하 spacing/16 | radius/8 |
| 구독 신청 | 하단 "취소" | Button (Type=Secondary, Size=xl, State=Default) | 배경 surface/default, 테두리 border/default, 글자 text/primary | font-size/body (body/strong) | 좌우 spacing/24, 상하 spacing/16 | radius/8 |
| 구독 신청 | 하단 액션 영역 (버튼 3개 세로) | Button xl x3 | bg/surface | - | 좌우 spacing/16, 상단 spacing/12, 버튼 사이 spacing/8, 하단 spacing/32 | - |

### 상태별 표시 (구독 신청)

| 상태 | 매핑 |
|---|---|
| 기본 | 위 표 그대로. 입력란은 filled |
| 상담 요청 접수 후 | "상담 요청" 버튼을 State=Disabled(배경 fill/disabled)로 바꾼다. 접수 안내 문구와 색은 미정 |
| 입력 검증 오류 (필요할 때만) | Input State=caution, 테두리 border/error, 오류 문구 text/error, 오류 아이콘 icon/error. 검증 조건과 문구는 미정 |
| 로딩 / 빈 / 에러 | 미정 (신청 처리 중 표시와 버튼 상태, 입력 전 화면, 신청 실패 처리 모두 미정) |

---

## 4. 신청 완료 (/plans/:planId/subscribe/complete)

| 화면 | 구성 요소 | 컴포넌트 | 색 토큰 | 글자 크기 토큰 | 간격 토큰 | 모서리 토큰 |
|---|---|---|---|---|---|---|
| 신청 완료 | Header | Header (Type=root) | 배경 bg/surface, 제목 text/primary | font-size/heading-h4 (heading/h4) | 상하 spacing/4, 좌우 spacing/16, gap spacing/12 | - |
| 신청 완료 | 완료 표시 | icon/doneMark | 배경 fill/primary | - | - | radius/full |
| 신청 완료 | 완료 표시 내부 체크 | icon/check | icon/on-dark | - | - | - |
| 신청 완료 | 완료 제목 "신청이 접수되었어요" | 미정 (텍스트) | text/primary | 토큰 없음 (완료 제목에 쓸 스타일이 Design.md에 정해져 있지 않다) | 본문 spacing/24 | - |
| 신청 완료 | 설명 (접수 안내, 문자 안내 유지 여부 미정) | 미정 (텍스트) | text/secondary | font-size/body-small (body/small-medium) | 본문 spacing/24 | - |
| 신청 완료 | 섹션 제목 "신청 내역" | 미정 (텍스트) | text/primary | 토큰 없음 (섹션 제목 스타일 미기재) | 섹션 간격 spacing/24 | - |
| 신청 완료 | 신청 내역 행 (변경 후 요금제, 월 요금, 위약금 안내 확인) | List/Row (Type=default) | 레이블 text/secondary(역할 기준), 값 text/primary, 구분선 border/subtle | 값 font-size/body-small (body/small-strong), 레이블 font-size/body-small | 상하 spacing/12, 좌우 spacing/4, gap spacing/12 | radius/0 |
| 신청 완료 | 신청 번호·이용 시작일·신청자·휴대폰 번호 행 | 유지 여부 미정 | 미정 | 미정 | 미정 | 미정 |
| 신청 완료 | 변경 적용 시점 표시 | 표시 여부 미정 | 미정 | 미정 | 미정 | 미정 |
| 신청 완료 | "다음 결제일", "매월 자동 결제" 설명 | 넣지 않는다 (PRD 삭제) | - | - | - | - |
| 신청 완료 | 하단 "완료" | Button (Type=Primary, Size=xl, State=Default) | 배경 fill/primary, 글자 text/on-dark | font-size/body (body/strong) | 좌우 spacing/24, 상하 spacing/16 | radius/8 |
| 신청 완료 | 하단 버튼 영역 (버튼 1개) | 화면의 단일 버튼 영역 96px | bg/surface | - | 좌우 spacing/16, 상단 spacing/12, 하단 spacing/32 | - |

### 상태별 표시 (신청 완료)

| 상태 | 매핑 |
|---|---|
| 기본 | 위 표 그대로 |
| 로딩 / 빈 / 에러 | 미정 |

---

## 고정 크기 (tokens.json에 없음, Design.md가 근거)

| 대상 | 고정 크기(Design.md) |
|---|---|
| 화면 | 390x844 |
| Header | 390x56 |
| Button sm (Secondary, Default) | 높이 42 (예외값. 기본 sm은 40) |
| Button xl | 높이 52 |
| Card/Plan | 358x223 (default) |
| List/Row | 358x46 |
| Input | 358x58 (caution은 358x91) |
| Tag | 기본 콘텐츠 기준 48x26 |
| icon/arrowLeft, icon/check | 24x24 |
| icon/doneMark | 64x64 |
| Logo | 32x24 |
| 세로 3버튼 하단 영역 (화면 2, 3) | 높이 216 (12+52+8+52+8+52+32. Design.md에 없는 별도 사양, PRD 결정) |
| 단일 버튼 영역 (화면 4) | 높이 96 (12+52+32) |
| 안내 텍스트 영역 (화면 1 하단 안내) | 높이 62 (12+18+32) |
| 본문 가용 높이 (화면 2) | 572 (844-56-216, PRD 결정). 화면 3은 같은 구조라 같은 값일 것으로 보이나 screen-spec.md에 값이 없어 미정 |

---

## 토큰 없음 목록 (사람에게 물을 것)

| # | 화면 | 항목 | 사유 |
|---|---|---|---|
| 1 | 요금제 목록 | 하단 안내 글자 스타일 | Design.md에 이 안내의 크기 스타일이 없다. 줄높이 18px만 확인됨 |
| 2 | 요금제 상세, 구독 신청, 신청 완료 | 섹션 제목 글자 스타일 | Design.md에 섹션 제목용 스타일이 정해져 있지 않다 |
| 3 | 신청 완료 | 완료 제목 글자 스타일 | Design.md에 완료 제목용 스타일이 정해져 있지 않다 |
| 4 | 요금제 상세, 구독 신청 | 하단 영역 높이 216 | 높이는 tokens.json에 없다. Design.md에도 없고 PRD 결정이다 |
| 5 | 공통 | 고정 크기 전체 (위 '고정 크기' 표) | width/height 토큰이 tokens.json에 없다 |
| 6 | 공통 | 그림자 위치·블러·확산 | `effect/shadow-subtle`은 색만 있고 크기 토큰이 없다. 이번 매핑에서는 그림자를 쓰지 않았다 |

## 미정 목록 (screen-spec.md가 정하지 않아 비워 둔 것)

| # | 화면 | 항목 |
|---|---|---|
| 1 | 요금제 목록 | 최근 3개월 이용량 표시와 카드의 이용량-제공량 비교에 쓸 컴포넌트와 토큰 |
| 2 | 요금제 목록 | "맞는 요금제" 표시 방식 (Chip, Tag 등) |
| 3 | 요금제 목록 | 저장 삭제 방법과 유효기간 |
| 4 | 요금제 상세 | 맞는 요금제, 절감액, 위약금을 한 화면에 보여줄 컴포넌트 (Card/Price는 공개 Text 속성이 없고 크기가 고정, 새 사양 필요 여부 미정) |
| 5 | 요금제 상세 | "매월 정기 구독", "매월 같은 날짜에 자동 결제" 문구 유지 여부 |
| 6 | 요금제 상세 | "뒤로 · 요금제 목록" 버튼 유지 여부 |
| 7 | 요금제 상세, 구독 신청 | 상담 요청 접수 안내 문구의 내용·컴포넌트·색, 접수 후 Disabled 버튼의 글자 색 |
| 8 | 요금제 상세 | 나중에 다시 확인 저장 직후 화면 표시 |
| 9 | 구독 신청 | 위약금·약정 남은 기간 안내 영역의 컴포넌트와 구성, 약정 구조 |
| 10 | 구독 신청 | 이용 시작일 행, 신청자 입력란(Input x2)과 레이블 유지 여부, 자동 결제 안내 문구 유지 여부 |
| 11 | 구독 신청 | 입력 검증 조건, 오류 문구, 신청 실패 처리, 신청 처리 중 표시 |
| 12 | 신청 완료 | 문자 안내 유지 여부, 신청 번호·이용 시작일·신청자·휴대폰 번호 행 유지 여부, 변경 적용 시점 표시 여부 |
| 13 | 신청 완료 | "완료" 버튼 이동 화면 |
| 14 | 전체 | 로딩·빈·에러 상태 (4개 화면 모두) |
| 15 | 요금제 목록 | 목록 안내 문구와 저장함 안내의 간격 |

## 참고 (Design.md에 근거가 약한 매핑)

- 설명 문구에 쓴 `text/secondary`와 `font-size/body-small`은 Design.md의 "보조 설명", "작은 본문" 역할 기준이다.
- List/Row 레이블 색 `text/secondary`는 Design.md에 명시가 없어 역할 기준으로 적었다. 확정이 필요하다.
- Card/Plan의 배경색은 Design.md에 적혀 있지 않아 쓰지 않았다. 테두리만 `border/default`로 적었다.
- Card/Plan 내부 Name·Price·Desc의 색과 크기는 Design.md의 텍스트 스타일 "쓰는 곳"(요금제 이름, 핵심 금액, 요금제 설명)을 따랐다.
