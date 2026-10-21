# Design.md

기준: 현재 파일의 로컬 베리어블, 텍스트 스타일, Components 섹션 및 390×844 모바일 화면.
모든 베리어블은 각 컬렉션의 Default 모드를 기준으로 한다.

토큰 값·스타일 사양·컴포넌트 속성은 현재 정의를 따른다. 용도는 실제 적용 사례를 우선하며, 적용 사례가 확인되지 않은 항목은 ‘역할 기준’으로 표시한다. 사용 규칙은 확인된 구조를 바탕으로 한 구현 가이드다.

## 1. 색 팔레트

색상은 primitive의 HEX 값을 직접 반복하기보다 semantic 토큰으로 참조한다. 같은 값이라도 텍스트·배경·테두리·아이콘의 역할을 구분한다.

### 텍스트

| Semantic 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `text/primary` | `#181A1B` | 입력값, 일반 제목·본문, Secondary 버튼 레이블 |
| `text/secondary` | `#66707A` | 보조 설명과 낮은 강조 텍스트 |
| `text/tertiary` | `#878787` | 가격 요약의 레이블·정가 등 부가 정보 |
| `text/on-dark` | `#FFFFFF` | Primary 버튼 레이블 등 강한 배경 위 텍스트 |
| `text/accent` | `#FF2E98` | 할인율, 혜택 값 등 강조 정보 |
| `text/error` | `#E30036` | Input의 검증 오류 메시지 |
| `text/placeholder` | `#B7BDC4` | 입력 전 안내 텍스트 |
| `text/on-disabled` | `#66707A` | disabled Input의 텍스트 |

### 배경·표면

| Semantic 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `bg/surface` | `#FFFFFF` | Header와 기본 표면 |
| `bg/default` | `#F7F7F7` | 가격 요약 카드, 선택된 OptionItem 배경 |
| `bg/subtle` | `#EFF1F3` | disabled Input, Secondary 버튼 Hover, benefit Chip |
| `bg/inverse` | `#2D2D2D` | 역상 배경 — 역할 기준 |
| `bg/accent-subtle` | `#FFF5FA` | 할인 Chip과 프로모션 배경 |
| `bg/error-subtle` | `#FFF0F3` | 오류 안내의 옅은 배경 — 역할 기준 |
| `surface/default` | `#FFFFFF` | Secondary 버튼 기본 배경 |

### 테두리·구분선

| Semantic 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `border/default` | `#D9DCDF` | Input 기본 테두리, Secondary 버튼, 기본 선택 카드 |
| `border/subtle` | `#EFF1F3` | List/Row 구분선; 현재 Tag 배경에도 연결됨 |
| `border/medium` | `#66707A` | 선택된 Card/Plan·OptionItem 테두리 |
| `border/strong` | `#181A1B` | 강한 경계 — 역할 기준 |
| `border/divider` | `rgba(0, 0, 0, 0.10)` | 약한 영역 구분선 |
| `border/focus` | `#FF2E98` | focus Input 테두리 |
| `border/error` | `#E30036` | caution Input 테두리 |

### 채움

| Semantic 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `fill/primary` | `#FF2E98` | Primary 버튼, active Checkbox, 완료 표시 |
| `fill/accent` | `#FF2E98` | 강조 채움 — 역할 기준 |
| `fill/primary-hover` | `#E6007E` | Primary 버튼 Hover |
| `fill/secondary` | `#D9DCDF` | package Chip, selected FilterChip |
| `fill/tertiary` | `#EFF1F3` | 낮은 강조 채움 — 역할 기준 |
| `fill/disabled` | `#D9DCDF` | Disabled 버튼 배경 |
| `fill/disabled-strong` | `#66707A` | 강한 비활성 표시 — 역할 기준 |

### 아이콘

