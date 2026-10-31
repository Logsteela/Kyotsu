// 2025年度・2026年度で大問番号と配点が対応する科目だけを大問単位で比較する。
// 2025年度の得点率は大学入試センターの本試験データを用いた再集計値。
// 出典・定義は /sources に集約。
export type PriorGroupRate = { number: number; points: number; previousRate: number; topic: string };
export type GroupComparison = {
  previousYear: number;
  groups: PriorGroupRate[];
  comment: string;
  nonAdditive?: boolean; // 選択式のため科目平均点への寄与を算定不可
  nonComparable?: boolean; // 年度間で配点体系が異なるため大問別の寄与を算定不可
  mixedCurriculum?: boolean; // 2025年度化学：旧課程は第5・第6問を選択するため、全体平均を復元不可
};
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
  },
  "数学Ⅱ，数学Ｂ，数学Ｃ": {
    "previousYear": 2025,
    "nonAdditive": true,
    "groups": [
      {
        "number": 1,
        "points": 15,
        "previousRate": 50.83,
        "topic": "三角関数"
      },
      {
        "number": 2,
        "points": 15,
        "previousRate": 53.42,
        "topic": "指数関数・対数関数"
      },
      {
        "number": 3,
        "points": 22,
        "previousRate": 61.66,
        "topic": "微分積分"
      },
      {
        "number": 4,
        "points": 16,
        "previousRate": 46.86,
        "topic": "数列（選択）"
      },
      {
        "number": 5,
        "points": 16,
        "previousRate": 36.95,
        "topic": "統計的な推測（選択）"
      },
      {
        "number": 6,
        "points": 16,
        "previousRate": 49.14,
        "topic": "ベクトル（選択）"
      },
      {
        "number": 7,
        "points": 16,
        "previousRate": 54.09,
        "topic": "複素数平面（選択）"
      }
    ],
    "comment": "第5問（統計的な推測）の得点率は2025年度36.95%から2026年度44.80%へ7.85ポイント上昇。第4問（数列）は46.86%から50.56%、第6問（ベクトル）は49.14%から56.05%、第7問（複素数平面）は54.09%から56.96%となった。ただし第4～7問は4つから3つを選ぶ方式であり、選択した受験者の違いがある。各大問の差を単純合計して科目平均点の変化と見なしてはならない。"
  },
  "物理": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 25,
        "previousRate": 53.21,
        "topic": "小問集合・物理基礎"
      },
      {
        "number": 2,
        "points": 25,
        "previousRate": 67.92,
        "topic": "単振り子・周期測定"
      },
      {
        "number": 3,
        "points": 25,
        "previousRate": 62.12,
        "topic": "気体の状態変化・波の干渉"
      },
      {
        "number": 4,
        "points": 25,
        "previousRate": 52.59,
        "topic": "導体棒の電磁誘導"
      }
    ],
    "comment": "第4問の得点率は2025年度52.59%から2026年度29.99%へ22.60ポイント低下し、25点配点なので、科目平均の差に約−5.65点寄与した。第2問も67.92%から53.78%へ14.14ポイント低下。全4問の得点率が低下し、科目平均は58.96点から45.55点へ下がった。"
  },
  "物理基礎": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 16,
        "previousRate": 42.32,
        "topic": "小問集合"
      },
      {
        "number": 2,
        "points": 16,
        "previousRate": 46.54,
        "topic": "実験・力学"
      },
      {
        "number": 3,
        "points": 18,
        "previousRate": 58.66,
        "topic": "熱・電磁気"
      }
    ],
    "comment": "第1問は42.32%から65.81%、第2問は46.54%から78.79%へ上昇。特に第2問は32.25ポイントの上昇で、平均点の上昇幅に約+5.16点寄与した。科目全体の平均点は24.78点から34.68点へ約9.90点上昇した。"
  },
  "化学基礎": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 30,
        "previousRate": 56.12,
        "topic": "物質の構成・物質の変化"
      },
      {
        "number": 2,
        "points": 20,
        "previousRate": 50.84,
        "topic": "総合問題"
      }
    ],
    "comment": "第1問は2025年度56.12%から2026年度64.80%へ8.68ポイント上昇したが、第2問は50.84%から45.70%へ5.14ポイント低下。30点配点の第1問の改善が第2問の低下を上回り、科目全体では27.00点から28.58点へ1.58点上昇した。"
  },
  "生物基礎": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 16,
        "previousRate": 59.71,
        "topic": "第1問"
      },
      {
        "number": 2,
        "points": 18,
        "previousRate": 64.14,
        "topic": "第2問"
      },
      {
        "number": 3,
        "points": 16,
        "previousRate": 64.3,
        "topic": "第3問"
      }
    ],
    "comment": "第1問は2025年度59.71%から2026年度60.49%と大きな変化はないが、第2問は64.14%から77.77%、第3問は64.30%から79.89%へ上昇。第2・3問の上昇が科目平均の31.39点→36.46点という変化を主に説明する。"
  },
  "地学基礎": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 20,
        "previousRate": 72.19,
        "topic": "第1問"
      },
      {
        "number": 2,
        "points": 10,
        "previousRate": 51.98,
        "topic": "第2問"
      },
      {
        "number": 3,
        "points": 10,
        "previousRate": 69.33,
        "topic": "第3問"
      },
      {
        "number": 4,
        "points": 10,
        "previousRate": 79.17,
        "topic": "第4問"
      }
    ],
    "comment": "第1問は2025年度72.19%から2026年度54.14%へ18.05ポイント、第4問は79.17%から62.66%へ16.51ポイント低下した。第2問は51.98%から54.56%へわずかに上昇しているが、科目平均は34.49点から28.17点へ6.32点下がった。"
  },
  "歴史総合，日本史探究": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 25,
        "previousRate": 58.88,
        "topic": "境界と地域の近代史"
      },
      {
        "number": 2,
        "points": 15,
        "previousRate": 59.89,
        "topic": "菓子の普及と社会・経済"
      },
      {
        "number": 3,
        "points": 15,
        "previousRate": 54.19,
        "topic": "九州北部と対外交流"
      },
      {
        "number": 4,
        "points": 15,
        "previousRate": 58.74,
        "topic": "鎌倉の御家人と戦国大名"
      },
      {
        "number": 5,
        "points": 15,
        "previousRate": 67.83,
        "topic": "近世の村落"
      },
      {
        "number": 6,
        "points": 15,
        "previousRate": 41.15,
        "topic": "松本清張と近現代史"
      }
    ],
    "comment": "第6問の得点率は2025年度41.15%から2026年度57.30%へ16.15ポイント上昇し、15点配点なので科目平均に約+2.42点寄与した。第2問も59.89%から70.04%へ10.15ポイント上昇。一方、第3問は54.19%から54.09%でほぼ同水準であり、全大問一律の変化ではない。科目平均は56.99点から62.29点に上昇した。"
  },
  "公共，倫理": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 12,
        "previousRate": 67.7,
        "topic": "男女共同参画と公共空間"
      },
      {
        "number": 2,
        "points": 13,
        "previousRate": 80.03,
        "topic": "社会参画と共生"
      },
      {
        "number": 3,
        "points": 28,
        "previousRate": 57.93,
        "topic": "青年期・西洋思想・哲学"
      },
      {
        "number": 4,
        "points": 15,
        "previousRate": 59.21,
        "topic": "日本思想の変遷"
      },
      {
        "number": 5,
        "points": 16,
        "previousRate": 41.62,
        "topic": "現代社会と倫理的課題"
      },
      {
        "number": 6,
        "points": 16,
        "previousRate": 59.05,
        "topic": "環境倫理と生命倫理"
      }
    ],
    "comment": "第5問の得点率は2025年度41.62%から2026年度58.18%へ16.56ポイント上昇し、16点配点なので平均点に約+2.65点寄与した。これに対し第2問は80.03%から73.47%へ6.56ポイント低下した。平均点59.74点から64.24点への上昇は、大問ごとに異なる動きを伴う。"
  },
  "生物": {
    "previousYear": 2025,
    "nonComparable": true,
    "groups": [
      {
        "number": 1,
        "points": 18,
        "previousRate": 34.53,
        "topic": "苦味受容体の遺伝子変異"
      },
      {
        "number": 2,
        "points": 20,
        "previousRate": 56.05,
        "topic": "アミノ酸代謝と生体内の物質"
      },
      {
        "number": 3,
        "points": 20,
        "previousRate": 65.46,
        "topic": "森林の林床植物と光合成"
      },
      {
        "number": 4,
        "points": 18,
        "previousRate": 56.94,
        "topic": "両生類の胚発生と誘導"
      },
      {
        "number": 5,
        "points": 24,
        "previousRate": 47.67,
        "topic": "イネ・ラッカセイの環境応答"
      }
    ],
    "comment": "2025年度は第1問18点、第2・3問各20点、第4問18点、第5問24点。2026年度は全5問20点ずつの配点に変わった。このため同じ大問番号の平均得点率差を科目平均点への寄与として計算することはしない。2025年の第1問34.53%が最も低く、第3問65.46%が最も高い。2026年は第3問が37.99%で最低、第5問が71.39%で最高であり、どの分野で高得点が取られたかは大きく変化した。"
  },
  "情報Ⅰ": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 20,
        "previousRate": 65.44,
        "topic": "情報社会・デジタル表現"
      },
      {
        "number": 2,
        "points": 30,
        "previousRate": 76.11,
        "topic": "ネットワークと情報システム"
      },
      {
        "number": 3,
        "points": 25,
        "previousRate": 64.73,
        "topic": "プログラミング"
      },
      {
        "number": 4,
        "points": 25,
        "previousRate": 68.64,
        "topic": "データ活用"
      }
    ],
    "comment": "2025年度の情報Ⅰは第2問が76.11%と最も高く、第3問64.73%が最も低かった。2026年度は第1問40.50%、第2問58.11%、第3問57.77%、第4問66.45%。第1問が24.94ポイント低下し、20点配点で科目平均に約−4.99点寄与。第2問は18.00ポイント低下し、30点配点で約−5.40点寄与した。この2大問の計約−10.39点が、科目平均の12.67点低下の大部分を説明している。"
  },
  "英語（リスニング）": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 28,
        "previousRate": 61.9,
        "topic": "短い発話とイラスト"
      },
      {
        "number": 2,
        "points": 12,
        "previousRate": 85,
        "topic": "短い会話の理解"
      },
      {
        "number": 3,
        "points": 18,
        "previousRate": 57,
        "topic": "一度読みの対話・問い"
      },
      {
        "number": 4,
        "points": 12,
        "previousRate": 65,
        "topic": "図表や説明の整理"
      },
      {
        "number": 5,
        "points": 16,
        "previousRate": 42.2,
        "topic": "講義と議論を聞く"
      },
      {
        "number": 6,
        "points": 14,
        "previousRate": 64.1,
        "topic": "長い会話と意見照合"
      }
    ],
    "comment": "2025年度は第2問の得点率が約85.0%で最も高かったが、2026年度は約65.70%となり約19.3ポイント低下した。第6問も約64.1%から48.74%へ約15.4ポイント低下。一方、第1問は約61.9%から62.87%へ小幅上昇しており、全大問が一様に低下したわけではない。2025年度の数値は小数第1位の集計値を使用しているため、前年差の小数第2位には丸め誤差が含まれる。"
  },
  "英語（リーディング）": {
    "previousYear": 2025,
    "groups": [
      {
        "number": 1,
        "points": 6,
        "previousRate": 56.02,
        "topic": "水槽の魚の飼育パンフレット"
      },
      {
        "number": 2,
        "points": 12,
        "previousRate": 67.5,
        "topic": "大学寮の満足度を扱うブログ"
      },
      {
        "number": 3,
        "points": 9,
        "previousRate": 68.8,
        "topic": "ワークショップの記事読解"
      },
      {
        "number": 4,
        "points": 12,
        "previousRate": 75.56,
        "topic": "レポートの推敲"
      },
      {
        "number": 5,
        "points": 16,
        "previousRate": 62.54,
        "topic": "メールを用いた状況読解"
      },
      {
        "number": 6,
        "points": 12,
        "previousRate": 41.59,
        "topic": "物語文の流れと人物理解"
      },
      {
        "number": 7,
        "points": 16,
        "previousRate": 50.36,
        "topic": "論説文と発表資料の整理"
      },
      {
        "number": 8,
        "points": 17,
        "previousRate": 46.56,
        "topic": "スポーツ技術についてのエッセイ構成"
      }
    ],
    "comment": "第6問の物語文は2025年度41.59%から2026年度53.79%へ12.20ポイント上昇し、12点配点で平均点への寄与は約+1.46点。第8問も46.56%から61.17%へ14.61ポイント上昇し、17点配点で約+2.48点寄与した。一方、推敲を問う第4問は75.56%→79.92%と高得点率が続いた。大問構成・配点は両年度で共通しているが、題材や設問内容は異なっている。"
  },
  "地学": {
    "previousYear": 2025,
    "nonComparable": true,
    "groups": [
      {
        "number": 1,
        "points": 20,
        "previousRate": 40.63,
        "topic": "観測・地磁気・地質"
      },
      {
        "number": 2,
        "points": 15,
        "previousRate": 39.57,
        "topic": "固体地球の物理・地震"
      },
      {
        "number": 3,
        "points": 25,
        "previousRate": 40.74,
        "topic": "変成作用・火山・地質"
      },
      {
        "number": 4,
        "points": 21,
        "previousRate": 43.58,
        "topic": "気象・雲・海洋"
      },
      {
        "number": 5,
        "points": 19,
        "previousRate": 43.35,
        "topic": "太陽系・恒星・宇宙"
      }
    ],
    "comment": "2025年度の大問配点は20・15・25・21・19点で、2026年度の18・15・28・21・18点とは異なる。2025年度は第4問43.58%が最高、第2問39.57%が最低で、大問別の得点率が約4割前後に集まった。2026年度は第3問40.07%が最低で第2問48.53%が最高となっている。得点率の数値は比較できるが、配点が異なるため、同番号の得点率差をそのまま科目平均点の寄与に換算しない。"
  },
  "化学": {
    "previousYear": 2025,
    "nonComparable": true,
    "mixedCurriculum": true,
    "groups": [
      {
        "number": 1,
        "points": 20,
        "previousRate": 41.68,
        "topic": "物質の構成・状態"
      },
      {
        "number": 2,
        "points": 20,
        "previousRate": 42.87,
        "topic": "反応速度と化学平衡"
      },
      {
        "number": 3,
        "points": 20,
        "previousRate": 49.11,
        "topic": "無機化学"
      },
      {
        "number": 4,
        "points": 20,
        "previousRate": 47.8,
        "topic": "有機化合物"
      },
      {
        "number": 5,
        "points": 20,
        "previousRate": 44.67,
        "topic": "新課程の高分子・総合問題"
      }
    ],
    "comment": "2025年度化学は、新課程履修者は第1～5問を必答、旧課程履修者等は第1～4問を必答として第5問と第6問のうち1問を選択した。第1～5問の得点率は41.68%、42.87%、49.11%、47.80%、44.67%。旧課程の第6問は52.66%だった。第5問と第6問の受験者が異なるため、ここに掲載した第1～5問の配点加重平均45.23点は、科目全体の公表平均45.34点と一致しない。この差をデータの誤りと扱わず、2026年度との平均点寄与の計算も行わない。"
  }
};
