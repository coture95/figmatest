// doc/tokens.json(SSOT)에서 허용값 목록을 읽는다. 목록은 이 파일에 따로 적지 않는다.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

const normHex = (h) => {
  let x = h.replace('#', '').toUpperCase();
  if (x.length === 3) x = x.split('').map((c) => c + c).join('');
  return x.slice(0, 6);
};

const numbersOf = (group) =>
  new Set(Object.values(group.tokens).filter((v) => typeof v === 'number'));

export function loadTokens() {
  const raw = JSON.parse(readFileSync(resolve(ROOT, 'doc/tokens.json'), 'utf8'));
  const hex = new Set();
  for (const group of [raw.primitive, raw.semantic]) {
    for (const t of Object.values(group.tokens)) hex.add(normHex(t.hex));
  }
  const fontSize = new Set(
    Object.entries(raw.typography.tokens)
      .filter(([k]) => k.startsWith('font-size/'))
      .map(([, v]) => v),
  );
  return {
    hex,
    normHex,
    fontSize,
    spacing: numbersOf(raw.spacing),
    radius: numbersOf(raw.radius),
    fontFamily: raw.typography.tokens['font-family/family-font'],
  };
}
