// 파일: 디자인 토큰(색, 글자 크기, 간격, 모서리 둥글기) 값 모음
// 목적: 모든 화면이 같은 색과 크기를 쓰도록 값을 한곳에 정해 둔다. 특정 화면의 코드가 아니다.
// 화면·유저 스토리·기능 ID: 해당 없음. 이 파일의 값은 PRD.md의 어떤 기능(F1~F12)에도 직접 연결되지 않는다.
// 토큰별 쓰임새는 doc/Design.md를 따른다. 모든 값은 Default 모드 기준이다.
{
  // 1단계: 원색 팔레트. 색의 이름과 HEX 값만 정해 둔다.
  // 화면에서는 이 값을 직접 쓰지 않고, 아래 2단계(semantic)의 역할 이름으로 참조한다. (Design.md)
  "primitive": {
    "mode": "Default",
    "tokens": {
      "gray/950": { "hex": "#000000" },
      "gray/900": { "hex": "#181A1B" },
      "gray/800": { "hex": "#2D2D2D" },
      "gray/600": { "hex": "#66707A" },
      "gray/500": { "hex": "#878787" },
      "gray/400": { "hex": "#B7BDC4" },
      "gray/300": { "hex": "#D9DCDF" },
      "gray/200": { "hex": "#EFF1F3" },
      "gray/100": { "hex": "#F7F7F7" },
      "gray/0": { "hex": "#FFFFFF" },
      "pink/500": { "hex": "#FF2E98" },
      "pink/600": { "hex": "#E6007E" },
      "pink/50": { "hex": "#FFF5FA" },
      "pink/25": { "hex": "#FFF8F5" },
      "red/500": { "hex": "#E30036" },
      "red/50": { "hex": "#FFF0F3" },
      "black/10": { "hex": "#000000", "alpha": 0.1 }
    }
  },
  // 2단계: 역할별 색. "어디에 쓰는 색인지"를 이름으로 구분한다. (text=글자, bg=배경, border=테두리, fill=채움, icon=아이콘)
  // 값이 같아도 역할이 다르면 따로 둔다. 예: 분홍색(#FF2E98)은 fill/primary(Primary 버튼), text/accent(강조 글자), icon/accent(강조 아이콘), brand/primary(로고)로 나뉜다.
  // text/error, border/error, icon/error는 입력란 검증 오류용이다. (Design.md)
  // fill/secondary는 검정 계열이 아니라 연한 회색(#D9DCDF)이다. (Design.md)
  "semantic": {
    "mode": "Default",
    "tokens": {
      "fill/accent": {
        "hex": "#FF2E98",
        "primitive": "pink/500"
      },
      "text/accent": {
        "hex": "#FF2E98",
        "primitive": "pink/500"
      },
      "icon/accent": {
        "hex": "#FF2E98",
        "primitive": "pink/500"
      },
      "text/primary": {
        "hex": "#181A1B",
        "primitive": "gray/900"
      },
      "text/secondary": {
        "hex": "#66707A",
        "primitive": "gray/600"
      },
      "text/tertiary": {
        "hex": "#878787",
        "primitive": "gray/500"
      },
      "text/on-dark": {
        "hex": "#FFFFFF",
        "primitive": "gray/0"
      },
      "text/error": {
        "hex": "#E30036",
        "primitive": "red/500"
      },
      "text/placeholder": {
        "hex": "#B7BDC4",
        "primitive": "gray/400"
      },
      "text/on-disabled": {
        "hex": "#66707A",
        "primitive": "gray/600"
      },
      "bg/surface": {
        "hex": "#FFFFFF",
        "primitive": "gray/0"
      },
      "bg/default": {
        "hex": "#F7F7F7",
        "primitive": "gray/100"
      },
      "bg/subtle": {
        "hex": "#EFF1F3",
        "primitive": "gray/200"
      },
      "bg/inverse": {
        "hex": "#2D2D2D",
        "primitive": "gray/800"
      },
      "bg/accent-subtle": {
        "hex": "#FFF5FA",
        "primitive": "pink/50"
      },
      "bg/error-subtle": {
        "hex": "#FFF0F3",
        "primitive": "red/50"
      },
      "border/default": {
        "hex": "#D9DCDF",
        "primitive": "gray/300"
      },
      "border/subtle": {
        "hex": "#EFF1F3",
        "primitive": "gray/200"
      },
      "border/strong": {
        "hex": "#181A1B",
        "primitive": "gray/900"
      },
      "border/divider": {
        "hex": "#000000",
        "primitive": "black/10",
        "alpha": 0.1
      },
      "border/focus": {
        "hex": "#FF2E98",
        "primitive": "pink/500"
      },
      "border/error": {
        "hex": "#E30036",
        "primitive": "red/500"
      },
      "fill/primary": {
        "hex": "#FF2E98",
        "primitive": "pink/500"
      },
      "fill/secondary": {
        "hex": "#D9DCDF",
        "primitive": "gray/300"
      },
      "fill/tertiary": {
        "hex": "#EFF1F3",
        "primitive": "gray/200"
      },
      "fill/disabled": {
        "hex": "#D9DCDF",
        "primitive": "gray/300"
      },
      "fill/disabled-strong": {
        "hex": "#66707A",
        "primitive": "gray/600"
      },
      "fill/primary-hover": {
        "hex": "#E6007E",
        "primitive": "pink/600"
      },
      "icon/default": {
        "hex": "#66707A",
        "primitive": "gray/600"
      },
      "icon/strong": {
        "hex": "#181A1B",
        "primitive": "gray/900"
      },
      "border/medium": {
        "hex": "#66707A",
        "primitive": "gray/600"
      },
      "surface/default": {
        "hex": "#FFFFFF",
        "primitive": "gray/0"
      },
      "icon/on-dark": {
        "hex": "#FFFFFF",
        "primitive": "gray/0"
      },
      "icon/disabled": {
        "hex": "#D9DCDF",
        "primitive": "gray/300"
      },
      "icon/error": {
        "hex": "#E30036",
        "primitive": "red/500"
      },
      "icon/primary": {
        "hex": "#000000",
        "primitive": "gray/950"
      },
      "brand/primary": {
        "hex": "#FF2E98",
        "primitive": "pink/500"
      },
      "effect/shadow-subtle": {
        "hex": "#000000",
        "primitive": null,
        "alpha": 0.05
      }
    }
  },
  // 글자: 기본 서체(Noto Sans KR)와 글자 크기(px). 글자 굵기와 줄 높이는 이 파일에 없고 Design.md의 텍스트 스타일에 정의되어 있다.
  "typography": {
    "mode": "Default",
    "tokens": {
      "font-family/family-font": "Noto Sans KR",
      "font-size/heading-h1": 32,
      "font-size/heading-h2": 28,
      "font-size/heading-h3": 24,
      "font-size/heading-h4": 20,
      "font-size/subtitle": 18,
      "font-size/body": 16,
      "font-size/body-small": 14,
      "font-size/caption": 13,
      "font-size/caption-mini": 10,
      "font-size/12": 12
    }
  },
  // 간격: 여백과 요소 사이 거리(px). 이름의 숫자가 실제 px 값이다. 예: spacing/24 = 24px. (일반 화면의 본문 여백은 24px)
  "spacing": {
    "mode": "Default",
    "tokens": {
      "spacing/4": 4,
      "spacing/8": 8,
      "spacing/12": 12,
      "spacing/16": 16,
      "spacing/20": 20,
      "spacing/24": 24,
      "spacing/32": 32,
      "spacing/40": 40,
      "spacing/48": 48,
      "spacing/80": 80,
      "spacing/10": 10,
      "spacing/0": 0,
      "spacing/2": 2,
      "spacing/6": 6,
      "spacing/56": 56,
      "spacing/64": 64,
      "spacing/28": 28,
      "spacing/60": 60
    }
  },
  // 모서리 둥글기(px). radius/full(9999)과 radius/999는 알약·원형 모양에 쓴다. 예: 버튼은 radius/8, 요금제 카드는 radius/16. (Design.md)
  "radius": {
    "mode": "Default",
    "tokens": {
      "radius/4": 4,
      "radius/8": 8,
      "radius/12": 12,
      "radius/16": 16,
      "radius/20": 20,
      "radius/24": 24,
      "radius/32": 32,
      "radius/full": 9999,
      "radius/2": 2,
      "radius/0": 0,
      "radius/5": 5,
      "radius/6": 6,
      "radius/999": 999,
      "radius/10": 10,
      "radius/40": 40
    }
  }
}
