import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFIED_IDS_KEY = '@notified_ids';

export const storage = {
  async getNotifiedIds(): Promise<Set<string>> {
    try {
      const json = await AsyncStorage.getItem(NOTIFIED_IDS_KEY);
      return json ? new Set(JSON.parse(json)) : new Set();
    } catch {
      return new Set();
    }
  },

  async addNotifiedIds(ids: string[]): Promise<void> {
    try {
      const existing = await this.getNotifiedIds();
      ids.forEach(id => existing.add(id));
      await AsyncStorage.setItem(NOTIFIED_IDS_KEY, JSON.stringify([...existing]));
    } catch {}
  },

  async clearNotifiedIds(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NOTIFIED_IDS_KEY);
    } catch {}
  },
};