| Semantic 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `icon/primary` | `#000000` | 최상위 강조 아이콘 — 역할 기준 |
| `icon/strong` | `#181A1B` | 높은 강조 아이콘 — 역할 기준 |
| `icon/default` | `#66707A` | 뒤로가기·체크 아이콘의 내부 도형 |
| `icon/accent` | `#FF2E98` | 혜택 목록 bullet, 할인·프로모션 표시 |
| `icon/on-dark` | `#FFFFFF` | 완료 표시 내부의 밝은 아이콘 |
| `icon/disabled` | `#D9DCDF` | 비활성 아이콘 — 역할 기준 |
| `icon/error` | `#E30036` | Input 오류 아이콘 |

### 브랜드·효과

| Semantic 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `brand/primary` | `#FF2E98` | Logo 내부 브랜드 도형 |
| `effect/shadow-subtle` | `rgba(0, 0, 0, 0.05)` | 미세한 그림자 색 — 역할 기준 |

### 적용 규칙

- `fill/primary`, `text/accent`, `icon/accent`, `brand/primary`는 값이 같아도 서로 다른 역할로 유지한다.
- `fill/secondary`는 현재 `#D9DCDF`다. 검정 계열로 해석하지 않는다.
- `fill/disabled-strong`은 현재 `#66707A`다.
- `border/divider`의 알파 10%, `effect/shadow-subtle`의 알파 5%를 유지한다.
- `effect/shadow-subtle`은 색상 토큰이다. 이 토큰만으로 그림자의 위치·블러·확산 값을 결정하지 않는다.
- focus·error·disabled·selected 상태는 해당 컴포넌트의 Variant와 함께 적용한다.

## 2. 타이포 스케일

기본 서체는 `Noto Sans KR`이며, `font-family/family-font` 베리어블과 일치한다.
로컬 텍스트 스타일의 자간은 모두 `0%`다. 크기와 줄높이 단위는 px다.

| 텍스트 스타일 | 크기 / 줄높이 | 굵기 | 쓰는 곳 |
|---|---:|---|---|
| `heading/h1` | 32 / 44 | Bold 700 | 최상위 제목 — 역할 기준 |
| `heading/h2` | 28 / 40 | Bold 700 | 가격 요약 카드의 핵심 금액, 큰 제목 |
| `heading/h3` | 24 / 32 | Bold 700 | 중간 단계 제목 — 역할 기준 |
| `heading/h4` | 20 / 28 | Bold 700 | root Header 제목 |
| `subtitle/bold` | 18 / 26 | Bold 700 | 요금제 이름, 하단 요약 금액, 할인율 |
| `subtitle/default` | 18 / 26 | SemiBold 600 | default Header 제목 |
| `body/strong` | 16 / 24 | SemiBold 600 | Input 텍스트, 주요 버튼 레이블 |
| `body/medium` | 16 / 24 | Medium 500 | 일반 본문, Disabled 버튼 레이블 |
| `body/small-strong` | 14 / 21 | SemiBold 600 | List/Row 값, selected FilterChip 레이블 |
| `body/small-medium` | 14 / 21 | Medium 500 | 오류 안내, 요금제 설명 등 작은 본문 |
| `caption/bold` | 13 / 18 | Bold 700 | 추천 Tag, 할인·프로모션 Chip |
| `caption/medium` | 13 / 18 | Medium 500 | 요금 레이블, 정가 등 부가 정보 |
| `caption/small-bold` | 12 / 16 | Bold 700 | 작은 강조 정보 — 역할 기준 |
| `caption/small` | 12 / 16 | Medium 500 | 작은 보조 정보 — 역할 기준 |
| `caption/mini` | 10 / 14 | SemiBold 600 | benefit·package Chip 레이블 |
| `specimen/weight-medium` | 32 / 44 | Medium 500 | 서체 굵기 견본 |
| `specimen/weight-semibold` | 32 / 44 | SemiBold 600 | 서체 굵기 견본 |

### 크기 베리어블 연결

