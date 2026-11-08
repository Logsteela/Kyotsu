// 東進2026年科目別難易度とZ会2025・2026年大問別判定。
// データは各社の公表した短い評価語のみ。出典URLは /sources に一括表示。
// 大問の配列は第1問から昇順で、英語リスニングのA/Bは同じ判定のみ統合。
// 2025年物理第3問はA/Bの判定を併記する。
export type PrepSchoolReview = {
  zkai?: string[];
  zkaiUrl?: string;
  toshin?: '難化' | '易化' | '前年並み';
};
export const PREP_SCHOOL_EVALUATIONS: Record<string, Record<string, PrepSchoolReview>> = {
  "2025": {
    "英語（リーディング）": {
      "zkai": [
        "やや易",
        "やや易",
        "標準",
        "標準",
        "標準",
        "やや難",
        "やや難",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/eigo-reading-2025/"
    },
    "英語（リスニング）": {
      "zkai": [
        "やや易",
        "やや易",
        "標準",
        "標準",
        "やや難",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/eigo-listening-2025/"
    },
    "数学Ⅰ，数学Ａ": {
      "zkai": [
        "標準",
        "標準",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/suugaku-1a-2025/"
    },
    "数学Ⅱ，数学Ｂ，数学Ｃ": {
      "zkai": [
        "標準",
        "標準",
        "標準",
        "標準",
        "標準",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/suugaku-2b-2025/"
    },
    "国語": {
      "zkai": [
        "やや難",
        "やや易",
        "標準",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/kokugo-2025/"
    },
    "物理": {
      "zkai": [
        "やや難",
        "標準",
        "標準／やや難",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/butsuri-2025/"
    },
    "化学": {
      "zkai": [
        "難",
        "標準",
        "標準",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/kagaku-2025/"
    },
    "生物": {
      "zkai": [
        "標準",
        "標準",
        "標準",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/seibutsu-2025/"
    },
    "化学基礎": {
      "zkai": [
        "やや易",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/kagaku-kiso-2025/"
    },
    "生物基礎": {
      "zkai": [
        "やや易",
        "やや易",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/seibutsu-kiso-2025/"
    },
    "歴史総合，日本史探究": {
      "zkai": [
        "標準",
        "標準",
        "標準",
        "標準",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/nihonshi-2025/"
    },
    "歴史総合，世界史探究": {
      "zkai": [
        "標準",
        "標準",
        "標準",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/sekaishi-2025/"
    },
    "地理総合，地理探究": {
      "zkai": [
        "標準",
        "標準",
        "やや難",
        "標準",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/chiri-2025/"
    },
    "情報Ⅰ": {
      "zkai": [
        "易",
        "やや易",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki-2025/jyouhou1-2025/"
    }
  },
  "2026": {
    "英語（リーディング）": {
      "zkai": [
        "易",
        "やや易",
        "やや易",
        "標準",
        "標準",
        "やや難",
        "やや難",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/eigo-reading/",
      "toshin": "易化"
    },
    "英語（リスニング）": {
      "zkai": [
        "やや易",
        "やや易",
        "標準",
        "標準",
        "やや難",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/eigo-listening/",
      "toshin": "難化"
    },
    "数学Ⅰ，数学Ａ": {
      "zkai": [
        "標準",
        "標準",
        "標準",
        "やや難"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/suugaku-1a/",
      "toshin": "難化"
    },
    "数学Ⅱ，数学Ｂ，数学Ｃ": {
      "zkai": [
        "標準",
        "標準",
        "標準",
        "標準",
        "標準",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/suugaku-2b/",
      "toshin": "前年並み"
    },
    "国語": {
      "zkai": [
        "やや難",
        "標準",
        "やや難",
        "標準",
        "やや易"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/kokugo/",
      "toshin": "難化"
    },
    "物理": {
      "zkai": [
        "やや難",
        "標準",
        "やや難",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/butsuri/",
      "toshin": "難化"
    },
    "化学": {
      "zkai": [
        "やや易",
        "標準",
        "標準",
        "やや易",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/kagaku/",
      "toshin": "易化"
    },
    "生物": {
      "zkai": [
        "標準",
        "標準",
        "標準",
        "やや易",
        "やや易"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/seibutsu/",
      "toshin": "前年並み"
    },
    "化学基礎": {
      "zkai": [
        "やや易",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/kagaku-kiso/",
      "toshin": "易化"
    },
    "生物基礎": {
      "zkai": [
        "やや易",
        "標準",
        "やや易"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/seibutsu-kiso/",
      "toshin": "易化"
    },
    "歴史総合，日本史探究": {
      "zkai": [
        "標準",
        "標準",
        "標準",
        "標準",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/nihonshi/",
      "toshin": "易化"
    },
    "歴史総合，世界史探究": {
      "zkai": [
        "標準",
        "やや難",
        "やや難",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/sekaishi/",
      "toshin": "難化"
    },
    "地理総合，地理探究": {
      "zkai": [
        "標準",
        "標準",
        "標準",
        "標準",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/chiri/",
      "toshin": "易化"
    },
    "情報Ⅰ": {
      "zkai": [
        "標準",
        "やや難",
        "標準",
        "標準"
      ],
      "zkaiUrl": "https://www.zkai.co.jp/kyotsu-test/bunseki/jyouhou1/",
      "toshin": "難化"
    },
    "数学Ⅰ": {
      "toshin": "難化"
    },
    "地学基礎": {
      "toshin": "難化"
    },
    "地理総合": {
      "toshin": "易化"
    },
    "公共，倫理": {
      "toshin": "易化"
    },
    "公共": {
      "toshin": "易化"
    },
    "物理基礎": {
      "toshin": "易化"
    },
    "歴史総合": {
      "toshin": "前年並み"
    },
    "公共，政治・経済": {
      "toshin": "前年並み"
    },
    "地学": {
      "toshin": "前年並み"
    }
  }
};
