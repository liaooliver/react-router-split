// 產生隨機密碼
export function generateRandomPassword(length: number): string {
  return Math.random().toString(36).slice(-length);
}
