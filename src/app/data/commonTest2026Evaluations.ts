// 大学入試センター 2026年度 本試験「問題評価・分析委員会」巻末資料、
// 高校教員の項目⑦「問題の難易度は適正である」に対する同意度。
export const LOWER_RATING_SUBJECTS = new Set([
  '物理','生物','地学','生物基礎','地学基礎','フランス語','韓国語',
]);
export function getDifficultyAppropriateness(subject: string): 3 | 4 {
  return LOWER_RATING_SUBJECTS.has(subject) ? 3 : 4;
}
