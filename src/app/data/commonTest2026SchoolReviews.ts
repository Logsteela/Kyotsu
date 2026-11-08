// Verified 2026 Common Test school assessments joined with official section scores.
// Distinguish company judgments from the Center's observed scoring percentages.
// Source references for the complete set are displayed together on /sources.
export type RelativeSchoolAssessment = {
  school: '東進' | '河合塾';
  rating: string;
  source: string;
};
export type SectionSchoolAssessment = {
  source: string;
  ratings: string[]; // index 0 = 第1問. Z-kai's A/B subsections use their overall question label.
  notes: string[];
};
export const COMMON_TEST_2026_SCHOOL_DIFFICULTY: Record<string, RelativeSchoolAssessment[]> = {
  "国語": [
    {
      "school": "東進",
      "rating": "難化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "やや難化",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/3910/"
    }
  ],
  "数学Ⅰ": [
    {
      "school": "東進",
      "rating": "難化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "やや難化",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/2160/"
    }
  ],
  "数学Ⅰ，数学Ａ": [
    {
      "school": "東進",
      "rating": "難化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "やや難化",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/2260/"
    }
  ],
  "数学Ⅱ，数学Ｂ，数学Ｃ": [
    {
      "school": "東進",
      "rating": "昨年並み",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "昨年並み",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/2560/"
    }
  ],
  "物理": [
    {
      "school": "東進",
      "rating": "難化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "やや難化",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/4210/"
    }
  ],
  "化学": [
    {
      "school": "東進",
      "rating": "易化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "易化",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/4310/"
    }
  ],
  "生物": [
    {
      "school": "東進",
      "rating": "昨年並み",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    }
  ],
  "地学": [
    {
      "school": "東進",
      "rating": "昨年並み",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    }
  ],
  "物理基礎": [
    {
      "school": "東進",
      "rating": "易化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    }
  ],
  "化学基礎": [
    {
      "school": "東進",
      "rating": "易化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "やや易化",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/4305/"
    }
  ],
  "生物基礎": [
    {
      "school": "東進",
      "rating": "易化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "やや易化",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/4405/"
    }
  ],
  "地学基礎": [
    {
      "school": "東進",
      "rating": "難化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    }
  ],
  "地理総合，地理探究": [
    {
      "school": "東進",
      "rating": "易化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    }
  ],
  "歴史総合，日本史探究": [
    {
      "school": "東進",
      "rating": "易化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    }
  ],
  "歴史総合，世界史探究": [
    {
      "school": "東進",
      "rating": "難化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "やや難化",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/5310/"
    }
  ],
  "公共，倫理": [
    {
      "school": "東進",
      "rating": "易化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    }
  ],
  "公共，政治・経済": [
    {
      "school": "東進",
      "rating": "昨年並み",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    }
  ],
  "地理総合": [
    {
      "school": "東進",
      "rating": "易化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    }
  ],
  "歴史総合": [
    {
      "school": "東進",
      "rating": "昨年並み",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "昨年並み",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/5145/"
    }
  ],
  "公共": [
    {
      "school": "東進",
      "rating": "易化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "やや易化",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/5150/"
    }
  ],
  "英語（リーディング）": [
    {
      "school": "東進",
      "rating": "易化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "やや易化",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/1110/"
    }
  ],
  "英語（リスニング）": [
    {
      "school": "東進",
      "rating": "難化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "やや難化",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/1520/"
    }
  ],
  "情報Ⅰ": [
    {
      "school": "東進",
      "rating": "難化",
      "source": "https://www.toshin.com/news_newtest/gaiyou/"
    },
    {
      "school": "河合塾",
      "rating": "難化",
      "source": "https://kaisoku.kawai-juku.ac.jp/nyushi/kyotsutest/26/analysis/6110/"
    }
  ]
};
export const COMMON_TEST_2026_ZKAI_SECTIONS: Record<string, SectionSchoolAssessment> = {
  "国語": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/kokugo/",
    "ratings": [
      "やや難",
      "標準",
      "やや難",
      "標準",
      "やや易"
    ],
    "notes": [
      "評論の出典は櫻井あすみ、古文は『うつほ物語』、漢文は長野豊山『松陰快談』。",
      "第3問は科学絵本と関連資料を使った文章の推敲。"
    ]
  },
  "英語（リーディング）": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/eigo-reading/",
    "ratings": [
      "易",
      "やや易",
      "やや易",
      "標準",
      "標準",
      "やや難",
      "やや難",
      "標準"
    ],
    "notes": [
      "大問8題・解答数44。読解本文と複数資料の対応付けが中心。",
      "第4問はニュースレターの修正、第7問はマインド・ワンダリングを扱う資料読解。"
    ]
  },
  "英語（リスニング）": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/eigo-listening/",
    "ratings": [
      "やや易",
      "やや易",
      "標準",
      "標準",
      "やや難",
      "標準"
    ],
    "notes": [
      "大問6題・解答数37。第4問Aには不要なイラストを含む並べ替えを採用。",
      "第5問は講義と会話の情報を合わせて答える形式。"
    ]
  },
  "数学Ⅰ，数学Ａ": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/suugaku-1a/",
    "ratings": [
      "標準",
      "標準",
      "標準",
      "やや難"
    ],
    "notes": [
      "第1問は集合と図形、第2問は二次関数・データの分析。",
      "第4問の確率は途中の考察を振り返る設問が特徴。"
    ]
  },
  "数学Ⅱ，数学Ｂ，数学Ｃ": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/suugaku-2b/",
    "ratings": [
      "標準",
      "標準",
      "標準",
      "標準",
      "標準",
      "標準",
      "標準"
    ],
    "notes": [
      "第1問～3問は必答、4～7問は4題から3題選択。",
      "図形と方程式・三角関数・微積分に加え、複素数平面と二次曲線の融合が出題。"
    ]
  },
  "物理": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/butsuri/",
    "ratings": [
      "やや難",
      "標準",
      "やや難",
      "標準"
    ],
    "notes": [
      "第1問は交流回路・加速する乗り物内の風船・コンプトン効果などの小問。",
      "第2問は衝突、第3問は熱サイクルと波の干渉、第4問は荷電粒子の運動。"
    ]
  },
  "化学": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/kagaku/",
    "ratings": [
      "やや易",
      "標準",
      "標準",
      "やや易",
      "標準"
    ],
    "notes": [
      "大問数5、マーク数33（前年34）。",
      "第5問にはポリイミドの形成、第1問にはエタノール燃焼後の気体圧力の計算。"
    ]
  },
  "生物": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/seibutsu/",
    "ratings": [
      "標準",
      "標準",
      "標準",
      "やや易",
      "やや易"
    ],
    "notes": [
      "第1問は人類進化と古人類の遺伝情報、第3問はショウジョウバエの発生。",
      "第5問はマングローブの環境適応と代謝を扱う。"
    ]
  },
  "化学基礎": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/kagaku-kiso/",
    "ratings": [
      "やや易",
      "標準"
    ],
    "notes": [
      "第1問は小問集合、第2問は肥料に用いる物質と実験データの考察。"
    ]
  },
  "生物基礎": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/seibutsu-kiso/",
    "ratings": [
      "やや易",
      "標準",
      "やや易"
    ],
    "notes": [
      "第1問は細胞・DNA、第2問は体温調節と免疫、第3問は遷移と人間活動。"
    ]
  },
  "歴史総合，日本史探究": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/nihonshi/",
    "ratings": [
      "標準",
      "標準",
      "標準",
      "標準",
      "標準",
      "標準"
    ],
    "notes": [
      "第1問は災害史、第3問は絵画史料、第6問は近現代の政治的リーダーシップ。",
      "第3問には選んだ歴史事象から後続設問に進む連動型が登場。"
    ]
  },
  "歴史総合，世界史探究": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/sekaishi/",
    "ratings": [
      "標準",
      "やや難",
      "やや難",
      "標準",
      "標準"
    ],
    "notes": [
      "第1問は都市の変容、第2問は法とその運用、第4問は帝国、第5問は税制。",
      "第3問には歴史を伝える手段を扱う資料が用いられた。"
    ]
  },
  "地理総合，地理探究": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/chiri/",
    "ratings": [
      "標準",
      "標準",
      "標準",
      "標準",
      "標準",
      "標準"
    ],
    "notes": [
      "第2問は津軽平野の地域調査、第4問は繊維産業と再資源化、第6問は河川流域の地誌。",
      "組合せ式の設問は21問。"
    ]
  },
  "情報Ⅰ": {
    "source": "https://www.zkai.co.jp/kyotsu-test/bunseki/jyouhou1/",
    "ratings": [
      "標準",
      "やや難",
      "標準",
      "標準"
    ],
    "notes": [
      "マーク数は前年51から60に増加。",
      "第2問は証明書発行の情報システムと画面透過の論理演算、第4問は桜の開花日データ。"
    ]
  }
};
