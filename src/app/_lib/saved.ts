export const SAVED_KEY = "plans:saved";

export type SavedPlan = { planId: string; savedAt: string };

export function saveForLater(planId: string): void {
  const value: SavedPlan = { planId, savedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(value));
  } catch {
    // 저장소를 쓸 수 없으면 저장하지 않는다.
  }
}

export function subscribeSaved(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function getSavedRaw(): string | null {
  try {
    return window.localStorage.getItem(SAVED_KEY);
  } catch {
    return null;
  }
}

export function getSavedServerRaw(): string | null {
  return null;
}

export function parseSaved(raw: string | null): SavedPlan | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<SavedPlan>;
    if (typeof value.planId === "string" && typeof value.savedAt === "string") {
      return { planId: value.planId, savedAt: value.savedAt };
    }
  } catch {
    // 형식이 맞지 않으면 저장 없음으로 본다.
  }
  return null;
}
