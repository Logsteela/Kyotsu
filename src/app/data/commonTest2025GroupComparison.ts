// 2025年度・2026年度で大問番号と配点が対応する科目だけを扱う。
// 2025年度の得点率は大学入試センターの本試験データを用いた再集計値。
// 出典・定義は /sources に集約。
export type PriorGroupRate = { number: number; points: number; previousRate: number; topic: string };
export type GroupComparison = { previousYear: number; groups: PriorGroupRate[]; comment: string };
export const COMMON_TEST_GROUP_COMPARISONS: Record<string, GroupComparison> = {
  "国語": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 45,
        "previousRate": 66.74,
        "topic": "論理的文章"
      },
      {
        "number": 2,
        "points": 45,
        "previousRate": 73.47,
        "topic": "文学的文章"
      },
      {
        "number": 3,
        "points": 20,
        "previousRate": 66.01,
        "topic": "実用的文章"
      },
      {
        "number": 4,
        "points": 45,
        "previousRate": 57.42,
        "topic": "古文"
      },
      {
        "number": 5,
        "points": 45,
        "previousRate": 54.51,
        "topic": "漢文"
      }
    ],
    "comment": "2026年度は5大問すべてで得点率が低下しました。第4問（古文）の11.74ポイントの低下が最も大きく、この大問だけで平均点の前年差約10.30点のうち約5.28点を説明します。古文を除く4大問でも低下しており、平均点の減少を古文だけに帰することはできません。"
  },
  "数学Ⅰ，数学Ａ": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 30,
        "previousRate": 62.06,
        "topic": "第1問"
      },
      {
        "number": 2,
        "points": 30,
        "previousRate": 42.16,
        "topic": "第2問"
      },
      {
        "number": 3,
        "points": 20,
        "previousRate": 52.71,
        "topic": "図形の性質"
      },
      {
        "number": 4,
        "points": 20,
        "previousRate": 58.54,
        "topic": "場合の数と確率"
      }
    ],
    "comment": "第2問は得点率が14.79ポイント上昇した一方、第3問と第4問はそれぞれ20.29・21.65ポイント低下しました。両年とも全4大問必答ですが、同じ大問番号が同じ問題という意味ではありません。第3・4問の低下を第2問の上昇が一部相殺し、科目平均点は6.31点下がりました。"
  },
  "数学Ⅰ": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 20,
        "previousRate": 57.89,
        "topic": "数と式・集合と命題"
      },
      {
        "number": 2,
        "points": 30,
        "previousRate": 22.92,
        "topic": "図形と計量"
      },
      {
        "number": 3,
        "points": 30,
        "previousRate": 15.82,
        "topic": "2次関数"
      },
      {
        "number": 4,
        "points": 20,
        "previousRate": 24.42,
        "topic": "データの分析"
      }
    ],
    "comment": "第1問の得点率は16.86ポイント低下しましたが、第2問が5.93ポイント、第3問が4.92ポイント、第4問が2.82ポイント上昇しました。こうした大問別の上下がほぼ相殺され、科目平均点は2025年度28.08点から2026年度28.53点へ0.45点の上昇にとどまりました。"
  }
};
