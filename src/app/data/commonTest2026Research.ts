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
  },
  "地理総合，地理探究": {
    "parts": [
      {
        "number": 1,
        "points": 13,
        "scoreRate": 68.51,
        "correctRate": 67.23,
        "topic": "乾燥地域の生活文化"
      },
      {
        "number": 2,
        "points": 12,
        "scoreRate": 75.66,
        "correctRate": 75.66,
        "topic": "津軽平野の農業・自然環境"
      },
      {
        "number": 3,
        "points": 21,
        "scoreRate": 56.69,
        "correctRate": 56.9,
        "topic": "世界の自然環境と災害"
      },
      {
        "number": 4,
        "points": 17,
        "scoreRate": 55.54,
        "correctRate": 55.55,
        "topic": "衣料品の生産・流通・再利用"
      },
      {
        "number": 5,
        "points": 20,
        "scoreRate": 58.45,
        "correctRate": 58.86,
        "topic": "人口と都市"
      },
      {
        "number": 6,
        "points": 17,
        "scoreRate": 63.83,
        "correctRate": 63.32,
        "topic": "ドナウ・ナイル・メコン流域"
      }
    ],
    "observation": "第2問75.66%と第4問55.54%の差は20.12ポイント。津軽平野の一次産業に関する資料を読む問題より、衣料品の流通構造を比較する大問のほうが得点率は低かった。",
    "review": "第3問では世界各地の地形・土壌と災害、第4問では衣料品のサプライチェーン、第6問では複数の国際河川流域を横断して比較する。高校教員の評価では、初見資料を読み解くことが中心だが、一部の職業分類などは見慣れない形式で判断が難しいとの指摘がある。",
    "detail": "第3問問2（資料の特徴の解釈）と第5問問4（職業分類）、第6問問3（経済規模と輸送）の難しさが報告書で取り上げられた。得点率の最も低い第4問だけが、個別の難問を含むわけではない。"
  },
  "歴史総合，日本史探究": {
    "parts": [
      {
        "number": 1,
        "points": 25,
        "scoreRate": 67.26,
        "correctRate": 66.88,
        "topic": "災害の歴史と近代"
      },
      {
        "number": 2,
        "points": 15,
        "scoreRate": 70.04,
        "correctRate": 70.04,
        "topic": "漁業の歴史"
      },
      {
        "number": 3,
        "points": 15,
        "scoreRate": 54.09,
        "correctRate": 54.09,
        "topic": "絵画資料と古代・中世"
      },
      {
        "number": 4,
        "points": 15,
        "scoreRate": 56.07,
        "correctRate": 56.07,
        "topic": "中世の女性と政治"
      },
      {
        "number": 5,
        "points": 15,
        "scoreRate": 65.64,
        "correctRate": 65.64,
        "topic": "近世城郭と城下町"
      },
      {
        "number": 6,
        "points": 15,
        "scoreRate": 57.3,
        "correctRate": 57.3,
        "topic": "原敬日記・近現代政治"
      }
    ],
    "observation": "第2問の得点率70.04%に対し、第3問は54.09%、第4問も56.07%。比較的取りやすかった漁業史の大問と、図像資料の読解や中世政治を扱う大問で差がある。",
    "review": "大問ごとに漁業の歴史、伴大納言絵巻などの絵画、中世の女性と政治、城郭、原敬日記が用いられた。特定の一時代の知識を聞くよりも、一つの資料や題材を軸に時代をまたぐ設問が目立った。",
    "detail": "第4問の八条院を扱う設問の正答率32.85%、院政期の政治・荘園に関する設問は36.02%。共通の歴史総合大問にも28.48%の設問があり、大問別得点率が5割以上でも小問単位では正答率が3割を下回る例がある。"
  },
  "歴史総合，世界史探究": {
    "parts": [
      {
        "number": 1,
        "points": 25,
        "scoreRate": 65.73,
        "correctRate": 65.64,
        "topic": "近現代の都市の変容"
      },
      {
        "number": 2,
        "points": 21,
        "scoreRate": 61.71,
        "correctRate": 61.71,
        "topic": "法のあり方と運用"
      },
      {
        "number": 3,
        "points": 18,
        "scoreRate": 59,
        "correctRate": 59,
        "topic": "歴史を伝える手段"
      },
      {
        "number": 4,
        "points": 18,
        "scoreRate": 51.92,
        "correctRate": 51.92,
        "topic": "帝国の形態と拡張"
      },
      {
        "number": 5,
        "points": 18,
        "scoreRate": 64.03,
        "correctRate": 65.16,
        "topic": "税制度と社会変容"
      }
    ],
    "observation": "最低は第4問51.92%、最高は第1問65.73%で差は13.81ポイント。平均点は前年66.12点から60.88点に下がったが、第1問・第5問は6割台の得点率だった。",
    "review": "第4問ではローマ・ムガル帝国と米国の対カリブ海政策を「帝国」という共通の観点で扱い、第5問では地域の異なる税制度を比較する。高校教員の評価は総量を適正とする一方、資料の数や文章量が前年より増えたことを指摘している。",
    "detail": "第4問問2と問6の判断手順の多さが評価上の論点になった。第4問は大問内平均でも最も低く、個別設問の読解と複数資料の照合が得点差に関係した可能性がある。"
  },
  "公共，倫理": {
    "parts": [
      {
        "number": 1,
        "points": 12,
        "scoreRate": 67.58,
        "correctRate": 67.58,
        "topic": "社会保障と公助"
      },
      {
        "number": 2,
        "points": 13,
        "scoreRate": 73.47,
        "correctRate": 71.72,
        "topic": "異文化共生と宗教"
      },
      {
        "number": 3,
        "points": 28,
        "scoreRate": 63.45,
        "correctRate": 63.2,
        "topic": "悪をめぐる思想"
      },
      {
        "number": 4,
        "points": 15,
        "scoreRate": 65.16,
        "correctRate": 65.16,
        "topic": "理と情・日本思想"
      },
      {
        "number": 5,
        "points": 16,
        "scoreRate": 58.18,
        "correctRate": 59.28,
        "topic": "科学技術と倫理"
      },
      {
        "number": 6,
        "points": 16,
        "scoreRate": 60.85,
        "correctRate": 60.13,
        "topic": "生態系・環境倫理"
      }
    ],
    "observation": "第2問73.47%と第5問58.18%の差は15.29ポイント。現代の科学技術と倫理的判断を問う第5問は、文化・宗教の共生を扱う第2問より得点率が低い。",
    "review": "第3問は思想史上の「悪」を横断的に扱い、第4問は日本思想の理性と感情の関係、第5問はAIやBMIなどの技術倫理、第6問は環境倫理を扱った。思想家の単純な対応づけだけでなく、共通の論点から比較する設問が多い。",
    "detail": "報告書では第3問問6のアウグスティヌスとカントの比較、第3問問4のヒュームの考え方の判断が難しい設問として指摘された。第5問が大問の最低得点率であっても、難しい小問は他の大問にもある。"
  },
  "公共，政治・経済": {
    "parts": [
      {
        "number": 1,
        "points": 12,
        "scoreRate": 73.53,
        "correctRate": 73.53,
        "topic": "社会保障と再分配"
      },
      {
        "number": 2,
        "points": 13,
        "scoreRate": 72.99,
        "correctRate": 71.23,
        "topic": "文化・宗教と共生"
      },
      {
        "number": 3,
        "points": 19,
        "scoreRate": 68.03,
        "correctRate": 67.5,
        "topic": "貿易・国際機関"
      },
      {
        "number": 4,
        "points": 19,
        "scoreRate": 63.9,
        "correctRate": 63.31,
        "topic": "日本の経済政策"
      },
      {
        "number": 5,
        "points": 18,
        "scoreRate": 53.36,
        "correctRate": 53.36,
        "topic": "人口減少と地方自治"
      },
      {
        "number": 6,
        "points": 19,
        "scoreRate": 55.84,
        "correctRate": 55.91,
        "topic": "SDGsと国際課題"
      }
    ],
    "observation": "第1問73.53%、第2問72.99%と比較して、第5問53.36%、第6問55.84%は17～20ポイント低い。公共との共通問題2問より、地方財政や国際課題の具体的な資料分析で差が出た。",
    "review": "第5問では自治体合併、水道事業、宿泊税など人口減少下の公共サービスを扱い、第6問では開発と環境の両立を含む国際問題を扱った。制度名を覚えているだけではなく、複数の政策指標を踏まえて判断する形式が中心。",
    "detail": "第6問は問4を除く複数の設問が高校教員の評価でやや難しいとされている。ただし大問得点率が最低なのは第5問であり、報告書の評価と実測の得点率は同一の指標ではない。"
  }
};
