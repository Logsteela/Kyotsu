import { useMemo } from 'react';
import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';
import { testDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';

type SourceItem = { label: string; count: number; example: string[] };
type SourceGroup = { kind: string; sources: SourceItem[] };
function extractSources(notes: string): {kind: string; source: string}[] {
  const found: {kind: string; source: string}[] = [];
  for (const match of notes.matchAll(/(問題|解答|音源)：([^　\n]+)/g)) {
    const source = match[2].trim().replace(/[、，。]+$/, '');
    if (source) found.push({ kind: match[1], source });
  }
  return found;
}
function SourceTable({ items }: { items: SourceItem[] }) {
  const { sorted, sortKey, direction, sortBy } = useSortedRows(items, 'count');
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead><tr className="border-b bg-gray-50">
          <SortHeader label="記載された出典名" column="label" {...{sortKey,direction}} onSort={sortBy} />
          <SortHeader label="件数" column="count" {...{sortKey,direction}} onSort={sortBy} />
          <th className="p-3">資料例</th>
        </tr></thead>
        <tbody>{sorted.map(item => (
          <tr key={item.label} className="border-b">
            <td className="p-3 font-medium">{item.label}</td>
            <td className="p-3 tabular-nums">{item.count}</td>
            <td className="p-3"><div className="flex flex-wrap gap-3">{item.example.map((pdf, i) => <Link key={pdf} to={`/test/${encodeURIComponent(pdf)}`} className="text-[var(--color-brand-green)] underline">例{i + 1}</Link>)}</div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
export function SourcesPage() {
  const data = useMemo(() => {
    const kinds = ['問題', '解答', '音源'];
    const groups = new Map<string, Map<string, { count: number; example: string[] }>>();
    const empty = { missing: 0, documented: 0, count: testDatabase.length };
    for (const record of testDatabase) {
      const notes = getTestDetails(record.questionPdf)?.specialNotes || '';
      const sources = extractSources(notes);
      if (!sources.length) { empty.missing++; continue; }
      empty.documented++;
      for (const item of sources) {
        const map = groups.get(item.kind) ?? new Map();
        const entry = map.get(item.source) ?? { count: 0, example: [] };
        entry.count++;
        if (entry.example.length < 4) entry.example.push(record.questionPdf);
        map.set(item.source, entry);
        groups.set(item.kind, map);
      }
    }
    const tables: SourceGroup[] = kinds.map(kind => ({
      kind,
      sources: [...(groups.get(kind) ?? new Map()).entries()]
        .map(([label, v]) => ({ label, ...v }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'ja')),
    }));
    return { summary: empty, tables };
  }, []);
  return (
    <>
      <SEOMeta path="/sources" title="収録資料の出典一覧・来歴｜共通テスト過去問総集"
        description="過去問資料の問題・解答・音源ごとの出典記録を集計。大学入試センター、国立国会図書館等の記録と照合できる目録。" />
      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <article className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-6xl text-gray-800 leading-relaxed">
          <h1 className="text-2xl font-bold mb-4">収録資料の出典記録</h1>
          <section className="mb-8 border rounded-lg p-4 sm:p-5 bg-gray-50" id="research-methods">
            <h2 className="text-xl font-bold mb-3">統計・問題分析に用いる資料と方法</h2>
            <p className="mb-3 text-sm">共通テスト本試験の個別試験ページに掲載している「大問ごとの得点状況」「出題内容・問題評価」「得点分布」の出典はこちらに集約しています。試験ページから外部サイトを巡回しなくても主要な数値と分析が分かるよう、数値の比較と解釈は当サイト内に掲載します。</p>
            <h3 className="font-semibold mb-2">大学入試センター（一次資料）</h3>
            <ul className="list-disc pl-5 text-sm space-y-2 mb-4">
              <li><a className="underline text-[var(--color-brand-green)]" href="https://www.dnc.ac.jp/kyotsu/hyouka/r8_hyouka/r8_data.html" target="_blank" rel="noopener noreferrer">2026年度本試験・設問別得点率と正答率／科目別成績分布</a>（CSVおよび説明書）</li>
              <li><a className="underline text-[var(--color-brand-green)]" href="https://www.dnc.ac.jp/kyotsu/hyouka/r7_hyouka/r7_data.html" target="_blank" rel="noopener noreferrer">2025年度本試験・設問別得点率と正答率／科目別成績分布</a></li>
              <li><a className="underline text-[var(--color-brand-green)]" href="https://www.dnc.ac.jp/kyotsu/hyouka/r8_hyouka/r8_hyoukahoukokusyo_honshiken.html" target="_blank" rel="noopener noreferrer">2026年度・問題評価・分析委員会報告書（本試験）</a>：高等学校教科担当教員、関係教育団体、問題作成部会の評価</li>
              <li><a className="underline text-[var(--color-brand-green)]" href="https://www.dnc.ac.jp/kyotsu/suii/R3_.html" target="_blank" rel="noopener noreferrer">共通テスト本試験の受験者数・平均点の推移</a></li>
              <li><a className="underline text-[var(--color-brand-green)]" href="https://www.dnc.ac.jp/kyotsu/hyouka/" target="_blank" rel="noopener noreferrer">過年度の問題評価報告書・試験情報データ一覧</a></li>
            </ul>
            <h3 className="font-semibold mb-2">数値照合・分布分析の補助資料</h3>
            <ul className="list-disc pl-5 text-sm space-y-2 mb-4">
              <li><a className="underline text-[var(--color-brand-green)]" href="https://eic.obunsha.co.jp/exam_info/2026/2026%E5%B9%B4-%E5%85%B1%E9%80%9A%E3%83%86%E3%82%B9%E3%83%88-%E5%B0%8F%E5%95%8F%E5%88%A5%E6%AD%A3%E7%AD%94%E7%8E%87/" target="_blank" rel="noopener noreferrer">旺文社教育情報センター・2026年の小問別正答率整理</a>：原資料の個別設問の数値の照合</li>
              <li><a className="underline text-[var(--color-brand-green)]" href="https://kyotsu-zemi.fworks.studio/guide/daimon-tokutenritsu-2025/" target="_blank" rel="noopener noreferrer">2025年度の大問別得点率の再集計</a>：国語、数学などの前年との比較数値の照合</li>
              <li><a className="underline text-[var(--color-brand-green)]" href="https://kyotsu-zemi.fworks.studio/guide/kokugo-daimon-kousei/" target="_blank" rel="noopener noreferrer">2025・2026年度国語の大問別得点率</a>：古文などの前年差と科目平均点への寄与の照合</li>
              <li><a className="underline text-[var(--color-brand-green)]" href="https://kyotsu-zemi.fworks.studio/guide/daimon-tokutenritsu-2026/" target="_blank" rel="noopener noreferrer">共通テストゼミ・2026年大問別得点率の再集計</a>：大問単位の値の照合</li>
              <li><a className="underline text-[var(--color-brand-green)]" href="https://kyotsu-zemi.fworks.studio/guide/kokugo-tokuten-bunpu/" target="_blank" rel="noopener noreferrer">共通テストゼミ・2025／2026年度国語の得点分布再集計</a>：得点帯別人数、5分位値を照合</li>
              <li><a className="underline text-[var(--color-brand-green)]" href="https://sukyojuku.com/joho1-2026-honshiken/" target="_blank" rel="noopener noreferrer">数強塾・2025／2026年度情報Ⅰの設問・成績分布の分析</a>：中央値、分布の境界、得点帯別人数を照合</li>
            </ul>
            <h3 className="font-semibold mb-2">出題テーマの照合</h3>
            <ul className="list-disc pl-5 text-sm space-y-2 mb-4">
              <li><a className="underline text-[var(--color-brand-green)]" href="https://www.keinet.ne.jp/learning/center/" target="_blank" rel="noopener noreferrer">河合塾 Kei-Net 共通テスト対策・科目別出題分析</a>：2026年度の生物・生物基礎・物理基礎・地学基礎・英語リスニング等での大問構成や題材を照合</li>
              <li><a className="underline text-[var(--color-brand-green)]" href="https://kyotsu-zemi.fworks.studio/guide/daimon-tokutenritsu-chireki-koumin-2026/" target="_blank" rel="noopener noreferrer">共通テストゼミ・2026年度地歴公民の大問別得点率</a>：5科目の大問別集計値を照合</li>
              <li><a className="underline text-[var(--color-brand-green)]" href="https://kyotsu-zemi.fworks.studio/guide/chireki-koumin-daizai/" target="_blank" rel="noopener noreferrer">同・地歴公民の大問別題材と報告書の解説</a>：報告書のテーマと設問の評価を照合</li>
            </ul>
            <p className="text-sm mb-4">2026年度の数学Ⅰ・地学、地理総合／歴史総合／公共の大問集計については、大学入試センターの上記データに加え、次の数値整理・問題分析で題材と平均点を照合しています。</p>
            <ul className="list-disc pl-5 text-sm space-y-2 mb-4">
              <li><a href="https://kyotsu-zemi.fworks.studio/guide/sugaku1a-shudai-hani/" className="underline text-[var(--color-brand-green)]" target="_blank" rel="noopener noreferrer">数学Ⅰ（単独科目）の配点・2025/2026大問別得点率</a></li>
              <li><a href="https://www.keinet.ne.jp/learning/center/math-1a.html" className="underline text-[var(--color-brand-green)]" target="_blank" rel="noopener noreferrer">河合塾・2026年度数学Ⅰ／数学ⅠAの出題分析</a></li>
              <li><a href="https://kyotsu-zemi.fworks.studio/guide/chigaku-daimon-kousei/" className="underline text-[var(--color-brand-green)]" target="_blank" rel="noopener noreferrer">2026年度地学の大問配点・得点率と低正答率設問</a></li>
              <li><a href="https://kyotsu-zemi.fworks.studio/guide/chiri-rekishi-koukyou-daimon-kousei/" className="underline text-[var(--color-brand-green)]" target="_blank" rel="noopener noreferrer">2026年度「地理総合／歴史総合／公共」選択領域の配点と得点率</a></li>
              <li><a href="https://kyotsu-zemi.fworks.studio/guide/chireki-koumin-daizai/" className="underline text-[var(--color-brand-green)]" target="_blank" rel="noopener noreferrer">2026年度地理・歴史・公共の大問題材と評価</a></li>
            </ul>
            <h3 className="font-semibold mb-2">外国語4科目の問題評価の利用について</h3>
            <p className="text-sm mb-4">2026年度のドイツ語・フランス語・中国語・韓国語は、大学入試センターの問題評価・分析委員会報告書にある各科目の「高等学校教科担当教員からの評価」を読み、当サイト独自の説明として大問の構成、時間的負荷、設問評価を整理しています。原資料は上の2026年度報告書ページから各言語を選べます。大問ごとの実測得点率は数値未照合のため掲載していません。</p>
            <h3 className="font-semibold mb-2">2026年度・高校教員の外部評価</h3>
            <p className="text-sm mb-3">「難易度の適正さ」の値は、大学入試センターの「問題評価・分析委員会 外部評価分科会の評価結果」巻末資料の第7項目から整理しました。全27科目・出題範囲のうち物理・生物・地学・生物基礎・地学基礎・フランス語・韓国語の7科目は3、ほかの20科目は4です。4＝「あてはまる」、3＝「ある程度あてはまる」。難しいほど高くなる得点ではなく、平均得点率とも別の指標です。</p>
            <p className="text-sm mb-4"><a className="underline text-[var(--color-brand-green)]" href="https://www.dnc.ac.jp/kyotsu/hyouka/r8_hyouka/r8_hyoukahoukokusyo_honshiken.html" target="_blank" rel="noopener noreferrer">原資料：2026年度問題評価報告書・巻末資料</a></p>
            <h3 className="font-semibold mb-2">数値と解釈の区別</h3>
            <p className="text-sm mb-2">得点率＝平均得点÷配点。正答率＝完全に正答した受験者の割合（部分点を含めない）。大問全体の正答率は設問の正答率の平均であり、配点を重み付けした得点率と一致するとは限りません。大問の得点率・正答率は小数第2位まで表示し、元の集計で端数処理が行われた場合は合計値とわずかな差が生じることがあります。</p>
            <p className="text-sm mb-2">「出題内容」「注目した設問」「差の要因」は各報告書を参考に当サイトが整理した文章です。報告書の文章や表そのものを転載せず、考察と計算結果を掲載します。前年のデータとの比較は、同名・同配点の本試験かを確認してから実施しています。</p>
            <p className="text-sm">資料を根拠とする解釈であっても、各問題の客観的な難易度や個人の得点可能性を確定するものではありません。試行問題・追試験の統計を本試験のものとして扱うことはありません。</p>
          </section>
          <p className="mb-4">問題、解答、リスニング音源について、試験詳細の「特記事項」に記録された提供元を集計しました。歴史的な試験資料の所在や伝達経路を調べるための目録です。収録レコードから自動生成するため、データの追記に応じて結果が変わります。</p>
          <p className="mb-5">対象レコード：<strong>{data.summary.count.toLocaleString('ja-JP')}件</strong> ／ 出典の記載あり：<strong>{data.summary.documented.toLocaleString('ja-JP')}件</strong> ／ 記載なし：<strong>{data.summary.missing.toLocaleString('ja-JP')}件</strong></p>
          <p className="text-sm mb-6 border-l-4 border-gray-300 pl-3">重要：これはサイト内の出典表記を集計したもので、提供元が本サイトによる転載・再配布を許諾したことを示すものではありません。また、出典の記載がない資料も、提供元が存在しないことを意味しません。正確な出典の確認や権利に関する連絡は、右下のヘルプ窓口へお願いします。</p>
          {data.tables.map(table => (
            <section key={table.kind} className="mb-7">
              <h2 className="text-xl font-bold mb-2">{table.kind}の出典記録</h2>
              <SourceTable items={table.sources} />
            </section>
          ))}
          <h2 className="text-lg font-bold mb-2">収録情報の整理方法</h2>
          <p className="mb-3">出典名は掲載記録の表記を原則として維持し、同一団体を勝手に統合しません。1つの試験について問題と解答の出典が異なる場合は別々に集計します。記載のない資料を推測で補完することはありません。</p>
          <p><Link to="/coverage" className="text-[var(--color-brand-green)] underline">年度別の記録状況</Link> ／ <Link to="/about" className="text-[var(--color-brand-green)] underline">サイトと資料の取り扱い</Link></p>
        </article>
      </div>
    </>
  );
}
