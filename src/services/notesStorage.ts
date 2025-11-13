import { Preferences } from '@capacitor/preferences';

/**
 * Service quản lý lưu trữ ghi chú sử dụng Capacitor Preferences
 */
export class NotesStorage {
  /**
   * Lấy raw data từ storage
   * @param subject - Tên môn học
   * @returns Promise with value
   */
  static async getNotes(subject: string) {
    try {
      const result = await Preferences.get({ key: `notes_${subject}` });
      return result;
    } catch (error) {
      console.error('Error getting notes:', error);
      return { value: null };
    }
  }

  /**
   * Set data trực tiếp
   */
  static async set(options: { key: string; value: string }) {
    try {
      await Preferences.set(options);
    } catch (error) {
      console.error('Error setting data:', error);
      throw error;
    }
  }

  /**
   * Lưu danh sách ghi chú của một môn học (legacy support)
   * @param subject - Tên môn học
   * @param notes - Mảng các ghi chú cần lưu
   */
  static async saveNotes(subject: string, notes: string[]): Promise<void> {
    try {
      await Preferences.set({
        key: `notes_${subject}`,
        value: JSON.stringify(notes)
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      throw error;
    }
  }

  /**
   * Xóa toàn bộ ghi chú của một môn học
   * @param subject - Tên môn học
   */
  static async clearNotes(subject: string): Promise<void> {
    try {
      await Preferences.remove({ key: `notes_${subject}` });
    } catch (error) {
      console.error('Error clearing notes:', error);
      throw error;
    }
  }
}
