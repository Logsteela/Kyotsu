// 令和8年度 大学入学共通テスト本試験：設問別得点率CSVに由来する大問集計を整理した独自表示データ。
// 元データの所在地・定義・検証上の注意は /sources に集約する。
// 数値は大問単位の得点率・正答率（%）。正答率は解答番号ごとの完全正答率の平均。
// 英語・数学等の選択問題や部分点によって値の意味が異なるため、平均点と取り違えない。
export type MainQuestionGroup = { number: number; points: number; scoreRate: number; correctRate: number; topic: string };
export type MainExamResearch = {
  parts: MainQuestionGroup[];
  observation: string;
  review: string;
  detail: string;
};
export const COMMON_TEST_2026_RESEARCH: Record<string, MainExamResearch> = {
  "国語": {
    "parts": [
      {
        "number": 1,
        "points": 45,
        "scoreRate": 63.86,
        "correctRate": 71.28,
        "topic": "論理的文章"
      },
      {
        "number": 2,
        "points": 45,
        "scoreRate": 69.86,
        "correctRate": 70.7,
        "topic": "文学的文章"
      },
      {
        "number": 3,
        "points": 20,
        "scoreRate": 61.04,
        "correctRate": 55.05,
        "topic": "資料と文章表現"
      },
      {
        "number": 4,
        "points": 45,
        "scoreRate": 45.68,
        "correctRate": 47.31,
        "topic": "古文"
      },
      {
        "number": 5,
        "points": 45,
        "scoreRate": 52.08,
        "correctRate": 50.95,
        "topic": "漢文"
      }
    ],
    "observation": "古文の得点率45.68%は小説の69.86%を24.18ポイント下回る。平均点の差は、5大問を一括して見るだけでは分からない。",
    "review": "第3問は資料を比較して文章を推敲する設定。高校教員の評価では複数の資料と選択肢の検討に時間がかかる点を課題とし、第4問の古文や第5問の漢文についても文脈の理解と知識の結び付きが重視された。",
    "detail": "第3問・解答番号20～21は得点率54.61%に対し完全正答率29.96%。部分点を含む得点率だけで正答者の割合を判断できない例。"
  },
  "数学Ⅰ，数学Ａ": {
    "parts": [
      {
        "number": 1,
        "points": 30,
        "scoreRate": 54.17,
        "correctRate": 57.67,
        "topic": "数と式・図形と計量"
      },
      {
        "number": 2,
        "points": 30,
        "scoreRate": 56.95,
        "correctRate": 60.36,
        "topic": "2次関数・データの分析"
      },
      {
        "number": 3,
        "points": 20,
        "scoreRate": 32.42,
        "correctRate": 34.79,
        "topic": "図形の性質"
      },
      {
        "number": 4,
        "points": 20,
        "scoreRate": 36.89,
        "correctRate": 35.8,
        "topic": "場合の数と確率"
      }
    ],
    "observation": "前半2大問の得点率は54～57%台なのに対し、後半の図形と確率は32～37%台にとどまる。後半の設問を含めた時間配分が重要な試験だったと読める。",
    "review": "第3問では三角錐内の線分や交点の位置による体積変化、第4問ではリーグ戦での優勝確率を扱った。学校教員による評価では、与えられた結果を振り返って発展させる力を問う点が評価された。",
    "detail": "全科目の設問別集計では、第1問の解答欄「ヒ・フ」の完全正答率が約2.68%。大問平均より際立って低い個別設問もある。"
  },
  "数学Ⅱ，数学Ｂ，数学Ｃ": {
    "parts": [
      {
        "number": 1,
        "points": 15,
        "scoreRate": 56.17,
        "correctRate": 57.55,
        "topic": "図形と方程式"
      },
      {
        "number": 2,
        "points": 15,
        "scoreRate": 50.25,
        "correctRate": 53.07,
        "topic": "三角関数"
      },
      {
        "number": 3,
        "points": 22,
        "scoreRate": 62.47,
        "correctRate": 62.47,
        "topic": "微分積分"
      },
      {
        "number": 4,
        "points": 16,
        "scoreRate": 50.56,
        "correctRate": 57.93,
        "topic": "数列（選択）"
      },
      {
        "number": 5,
        "points": 16,
        "scoreRate": 44.8,
        "correctRate": 44.8,
        "topic": "統計的な推測（選択）"
      },
      {
        "number": 6,
        "points": 16,
        "scoreRate": 56.05,
        "correctRate": 59.08,
        "topic": "ベクトル（選択）"
      },
      {
        "number": 7,
        "points": 16,
        "scoreRate": 56.96,
        "correctRate": 57.71,
        "topic": "複素数平面（選択）"
      }
    ],
    "observation": "必答の第3問（微分積分）は得点率62.47%、選択の第5問（統計的な推測）は44.80%。選択問題は解答者の構成が違うため、これを単純な分野別難易度順としては扱えない。",
    "review": "第4～7問は4問から3問を選ぶ方式。大問別平均点を7問分合計しても100点満点の科目平均には一致しないため、表中の各大問は独立の記録として読む必要がある。",
    "detail": "大問別の「正答率」は解答欄ごとの完全正答率の単純平均であり、配点で重み付けされた「得点率」とは定義が異なる。"
  },
  "英語（リーディング）": {
    "parts": [
      {
        "number": 1,
        "points": 6,
        "scoreRate": 69.98,
        "correctRate": 69.98,
        "topic": "短いメッセージ"
      },
      {
        "number": 2,
        "points": 12,
        "scoreRate": 72.15,
        "correctRate": 72.15,
        "topic": "数値を含む説明"
      },
      {
        "number": 3,
        "points": 9,
        "scoreRate": 61.53,
        "correctRate": 61.53,
        "topic": "一人称の物語"
      },
      {
        "number": 4,
        "points": 12,
        "scoreRate": 79.92,
        "correctRate": 79.92,
        "topic": "文章の推敲"
      },
      {
        "number": 5,
        "points": 16,
        "scoreRate": 64.07,
        "correctRate": 59.67,
        "topic": "複数の案内資料"
      },
      {
        "number": 6,
        "points": 12,
        "scoreRate": 53.79,
        "correctRate": 53.79,
        "topic": "三人称の物語"
      },
      {
        "number": 7,
        "points": 16,
        "scoreRate": 48.25,
        "correctRate": 48.64,
        "topic": "科学的文章"
      },
      {
        "number": 8,
        "points": 17,
        "scoreRate": 61.17,
        "correctRate": 61.28,
        "topic": "複数意見・図表の整理"
      }
    ],
    "observation": "第4問79.92%と第7問48.25%の差は31.67ポイント。同じ英語でも、文章の推敲を扱う第4問と、科学的説明文を整理して推論する第7問で成績差が大きかった。",
    "review": "高校教員の評価では、第4問は英文を推敲する構成で解きやすく、第7問は科学的内容を踏まえた推論、第8問は対立する意見と図表の照合を要する点が指摘された。問われた作業が大問ごとに異なる。",
    "detail": "第5問では部分点を含む得点率64.07%に対し完全正答率の平均は59.67%。複数解答の設問が含まれることに注意。"
  },
  "英語（リスニング）": {
    "parts": [
      {
        "number": 1,
        "points": 28,
        "scoreRate": 62.87,
        "correctRate": 64.87,
        "topic": "第1問"
      },
      {
        "number": 2,
        "points": 12,
        "scoreRate": 65.7,
        "correctRate": 65.7,
        "topic": "第2問"
      },
      {
        "number": 3,
        "points": 18,
        "scoreRate": 54.55,
        "correctRate": 54.55,
        "topic": "第3問"
      },
      {
        "number": 4,
        "points": 12,
        "scoreRate": 57.07,
        "correctRate": 65.59,
        "topic": "第4問"
      },
      {
        "number": 5,
        "points": 16,
        "scoreRate": 35.46,
        "correctRate": 33.93,
        "topic": "第5問"
      },
      {
        "number": 6,
        "points": 14,
        "scoreRate": 48.74,
        "correctRate": 48.21,
        "topic": "第6問"
      }
    ],
    "observation": "第5問の得点率35.46%は第2問65.70%を30.24ポイント下回る。試験全体の平均点だけでなく、後半の情報処理がどれほど負担になったかを切り分けられる。",
    "review": "",
    "detail": "第4問は得点率57.07%と大問内の平均正答率65.59%が一致しない。配点や部分点処理の違いを考慮する必要がある。"
  },
  "情報Ⅰ": {
    "parts": [
      {
        "number": 1,
        "points": 20,
        "scoreRate": 40.5,
        "correctRate": 43.05,
        "topic": "知識・デジタル表現"
      },
      {
        "number": 2,
        "points": 30,
        "scoreRate": 58.11,
        "correctRate": 61.32,
        "topic": "情報システム・論理演算"
      },
      {
        "number": 3,
        "points": 25,
        "scoreRate": 57.77,
        "correctRate": 56.31,
        "topic": "プログラミング"
      },
      {
        "number": 4,
        "points": 25,
        "scoreRate": 66.45,
        "correctRate": 67.27,
        "topic": "データの分析"
      }
    ],
    "observation": "2025年からの平均点低下12.67点のうち、第1問で約4.99点、第2問で約5.40点低下しており、両者で約82%を占める。第3問だけが大きく下がったという見方は数字と合わない。",
    "review": "第1問はセキュリティや2進数・メール配送、第2問は情報システムの改良と画像合成、第3問は来訪者の待ち時間シミュレーション、第4問は桜の開花日のデータ分析。評価では分野の偏りが前年より改善された点が指摘された。",
    "detail": "第1問のメール配送の設問「セ」の正答率は約10.23%、第3問のプログラム実行回数「ソ」は約19.63%。計算量というより仕組み・実行順の追跡が難しい例。"
  },
  "物理": {
    "parts": [
      {
        "number": 1,
        "points": 25,
        "scoreRate": 47.25,
        "correctRate": 49.14,
        "topic": "小問集合"
      },
      {
        "number": 2,
        "points": 25,
        "scoreRate": 53.78,
        "correctRate": 53.78,
        "topic": "力学・衝突"
      },
      {
        "number": 3,
        "points": 25,
        "scoreRate": 51.2,
        "correctRate": 51.26,
        "topic": "熱サイクル・波動"
      },
      {
        "number": 4,
        "points": 25,
        "scoreRate": 29.99,
        "correctRate": 29.99,
        "topic": "電磁場中の荷電粒子"
      }
    ],
    "observation": "第4問の得点率29.99%は他の3大問（47.25～53.78%）より大幅に低い。4大問とも25点配点なので、第4問の平均点の低さが科目平均にそのまま大きく影響する。",
    "review": "第4問は質量分析器を題材に電場・磁場中の粒子運動を扱い、設定条件と加速度運動の読み替えが必要。高校教員の評価では計算量と時間不足が指摘され、同問の冒頭設問は約19%の正答率にとどまった。",
    "detail": "第3問は熱サイクルと水面波、第2問は衝突と重心の運動を扱った。物理法則を複数組み合わせる設問が多いという評価。"
  },
  "化学": {
    "parts": [
      {
        "number": 1,
        "points": 20,
        "scoreRate": 62.77,
        "correctRate": 63.48,
        "topic": "物質の状態と平衡"
      },
      {
        "number": 2,
        "points": 20,
        "scoreRate": 54.6,
        "correctRate": 54.94,
        "topic": "反応速度・化学平衡"
      },
      {
        "number": 3,
        "points": 20,
        "scoreRate": 57.4,
        "correctRate": 58.79,
        "topic": "無機物質"
      },
      {
        "number": 4,
        "points": 20,
        "scoreRate": 59.59,
        "correctRate": 60.06,
        "topic": "有機化合物"
      },
      {
        "number": 5,
        "points": 20,
        "scoreRate": 49.92,
        "correctRate": 50.62,
        "topic": "高分子を含む総合問題"
      }
    ],
    "observation": "全5大問が20点配点で、最高は第1問62.77%、最低は第5問49.92%。極端に得点率の低い一問だけでなく、各大問の得点率が5～6割前後に分布した。",
    "review": "第1問は物質の状態と平衡、第2問は反応速度・化学平衡、第3問は無機、第4問は有機、第5問はポリイミドなど身近な高分子を含む総合問題。高校教員による評価では、単なる語句の記憶ではなく実験条件や粒子の状態を判断させる設問に識別力があると指摘された。",
    "detail": "第2問の塩の加水分解は正答率32.94%、緩衝液の判別は37.33%。第3問の金属イオン系統分離の操作の逆推論は33.35%。第5問の平衡定数の計算は30.12%。大問平均に隠れる低正答率の設問が散らばっている。"
  },
  "生物": {
    "parts": [
      {
        "number": 1,
        "points": 20,
        "scoreRate": 48.61,
        "correctRate": 48.61,
        "topic": "第1問"
      },
      {
        "number": 2,
        "points": 20,
        "scoreRate": 59.85,
        "correctRate": 55.55,
        "topic": "第2問"
      },
      {
        "number": 3,
        "points": 20,
        "scoreRate": 37.99,
        "correctRate": 38.22,
        "topic": "第3問"
      },
      {
        "number": 4,
        "points": 20,
        "scoreRate": 57.18,
        "correctRate": 57.71,
        "topic": "第4問"
      },
      {
        "number": 5,
        "points": 20,
        "scoreRate": 71.39,
        "correctRate": 71.38,
        "topic": "第5問"
      }
    ],
    "observation": "第3問37.99%と第5問71.39%の差は33.40ポイント。どちらも20点配点であるため、大問間の得点差が特に大きい。",
    "review": "",
    "detail": "第2問は得点率59.85%に対し完全正答率の平均55.55%。部分得点を含むかで数字が変わる。"
  },
  "物理基礎": {
    "parts": [
      {
        "number": 1,
        "points": 16,
        "scoreRate": 65.81,
        "correctRate": 65.81,
        "topic": "第1問"
      },
      {
        "number": 2,
        "points": 16,
        "scoreRate": 78.79,
        "correctRate": 78.79,
        "topic": "第2問"
      },
      {
        "number": 3,
        "points": 18,
        "scoreRate": 64.16,
        "correctRate": 64.16,
        "topic": "第3問"
      }
    ],
    "observation": "最も高い第2問78.79%と、最も低い第3問64.16%の差は14.63ポイント。いずれも5割を超えた。",
    "review": "",
    "detail": ""
  },
  "化学基礎": {
    "parts": [
      {
        "number": 1,
        "points": 30,
        "scoreRate": 64.8,
        "correctRate": 64.8,
        "topic": "小問集合"
      },
      {
        "number": 2,
        "points": 20,
        "scoreRate": 45.7,
        "correctRate": 46.82,
        "topic": "肥料を題材とする総合問題"
      }
    ],
    "observation": "第1問64.80%に対して第2問45.70%。第2問の方が約19ポイント低く、総合問題の題材を整理しながら数的処理する負荷が表れている。",
    "review": "高校教員の評価では、第2問は肥料として用いられる物質を扱い、化学基礎の概念を使って未知の反応を考えることが要求された。酸化還元反応の理解を問う設問には完全正答率46.56%のものがあった。",
    "detail": ""
  },
  "生物基礎": {
    "parts": [
      {
        "number": 1,
        "points": 16,
        "scoreRate": 60.49,
        "correctRate": 59.25,
        "topic": "第1問"
      },
      {
        "number": 2,
        "points": 18,
        "scoreRate": 77.77,
        "correctRate": 77.77,
        "topic": "第2問"
      },
      {
        "number": 3,
        "points": 16,
        "scoreRate": 79.89,
        "correctRate": 80.73,
        "topic": "第3問"
      }
    ],
    "observation": "第2・3問の得点率はともに約8割で、第1問の60.49%より高い。大問ごとに正答の集中度が異なる。",
    "review": "",
    "detail": ""
  },
  "地学基礎": {
    "parts": [
      {
        "number": 1,
        "points": 20,
        "scoreRate": 54.14,
        "correctRate": 54.36,
        "topic": "第1問"
      },
      {
        "number": 2,
        "points": 10,
        "scoreRate": 54.56,
        "correctRate": 58,
        "topic": "第2問"
      },
      {
        "number": 3,
        "points": 10,
        "scoreRate": 56.25,
        "correctRate": 57,
        "topic": "第3問"
      },
      {
        "number": 4,
        "points": 10,
        "scoreRate": 62.66,
        "correctRate": 65.74,
        "topic": "第4問"
      }
    ],
    "observation": "第1～3問は得点率が54～56%台で近く、第4問は62.66%。大問別の得点率の幅は8.52ポイント。",
    "review": "",
    "detail": ""
  }
};