| 베리어블 | 값 | 대응 스타일 |
|---|---:|---|
| `font-size/heading-h1` | 32 | `heading/h1`, 32px 견본 |
| `font-size/heading-h2` | 28 | `heading/h2` |
| `font-size/heading-h3` | 24 | `heading/h3` |
| `font-size/heading-h4` | 20 | `heading/h4` |
| `font-size/subtitle` | 18 | `subtitle/*` |
| `font-size/body` | 16 | `body/strong`, `body/medium` |
| `font-size/body-small` | 14 | `body/small-*` |
| `font-size/caption` | 13 | `caption/bold`, `caption/medium` |
| `font-size/12` | 12 | `caption/small`, `caption/small-bold` |
| `font-size/caption-mini` | 10 | `caption/mini` |

### 적용 규칙

- 크기만 맞추지 말고 서체·굵기·줄높이를 포함한 텍스트 스타일 단위로 적용한다.
- `heading/h4`의 현재 굵기는 Bold 700이다.
- `specimen/*`은 서체 견본용이며 일반 화면의 제목 스타일을 대체하지 않는다.
- 줄 수가 늘어날 수 있는 설명·오류 메시지는 높이를 내용에 맞춰 확장하고 주변 요소를 밀어내도록 구성한다.
- 숨겨진 메시지 레이어 등 일부 기존 노드에는 예외 스타일이 있으므로, 이를 새로운 공통 타이포 규칙으로 일반화하지 않는다.

## 3. 간격·레이아웃

### 간격 베리어블

토큰 이름의 숫자와 실제 px 값이 일치한다.

| 토큰 | 값 |
|---|---:|
| `spacing/0` | 0 |
| `spacing/2` | 2 |
| `spacing/4` | 4 |
| `spacing/6` | 6 |
| `spacing/8` | 8 |
| `spacing/10` | 10 |
| `spacing/12` | 12 |
| `spacing/16` | 16 |
| `spacing/20` | 20 |
| `spacing/24` | 24 |
| `spacing/28` | 28 |
| `spacing/32` | 32 |
| `spacing/40` | 40 |
| `spacing/48` | 48 |
| `spacing/56` | 56 |
| `spacing/60` | 60 |
| `spacing/64` | 64 |
| `spacing/80` | 80 |

주요 적용 사례:

- 0px: 불필요한 외곽 padding·gap 제거.
- 2px: Input 내부의 미세한 시작 여백.
- 4px: 가격 정보 간격, 작은 표시 요소.
- 6px: benefit·package Chip 좌우 padding.
- 8px: 카드 내부 스택, 버튼 사이, 진행 표시 내부 간격.
- 10px: Input 내부 gap, sale Chip 좌우 padding.
- 12px: Input과 메시지 사이, OptionItem 내부, 하단 액션 상단 여백.
- 16px: Header·하단 액션 좌우 여백, 일부 화면 본문 여백.
- 20px: Card/Plan 내부 padding.
- 24px: 일반 화면 본문 padding·섹션 간격, Button 좌우 padding.
- 32px: BottomCTA 하단 여백.
- 나머지 값은 등록된 확장 간격이며, 등록 여부만으로 특정 화면 용도를 고정하지 않는다.

### 모서리 반경 베리어블

| 토큰 | 값 |
|---|---:|
| `radius/0` | 0 |
| `radius/2` | 2 |
| `radius/4` | 4 |
| `radius/5` | 5 |
| `radius/6` | 6 |
| `radius/8` | 8 |
| `radius/10` | 10 |
| `radius/12` | 12 |
| `radius/16` | 16 |
| `radius/20` | 20 |
| `radius/24` | 24 |
| `radius/32` | 32 |
| `radius/40` | 40 |
| `radius/999` | 999 |
| `radius/full` | 9999 |

실제 적용:

- Input field: 0px.
- benefit·package Chip: 4px.
- sale Chip: 6px.
- Button: 8px.
- OptionItem·Card/Price: 12px.
- Card/Plan: 16px.
- Tag: `radius/999`.
- FilterChip·완료 표시: `radius/full`.

