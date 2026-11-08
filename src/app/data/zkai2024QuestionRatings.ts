// Z会 2024年度公表の大問・中問単位の難度判定と題材（要約）。
// 原稿の長文転載ではなく、出題区分・題材と短い評価語だけを収録。
// 出典URLは /sources にまとめて表示する。
export interface HistoricRatingPart { label:string; topic:string; difficulty:string; sortNo:number }
export interface HistoricRatingSubject { sourceUrl:string; parts:HistoricRatingPart[] }
export const ZKAI_2024_QUESTION_RATINGS: Record<string,HistoricRatingSubject> = {
  "国語": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/kokugo-2024/",
    "parts": [
      {
        "label": "第1問",
        "topic": "評論・音楽と芸術",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "小説「桟橋」",
        "difficulty": "やや易",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "古文「車中雪」",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "漢文「華清宮」ほか",
        "difficulty": "標準",
        "sortNo": 4
      }
    ]
  },
  "英語（リーディング）": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/eigo-reading-2024/",
    "parts": [
      {
        "label": "第1問A",
        "topic": "語学学校のイベント案内",
        "difficulty": "やや易",
        "sortNo": 1
      },
      {
        "label": "第1問B",
        "topic": "観光ツアーの比較",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第2問A",
        "topic": "高校のクラブ勧誘",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第2問B",
        "topic": "旅行保険のレビュー",
        "difficulty": "標準",
        "sortNo": 4
      },
      {
        "label": "第3問A",
        "topic": "フォトラリーの記事",
        "difficulty": "標準",
        "sortNo": 5
      },
      {
        "label": "第3問B",
        "topic": "バーチャルツアーの記事",
        "difficulty": "標準",
        "sortNo": 6
      },
      {
        "label": "第4問",
        "topic": "英語クラブ室の改善案",
        "difficulty": "標準",
        "sortNo": 7
      },
      {
        "label": "第5問",
        "topic": "同級生の再会を描く物語",
        "difficulty": "やや難",
        "sortNo": 8
      },
      {
        "label": "第6問A",
        "topic": "時間の知覚",
        "difficulty": "やや難",
        "sortNo": 9
      },
      {
        "label": "第6問B",
        "topic": "香辛料と人体への影響",
        "difficulty": "やや難",
        "sortNo": 10
      }
    ]
  },
  "英語（リスニング）": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/eigo-listening-2024/",
    "parts": [
      {
        "label": "第1問A",
        "topic": "短い発話・内容一致",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第1問B",
        "topic": "短い発話・イラスト選択",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第2問",
        "topic": "短い対話・イラスト選択",
        "difficulty": "やや易",
        "sortNo": 3
      },
      {
        "label": "第3問",
        "topic": "短い対話・質問回答",
        "difficulty": "標準",
        "sortNo": 4
      },
      {
        "label": "第4問A",
        "topic": "説明の聞き取り・順序と表",
        "difficulty": "標準",
        "sortNo": 5
      },
      {
        "label": "第4問B",
        "topic": "文化祭の出し物",
        "difficulty": "標準",
        "sortNo": 6
      },
      {
        "label": "第5問",
        "topic": "ガラスに関する講義",
        "difficulty": "標準",
        "sortNo": 7
      },
      {
        "label": "第6問A",
        "topic": "旅行中の移動方法",
        "difficulty": "標準",
        "sortNo": 8
      },
      {
        "label": "第6問B",
        "topic": "これから始める運動の議論",
        "difficulty": "やや難",
        "sortNo": 9
      }
    ]
  },
  "数学Ⅰ・数学Ａ": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/suugaku-1a-2024/",
    "parts": [
      {
        "label": "第1問〔1〕",
        "topic": "数と式・無理数の評価",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第1問〔2〕",
        "topic": "図形と計量・電柱の影",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第2問〔1〕",
        "topic": "2次関数・三角形の面積",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第2問〔2〕",
        "topic": "データの分析・競技記録",
        "difficulty": "やや易",
        "sortNo": 4
      },
      {
        "label": "第3問",
        "topic": "場合の数と確率・カード",
        "difficulty": "標準",
        "sortNo": 5
      },
      {
        "label": "第4問",
        "topic": "整数の性質・n進数",
        "difficulty": "標準",
        "sortNo": 6
      },
      {
        "label": "第5問",
        "topic": "図形の性質・星形図形",
        "difficulty": "標準",
        "sortNo": 7
      }
    ]
  },
  "数学Ⅱ・数学Ｂ": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/suugaku-2b-2024/",
    "parts": [
      {
        "label": "第1問〔1〕",
        "topic": "対数関数・グラフと不等式",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第1問〔2〕",
        "topic": "式と証明・整式の割り算",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第2問",
        "topic": "微分・積分・放物線の面積",
        "difficulty": "やや難",
        "sortNo": 3
      },
      {
        "label": "第3問",
        "topic": "確率分布・期待値",
        "difficulty": "標準",
        "sortNo": 4
      },
      {
        "label": "第4問",
        "topic": "数列・漸化式",
        "difficulty": "標準",
        "sortNo": 5
      },
      {
        "label": "第5問",
        "topic": "ベクトル・直線間距離",
        "difficulty": "やや易",
        "sortNo": 6
      }
    ]
  },
  "物理": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/butsuri-2024/",
    "parts": [
      {
        "label": "第1問",
        "topic": "力学・熱・波・電磁気・原子の小問",
        "difficulty": "やや難",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "ペットボトルロケットの探究",
        "difficulty": "やや難",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "弦の定常波と交流電流",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "導体紙の電位と電場",
        "difficulty": "標準",
        "sortNo": 4
      }
    ]
  },
  "化学": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/kagaku-2024/",
    "parts": [
      {
        "label": "第1問",
        "topic": "物質の構成・状態変化・コロイド",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "電池・化学平衡",
        "difficulty": "やや難",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "無機化学・ニッケル精錬",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "有機化学・ペプチドの呈色",
        "difficulty": "やや易",
        "sortNo": 4
      },
      {
        "label": "第5問",
        "topic": "質量分析法",
        "difficulty": "やや難",
        "sortNo": 5
      }
    ]
  },
  "生物": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/seibutsu-2024/",
    "parts": [
      {
        "label": "第1問",
        "topic": "細菌の糖代謝と遺伝子発現",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "細胞膜の輸送タンパク質",
        "difficulty": "やや易",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "筋収縮と筋細胞の発生",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "生殖と光環境への応答",
        "difficulty": "標準",
        "sortNo": 4
      },
      {
        "label": "第5問",
        "topic": "生態系の物質生産",
        "difficulty": "標準",
        "sortNo": 5
      },
      {
        "label": "第6問A",
        "topic": "動物の分類",
        "difficulty": "やや難",
        "sortNo": 6
      },
      {
        "label": "第6問B",
        "topic": "進化のシミュレーション",
        "difficulty": "標準",
        "sortNo": 7
      }
    ]
  },
  "日本史Ｂ": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/nihonshi-2024/",
    "parts": [
      {
        "label": "第1問",
        "topic": "印刷の歴史",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "古代の食物",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "中世社会の特色",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "近世の貿易・経済",
        "difficulty": "標準",
        "sortNo": 4
      },
      {
        "label": "第5問",
        "topic": "幕末から明治の洋服・銀行",
        "difficulty": "標準",
        "sortNo": 5
      },
      {
        "label": "第6問",
        "topic": "世界大戦後の日本外交",
        "difficulty": "標準",
        "sortNo": 6
      }
    ]
  },
  "世界史Ｂ": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/sekaishi-2024/",
    "parts": [
      {
        "label": "第1問",
        "topic": "各地域の統治制度",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "諸勢力による支配と拡大",
        "difficulty": "やや易",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "交通と社会の変化",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "言語・文字と文化的な帰属",
        "difficulty": "標準",
        "sortNo": 4
      }
    ]
  },
  "地理Ｂ": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/chiri-2024/",
    "parts": [
      {
        "label": "第1問",
        "topic": "自然環境と自然災害",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "資源・産業構造の変化",
        "difficulty": "やや易",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "都市と生活文化",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "環太平洋の地域地誌",
        "difficulty": "標準",
        "sortNo": 4
      },
      {
        "label": "第5問",
        "topic": "島根県石見地方の地域調査",
        "difficulty": "やや易",
        "sortNo": 5
      }
    ]
  },
  "化学基礎": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/kagaku-kiso-2024/",
    "parts": [
      {
        "label": "第1問",
        "topic": "物質の構成・物質変化",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "宇宙ステーションの空気制御",
        "difficulty": "やや易",
        "sortNo": 2
      }
    ]
  },
  "生物基礎": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/seibutsu-kiso-2024/",
    "parts": [
      {
        "label": "第1問",
        "topic": "細胞・ゲノムと細胞周期",
        "difficulty": "やや易",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "血液・血管と腎臓",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "バイオーム・生態系と外来生物",
        "difficulty": "やや易",
        "sortNo": 3
      }
    ]
  },
  "地学基礎": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2024/chigaku-kiso-2024/",
    "parts": [
      {
        "label": "第1問",
        "topic": "地震・鉱物と地球環境",
        "difficulty": "やや易",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "台風と海洋",
        "difficulty": "やや易",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "太陽系・恒星・宇宙",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "火山噴火による災害",
        "difficulty": "標準",
        "sortNo": 4
      }
    ]
  }
};
