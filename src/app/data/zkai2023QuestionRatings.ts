// Z会2023年度の大問・中問ごとの短い難度評価と題材。講評の文章は転載しない。
// 長文記事ではなく、ユーザーが同じ試験ページで比較できる一覧を用意する。
import type { HistoricRatingSubject } from '@/app/data/zkai2024QuestionRatings';
export const ZKAI_2023_QUESTION_RATINGS: Record<string,HistoricRatingSubject> = {
  "国語": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/kokugo-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "評論・建築と視覚文化",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "小説「飢えの季節」",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "古文『俊頼髄脳』",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "漢文『白氏文集』",
        "difficulty": "標準",
        "sortNo": 4
      }
    ]
  },
  "英語（リーディング）": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/eigo-reading-2023/",
    "parts": [
      {
        "label": "第1問A",
        "topic": "観劇する芝居の案内",
        "difficulty": "やや易",
        "sortNo": 1
      },
      {
        "label": "第1問B",
        "topic": "英語集中キャンプの案内",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第2問A",
        "topic": "靴の広告とレビュー",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第2問B",
        "topic": "通学時間の活用法",
        "difficulty": "標準",
        "sortNo": 4
      },
      {
        "label": "第3問A",
        "topic": "キャンプ旅行の助言",
        "difficulty": "やや易",
        "sortNo": 5
      },
      {
        "label": "第3問B",
        "topic": "自作レクリエーションのブログ",
        "difficulty": "標準",
        "sortNo": 6
      },
      {
        "label": "第4問",
        "topic": "効果的な学習法の比較",
        "difficulty": "標準",
        "sortNo": 7
      },
      {
        "label": "第5問",
        "topic": "卓球クラブのエッセイ",
        "difficulty": "標準",
        "sortNo": 8
      },
      {
        "label": "第6問A",
        "topic": "収集行動に関する記事",
        "difficulty": "標準",
        "sortNo": 9
      },
      {
        "label": "第6問B",
        "topic": "クマムシの生態",
        "difficulty": "やや難",
        "sortNo": 10
      }
    ]
  },
  "英語（リスニング）": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/eigo-listening-2023/",
    "parts": [
      {
        "label": "第1問A",
        "topic": "発話の内容一致",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第1問B",
        "topic": "発話とイラストの選択",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第2問",
        "topic": "対話とイラストの選択",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第3問",
        "topic": "対話と質問回答",
        "difficulty": "標準",
        "sortNo": 4
      },
      {
        "label": "第4問A",
        "topic": "職業選択・ゲーム大会",
        "difficulty": "標準",
        "sortNo": 5
      },
      {
        "label": "第4問B",
        "topic": "生徒会候補の演説",
        "difficulty": "標準",
        "sortNo": 6
      },
      {
        "label": "第5問",
        "topic": "アジアゾウの講義",
        "difficulty": "標準",
        "sortNo": 7
      },
      {
        "label": "第6問A",
        "topic": "ハイキングの対話",
        "difficulty": "標準",
        "sortNo": 8
      },
      {
        "label": "第6問B",
        "topic": "就職後の住居の議論",
        "difficulty": "やや難",
        "sortNo": 9
      }
    ]
  },
  "数学Ⅰ・数学Ａ": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/suugaku-1a-2023/",
    "parts": [
      {
        "label": "第1問〔1〕",
        "topic": "数と式・絶対値不等式",
        "difficulty": "やや易",
        "sortNo": 1
      },
      {
        "label": "第1問〔2〕",
        "topic": "図形と計量・三角錐",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第2問〔1〕",
        "topic": "データの分析・食文化",
        "difficulty": "やや易",
        "sortNo": 3
      },
      {
        "label": "第2問〔2〕",
        "topic": "2次関数・シュート軌道",
        "difficulty": "やや難",
        "sortNo": 4
      },
      {
        "label": "第3問",
        "topic": "場合の数と確率・球の色",
        "difficulty": "やや易",
        "sortNo": 5
      },
      {
        "label": "第4問",
        "topic": "整数の性質・長方形の配置",
        "difficulty": "標準",
        "sortNo": 6
      },
      {
        "label": "第5問",
        "topic": "図形の性質",
        "difficulty": "標準",
        "sortNo": 7
      }
    ]
  },
  "数学Ⅱ・数学Ｂ": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/suugaku-2b-2023/",
    "parts": [
      {
        "label": "第1問〔1〕",
        "topic": "三角関数・値の大小",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第1問〔2〕",
        "topic": "対数関数・有理数と無理数",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第2問〔1〕",
        "topic": "微分・円錐内接円柱",
        "difficulty": "やや易",
        "sortNo": 3
      },
      {
        "label": "第2問〔2〕",
        "topic": "積分・桜の開花予想",
        "difficulty": "標準",
        "sortNo": 4
      },
      {
        "label": "第3問",
        "topic": "確率分布・ピーマンの重さ",
        "difficulty": "標準",
        "sortNo": 5
      },
      {
        "label": "第4問",
        "topic": "数列・預金の複利計算",
        "difficulty": "標準",
        "sortNo": 6
      },
      {
        "label": "第5問",
        "topic": "ベクトル・三角錐",
        "difficulty": "標準",
        "sortNo": 7
      }
    ]
  },
  "物理": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/butsuri-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "力学・電磁気・熱・原子の小問",
        "difficulty": "やや易",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "空気中の落下運動と抵抗力",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "円運動と斜めドップラー効果",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "コンデンサー容量の実験",
        "difficulty": "やや難",
        "sortNo": 4
      }
    ]
  },
  "化学": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/kagaku-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "理論・結合・コロイド・蒸気圧",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "理論・電気分解と平衡",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "理論・無機と金属イオン",
        "difficulty": "やや難",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "有機・アルコールと脂質",
        "difficulty": "やや易",
        "sortNo": 4
      },
      {
        "label": "第5問",
        "topic": "理論・無機と酸化還元滴定",
        "difficulty": "やや難",
        "sortNo": 5
      }
    ]
  },
  "生物": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/seibutsu-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "シアノバクテリアの遺伝子発現",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問A",
        "topic": "霊長類の色覚と進化",
        "difficulty": "やや難",
        "sortNo": 2
      },
      {
        "label": "第2問B",
        "topic": "嗅細胞と匂いの識別",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第3問",
        "topic": "植物の光応答と葉緑体",
        "difficulty": "やや難",
        "sortNo": 4
      },
      {
        "label": "第4問",
        "topic": "植物の物質生産と窒素同化",
        "difficulty": "標準",
        "sortNo": 5
      },
      {
        "label": "第5問",
        "topic": "ショウジョウバエの母性因子",
        "difficulty": "やや難",
        "sortNo": 6
      },
      {
        "label": "第6問",
        "topic": "魚類の縄張り形成",
        "difficulty": "標準",
        "sortNo": 7
      }
    ]
  },
  "日本史Ｂ": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/nihonshi-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "日本史を地図から考える",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "古代の陰陽道",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "中世の京都",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "江戸時代の人々のつながり",
        "difficulty": "標準",
        "sortNo": 4
      },
      {
        "label": "第5問",
        "topic": "幕末から明治の日本",
        "difficulty": "標準",
        "sortNo": 5
      },
      {
        "label": "第6問",
        "topic": "近現代の「旅」",
        "difficulty": "やや難",
        "sortNo": 6
      }
    ]
  },
  "世界史Ｂ": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/sekaishi-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "歴史の中の女性",
        "difficulty": "やや易",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "君主の地位の継承",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "歴史知識を巡る疑問と議論",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "さまざまな歴史資料",
        "difficulty": "やや難",
        "sortNo": 4
      },
      {
        "label": "第5問",
        "topic": "歴史統計",
        "difficulty": "標準",
        "sortNo": 5
      }
    ]
  },
  "地理Ｂ": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/chiri-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "自然環境と災害",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "資源と産業",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "日本の人口と都市",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "インド・中国の地誌",
        "difficulty": "標準",
        "sortNo": 4
      },
      {
        "label": "第5問",
        "topic": "利根川下流域の地域調査",
        "difficulty": "やや易",
        "sortNo": 5
      }
    ]
  },
  "化学基礎": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/kagaku-kiso-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "物質の構成と変化",
        "difficulty": "やや易",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "沈殿滴定の実験",
        "difficulty": "やや難",
        "sortNo": 2
      }
    ]
  },
  "生物基礎": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/seibutsu-kiso-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "原核・真核細胞とDNA複製",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "脂肪消化と免疫",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "水槽の物質循環とバイオーム",
        "difficulty": "やや難",
        "sortNo": 3
      }
    ]
  },
  "地学基礎": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/chigaku-kiso-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "地球の形・地層・鉱物・火山",
        "difficulty": "やや易",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "地上天気図と黒潮",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "銀河系",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "日本の自然環境",
        "difficulty": "やや易",
        "sortNo": 4
      }
    ]
  },
  "現代社会": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/gendaishakai-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "国際経済・国際社会",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "青年期・日本経済と社会",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "経済のしくみ",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "司法と人権・政治参加",
        "difficulty": "標準",
        "sortNo": 4
      },
      {
        "label": "第5問",
        "topic": "探究学習・子どもの貧困",
        "difficulty": "標準",
        "sortNo": 5
      }
    ]
  },
  "倫理": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/rinri-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "正義と人間の本性（源流思想）",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "問いをめぐる思索（日本思想）",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "自由（西洋思想）",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "不平等・格差の背景",
        "difficulty": "やや難",
        "sortNo": 4
      }
    ]
  },
  "政治・経済": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/seijikeizai-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "県の広報誌",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "現代日本の諸課題",
        "difficulty": "やや難",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "戦争と平和・日本の議会制民主主義",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "SDGsの意義と課題",
        "difficulty": "やや難",
        "sortNo": 4
      }
    ]
  },
  "倫理，政治・経済": {
    "sourceUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2023/rinsei-2023/",
    "parts": [
      {
        "label": "第1問",
        "topic": "正義と人間の本性（倫理）",
        "difficulty": "標準",
        "sortNo": 1
      },
      {
        "label": "第2問",
        "topic": "問いをめぐる思索（倫理）",
        "difficulty": "標準",
        "sortNo": 2
      },
      {
        "label": "第3問",
        "topic": "自由（西洋思想・倫理）",
        "difficulty": "標準",
        "sortNo": 3
      },
      {
        "label": "第4問",
        "topic": "不平等・格差の背景（倫理）",
        "difficulty": "やや難",
        "sortNo": 4
      },
      {
        "label": "第5問",
        "topic": "現代日本の諸課題（政治・経済）",
        "difficulty": "やや難",
        "sortNo": 5
      },
      {
        "label": "第6問",
        "topic": "戦争と平和・議会制民主主義（政治・経済）",
        "difficulty": "標準",
        "sortNo": 6
      },
      {
        "label": "第7問",
        "topic": "SDGsの意義と課題（政治・経済）",
        "difficulty": "やや難",
        "sortNo": 7
      }
    ]
  }
};