Components 섹션의 전시용 컨테이너에 적용된 반경을 실사용 컴포넌트 사양으로 혼동하지 않는다.

### 390×844 모바일 구조

기본 구조는 상단 Header, 남은 높이를 차지하는 본문, 필요한 경우 하단 액션 영역으로 구성한다.

| 영역 | 확인된 기준 |
|---|---|
| 화면 | 390×844px |
| Header | 390×56px |
| Header 좌우 padding | 16px |
| 16px 좌우 여백의 콘텐츠 폭 | 358px |
| 24px 좌우 여백의 콘텐츠 폭 | 342px |
| 일반 화면 본문 | 세로 Auto Layout |
| 일반 화면 본문 padding | 상하좌우 24px |
| 일반 화면 본문 gap | 24px |
| 일부 신청·완료 화면 본문 | 좌우 16px, gap 16px 또는 24px |
| 하단 액션 좌우 padding | 일반 화면 16px, 일부 예시 24px |
| 하단 안전 여백 | 기본 컴포넌트 32px |

16px과 24px 여백은 모두 실제 화면에 존재한다. 모든 본문을 358px로 고정하지 않고 해당 화면의 여백 체계를 따른다.

### 하단 액션 패턴

| 패턴 | 높이 | 구성 |
|---|---:|---|
| BottomCTA `single` | 97px | 52px 버튼 하나, 상단 12px·하단 32px |
| BottomCTA `double` | 97px | 가로 버튼 두 개, gap 8px |
| BottomCTA `price` | 139px | 26px 금액 행, gap 12px, 52px 버튼, 상단 16px·하단 32px |
| 화면의 단일 버튼 영역 | 96px | 12 + 52 + 32px |
| 화면의 세로 이중 버튼 영역 | 156px | 12 + 52 + 8 + 52 + 32px |
| 화면의 안내 텍스트 영역 | 62px | 12 + 18 + 32px |

BottomCTA의 실제 외곽 높이에는 테두리와 레이아웃 설정이 반영되어 있으므로, 단순 padding 합산값과 구분한다.

### 본문 가용 높이

Header와 하단 액션을 별도 영역으로 유지할 때:

- BottomCTA single/double: `844 - 56 - 97 = 691px`.
- BottomCTA price: `844 - 56 - 139 = 649px`.
- 단일 버튼 영역 96px: `692px`.
- 세로 이중 버튼 영역 156px: `632px`.
- 안내 영역 62px: `726px`.

### 구현 규칙

- Header·하단 액션은 전체 폭을 사용하고, 내부 콘텐츠는 해당 영역의 padding을 따른다.
- 카드·입력·진행 표시의 원본 폭은 358px이지만, 24px 본문 여백에서는 342px에 맞춰 내부 콘텐츠와 함께 조정한다.
- 버튼 높이는 기본적으로 40·48·52px 체계를 사용하되 실제 Variant 예외는 아래 컴포넌트 사양을 따른다.
- 내용이 가용 높이를 넘으면 본문만 세로 스크롤하도록 구현하고 하단 액션을 가리지 않게 한다.
- 현재 확인한 일반 화면에는 스크롤 동작이 설정되어 있지 않다. 스크롤은 완성된 기존 동작이 아니라 구현 시 필요한 규칙이다.
- 기기별 안전 영역에 대응하되, 390×844 기준에서는 하단 32px 여백을 기준으로 삼는다.

## 4. 컴포넌트 용법

속성은 표시 이름 기준으로 기록한다. Text는 텍스트 교체, Boolean은 표시 여부, Variant는 정의된 형태·상태 선택을 뜻한다.

### Input

- Variant: `State = default | focus | filled | caution | disabled`.
- 기본 State: `default`.
- Boolean: `errorMessage`, 기본값 `false`.
- 크기: 기본 358×58px, caution 358×91px.
- field 반경: 0px.
- field와 메시지 사이: 12px.

사용 규칙:

