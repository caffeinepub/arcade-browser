const STORAGE_KEY = 'cookieClicker_save';

export interface CookieClickerState {
  cookies: number;
  cookiesPerSecond: number;
  cookiesPerClick: number;
  upgrades: Array<{
    id: string;
    owned: number;
  }>;
  multiplierUpgrades: Array<{
    id: string;
    purchased: boolean;
  }>;
  clickMultiplier: number;
  productionMultiplier: number;
  timestamp: number;
}

export function saveCookieClickerState(state: CookieClickerState): void {
  try {
    const serialized = JSON.stringify({
      ...state,
      upgrades: state.upgrades.map((u) => ({ id: u.id, owned: u.owned })),
      multiplierUpgrades: state.multiplierUpgrades.map((m) => ({
        id: m.id,
        purchased: m.purchased,
      })),
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save Cookie Clicker state:', error);
  }
}

export function loadCookieClickerState(): CookieClickerState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load Cookie Clicker state:', error);
    return null;
  }
}

export function clearCookieClickerState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear Cookie Clicker state:', error);
  }
}
