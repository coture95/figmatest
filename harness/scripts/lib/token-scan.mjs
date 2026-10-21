// G2: 소스 텍스트에서 doc/tokens.json 목록 밖의 값을 찾는다. 훅(guard-write)과 verify.mjs가 같이 쓴다.
// 검사 범위: 색, 글자 크기, 간격(padding·margin·gap), 모서리, 폰트. width/height는 검사하지 않는다.
import { loadTokens } from './tokens.mjs';

const T = loadTokens();
const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;

const TW_FONT = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48, '6xl': 60, '7xl': 72, '8xl': 96, '9xl': 128 };
const TW_RADIUS = { none: 0, xs: 2, sm: 4, '': 4, md: 6, lg: 8, xl: 12, '2xl': 16, '3xl': 24, '4xl': 32, full: 9999 };

// CSS/JS 값 문자열에서 px로 환산한 숫자 목록. %, vh, vw, var(), calc()는 건너뛴다.
function pxValues(value) {
  if (/var\(|calc\(|clamp\(|min\(|max\(/.test(value)) return [];
  const out = [];
  for (const m of value.matchAll(/(-?\d+(?:\.\d+)?)(px|rem|em|%|vh|vw)?/g)) {
    const unit = m[2];
    if (unit === '%' || unit === 'vh' || unit === 'vw') continue;
    const n = Math.abs(parseFloat(m[1]));
    out.push({ raw: m[0], px: unit === 'rem' || unit === 'em' ? n * 16 : n });
  }
  return out;
}

export function scanSource(text) {
  const v = [];
  const add = (idx, rule, found, hint) => v.push({ line: lineOf(text, idx), rule, found, hint });

  // 1) 색: hex는 tokens.json의 hex 집합 안, 색 함수는 그림자 알파(0.05, 0.1)만 허용
  for (const m of text.matchAll(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
    if (!T.hex.has(T.normHex(m[0]))) add(m.index, '색', m[0], 'tokens.json의 색(semantic 토큰)만 쓴다');
  }
  for (const m of text.matchAll(/\b(rgba?|hsla?|oklch|oklab|lab|lch|hwb)\s*\(([^)]*)\)/g)) {
    const shadowOk = /^\s*0[\s,]+0[\s,]+0\s*[,/]\s*0?\.(05|1)\s*$/.test(m[2]);
    if (!shadowOk) add(m.index, '색', m[0], '색 함수 대신 tokens.json의 토큰을 쓴다');
  }
  for (const m of text.matchAll(/(?<![\w-])(?:bg|text|border|fill|stroke|ring|outline|divide|from|via|to|shadow|accent|caret|decoration|placeholder)-(?:(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}|white|black)(?![\w-])/g)) {
    add(m.index, '색', m[0], 'Tailwind 기본 팔레트 대신 tokens.json의 토큰을 쓴다');
  }

  // 2) 글자 크기
  for (const m of text.matchAll(/font-size\s*:\s*([^;}\n]+)|\bfontSize\s*:\s*([^,}\n]+)/g)) {
    for (const { raw, px } of pxValues(m[1] ?? m[2])) {
      if (!T.fontSize.has(px)) add(m.index, '글자 크기', raw, `허용: ${[...T.fontSize].join(', ')}`);
    }
  }
  for (const m of text.matchAll(/(?<![\w-])text-\[(\d+(?:\.\d+)?)px\]/g)) {
    if (!T.fontSize.has(parseFloat(m[1]))) add(m.index, '글자 크기', m[0], `허용: ${[...T.fontSize].join(', ')}`);
  }
  for (const m of text.matchAll(/(?<![\w-])text-(xs|sm|base|lg|xl|[2-9]xl)(?![\w-])/g)) {
    if (!T.fontSize.has(TW_FONT[m[1]])) add(m.index, '글자 크기', m[0], `${TW_FONT[m[1]]}px는 목록 밖. 허용: ${[...T.fontSize].join(', ')}`);
  }

  // 3) 간격: padding, margin, gap
  const SP = 'padding|margin|gap|row-gap|column-gap|rowGap|columnGap|(?:padding|margin)-(?:top|right|bottom|left|inline|block)|(?:padding|margin)(?:Top|Right|Bottom|Left|Inline|Block)';
  for (const m of text.matchAll(new RegExp(`(?<![\\w-])(?:${SP})\\s*:\\s*([^;}\\n]+)`, 'g'))) {
    for (const { raw, px } of pxValues(m[1].split(',')[0])) {
      if (!T.spacing.has(px)) add(m.index, '간격', raw, `허용: ${[...T.spacing].sort((a, b) => a - b).join(', ')}`);
    }
  }
  const TWSP = '(?:p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y)';
  for (const m of text.matchAll(new RegExp(`(?<![\\w-])-?${TWSP}-(\\d+(?:\\.\\d+)?)(?![\\w.\\[])`, 'g'))) {
    const px = parseFloat(m[1]) * 4;
    if (!T.spacing.has(px)) add(m.index, '간격', m[0], `${px}px는 목록 밖. 허용: ${[...T.spacing].sort((a, b) => a - b).join(', ')}`);
  }
  for (const m of text.matchAll(new RegExp(`(?<![\\w-])-?${TWSP}-\\[(\\d+(?:\\.\\d+)?)px\\]`, 'g'))) {
    if (!T.spacing.has(parseFloat(m[1]))) add(m.index, '간격', m[0], '간격 토큰 값만 쓴다');
  }

  // 4) 모서리
  for (const m of text.matchAll(/border(?:-(?:top|bottom|start|end)-(?:left|right|start|end))?-radius\s*:\s*([^;}\n]+)|\bborder(?:(?:Top|Bottom|Start|End)(?:Left|Right|Start|End))?Radius\s*:\s*([^,}\n]+)/g)) {
    for (const { raw, px } of pxValues(m[1] ?? m[2])) {
      if (!T.radius.has(px)) add(m.index, '모서리', raw, `허용: ${[...T.radius].sort((a, b) => a - b).join(', ')}`);
    }
  }
  for (const m of text.matchAll(/(?<![\w-])rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|ee|es))?(?:-(none|xs|sm|md|lg|xl|[2-4]xl|full))?(?![\w-])/g)) {
    const px = TW_RADIUS[m[1] ?? ''];
    if (px !== undefined && !T.radius.has(px)) add(m.index, '모서리', m[0], `${px}px는 목록 밖`);
  }
  for (const m of text.matchAll(/(?<![\w-])rounded(?:-[a-z]{1,2})?-\[(\d+(?:\.\d+)?)px\]/g)) {
    if (!T.radius.has(parseFloat(m[1]))) add(m.index, '모서리', m[0], '모서리 토큰 값만 쓴다');
  }

  // 5) 폰트: Noto Sans KR만
  for (const m of text.matchAll(/font-family\s*:\s*([^;}\n]+)|\bfontFamily\s*:\s*([^}\n]+)/g)) {
    const val = m[1] ?? m[2];
    if (/var\(|inherit/.test(val)) continue;
    if (!/Noto[ _]Sans[ _]KR/.test(val)) add(m.index, '폰트', val.trim(), `${T.fontFamily}만 쓴다`);
  }
  for (const m of text.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']next\/font\/google["']/g)) {
    for (const name of m[1].split(',').map((s) => s.trim()).filter(Boolean)) {
      if (name !== 'Noto_Sans_KR') add(m.index, '폰트', name, `${T.fontFamily}만 쓴다`);
    }
  }
  return v;
}
