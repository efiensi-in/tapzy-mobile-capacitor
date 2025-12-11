import { Preferences } from '@capacitor/preferences';

const KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  THEME: 'app_theme',
} as const;

export const storage = {
  // Token management
  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: KEYS.TOKEN });
    return value;
  },

  async setToken(token: string): Promise<void> {
    await Preferences.set({ key: KEYS.TOKEN, value: token });
  },

  async removeToken(): Promise<void> {
    await Preferences.remove({ key: KEYS.TOKEN });
  },

  // User management
  async getUser<T>(): Promise<T | null> {
    const { value } = await Preferences.get({ key: KEYS.USER });
    return value ? JSON.parse(value) : null;
  },

  async setUser<T>(user: T): Promise<void> {
    await Preferences.set({ key: KEYS.USER, value: JSON.stringify(user) });
  },

  async removeUser(): Promise<void> {
    await Preferences.remove({ key: KEYS.USER });
  },

  // Theme management
  async getTheme(): Promise<'light' | 'dark' | null> {
    const { value } = await Preferences.get({ key: KEYS.THEME });
    return value as 'light' | 'dark' | null;
  },

  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    await Preferences.set({ key: KEYS.THEME, value: theme });
  },

  // Clear all
  async clear(): Promise<void> {
    await Preferences.clear();
  },
};