- 입력 전 `default`, 입력 활성화 시 `focus`, 값이 있으면 `filled`, 검증 실패 시 `caution`, 조작 불가 시 `disabled`를 사용한다.
- focus 테두리는 `border/focus`, 오류 테두리는 `border/error`를 사용한다.
- 입력값·placeholder·오류 문구를 교체하는 공개 Text 속성은 없다.
- caution의 메시지는 기본적으로 표시되며, 해당 메시지의 visibility는 `errorMessage`에 연결되어 있지 않다.
- 다른 상태의 메시지에는 `errorMessage` 연결이 있으므로 Boolean만으로 모든 상태가 동일하게 동작한다고 가정하지 않는다.

### Checkbox

- Variant: `State = default | active`.
- 기본 State: `default`.
- 크기: 24×24px.
- 공개 Text·Boolean 속성: 없음.

사용 규칙:

- 독립적인 선택·동의 항목에 사용한다.
- 선택 상태 이름은 `selected`가 아니라 `active`다.
- 단일 선택 카드에는 OptionItem을 사용한다.
- 아이콘 크기와 별도로 주변에 충분한 터치 영역을 확보한다.

### OptionItem

- Variant: `State = default | selected`.
- 기본 State: `default`.
- Text: `Title`, `Desc`.
- 크기: default 358×83px, selected 358×86px.
- padding: 상하 16px, 좌우 20px.
- 내부 gap: 12px.
- 반경: 12px.

사용 규칙:

- 제목·설명을 포함한 단일 선택에 사용한다.
- 같은 그룹에서 selected는 한 개만 유지한다.
- 선택 시 `bg/default`와 `border/medium`이 적용된다.
- selected에서 높이가 3px 증가하므로 주변 레이아웃이 이를 수용하도록 한다.
- 그룹의 상호 배타적 선택은 구현에서 별도로 관리한다.

### FilterChip

- Variant: `State = default | selected`.
- 기본 State: `default`.
- Text: `Label`.
- 높이: 40px.
- 기본 레이블 기준 폭: default 102px, selected 100px.
- padding: 상하 8px, 좌우 16px.
- 반경: `radius/full`.

사용 규칙:

- 조건·정렬 선택에 사용한다.
- 같은 단일 선택 그룹에서 selected는 한 개만 유지한다.
- selected 배경은 `fill/secondary`이며 핑크색이 아닌 회색이다.
- 레이블 길이에 맞춰 폭을 조정하고 상태 전환 시 폭 차이를 고려한다.
- 단순 정보 배지는 Chip 또는 Tag를 사용한다.

### Button

- Variant:
  - `Type = Primary | Secondary`.
  - `Size = sm | lg | xl`.
  - `State = Default | Hover | Disabled`.
- 기본값: `Primary`, `xl`, `Default`.
- Text: `Label`.
- 정의된 조합: 18개.
- 반경: 8px.
- 좌우 padding: 24px.

| Size | 기본 높이 | 상하 padding |
|---|---:|---:|
| `sm` | 40px | 8px |
| `lg` | 48px | 12px |
| `xl` | 52px | 16px |

현재 예외:

- Secondary의 sm Default·Hover는 실제 높이 42px이다.
- Secondary sm Disabled는 40px이다.
- xl은 실제 높이가 52px로 고정되어 있으므로 텍스트 줄높이와 padding의 단순 합으로 다시 계산하지 않는다.

사용 규칙:

- 핵심 액션은 Primary, 보조 액션은 Secondary를 사용한다.
- Primary 기본 채움은 `fill/primary`, Hover는 `fill/primary-hover`, Disabled는 `fill/disabled`다.
- Secondary 기본은 `surface/default`와 `border/default`, Hover는 `bg/subtle`이다.
- 모바일 하단 전체 폭 액션에는 주로 xl을 사용한다.
- Hover Variant의 존재가 자동 상태 전환을 의미하지는 않는다.

### Header

