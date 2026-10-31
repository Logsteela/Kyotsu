// 2026年度 大学入試センター「科目別成績分布」より、
// 各得点以上の人数÷受験者数で求めた割合。出典は /sources に集約。
// 5分位の境界は大学入試センター公表値。
// 2025年度の8割以上は同年度の成績分布に基づく照合可能な3科目のみ。
export type Distribution = {
  above80: number; above90: number; quintiles:[number,number,number,number];
  previous80: number | null;
};
export const COMMON_TEST_SOCIAL_DISTRIBUTION: Record<string,Distribution> = {
  "歴史総合，日本史探究": {
    "above80": 17.79,
    "above90": 6.3,
    "quintiles": [
      46,
      57,
      66,
      78
    ],
    "previous80": 7.38
  },
  "歴史総合，世界史探究": {
    "above80": 16.34,
    "above90": 3.75,
    "quintiles": [
      43,
      56,
      67,
      77
    ],
    "previous80": 25.43
  },
  "地理総合，地理探究": {
    "above80": 13.51,
    "above90": 1.61,
    "quintiles": [
      47,
      59,
      68,
      76
    ],
    "previous80": 8.03
  },
  "公共，政治・経済": {
    "above80": 20.38,
    "above90": 5.8,
    "quintiles": [
      47,
      59,
      69,
      80
    ],
    "previous80": null
  },
  "公共，倫理": {
    "above80": 17.15,
    "above90": 2.97,
    "quintiles": [
      50,
      61,
      69,
      78
    ],
    "previous80": null
  }
};