- Variant: `Type = default | root`.
- 기본 Type: `default`.
- Text: `Title`.
- 크기: 390×56px.
- padding: 상하 4px, 좌우 16px.

구성:

- default: 뒤로가기 24px + 가운데 제목 + 24px spacer, gap 8px.
- root: 왼쪽 제목 + Logo, gap 12px.

사용 규칙:

- 하위 화면에는 default, 서비스 진입 화면에는 root를 사용한다.
- default 제목은 `subtitle/default`, root 제목은 `heading/h4`를 기준으로 한다.
- 뒤로가기·Logo 표시를 제어하는 공개 Boolean은 없다.
- 화면별 인스턴스 오버라이드를 원본 Header의 공통 사양으로 일반화하지 않는다.

### BottomCTA

- Variant: `Layout = single | double | price`.
- 기본 Layout: `single`.
- Text: `Amount`, `AmountLabel`.
- 폭: 390px.
- 좌우 padding: 16px.
- 하단 padding: 32px.

구성:

- single: Primary 버튼 하나, 390×97px.
- double: Secondary + Primary 가로 배치, 390×97px, gap 8px.
- price: 금액 행 + Primary 버튼, 390×139px, gap 12px.

사용 규칙:

- 단일 결정은 single, 보조 선택이 함께 필요하면 double, 결제·신청 금액 확인이 필요하면 price를 사용한다.
- double은 동일 폭 분할이 아니다. 원본 버튼 폭은 약 132.67px / 217.33px다.
- `Amount`와 `AmountLabel`은 price의 금액 텍스트에 연결되어 있다.
- 버튼 레이블을 바꾸는 상위 Text 속성은 없다. 중첩 Button의 `Label`을 사용한다.
- 화면에 존재하는 세로 이중 버튼 패턴은 BottomCTA double과 다른 구조다.

### StepProgress

- Variant: `Step = 1 | 2 | 3`.
- 기본 Step: `1`.
- 크기: 358×30px.
- 단계 레이블 높이: 18px.
- 레이블과 track 사이: 8px.
- track 높이: 4px.
- 공개 Text·Boolean 속성: 없음.

사용 규칙:

- 3단계 입력·질문 흐름의 현재 위치를 나타낸다.
- 현재 단계와 Step Variant를 동기화한다.
- 단계 수나 레이블을 바꾸는 공개 속성은 없으므로 임의의 다단계 흐름에 그대로 적용하지 않는다.

### List/Row

- Variant: `Type = default | check`.
- 기본 Type: `default`.
- Text: `Label`, `Value`.
- 크기: 358×46px.
- padding: 상하 12px, 좌우 4px.
- gap: 12px.
- 반경: 0px.

사용 규칙:

- default는 레이블과 값으로 구성된 정보 행이다.
- check는 혜택 목록 행이며, 현재 앞쪽 표시는 체크 아이콘이 아니라 6×6px 원형 bullet이다.
- check의 값은 `text/accent`로 강조한다.
- 같은 목록에서는 레이블 시작점과 값 정렬을 일관되게 유지한다.

### Card/Plan

- Variant: `State = default | selected`.
- 기본 State: `default`.
- Text: `Name`, `Desc`, `Discount`, `Price`, `Original`.
- Boolean: `Badge`, `Promo`, `Sale` — 모두 기본값 `true`.
- 크기: default 358×223px, selected 358×224px.
- padding: 20px.
- gap: 8px.
- 반경: 16px.

사용 규칙:

- 요금제 이름·설명·월 요금·할인·프로모션·액션을 묶어 비교·선택하는 카드다.
- selected는 `border/medium` 테두리를 사용한다.
- 할인 정보가 없으면 Sale을 끄고, 프로모션이 없으면 Promo를 끈다.
- Sale은 할인율과 정가의 표시 여부에 연결되어 있다.
- Promo는 프로모션 Chip의 표시 여부에 연결되어 있다.
- Badge 속성은 정의되어 있지만 현재 배지 visibility에 연결되어 있지 않다. Badge를 껐을 때 배지가 숨겨진다고 가정하지 않는다.
- 중첩 버튼 레이블은 해당 Button의 Label 속성으로 관리한다.
- 선택 시 높이와 내부 가용 폭이 달라지므로 상태 전환에 따른 재배치를 허용한다.

### Card/Price

- Components 섹션에는 원격 컴포넌트의 인스턴스로 배치되어 있다.
- 공개 속성: 없음.
- 크기: 358×124px.
- padding: 20px.
- gap: 4px.
- 반경: 12px.
- 배경: `bg/default`.

사용 규칙:

- 요금 레이블, 할인율·핵심 금액, 정가·부가 정보를 묶는 가격 요약이다.
- 핵심 금액은 `heading/h2`, 할인율은 `subtitle/bold`, 보조 정보는 `caption/medium`을 기준으로 한다.
- 공개 속성이 없는 현재 상태에서 임의의 Text·Boolean 속성이 제공된다고 가정하지 않는다.
- 원격 원본과 로컬 컴포넌트를 구분하여 관리한다.

### Chip

- Variant: `Type = benefit | package | sale`.
- 기본 Type: `sale`.
- 공개 Text·Boolean 속성: 없음.

| Type | 높이 | 좌우 padding | 반경 | 배경 |
|---|---:|---:|---:|---|
| `benefit` | 20px | 6px | 4px | `bg/subtle` |
| `package` | 20px | 6px | 4px | `fill/secondary` |
| `sale` | 24px | 10px | 6px | `bg/accent-subtle` |

사용 규칙:

- 혜택·패키지·할인 정보를 보조적으로 표시한다.
- 선택형 컨트롤이 아니며, 필터 선택에는 FilterChip을 사용한다.
- benefit·package 레이블은 `caption/mini`, sale은 `caption/bold`를 사용한다.
- 원본 높이는 고정되어 있으므로 긴 문구를 넣을 때 잘림과 줄바꿈을 확인한다.

### Tag

- Variant·공개 속성: 없음.
- 기본 콘텐츠 기준 크기: 48×26px.
- padding: 상하 4px, 좌우 12px.
- 반경: `radius/999`.
- 배경: `border/subtle`.
- 텍스트: `caption/bold`, `text/secondary`.

사용 규칙:

- 추천 등 짧은 분류·강조 표시에 사용한다.
- 선택·실행 동작을 부여하는 용도로 사용하지 않는다.
- 표시 문구가 바뀌면 폭과 내부 여백을 함께 확인한다.

### 아이콘·로고

| 이름 | 크기 | Variant·공개 속성 | 사용 규칙 |
|---|---:|---|---|
| `icon/arrowLeft` | 24×24px | 없음 | 뒤로가기 표시. 터치 영역은 주변 컨테이너에서 별도 확보 |
| `icon/check` | 24×24px | 없음 | 완료·포함 상태를 보조 |
| `icon/doneMark` | 64×64px | 없음 | 완료 화면의 대표 표시. `fill/primary`와 원형 반경 사용 |
| `Logo` | 32×24px | 없음 | 브랜드 식별. 내부 도형은 `brand/primary`, 원본 비율 유지 |

### 공통 사용 규칙

- 동일한 역할에는 동일한 컴포넌트와 Variant를 재사용한다.
- 공개된 Text·Boolean·Variant 속성을 우선 사용한다.
- Boolean 정의와 실제 레이어 연결이 다른 항목은 연결 상태를 확인한 후 구현한다.
- Variant로 정의된 시각 상태와 실제 선택·입력·활성화 동작을 구분한다.
- 선택·오류 상태를 색상 하나만으로 전달하지 않고 테두리·아이콘·설명을 함께 사용한다.
- 컴포넌트 세트의 전시용 외곽 크기는 화면에서 사용하는 인스턴스 크기가 아니다.
- 정의되지 않은 변형이 필요하면 기존 상태를 임의로 재해석하지 말고 별도 사양으로 관리한다.
